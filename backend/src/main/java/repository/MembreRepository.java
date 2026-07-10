package com.aen.backend.repository;

import com.aen.backend.entity.Membre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MembreRepository extends JpaRepository<Membre, Long> {

    List<Membre> findByActifTrue();

    List<Membre> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
}