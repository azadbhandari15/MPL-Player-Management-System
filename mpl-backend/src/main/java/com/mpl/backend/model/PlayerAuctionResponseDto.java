package com.mpl.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mpl.backend.entity.PlayerRegistrationStatus;
import com.mpl.backend.entity.PlayerType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlayerAuctionResponseDto {

    private String playerName;
    private PlayerRegistrationStatus auctionStatus;
    private PlayerType playerType;
    private BigDecimal bidAmount;
    private String teamName;
    private String ownerName;
}
