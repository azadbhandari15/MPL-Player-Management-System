package com.mpl.backend.model;

import com.mpl.backend.entity.PlayerRegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlayerRegistrationUpdateRequestDto {

    private List<String> playerIds;
    private PlayerRegistrationStatus playerRegistrationStatus;
}
