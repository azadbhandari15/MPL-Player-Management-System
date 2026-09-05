package com.mpl.backend.service;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import com.mpl.backend.entity.PlayerRegistrationStatus;
import com.mpl.backend.mapper.PlayerRegistrationResponseDtoMapper;
import com.mpl.backend.model.PlayerRegistrationResponseDto;
import com.mpl.backend.repository.PlayerRegistrationRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class PlayerDetailsRetrievalService {

    private final PlayerRegistrationRepository playerRegistrationRepository;
    private final PlayerRegistrationResponseDtoMapper playerRegistrationResponseDtoMapper;

    public PlayerDetailsRetrievalService(PlayerRegistrationRepository playerRegistrationRepository, PlayerRegistrationResponseDtoMapper playerRegistrationResponseDtoMapper) {
        this.playerRegistrationRepository = playerRegistrationRepository;
        this.playerRegistrationResponseDtoMapper = playerRegistrationResponseDtoMapper;
    }

    public Page<PlayerRegistrationResponseDto> findAllPlayers(Pageable pageable){
        return playerRegistrationRepository.findByRegistrationStatus(PlayerRegistrationStatus.ELIGIBLE_FOR_AUCTION,pageable)
                .map(playerRegistrationResponseDtoMapper::mapToPlayerRegistrationDto);

    }

    public ByteArrayInputStream exportPlayerList() throws IOException {
        String[] columns={"Player ID", "Player Name","Contact Number",
                "Email","Player Type","CricHeros Profile"};

        try(Workbook workbook= new XSSFWorkbook();ByteArrayOutputStream outputStream=new ByteArrayOutputStream()){

            Sheet sheet=workbook.createSheet("Eligible Players");
            Font headerFont=workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle= workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.BLUE1.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow=sheet.createRow(0);
            for(int col=0;col<columns.length;col++){
                Cell cell=headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerStyle);
            }

            List<PlayerRegistrationEntity> registrationEntities=playerRegistrationRepository
                    .findByRegistrationStatus(PlayerRegistrationStatus.ELIGIBLE_FOR_AUCTION);

            int rowIndex=1;
            for(PlayerRegistrationEntity registrationEntity:registrationEntities){
                Row row=sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(registrationEntity.getPlayerId());
                row.createCell(1).setCellValue(registrationEntity.getPlayerName());
                row.createCell(2).setCellValue(registrationEntity.getContactNumber());
                row.createCell(3).setCellValue(registrationEntity.getPlayerEmail());
                row.createCell(4).setCellValue(registrationEntity.getPlayerType().value);
                row.createCell(5).setCellValue(registrationEntity.getCricHerosProfile());
            }

            for(int i=0;i<columns.length;i++){
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
            return new ByteArrayInputStream(outputStream.toByteArray());
        }
    }
}
