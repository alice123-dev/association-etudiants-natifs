package com.aen.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ReunionCreationDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;
    private String ordreDuJour;
    private String lieu;

    @NotNull(message = "La date et l'heure sont obligatoires")
    private LocalDateTime dateHeure;

    private List<Long> membreIds;
}