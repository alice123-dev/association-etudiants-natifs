package com.aen.backend.repository;

import com.aen.backend.entity.ParticipantReunion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipantReunionRepository extends JpaRepository<ParticipantReunion, Long> {

    List<ParticipantReunion> findByReunionId(Long reunionId);

    Optional<ParticipantReunion> findByReunionIdAndMembreId(Long reunionId, Long membreId);
}