package com.aen.backend.repository;

import com.aen.backend.entity.Reunion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReunionRepository extends JpaRepository<Reunion, Long> {
}