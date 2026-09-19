package com.mpl.backend.model;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixtureBulkResponseDto {

    private List<TeamFixturesResponseDto> upcomingFixture;
    private List<TeamFixturesResponseDto> liveFixture;
    private List<TeamFixturesResponseDto> pastFixtures;
}
