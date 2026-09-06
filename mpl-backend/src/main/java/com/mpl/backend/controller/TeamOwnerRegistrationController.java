package com.mpl.backend.controller;

import com.mpl.backend.model.OwnerRegistrationResponseDto;
import com.mpl.backend.model.TeamBudgetResponseDto;
import com.mpl.backend.model.TeamOwnerRegistrationDetailsRequestDto;
import com.mpl.backend.service.OwnerRegistrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("mpl/owner")
public class TeamOwnerRegistrationController {
    private static final Logger logger= LoggerFactory.getLogger(TeamOwnerRegistrationController.class);

    private final OwnerRegistrationService ownerRegistrationService;

    public TeamOwnerRegistrationController(OwnerRegistrationService ownerRegistrationService) {
        this.ownerRegistrationService = ownerRegistrationService;
    }

    @PostMapping("/register-owner")
    public ResponseEntity<OwnerRegistrationResponseDto> registerOwnerDetails(@RequestBody
                                                                                 TeamOwnerRegistrationDetailsRequestDto registrationDetailsRequestDto){
        return ResponseEntity.ok(ownerRegistrationService.registerOwnerDetails(registrationDetailsRequestDto));
    }

    @GetMapping("/retrieve-team-name")
    public ResponseEntity<List<TeamBudgetResponseDto>> retrieveTeamDetails(){
        return ResponseEntity.ok(ownerRegistrationService.retrieveTeamDetails());
    }

    @GetMapping("/owner-details/{ownerId}")
    public ResponseEntity<OwnerRegistrationResponseDto> retrieveTeamDetails(@PathVariable String ownerId){
        return ResponseEntity.ok(ownerRegistrationService.retrieveOwnerDetails(ownerId));
    }

}
