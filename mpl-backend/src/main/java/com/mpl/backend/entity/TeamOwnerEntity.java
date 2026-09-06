package com.mpl.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.cfg.CacheSettings;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "team_owner_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamOwnerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ownerName;
    private String ownerContactNumber;
    private String ownerEmailAddress;
    private String teamName;
    private String ownerRegistrationId;
    private BigDecimal budgetRemaining;
    @CreationTimestamp
    private LocalDateTime registeredDate;

    @OneToMany(mappedBy = "owner",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<PlayerRegistrationEntity> players=new ArrayList<>();

}
