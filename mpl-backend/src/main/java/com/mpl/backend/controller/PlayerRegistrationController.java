package com.mpl.backend.controller;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import com.mpl.backend.model.PlayerRegistrationRequestDto;
import com.mpl.backend.model.PlayerRegistrationResponseDto;
import com.mpl.backend.model.PlayerRegistrationUpdateRequestDto;
import com.mpl.backend.service.PlayerDetailsRetrievalService;
import com.mpl.backend.service.PlayerRegistrationService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.data.web.config.SpringDataJackson3Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/mpl/players")
public class PlayerRegistrationController {

    private final PlayerRegistrationService playerRegistrationService;
    private final PlayerDetailsRetrievalService playerDetailsRetrievalService;

    public PlayerRegistrationController(PlayerRegistrationService playerRegistrationService, PlayerDetailsRetrievalService playerDetailsRetrievalService) {
        this.playerRegistrationService = playerRegistrationService;
        this.playerDetailsRetrievalService = playerDetailsRetrievalService;
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

    @GetMapping("/{playerId}/image")
    public ResponseEntity<byte[]> retrievePlayerImage(@PathVariable String playerId){
        PlayerRegistrationEntity playerRegistrationEntity = playerRegistrationService.retrievePlayerImage(playerId);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(playerRegistrationEntity.getImageType())).body(playerRegistrationEntity.getImageData());
    }

    @GetMapping("/next-player")
    public ResponseEntity<PlayerRegistrationResponseDto> findNextEligiblePlayer(){
        return ResponseEntity.ok(playerRegistrationService.retrieveRandomPlayer());
    }

    @GetMapping("/find-all-player")
    public ResponseEntity<PagedModel<PlayerRegistrationResponseDto>> retrieveAllPlayerDetails(@PageableDefault(page = 0,size = 20)Pageable pageable){
        return ResponseEntity.ok(new PagedModel<>(playerDetailsRetrievalService.findAllPlayers(pageable)));
    }

    @GetMapping("/find-all-player-export")
    public ResponseEntity<InputStreamResource> downloadAllEligiblePlayers() throws IOException {
        String fileName="mpl-registered-player.xlsx";
        ByteArrayInputStream inputStream=playerDetailsRetrievalService.exportPlayerList();

        HttpHeaders httpHeaders=new HttpHeaders();
        httpHeaders.add("Content-Disposition","attachment; filename="+fileName);

        return ResponseEntity.ok().headers(httpHeaders)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(inputStream));

    }
}
