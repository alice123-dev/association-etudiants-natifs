package com.aen.backend.dto;

import com.aen.backend.entity.ModePaiement;
import com.aen.backend.entity.TypePeriode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CotisationDTO {

    private Long id;
    private Long membreId;
    private String membreNomComplet;
    private Double montant;
    private TypePeriode typePeriode;
    private String periodeLibelle;
    private ModePaiement modePaiement;
    private LocalDate datePaiement;
}