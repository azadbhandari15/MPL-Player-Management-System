package com.mpl.backend.controller;

import com.mpl.backend.component.LiveAuctionHolder;
import com.mpl.backend.model.AuctionUpdateEvent;
import com.mpl.backend.model.LiveAuctionState;
import com.mpl.backend.publisher.AuctionEventPublisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;

@RestController
@RequestMapping("mpl/auction")
public class LiveAuctionController {

    private final AuctionEventPublisher publisher;
    private final LiveAuctionHolder auctionHolder;
    private final String adminKey;

    public LiveAuctionController(AuctionEventPublisher publisher, LiveAuctionHolder auctionHolder,
                                 @Value("${mpl.auction.admin-key}") String adminKey) {
        this.publisher = publisher;
        this.auctionHolder = auctionHolder;
        this.adminKey = adminKey;
    }

    @GetMapping("/state")
    public ResponseEntity<LiveAuctionState> state(){
        LiveAuctionState state=auctionHolder.get();
        return state==null? ResponseEntity.noContent().build():ResponseEntity.ok(state);
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(){
        return publisher.subscribe();
    }

    @PostMapping("/live")
    public ResponseEntity<Void> updateLive(@RequestHeader(value = "X-Admin-Key", required = false)String key,
                                           @RequestBody LiveAuctionState auctionState){
//        if(!isAdmin(key))
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        if(auctionState.playerId()==null || auctionState.playerId().isBlank() ||
                auctionState.currentBid()==null || auctionState.currentBid().signum()<0){
            return ResponseEntity.badRequest().build();
        }

        LiveAuctionState state=new LiveAuctionState(auctionState.playerId(),auctionState.playerName(),
                auctionState.playerType(),auctionState.imageUrl(),auctionState.currentBid(),auctionState.highestBidderTeam(),
                Instant.now());

        auctionHolder.set(state);
        publisher.publish(new AuctionUpdateEvent("BID_UPDATED",state));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/live")
    public ResponseEntity<Void> clearLive(@RequestHeader(value = "X-Admin-Key",required = false) String key){
//        if (!isAdmin(key)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        auctionHolder.clear();
        publisher.publish(new AuctionUpdateEvent("AUCTION_CLEARED",null));
        return ResponseEntity.noContent().build();
    }


    private boolean isAdmin(String key) {
        return key != null && MessageDigest.isEqual(
                key.getBytes(StandardCharsets.UTF_8),
                adminKey.getBytes(StandardCharsets.UTF_8));
    }
}
