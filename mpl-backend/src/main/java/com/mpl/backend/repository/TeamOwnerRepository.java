package com.mpl.backend.repository;

import com.mpl.backend.entity.TeamOwnerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamOwnerRepository extends JpaRepository<TeamOwnerEntity,Long> {

    Optional<TeamOwnerEntity> findByOwnerRegistrationId(String ownerRegistrationId);
}
