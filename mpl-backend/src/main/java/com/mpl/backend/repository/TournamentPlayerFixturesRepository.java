package com.mpl.backend.repository;

import com.mpl.backend.entity.TournamentPlayerFixturesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TournamentPlayerFixturesRepository extends JpaRepository<TournamentPlayerFixturesEntity,Long> {

    Optional<TournamentPlayerFixturesEntity> findByFixtureId(String fixtureId);
}
