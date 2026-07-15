package com.aen.backend.dto;

import com.aen.backend.entity.RoleBureau;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MembreUpdateDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    private String telephone;
    private String filiere;
    private String niveauEtudes;
    private RoleBureau roleBureau;
    private boolean actif;
}