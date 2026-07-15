package com.aen.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cotisations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cotisation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "membre_id", nullable = false)
    private Membre membre;

    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    @Column(nullable = false)
    private Double montant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePeriode typePeriode;

    @NotBlank(message = "La période est obligatoire")
    @Column(nullable = false)
    private String periodeLibelle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModePaiement modePaiement;

    @NotNull(message = "La date de paiement est obligatoire")
    @Column(nullable = false)
    private LocalDate datePaiement;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
    }
}