package com.mpl.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="tournament_fixtures")
public class TournamentPlayerFixturesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fixtureId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_home_id",nullable = false)
    private TeamOwnerEntity teamOwnerEntityHomeEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_away_id",nullable = false)
    private TeamOwnerEntity teamOwnerEntityAwayEntity;


    @Column(nullable = false)
    private LocalDateTime matchDateTime;
    @Column(nullable = false)
    private String venue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FixtureStatus fixtureStatus=FixtureStatus.SCHEDULED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_team_id")
    private TeamOwnerEntity teamOwnerEntityWinner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="toss_winner_team_id")
    private TeamOwnerEntity tossWinnerTeamOwnerEntity;

    private String tossDecision;
    private String matchSummary;
    private String cricHerosMatchLink;


}
