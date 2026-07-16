package com.aen.backend.dto;

import com.aen.backend.entity.CategorieActivite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActiviteDTO {

    private Long id;
    private String titre;
    private String description;
    private CategorieActivite categorie;
    private LocalDate date;
    private LocalTime heure;
    private String lieu;
    private Long responsableId;
    private String responsableNomComplet;
    private Integer nombreParticipants;
    private String photoUrl;
    private String statut; // A_VENIR / EN_COURS / TERMINEE
}