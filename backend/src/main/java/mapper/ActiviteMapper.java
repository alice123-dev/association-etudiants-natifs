package com.aen.backend.mapper;

import com.aen.backend.dto.ActiviteDTO;
import com.aen.backend.entity.Activite;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ActiviteMapper {

    public ActiviteDTO toDTO(Activite activite) {
        if (activite == null) {
            return null;
        }

        return ActiviteDTO.builder()
                .id(activite.getId())
                .titre(activite.getTitre())
                .description(activite.getDescription())
                .categorie(activite.getCategorie())
                .date(activite.getDate())
                .heure(activite.getHeure())
                .lieu(activite.getLieu())
                .responsableId(activite.getResponsable() != null ? activite.getResponsable().getId() : null)
                .responsableNomComplet(activite.getResponsable() != null
                        ? activite.getResponsable().getPrenom() + " " + activite.getResponsable().getNom()
                        : null)
                .nombreParticipants(activite.getNombreParticipants())
                .photoUrl(activite.getPhotoUrl())
                .statut(calculerStatut(activite.getDate()))
                .build();
    }

    private String calculerStatut(LocalDate date) {
        LocalDate aujourdHui = LocalDate.now();
        if (date.isEqual(aujourdHui)) {
            return "EN_COURS";
        } else if (date.isAfter(aujourdHui)) {
            return "A_VENIR";
        } else {
            return "TERMINEE";
        }
    }
}