package com.mpl.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OwnerRegistrationResponseDto {
    private String ownerName;
    private String ownerContactNumber;
    private String teamName;
    private String ownerRegistrationId;
    private BigDecimal availablePurse;
    private LocalDateTime registrationDate;
    private String ownerEmailId;
}
