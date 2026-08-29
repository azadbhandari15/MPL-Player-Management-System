package com.mpl.backend.model;

import com.mpl.backend.entity.PlayerType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PlayerRegistrationRequestDto {


    private String playerName;
    private String contactNumber;
    private String playerEmail;
    private PlayerType playerType;
    private String cricHerosProfile;

}
