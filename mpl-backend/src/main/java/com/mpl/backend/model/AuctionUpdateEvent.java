package com.mpl.backend.model;

public record AuctionUpdateEvent(String type, LiveAuctionState state) {
}
