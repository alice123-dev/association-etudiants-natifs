package com.aen.backend.mapper;

import com.aen.backend.dto.ReunionDTO;
import com.aen.backend.entity.Reunion;
import org.springframework.stereotype.Component;

@Component
public class ReunionMapper {

    public ReunionDTO toDTO(Reunion reunion) {
        if (reunion == null) {
            return null;
        }

        var participants = reunion.getParticipants().stream()
                .map(p -> ReunionDTO.ParticipantDTO.builder()
                        .participantId(p.getId())
                        .membreId(p.getMembre().getId())
                        .membreNomComplet(p.getMembre().getPrenom() + " " + p.getMembre().getNom())
                        .present(p.isPresent())
                        .build())
                .toList();

        return ReunionDTO.builder()
                .id(reunion.getId())
                .titre(reunion.getTitre())
                .description(reunion.getDescription())
                .ordreDuJour(reunion.getOrdreDuJour())
                .lieu(reunion.getLieu())
                .dateHeure(reunion.getDateHeure())
                .participants(participants)
                .build();
    }
}