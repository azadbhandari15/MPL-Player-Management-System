package com.mpl.backend.service;

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

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;

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

        List<TeamFixturesResponseDto> upcomingFixtures = fixtures.stream()
                .filter(fixture -> SCHEDULED
                        .equals(fixture.getFixtureStatus()))
                .map(this::mapToTeamFixtureResponseDto)
                .toList();

        List<TeamFixturesResponseDto> liveFixtures = fixtures.stream()
                .filter(fixture -> IN_PROGRESS.equals(fixture.getFixtureStatus()))
                .map(this::mapToTeamFixtureResponseDto)
                .toList();

        List<TeamFixturesResponseDto> completedFixture = fixtures.stream()
                .filter(fixture-> Arrays.asList(COMPLETED,ABANDONED,POSTPONED)
                        .contains(fixture.getFixtureStatus()))
                .map(this::mapToTeamFixtureResponseDto)
                .toList();

        return FixtureBulkResponseDto.builder()
                .liveFixture(liveFixtures)
                .pastFixtures(completedFixture)
                .upcomingFixture(upcomingFixtures)
                .build();
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
                .matchWinner(safeGet(tournamentPlayerFixturesEntity.getTossWinnerTeamOwnerEntity(), TeamOwnerEntity::getTeamName))
                .tossWinner(safeGet(tournamentPlayerFixturesEntity.getTeamOwnerEntityWinner(), TeamOwnerEntity::getTeamName))
                .build();
    }
}
