package com.mpl.backend.controller;

import com.mpl.backend.model.PlayerRegistrationRequestDto;
import com.mpl.backend.model.PlayerRegistrationResponseDto;
import com.mpl.backend.model.PlayerRegistrationUpdateRequestDto;
import com.mpl.backend.service.PlayerRegistrationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/mpl/players")
public class PlayerRegistrationController {

    private final PlayerRegistrationService playerRegistrationService;

    public PlayerRegistrationController(PlayerRegistrationService playerRegistrationService) {
        this.playerRegistrationService = playerRegistrationService;
    }

    @PostMapping(value = "/register-player",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PlayerRegistrationResponseDto> registerPlayerRegistration(@RequestPart("playerInfo") PlayerRegistrationRequestDto playerRegistrationRequestDto,
                                                                                    @RequestPart(value = "playerImage",required = false) MultipartFile multipartFile) throws Exception{
        return ResponseEntity.ok(playerRegistrationService.registerMPLPlayer(playerRegistrationRequestDto,multipartFile));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PlayerRegistrationResponseDto>> retrievePlayerEntries(@RequestParam(value = "keyword") String keyword){
        return ResponseEntity.ok(playerRegistrationService.retrievePlayerDetails(keyword));
    }

    @PutMapping("/update-player-registration-status")
    public ResponseEntity<List<PlayerRegistrationResponseDto>> updatePlayerRegistrationStatus(@RequestBody PlayerRegistrationUpdateRequestDto playerRegistrationRequestDto){
        return ResponseEntity.ok(playerRegistrationService.updatePlayerStatus(playerRegistrationRequestDto.getPlayerIds(),
                playerRegistrationRequestDto.getPlayerRegistrationStatus()));
    }
}
