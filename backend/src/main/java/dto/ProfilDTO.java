package com.aen.backend.dto;

import com.aen.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilDTO {

    private String email;
    private Role role;
    private Long membreId;
    private String nom;
    private String prenom;
    private String telephone;
    private String filiere;
    private String niveauEtudes;
    private String photoUrl;
}