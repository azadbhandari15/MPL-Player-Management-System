package com.mpl.backend.mapper;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import com.mpl.backend.model.PlayerRegistrationResponseDto;
import org.springframework.stereotype.Component;

@Component
public class PlayerRegistrationResponseDtoMapper {

    public PlayerRegistrationResponseDto mapToPlayerRegistrationDto(PlayerRegistrationEntity playerRegistrationEntity){
        return PlayerRegistrationResponseDto.builder()
                .playerName(playerRegistrationEntity.getPlayerName())
                .playerEmail(playerRegistrationEntity.getPlayerEmail())
                .contactNumber(playerRegistrationEntity.getContactNumber())
                .playerType(playerRegistrationEntity.getPlayerType())
                .cricHerosProfile(playerRegistrationEntity.getCricHerosProfile())
                .registrationStatus(playerRegistrationEntity.getRegistrationStatus())
                .playerId(playerRegistrationEntity.getPlayerId())
                .imageUrl("/mpl/players/"+playerRegistrationEntity.getPlayerId()+"/image")
                .build();
    }
}
