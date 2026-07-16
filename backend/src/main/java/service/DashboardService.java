package com.aen.backend.service;

import com.aen.backend.dto.DashboardStatsDTO;
import com.aen.backend.repository.ActiviteRepository;
import com.aen.backend.repository.CotisationRepository;
import com.aen.backend.repository.MembreRepository;
import com.aen.backend.repository.ReunionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MembreRepository membreRepository;
    private final CotisationRepository cotisationRepository;
    private final ReunionRepository reunionRepository;
    private final ActiviteRepository activiteRepository;

    public DashboardStatsDTO getStats() {
        LocalDate aujourdHui = LocalDate.now();
        LocalDate il30Jours = aujourdHui.minusDays(30);

        long totalMembres = membreRepository.count();
        long nouveauxMembres = membreRepository.countByDateAdhesionAfter(il30Jours);

        long cotisationsMoisCourant = cotisationRepository.findAll().stream()
                .filter(c -> c.getDatePaiement().getMonth() == aujourdHui.getMonth()
                        && c.getDatePaiement().getYear() == aujourdHui.getYear())
                .count();

        long reunionsAVenir = reunionRepository.findAll().stream()
                .filter(r -> r.getDateHeure().toLocalDate().isAfter(aujourdHui.minusDays(1)))
                .count();

        long activitesAVenir = activiteRepository.findAll().stream()
                .filter(a -> a.getDate().isAfter(aujourdHui.minusDays(1)))
                .count();

        List<DashboardStatsDTO.PointEvolution> evolution = buildEvolution();

        return DashboardStatsDTO.builder()
                .totalMembres(totalMembres)
                .nouveauxMembres(nouveauxMembres)
                .cotisationsPayeesMoisCourant(cotisationsMoisCourant)
                .reunionsAVenir(reunionsAVenir)
                .activitesAVenir(activitesAVenir)
                .evolutionAdhesions(evolution)
                .build();
    }

    private List<DashboardStatsDTO.PointEvolution> buildEvolution() {
        List<DashboardStatsDTO.PointEvolution> points = new ArrayList<>();
        LocalDate maintenant = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate moisCible = maintenant.minusMonths(i);
            LocalDate finDuMois = moisCible.withDayOfMonth(moisCible.lengthOfMonth());

            long total = membreRepository.countByDateAdhesionBefore(finDuMois.plusDays(1));

            String libelleMois = moisCible.getMonth()
                    .getDisplayName(TextStyle.SHORT, Locale.FRENCH);

            points.add(DashboardStatsDTO.PointEvolution.builder()
                    .mois(libelleMois)
                    .membres(total)
                    .build());
        }

        return points;
    }
}