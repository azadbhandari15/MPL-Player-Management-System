package com.mpl.backend.repository;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlayerRegistrationRepository extends JpaRepository<PlayerRegistrationEntity,Long> {

    @Query("SELECT p FROM PlayerRegistrationEntity p " +
            "WHERE LOWER(p.playerName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.playerId) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<PlayerRegistrationEntity> searchByKeyword(@Param("keyword")String keyword);
}
