package com.mpl.backend.service;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import com.mpl.backend.entity.PlayerRegistrationStatus;
import com.mpl.backend.model.PlayerRegistrationRequestDto;
import com.mpl.backend.model.PlayerRegistrationResponseDto;
import com.mpl.backend.repository.PlayerRegistrationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class PlayerRegistrationService {

    private static final Logger logger= LoggerFactory.getLogger(PlayerRegistrationService.class);


    private final PlayerRegistrationRepository playerRegistrationRepository;

    public PlayerRegistrationService(PlayerRegistrationRepository playerRegistrationRepository) {
        this.playerRegistrationRepository = playerRegistrationRepository;
    }


    public PlayerRegistrationResponseDto registerMPLPlayer(PlayerRegistrationRequestDto playerRegistrationRequestDto,
                                                           MultipartFile multipartFile) throws IOException{
        try {
            logger.info("Starting Registration Process player : {}",playerRegistrationRequestDto);
            PlayerRegistrationEntity playerRegistrationEntity=createPlayerRegistrationEntry(playerRegistrationRequestDto,multipartFile);
            playerRegistrationRepository.save(playerRegistrationEntity);
            return PlayerRegistrationResponseDto.builder()
                    .playerName(playerRegistrationEntity.getPlayerName())
                    .playerEmail(playerRegistrationEntity.getPlayerEmail())
                    .contactNumber(playerRegistrationEntity.getContactNumber())
                    .playerType(playerRegistrationEntity.getPlayerType())
                    .cricHerosProfile(playerRegistrationEntity.getCricHerosProfile())
                    .registrationStatus(playerRegistrationEntity.getRegistrationStatus())
                    .playerId(playerRegistrationEntity.getPlayerId())
                    .build();
        }catch (Exception e){
            logger.error("An Error Occurred while registration of player :{}",e.getMessage());
            throw e;
        }
    }

    public PlayerRegistrationEntity createPlayerRegistrationEntry(PlayerRegistrationRequestDto playerRegistrationRequestDto,
                                                                  MultipartFile multipartFile) throws IOException {

        return PlayerRegistrationEntity.builder()
                .playerName(playerRegistrationRequestDto.getPlayerName())
                .contactNumber(playerRegistrationRequestDto.getContactNumber())
                .playerEmail(playerRegistrationRequestDto.getPlayerEmail())
                .playerType(playerRegistrationRequestDto.getPlayerType())
                .cricHerosProfile(playerRegistrationRequestDto.getCricHerosProfile())
                .registrationStatus(PlayerRegistrationStatus.REGISTERED)
                .imageName(multipartFile.getOriginalFilename())
                .imageType(multipartFile.getContentType())
                .imageData(multipartFile.getBytes())
                .playerId(generatePlayerName(playerRegistrationRequestDto.getPlayerName()))
                .build();

    }

    public List<PlayerRegistrationResponseDto> updatePlayerStatus(List<String> playerId,PlayerRegistrationStatus playerRegistrationStatus){
        List<PlayerRegistrationEntity> existingPlayerId = playerRegistrationRepository.findPlayerIds(playerId);
        List<PlayerRegistrationEntity> updatedEntityList = existingPlayerId.stream()
                .peek(player -> player.setRegistrationStatus(playerRegistrationStatus)).toList();

        List<PlayerRegistrationEntity> savedPlayerRegistrationEntity = playerRegistrationRepository.saveAll(updatedEntityList);
        return savedPlayerRegistrationEntity.stream().map(this::mapToPlayerRegistrationDto).toList();
    }

    public PlayerRegistrationEntity retrievePlayerImage(String playerId){
        PlayerRegistrationEntity playerRegistrationEntity = playerRegistrationRepository.findByPlayerId(playerId)
                .orElseThrow(() -> new RuntimeException("Player Details Not Found"));
        byte[] imageData = playerRegistrationEntity.getImageData();
        if(imageData==null){
            throw new RuntimeException("Image Details not found");
        }
        return playerRegistrationEntity;
    }

    public PlayerRegistrationResponseDto retrieveRandomPlayer(){
        return playerRegistrationRepository.findRandomEligiblePlayer(PlayerRegistrationStatus.ELIGIBLE_FOR_AUCTION.name())
                .map(this::mapToPlayerRegistrationDto)
                .orElseThrow(() -> new RuntimeException("No Eligible Players Are there for Auction"));
    }

    public List<PlayerRegistrationResponseDto> retrievePlayerDetails(String keyword){
        List<PlayerRegistrationEntity> playerRegistrationEntities = playerRegistrationRepository.searchByKeyword(keyword);
        return playerRegistrationEntities.stream().map(this::mapToPlayerRegistrationDto).toList();
    }

    private String generatePlayerName(String playerName){
        String uuidString= UUID.randomUUID().toString().substring(0,6);
        return playerName.replace(" ","").toUpperCase()+uuidString.toUpperCase();
    }

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
