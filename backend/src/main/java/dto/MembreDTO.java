package com.aen.backend.dto;

import com.aen.backend.entity.RoleBureau;
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
public class MembreDTO {

    private Long id;
    private String nom;
    private String prenom;
    private String telephone;
    private String photoUrl;
    private String filiere;
    private String niveauEtudes;
    private RoleBureau roleBureau;
    private boolean actif;
    private LocalDate dateAdhesion;
    private String email; // vient de l'Utilisateur lié, pratique pour l'affichage
}