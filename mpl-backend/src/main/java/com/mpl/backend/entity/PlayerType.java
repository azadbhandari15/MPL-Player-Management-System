package com.mpl.backend.entity;

public enum PlayerType {
    BATSMAN("Batsman"),
    BOWLER("Bowler"),
    ALL_ROUNDER("All Rounder"),
    WICKET_KEEPER("Wicket Keeper");

    public String value;

    PlayerType(String value) {
        this.value = value;
    }
}
