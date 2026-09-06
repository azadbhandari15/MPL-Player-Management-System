package com.mpl.backend.repository;

import com.mpl.backend.entity.TeamOwnerEntity;
import com.mpl.backend.model.TeamBudgetResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeamOwnerRepository extends JpaRepository<TeamOwnerEntity,Long> {

    Optional<TeamOwnerEntity> findByOwnerRegistrationId(String ownerRegistrationId);

    @Query("Select new com.mpl.backend.model.TeamBudgetResponseDto(o.teamName,o.budgetRemaining) " +
            "from TeamOwnerEntity o")
    List<TeamBudgetResponseDto> findTeamName();
}
