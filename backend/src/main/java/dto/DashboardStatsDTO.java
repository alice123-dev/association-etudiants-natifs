package com.aen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {

    private long totalMembres;
    private long nouveauxMembres;
    private long cotisationsPayeesMoisCourant;
    private long reunionsAVenir;
    private long activitesAVenir;
    private List<PointEvolution> evolutionAdhesions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PointEvolution {
        private String mois;
        private long membres;
    }
}