package com.mpl.backend.service;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import com.mpl.backend.entity.PlayerRegistrationStatus;
import com.mpl.backend.entity.PlayerType;
import com.mpl.backend.entity.TeamOwnerEntity;
import com.mpl.backend.model.PlayerImportResult;
import com.mpl.backend.repository.PlayerRegistrationRepository;
import com.mpl.backend.repository.TeamOwnerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerImportService {

    private static final Pattern DRIVE_ID = Pattern.compile("(?:id=|/d/)([A-Za-z0-9_-]{10,})");
    private static final Pattern URL = Pattern.compile("https?://\\S+");
    private static final String ID_PREFIX = "MPL4-";
    private final TeamOwnerRepository teamOwnerRepository;// adjust to your player id format

    private final PlayerRegistrationRepository repo;

    @Value("${mpl.owner.initial.purse.amount:10000}")
    private BigDecimal initialPurseAmount;

    @Transactional
    public PlayerImportResult replaceAll(MultipartFile file, boolean dryRun) throws IOException {
        String fname = Objects.requireNonNullElse(file.getOriginalFilename(), "").toLowerCase();
        if (file.isEmpty() || !fname.endsWith(".xlsx")) {
            throw new IllegalArgumentException("Please upload an .xlsx file");
        }

        Set<TeamOwnerEntity> refactoredOwner = teamOwnerRepository.findAll().stream().peek(team -> team.setBudgetRemaining(initialPurseAmount))
                .collect(Collectors.toSet());

        teamOwnerRepository.saveAll(refactoredOwner);

        List<String> errors = new ArrayList<>();
        List<PlayerRegistrationEntity> players = new ArrayList<>();
        Set<String> seenPhones = new HashSet<>();
        int total = 0;

        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);                       // "Form responses 1"
            Row header = sheet.getRow(0);
            int tsCol    = findCol(header, "timestamp");
            int nameCol  = findCol(header, "player name");
            int phoneCol = findCol(header, "phone");
            int imgCol   = findCol(header, "player image");
            int roleCol  = findCol(header, "player role");
            int chCol    = findCol(header, "cric");
            DataFormatter fmt = new DataFormatter();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String name  = fmt.formatCellValue(row.getCell(nameCol)).trim();
                String phone = fmt.formatCellValue(row.getCell(phoneCol)).replaceAll("\\D", "");
                if (name.isEmpty() && phone.isEmpty()) continue;
                total++;
                String label = "Row " + (i + 1) + " (" + name + ")";

                if (name.isEmpty() || name.length() > 50) { errors.add(label + ": name missing or over 50 chars"); continue; }
                if (phone.length() != 10)                 { errors.add(label + ": phone must be 10 digits"); continue; }
                if (!seenPhones.add(phone))               { errors.add(label + ": duplicate phone " + phone); continue; }

                PlayerType type = parseType(fmt.formatCellValue(row.getCell(roleCol)));
                if (type == null) { errors.add(label + ": unknown role"); continue; }

                String imageUrl = toDirectUrl(fmt.formatCellValue(row.getCell(imgCol)).trim());
                if (imageUrl == null) { errors.add(label + ": image link missing/invalid"); continue; }

                PlayerRegistrationEntity p = new PlayerRegistrationEntity();
                p.setPlayerName(name);
                p.setContactNumber(phone);
                p.setPlayerType(type);
                p.setCricHerosProfile(extractUrl(fmt.formatCellValue(row.getCell(chCol))));
                p.setImageUrl(imageUrl);
                p.setRegistrationStatus(PlayerRegistrationStatus.ELIGIBLE_FOR_AUCTION);            // anything except SOLD
                p.setRegisteredDate(readDate(row.getCell(tsCol)));
                p.setUpdatedDate(LocalDateTime.now());
                players.add(p);
            }
        }

        // assign ids only after validation so numbering has no gaps
        for (int i = 0; i < players.size(); i++) {
            players.get(i).setPlayerId(String.format("%s%03d", ID_PREFIX, i + 1));
        }

        long existing = repo.count();
        boolean apply = !dryRun && errors.isEmpty() && !players.isEmpty();
        if (apply) {
            repo.deleteAllInBatch();      // wipe previous entries
            repo.saveAll(players);        // persist new ones (same transaction)
        }


        return new PlayerImportResult(dryRun, total, players.size(), existing, apply, errors);
    }

    private int findCol(Row header, String contains) {
        for (Cell c : header) {
            if (c.getCellType() == CellType.STRING
                    && c.getStringCellValue().toLowerCase().contains(contains)) return c.getColumnIndex();
        }
        throw new IllegalArgumentException("Column not found in sheet: " + contains);
    }

    private PlayerType parseType(String raw) {
        String s = raw.trim().toUpperCase().replaceAll("[\\s-]+", "_");
        return switch (s) {
            case "BATTER", "BATSMAN" -> PlayerType.BATSMAN;
            case "BOWLER" -> PlayerType.BOWLER;
            case "ALL_ROUNDER", "ALLROUNDER" -> PlayerType.ALL_ROUNDER;
            case "WICKET_KEEPER", "WICKETKEEPER" -> PlayerType.WICKET_KEEPER;
            default -> null;
        };
    }

    private String toDirectUrl(String link) {
        Matcher m = DRIVE_ID.matcher(link);
        return m.find() ? "https://drive.google.com/thumbnail?id=" + m.group(1) + "&sz=w400" : null;
    }

    private String extractUrl(String raw) {
        Matcher m = URL.matcher(raw);
        return m.find() ? m.group() : null;     // junk like "Fudfg" or a phone number becomes null
    }

    private LocalDateTime readDate(Cell c) {
        if (c != null && c.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(c)) {
            return c.getLocalDateTimeCellValue();
        }
        return LocalDateTime.now();
    }
}