package com.mpl.backend.model;

import com.mpl.backend.entity.PlayerRegistrationStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PlayerAuctionBiddingRequestDto {

    private String playerId;
    private String ownerId;
    private PlayerRegistrationStatus auctionStatus;
    private BigDecimal auctionSoldAmount;
}
