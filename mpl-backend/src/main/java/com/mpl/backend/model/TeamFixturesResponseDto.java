package com.mpl.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mpl.backend.entity.FixtureStatus;
import lombok.*;
import org.springframework.beans.factory.config.YamlProcessor;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TeamFixturesResponseDto {
    private String matchFixtureId;
    private String homeTeamName;
    private String homeTeamId;
    private String awayTeamName;
    private String awayTeamId;
    private LocalDateTime matchDateTime;
    private String venue;
    private FixtureStatus fixtureStatus;
    private String result;
    private String cricHeroProfile;
    private String tossWinner;
    private String matchWinner;
}
