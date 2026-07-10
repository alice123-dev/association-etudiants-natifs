package com.aen.backend.mapper;

import com.aen.backend.dto.MembreDTO;
import com.aen.backend.entity.Membre;
import org.springframework.stereotype.Component;

@Component
public class MembreMapper {

    public MembreDTO toDTO(Membre membre) {
        if (membre == null) {
            return null;
        }

        return MembreDTO.builder()
                .id(membre.getId())
                .nom(membre.getNom())
                .prenom(membre.getPrenom())
                .telephone(membre.getTelephone())
                .photoUrl(membre.getPhotoUrl())
                .filiere(membre.getFiliere())
                .niveauEtudes(membre.getNiveauEtudes())
                .roleBureau(membre.getRoleBureau())
                .actif(membre.isActif())
                .dateAdhesion(membre.getDateAdhesion())
                .email(membre.getUtilisateur() != null ? membre.getUtilisateur().getEmail() : null)
                .build();
    }
}