package com.aen.backend.repository;

import com.aen.backend.entity.Cotisation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CotisationRepository extends JpaRepository<Cotisation, Long> {

    List<Cotisation> findByMembreId(Long membreId);

    List<Cotisation> findByPeriodeLibelle(String periodeLibelle);

    boolean existsByMembreIdAndPeriodeLibelle(Long membreId, String periodeLibelle);
}