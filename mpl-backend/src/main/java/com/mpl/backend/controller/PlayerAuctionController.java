package com.mpl.backend.controller;

import com.mpl.backend.model.PlayerAuctionBiddingRequestDto;
import com.mpl.backend.model.PlayerAuctionResponseDto;
import com.mpl.backend.service.PlayerAuctionBiddingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mpl")
public class PlayerAuctionController {


    private final PlayerAuctionBiddingService playerAuctionBiddingService;

    public PlayerAuctionController(PlayerAuctionBiddingService playerAuctionBiddingService) {
        this.playerAuctionBiddingService = playerAuctionBiddingService;
    }

    @PostMapping("/bid-auction-player")
    public ResponseEntity<PlayerAuctionResponseDto> bidAuctionPlayer(@RequestBody PlayerAuctionBiddingRequestDto
                                                                                 playerAuctionBiddingRequestDto){
        return ResponseEntity.ok(playerAuctionBiddingService.bidPlayer(playerAuctionBiddingRequestDto));
    }
}
