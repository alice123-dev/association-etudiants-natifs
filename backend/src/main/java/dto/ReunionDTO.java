package com.aen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReunionDTO {

    private Long id;
    private String titre;
    private String description;
    private String ordreDuJour;
    private String lieu;
    private LocalDateTime dateHeure;
    private List<ParticipantDTO> participants;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ParticipantDTO {
        private Long participantId;
        private Long membreId;
        private String membreNomComplet;
        private boolean present;
    }
}