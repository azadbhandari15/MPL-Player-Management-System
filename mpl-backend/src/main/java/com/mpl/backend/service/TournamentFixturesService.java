package com.mpl.backend.service;

import com.mpl.backend.entity.FixtureStatus;
import com.mpl.backend.entity.TeamOwnerEntity;
import com.mpl.backend.entity.TournamentPlayerFixturesEntity;
import com.mpl.backend.model.TeamFixturesRequestDto;
import com.mpl.backend.model.TeamFixturesResponseDto;
import com.mpl.backend.repository.TeamOwnerRepository;
import com.mpl.backend.repository.TournamentPlayerFixturesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TournamentFixturesService {

    private static final Logger logger= LoggerFactory.getLogger(TournamentFixturesService.class);
    private final TeamOwnerRepository teamOwnerRepository;
    private final TournamentPlayerFixturesRepository tournamentPlayerFixturesRepository;

    public TournamentFixturesService(TeamOwnerRepository teamOwnerRepository, TournamentPlayerFixturesRepository tournamentPlayerFixturesRepository) {
        this.teamOwnerRepository = teamOwnerRepository;
        this.tournamentPlayerFixturesRepository = tournamentPlayerFixturesRepository;
    }

    @Transactional
    public TeamFixturesResponseDto createTournamentFixture(TeamFixturesRequestDto teamFixturesRequestDto){

        logger.info("Registering Tournament Fixture: {} ",teamFixturesRequestDto);

        if(teamFixturesRequestDto.getHomeTeamOwnerId().equalsIgnoreCase(teamFixturesRequestDto.getAwayTeamOwnerId())){
            throw new IllegalArgumentException("Home and Away Team Owner Cannot have same OwnerId");
        }

        TeamOwnerEntity homeTeam = teamOwnerRepository.findByOwnerRegistrationId(teamFixturesRequestDto.getHomeTeamOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner Details Not Found"));

        TeamOwnerEntity awayTeam=teamOwnerRepository.findByOwnerRegistrationId(teamFixturesRequestDto.getAwayTeamOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner Details Not Found"));

        String fixtureId="MPLFIX"+ UUID.randomUUID().toString().replace("-","").toUpperCase();

        TournamentPlayerFixturesEntity tournamentPlayerFixturesEntity=TournamentPlayerFixturesEntity.builder()
                .teamOwnerEntityHomeEntity(homeTeam)
                .teamOwnerEntityAwayEntity(awayTeam)
                .matchDateTime(teamFixturesRequestDto.getMatchDateTime())
                .venue(teamFixturesRequestDto.getVenue())
                .fixtureStatus(FixtureStatus.SCHEDULED)
                .fixtureId(fixtureId)
                .build();

        TournamentPlayerFixturesEntity savedFixture = tournamentPlayerFixturesRepository.save(tournamentPlayerFixturesEntity);


        return TeamFixturesResponseDto.builder().matchFixtureId(savedFixture.getFixtureId())
                .homeTeamName(homeTeam.getTeamName())
                .awayTeamName(awayTeam.getTeamName())
                .matchDateTime(savedFixture.getMatchDateTime())
                .venue(savedFixture.getVenue())
                .fixtureStatus(savedFixture.getFixtureStatus())
                .build();
    }
}
