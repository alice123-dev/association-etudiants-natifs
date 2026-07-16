package com.aen.backend.dto;

import com.aen.backend.entity.TypeAnnonce;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnonceCreationDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotBlank(message = "Le contenu est obligatoire")
    private String contenu;

    @NotNull(message = "Le type est obligatoire")
    private TypeAnnonce type;

    private boolean epinglee;
}