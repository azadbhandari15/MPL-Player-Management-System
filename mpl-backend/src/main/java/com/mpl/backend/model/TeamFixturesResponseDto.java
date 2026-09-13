package com.mpl.backend.model;

import com.mpl.backend.entity.FixtureStatus;
import lombok.*;
import org.springframework.beans.factory.config.YamlProcessor;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamFixturesResponseDto {
    private String matchFixtureId;
    private String homeTeamName;
    private String awayTeamName;
    private LocalDateTime matchDateTime;
    private String venue;
    private FixtureStatus fixtureStatus;
}
