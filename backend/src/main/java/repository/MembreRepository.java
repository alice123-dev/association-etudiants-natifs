package com.aen.backend.repository;

import com.aen.backend.entity.Membre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MembreRepository extends JpaRepository<Membre, Long> {

    List<Membre> findByActifTrue();

    List<Membre> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom); 
    long countByDateAdhesionAfter(java.time.LocalDate date);

    long countByDateAdhesionBefore(java.time.LocalDate date);
    Optional<Membre> findByUtilisateurEmail(String email);
}