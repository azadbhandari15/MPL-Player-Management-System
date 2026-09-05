package com.mpl.backend.service;

import com.mpl.backend.entity.PlayerRegistrationStatus;
import com.mpl.backend.mapper.PlayerRegistrationResponseDtoMapper;
import com.mpl.backend.model.PlayerRegistrationResponseDto;
import com.mpl.backend.repository.PlayerRegistrationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PlayerDetailsRetrievalService {

    private final PlayerRegistrationRepository playerRegistrationRepository;
    private final PlayerRegistrationResponseDtoMapper playerRegistrationResponseDtoMapper;

    public PlayerDetailsRetrievalService(PlayerRegistrationRepository playerRegistrationRepository, PlayerRegistrationResponseDtoMapper playerRegistrationResponseDtoMapper) {
        this.playerRegistrationRepository = playerRegistrationRepository;
        this.playerRegistrationResponseDtoMapper = playerRegistrationResponseDtoMapper;
    }

    public Page<PlayerRegistrationResponseDto> findAllPlayers(Pageable pageable){
        return playerRegistrationRepository.findByRegistrationStatus(PlayerRegistrationStatus.ELIGIBLE_FOR_AUCTION,pageable)
                .map(playerRegistrationResponseDtoMapper::mapToPlayerRegistrationDto);

    }
}
