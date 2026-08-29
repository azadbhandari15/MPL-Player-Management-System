package com.mpl.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mpl.backend.entity.PlayerRegistrationStatus;
import com.mpl.backend.entity.PlayerType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PlayerRegistrationResponseDto {

    private String playerName;
    private String contactNumber;
    private String playerEmail;
    private PlayerType playerType;
    private String cricHerosProfile;
    private PlayerRegistrationStatus registrationStatus;
    private String playerId;
    private String imageUrl;
}
