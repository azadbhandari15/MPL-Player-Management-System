package com.mpl.backend.service;

import com.mpl.backend.entity.FixtureCategory;
import com.mpl.backend.entity.FixtureStatus;
import com.mpl.backend.entity.TeamOwnerEntity;
import com.mpl.backend.entity.TournamentPlayerFixturesEntity;
import com.mpl.backend.model.FixtureBulkResponseDto;
import com.mpl.backend.model.TeamFixturesRequestDto;
import com.mpl.backend.model.TeamFixturesResponseDto;
import com.mpl.backend.repository.TeamOwnerRepository;
import com.mpl.backend.repository.TournamentPlayerFixturesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.mpl.backend.entity.FixtureStatus.*;

@Service
public class TournamentFixturesService {

    private static final Logger logger = LoggerFactory.getLogger(TournamentFixturesService.class);
    private final TeamOwnerRepository teamOwnerRepository;
    private final TournamentPlayerFixturesRepository tournamentPlayerFixturesRepository;

    public TournamentFixturesService(TeamOwnerRepository teamOwnerRepository, TournamentPlayerFixturesRepository tournamentPlayerFixturesRepository) {
        this.teamOwnerRepository = teamOwnerRepository;
        this.tournamentPlayerFixturesRepository = tournamentPlayerFixturesRepository;
    }

