package com.mpl.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Types;
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

    private String playerName;
    private String contactNumber;
    private String playerEmail;
    @Enumerated(EnumType.STRING)
    private PlayerType playerType;
    private String cricHerosProfile;
    @Enumerated(EnumType.STRING)
    private PlayerRegistrationStatus registrationStatus;
    private String playerId;

    @Column(name = "image_name")
    private String imageName;


    @Column(name="image_type")
    private String imageType;

    @Lob
    @JdbcTypeCode(Types.BINARY)
    @Column(name="image_data",columnDefinition = "BYTEA")
    private byte[] imageData;

    @CreationTimestamp
    private LocalDateTime registeredDate;

    @UpdateTimestamp
    private LocalDateTime updatedDate;
}
