package com.mpl.backend.service;

import com.mpl.backend.entity.TeamOwnerEntity;
import com.mpl.backend.model.OwnerRegistrationResponseDto;
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

    private static final Logger logger= LoggerFactory.getLogger(OwnerRegistrationService.class);
    private final TeamOwnerRepository teamOwnerRepository;

    public OwnerRegistrationService(TeamOwnerRepository teamOwnerRepository) {
        this.teamOwnerRepository = teamOwnerRepository;
    }

    @Transactional
    public OwnerRegistrationResponseDto registerOwnerDetails(TeamOwnerRegistrationDetailsRequestDto registrationDetailsRequestDto){
        try {
            logger.info("Registering owner details: {}",registrationDetailsRequestDto);
            String ownerId = "MPL-OWNER-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            TeamOwnerEntity teamOwnerEntity=TeamOwnerEntity.builder().ownerRegistrationId(ownerId)
                    .ownerName(registrationDetailsRequestDto.getOwnerName())
                    .teamName(registrationDetailsRequestDto.getTeamName())
                    .budgetRemaining(initialPurseAmount)
                    .ownerEmailAddress(registrationDetailsRequestDto.getOwnerEmailId())
                    .ownerContactNumber(registrationDetailsRequestDto.getOwnerContactNumber())
                    .build();

            TeamOwnerEntity savedOwnerEntity = teamOwnerRepository.save(teamOwnerEntity);
            return OwnerRegistrationResponseDto.builder()
                    .ownerName(savedOwnerEntity.getOwnerName())
                    .ownerContactNumber(savedOwnerEntity.getOwnerContactNumber())
                    .teamName(savedOwnerEntity.getTeamName())
                    .ownerEmailId(savedOwnerEntity.getOwnerEmailAddress())
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
}
