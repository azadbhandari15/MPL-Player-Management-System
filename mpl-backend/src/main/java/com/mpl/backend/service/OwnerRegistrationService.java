package com.mpl.backend.service;

import com.mpl.backend.entity.TeamOwnerEntity;
import com.mpl.backend.model.OwnerRegistrationResponseDto;
import com.mpl.backend.model.PlayerAuctionResponseDto;
import com.mpl.backend.model.TeamBudgetResponseDto;
import com.mpl.backend.model.TeamOwnerRegistrationDetailsRequestDto;
import com.mpl.backend.repository.TeamOwnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class OwnerRegistrationService {

    @Value("${mpl.owner.initial.purse.amount:10000}")
    private BigDecimal initialPurseAmount;

    @Value("${mpl.owner.coowner.substraction.amount:2000}")
    private BigDecimal coOwnerSubstractionAmount;

    private static final Logger logger= LoggerFactory.getLogger(OwnerRegistrationService.class);
    private final TeamOwnerRepository teamOwnerRepository;

    public OwnerRegistrationService(TeamOwnerRepository teamOwnerRepository) {
        this.teamOwnerRepository = teamOwnerRepository;
    }

    @Transactional
    public OwnerRegistrationResponseDto registerOwnerDetails(TeamOwnerRegistrationDetailsRequestDto registrationDetailsRequestDto){
        try {
            BigDecimal purseAmount=Boolean.TRUE.equals(registrationDetailsRequestDto.getCoOwnerExists())? (initialPurseAmount.subtract(coOwnerSubstractionAmount)):initialPurseAmount;
            logger.info("Registering owner details: {}",registrationDetailsRequestDto);
            String ownerId = "MPL-OWNER-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            TeamOwnerEntity teamOwnerEntity=TeamOwnerEntity.builder().ownerRegistrationId(ownerId)
                    .ownerName(registrationDetailsRequestDto.getOwnerName())
                    .teamName(registrationDetailsRequestDto.getTeamName())
                    .budgetRemaining(purseAmount)
                    .coOwnerName(registrationDetailsRequestDto.getCoOwnerName())
                    .coOwnerContactNumber(registrationDetailsRequestDto.getCoOwnerContactNumber())
                    .ownerContactNumber(registrationDetailsRequestDto.getOwnerContactNumber())
                    .coOwnerExists(registrationDetailsRequestDto.getCoOwnerExists())
                    .build();

            TeamOwnerEntity savedOwnerEntity = teamOwnerRepository.save(teamOwnerEntity);
            return OwnerRegistrationResponseDto.builder()
                    .ownerName(savedOwnerEntity.getOwnerName())
                    .ownerContactNumber(savedOwnerEntity.getOwnerContactNumber())
                    .teamName(savedOwnerEntity.getTeamName())
                    .ownerRegistrationId(savedOwnerEntity.getOwnerRegistrationId())
                    .registrationDate(savedOwnerEntity.getRegisteredDate())
                    .availablePurse(savedOwnerEntity.getBudgetRemaining())
                    .build();

        }catch (Exception e){
            logger.error("An Error Occurred while persisting owner details:{}",e.getMessage());
            throw e;
        }

    }

    public List<TeamBudgetResponseDto> retrieveTeamDetails(){
        return teamOwnerRepository.findTeamName();
    }

    public OwnerRegistrationResponseDto retrieveOwnerDetails(String ownerRegistrationId){
        TeamOwnerEntity teamOwnerEntity = teamOwnerRepository.findByOwnerRegistrationId(ownerRegistrationId)
                .orElseThrow(() -> new RuntimeException("Owner Details Not Found"));

        List<PlayerAuctionResponseDto> players=teamOwnerEntity.getPlayers()
                .stream().map(player->PlayerAuctionResponseDto
                        .builder()
                        .playerName(player.getPlayerName())
                        .playerType(player.getPlayerType())
                        .bidAmount(player.getSoldPrice())
                        .contactNumber(player.getContactNumber())
                        .playerId(player.getPlayerId())
                        .build())
                .toList();

        return OwnerRegistrationResponseDto.builder()
                .ownerName(teamOwnerEntity.getOwnerName())
                .ownerContactNumber(teamOwnerEntity.getOwnerContactNumber())
                .teamName(teamOwnerEntity.getTeamName())
                .ownerRegistrationId(teamOwnerEntity.getOwnerRegistrationId())
                .registrationDate(teamOwnerEntity.getRegisteredDate())
                .availablePurse(teamOwnerEntity.getBudgetRemaining())
                .coOwnerContactNumber(teamOwnerEntity.getCoOwnerContactNumber())
                .coOwnerName(teamOwnerEntity.getCoOwnerName())
                .players(players)
                .build();
    }
}
