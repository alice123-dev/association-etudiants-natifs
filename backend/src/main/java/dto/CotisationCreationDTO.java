package com.aen.backend.dto;

import com.aen.backend.entity.ModePaiement;
import com.aen.backend.entity.TypePeriode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CotisationCreationDTO {

    @NotNull(message = "Le membre est obligatoire")
    private Long membreId;

    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private Double montant;

    @NotNull(message = "Le type de période est obligatoire")
    private TypePeriode typePeriode;

    @NotBlank(message = "La période est obligatoire")
    private String periodeLibelle;

    @NotNull(message = "Le mode de paiement est obligatoire")
    private ModePaiement modePaiement;

    @NotNull(message = "La date de paiement est obligatoire")
    private LocalDate datePaiement;
}