    @Transactional
    public TeamFixturesResponseDto createTournamentFixture(TeamFixturesRequestDto teamFixturesRequestDto) {

        logger.info("Registering Tournament Fixture: {} ", teamFixturesRequestDto);

        if (teamFixturesRequestDto.getHomeTeamOwnerId().equalsIgnoreCase(teamFixturesRequestDto.getAwayTeamOwnerId())) {
            throw new IllegalArgumentException("Home and Away Team Owner Cannot have same OwnerId");
        }

        TeamOwnerEntity homeTeam = teamOwnerRepository.findByOwnerRegistrationId(teamFixturesRequestDto.getHomeTeamOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner Details Not Found"));

        TeamOwnerEntity awayTeam = teamOwnerRepository.findByOwnerRegistrationId(teamFixturesRequestDto.getAwayTeamOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner Details Not Found"));

        String fixtureId = "MPLFIX" + UUID.randomUUID().toString().replace("-", "").toUpperCase();

        TournamentPlayerFixturesEntity tournamentPlayerFixturesEntity = TournamentPlayerFixturesEntity.builder()
                .teamOwnerEntityHomeEntity(homeTeam)
                .teamOwnerEntityAwayEntity(awayTeam)
                .matchDateTime(teamFixturesRequestDto.getMatchDateTime())
                .venue(teamFixturesRequestDto.getVenue())
                .fixtureStatus(SCHEDULED)
                .fixtureId(fixtureId)
                .build();

        TournamentPlayerFixturesEntity savedFixture = tournamentPlayerFixturesRepository.save(tournamentPlayerFixturesEntity);


        return TeamFixturesResponseDto.builder()
                .matchFixtureId(savedFixture.getFixtureId())
                .homeTeamName(homeTeam.getTeamName())
                .awayTeamName(awayTeam.getTeamName())
                .matchDateTime(savedFixture.getMatchDateTime())
                .venue(savedFixture.getVenue())
                .fixtureStatus(savedFixture.getFixtureStatus())
                .build();
    }

    public TeamFixturesResponseDto retrieveTeamFixtureDetails(String fixtureId) {
        TournamentPlayerFixturesEntity fixturesDetails = tournamentPlayerFixturesRepository.findByFixtureId(fixtureId)
                .orElseThrow(() -> new RuntimeException("Fixtures Not Found"));

        return TeamFixturesResponseDto.builder()
                .matchFixtureId(fixturesDetails.getFixtureId())
                .homeTeamName(safeGet(fixturesDetails.getTeamOwnerEntityHomeEntity(), TeamOwnerEntity::getTeamName))
                .awayTeamName(safeGet(fixturesDetails.getTeamOwnerEntityAwayEntity(), TeamOwnerEntity::getTeamName))
                .homeTeamId(safeGet(fixturesDetails.getTeamOwnerEntityHomeEntity(), TeamOwnerEntity::getOwnerRegistrationId))
                .awayTeamId(safeGet(fixturesDetails.getTeamOwnerEntityAwayEntity(), TeamOwnerEntity::getOwnerRegistrationId))
                .matchDateTime(fixturesDetails.getMatchDateTime())
                .venue(fixturesDetails.getVenue())
                .fixtureStatus(fixturesDetails.getFixtureStatus())
                .result(fixturesDetails.getMatchSummary())
                .cricHeroProfile(fixturesDetails.getCricHerosMatchLink())
                .matchWinner(safeGet(fixturesDetails.getTossWinnerTeamOwnerEntity(), TeamOwnerEntity::getTeamName))
                .tossWinner(safeGet(fixturesDetails.getTeamOwnerEntityWinner(), TeamOwnerEntity::getTeamName))
                .build();
    }

    public static <T, R> R safeGet(T object, Function<T, R> getter) {
        return object != null ? getter.apply(object) : null;
    }

    public FixtureBulkResponseDto retrieveBulkDetails() {
        List<TournamentPlayerFixturesEntity> fixtures = tournamentPlayerFixturesRepository
                .findAll();

        Map<FixtureCategory, List<TeamFixturesResponseDto>> categorized = fixtures.stream()
                .collect(Collectors.groupingBy(
                        this::categorizeFixture,
                        Collectors.mapping(this::mapToTeamFixtureResponseDto, Collectors.toList())
                ));

        return FixtureBulkResponseDto.builder()
                .liveFixture(categorized.getOrDefault(FixtureCategory.LIVE, List.of()))
                .upcomingFixture(categorized.getOrDefault(FixtureCategory.UPCOMING, List.of()))
                .pastFixtures(categorized.getOrDefault(FixtureCategory.PAST, List.of()))
                .build();
    }

    public TeamFixturesResponseDto updateTossDetails(String fixtureId,String tossWinnerTeamId,String matchSummary){

        TournamentPlayerFixturesEntity fixtureEntity = tournamentPlayerFixturesRepository.findByFixtureId(fixtureId)
                .orElseThrow(() -> new RuntimeException("Fixture not found"));

        if(Arrays.asList(COMPLETED,ABANDONED).contains(fixtureEntity.getFixtureStatus())){
            throw new IllegalArgumentException("Fixture has already completed");
        }
        TeamOwnerEntity teamOwnerEntity=teamOwnerRepository.findByOwnerRegistrationId(tossWinnerTeamId)
                .orElseThrow(()->new RuntimeException("Owner Details Not Found"));

        fixtureEntity.setTossWinnerTeamOwnerEntity(teamOwnerEntity);
        fixtureEntity.setFixtureStatus(IN_PROGRESS);
        fixtureEntity.setMatchSummary(matchSummary);
        tournamentPlayerFixturesRepository.save(fixtureEntity);

        return mapToTeamFixtureResponseDto(fixtureEntity);

    }

    public TeamFixturesResponseDto mapToTeamFixtureResponseDto(TournamentPlayerFixturesEntity tournamentPlayerFixturesEntity) {
        return TeamFixturesResponseDto.builder()
                .matchFixtureId(tournamentPlayerFixturesEntity.getFixtureId())
                .homeTeamName(safeGet(tournamentPlayerFixturesEntity.getTeamOwnerEntityHomeEntity(), TeamOwnerEntity::getTeamName))
                .awayTeamName(safeGet(tournamentPlayerFixturesEntity.getTeamOwnerEntityAwayEntity(), TeamOwnerEntity::getTeamName))
                .homeTeamId(safeGet(tournamentPlayerFixturesEntity.getTeamOwnerEntityHomeEntity(), TeamOwnerEntity::getOwnerRegistrationId))
                .awayTeamId(safeGet(tournamentPlayerFixturesEntity.getTeamOwnerEntityAwayEntity(), TeamOwnerEntity::getOwnerRegistrationId))
                .matchDateTime(tournamentPlayerFixturesEntity.getMatchDateTime())
                .venue(tournamentPlayerFixturesEntity.getVenue())
                .fixtureStatus(tournamentPlayerFixturesEntity.getFixtureStatus())
                .result(tournamentPlayerFixturesEntity.getMatchSummary())
                .cricHeroProfile(tournamentPlayerFixturesEntity.getCricHerosMatchLink())
                .tossWinner(safeGet(tournamentPlayerFixturesEntity.getTossWinnerTeamOwnerEntity(), TeamOwnerEntity::getTeamName))
                .matchWinner(safeGet(tournamentPlayerFixturesEntity.getTeamOwnerEntityWinner(), TeamOwnerEntity::getTeamName))
                .build();
    }

    private FixtureCategory categorizeFixture(TournamentPlayerFixturesEntity fixture) {
        FixtureStatus status = fixture.getFixtureStatus();
        if (SCHEDULED.equals(status)) {
            return FixtureCategory.UPCOMING;
        }
        if (IN_PROGRESS.equals(status)) {
            return FixtureCategory.LIVE;
        }
        if (COMPLETED.equals(status) || ABANDONED.equals(status) || POSTPONED.equals(status)) {
            return FixtureCategory.PAST;
        }
        return FixtureCategory.OTHER;
    }
}
