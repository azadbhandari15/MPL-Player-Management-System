package com.mpl.backend.repository;

import com.mpl.backend.entity.PlayerRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRegistrationRepository extends JpaRepository<PlayerRegistrationEntity,Long> {
}
