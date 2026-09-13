package com.mpl.backend.model;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class TeamFixturesRequestDto {

    @NotBlank
    private String homeTeamOwnerId;
    @NotBlank
    private String awayTeamOwnerId;
    @Future(message = "Match Time Must be in future")
    private LocalDateTime matchDateTime;
    private String venue;
}
