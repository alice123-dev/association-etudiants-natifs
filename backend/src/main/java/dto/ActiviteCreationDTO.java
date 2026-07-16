package com.aen.backend.dto;

import com.aen.backend.entity.CategorieActivite;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ActiviteCreationDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotNull(message = "La catégorie est obligatoire")
    private CategorieActivite categorie;

    @NotNull(message = "La date est obligatoire")
    private LocalDate date;

    private LocalTime heure;
    private String lieu;
    private Long responsableId;

    @PositiveOrZero(message = "Le nombre de participants doit être positif ou nul")
    private Integer nombreParticipants;

    private String photoUrl;
}