package com.mpl.backend.service;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import com.mpl.backend.entity.TeamOwnerEntity;
import com.mpl.backend.model.PlayerAuctionBiddingRequestDto;
import com.mpl.backend.model.PlayerAuctionResponseDto;
import com.mpl.backend.repository.PlayerRegistrationRepository;
import com.mpl.backend.repository.TeamOwnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

import static com.mpl.backend.entity.PlayerRegistrationStatus.*;

@Service
public class PlayerAuctionBiddingService {

    private static final Logger logger= LoggerFactory.getLogger(PlayerAuctionBiddingService.class);
    private final PlayerRegistrationRepository playerRegistrationRepository;
    private final TeamOwnerRepository teamOwnerRepository;

    public PlayerAuctionBiddingService(PlayerRegistrationRepository playerRegistrationRepository, TeamOwnerRepository teamOwnerRepository) {
        this.playerRegistrationRepository = playerRegistrationRepository;
        this.teamOwnerRepository = teamOwnerRepository;
    }

    @Transactional
    public PlayerAuctionResponseDto bidPlayer(PlayerAuctionBiddingRequestDto playerAuctionBiddingRequestDto){
        logger.info("Updating Auction Details for the player: {}",playerAuctionBiddingRequestDto);

        if(Arrays.asList(REGISTERED,ELIGIBLE_FOR_AUCTION,INELIGIBLE_FOR_AUCTION)
                .contains(playerAuctionBiddingRequestDto.getAuctionStatus())){
            throw new RuntimeException("Invalid Status for Auction Bidding Accepted Values are SOLD,UNSOLD");
        }

        PlayerRegistrationEntity playerRegistrationEntity = playerRegistrationRepository.findByPlayerId(playerAuctionBiddingRequestDto.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player Details Not Found"));

        if(SOLD.equals(playerRegistrationEntity.getRegistrationStatus())){
            throw new RuntimeException("Player is already Sold, therefore it cannot be picked");
        }



        if(SOLD.equals(playerAuctionBiddingRequestDto.getAuctionStatus())) {

            TeamOwnerEntity teamOwnerEntity = teamOwnerRepository.findByOwnerRegistrationId(playerAuctionBiddingRequestDto.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner Details Not Found"));

            if(playerAuctionBiddingRequestDto.getAuctionSoldAmount().compareTo(teamOwnerEntity.getBudgetRemaining())== 1){
                throw new RuntimeException("Team is ineligible to buy this player as the auction amount exceeds the team purse");
            }
            teamOwnerEntity.setBudgetRemaining(teamOwnerEntity.getBudgetRemaining()
                    .subtract(playerAuctionBiddingRequestDto.getAuctionSoldAmount()));

            playerRegistrationEntity.setRegistrationStatus(SOLD);
            playerRegistrationEntity.setSoldPrice(playerAuctionBiddingRequestDto.getAuctionSoldAmount());
            playerRegistrationEntity.setOwner(teamOwnerEntity);

            playerRegistrationRepository.save(playerRegistrationEntity);
            teamOwnerRepository.save(teamOwnerEntity);

            return PlayerAuctionResponseDto
                    .builder()
                    .playerName(playerRegistrationEntity.getPlayerName())
                    .playerType(playerRegistrationEntity.getPlayerType())
                    .bidAmount(playerRegistrationEntity.getSoldPrice())
                    .teamName(teamOwnerEntity.getTeamName())
                    .ownerName(teamOwnerEntity.getOwnerName())
                    .auctionStatus(playerAuctionBiddingRequestDto.getAuctionStatus())
                    .build();
        }

        playerRegistrationEntity.setRegistrationStatus(UNSOLD);
        playerRegistrationRepository.save(playerRegistrationEntity);

        return PlayerAuctionResponseDto
                .builder()
                .playerName(playerRegistrationEntity.getPlayerName())
                .playerType(playerRegistrationEntity.getPlayerType())
                .auctionStatus(playerAuctionBiddingRequestDto.getAuctionStatus())
                .build();
    }
}
