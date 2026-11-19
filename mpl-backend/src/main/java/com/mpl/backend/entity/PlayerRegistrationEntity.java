package com.mpl.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="player_registration_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerRegistrationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_name", nullable = false, length = 50)
    private String playerName;

    @Column(name = "contact_number", nullable = false, length = 50)
    private String contactNumber;

    @Column(name = "player_email")
    private String playerEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "player_type", columnDefinition = "TEXT")
    private PlayerType playerType;

    @Column(name = "cric_heros_profile")
    private String cricHerosProfile;

    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status")
    private PlayerRegistrationStatus registrationStatus;

    @Column(name = "player_id")
    private String playerId;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "registered_date")
    private LocalDateTime registeredDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private TeamOwnerEntity owner;

    private BigDecimal soldPrice;
}
