package com.mpl.backend.model;

import java.math.BigDecimal;
import java.time.Instant;

public record LiveAuctionState(String playerId, String playerName, String playerType,
                               String imageUrl, BigDecimal currentBid, String highestBidderTeam, Instant updatedAt) {
}
