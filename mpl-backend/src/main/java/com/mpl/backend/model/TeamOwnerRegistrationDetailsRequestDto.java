package com.mpl.backend.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TeamOwnerRegistrationDetailsRequestDto {

    private String ownerName;
    private String ownerContactNumber;
    private String ownerEmailId;
    private String teamName;
}
