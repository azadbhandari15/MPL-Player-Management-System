package com.mpl.backend.repository;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import com.mpl.backend.entity.PlayerRegistrationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlayerRegistrationRepository extends JpaRepository<PlayerRegistrationEntity,Long> {

    @Query("SELECT p FROM PlayerRegistrationEntity p " +
            "WHERE LOWER(p.playerName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.playerId) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<PlayerRegistrationEntity> searchByKeyword(@Param("keyword")String keyword);

    @Query("SELECT p FROM PlayerRegistrationEntity p where p.playerId in :playerIds")
    List<PlayerRegistrationEntity> findPlayerIds(@Param("playerIds")List<String> playerId);

    Optional<PlayerRegistrationEntity> findByPlayerId(String playerId);

    @Query(value = "SELECT * FROM player_registration_details where " +
            "registration_status=:registrationStatus ORDER BY RANDOM() LIMIT 1 ",nativeQuery = true)
    Optional<PlayerRegistrationEntity> findRandomEligiblePlayer(@Param("registrationStatus") String registrationStatus);

    Page<PlayerRegistrationEntity> findByRegistrationStatus(PlayerRegistrationStatus playerRegistrationStatus, Pageable pageable);
    List<PlayerRegistrationEntity> findByRegistrationStatus(PlayerRegistrationStatus playerRegistrationStatus);

}
