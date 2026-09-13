package com.mpl.backend.controller;

import com.mpl.backend.model.TeamFixturesRequestDto;
import com.mpl.backend.model.TeamFixturesResponseDto;
import com.mpl.backend.service.TournamentFixturesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mpl/fixture")
public class TeamFixtureController {

    private static final Logger logger= LoggerFactory.getLogger(TeamFixtureController.class);
    private final TournamentFixturesService tournamentFixturesService;

    public TeamFixtureController(TournamentFixturesService tournamentFixturesService) {
        this.tournamentFixturesService = tournamentFixturesService;
    }

    @PostMapping("/create-fixture")
    public ResponseEntity<TeamFixturesResponseDto> teamFixtureResponseDto(@RequestBody TeamFixturesRequestDto teamFixturesRequestDto){
        logger.info("Received Request to process fixture :{}",teamFixturesRequestDto);
        return ResponseEntity.ok(tournamentFixturesService.createTournamentFixture(teamFixturesRequestDto));

    }
}
