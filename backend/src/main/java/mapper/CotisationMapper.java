package com.aen.backend.mapper;

import com.aen.backend.dto.CotisationDTO;
import com.aen.backend.entity.Cotisation;
import org.springframework.stereotype.Component;

@Component
public class CotisationMapper {

    public CotisationDTO toDTO(Cotisation cotisation) {
        if (cotisation == null) {
            return null;
        }

        return CotisationDTO.builder()
                .id(cotisation.getId())
                .membreId(cotisation.getMembre().getId())
                .membreNomComplet(cotisation.getMembre().getPrenom() + " " + cotisation.getMembre().getNom())
                .montant(cotisation.getMontant())
                .typePeriode(cotisation.getTypePeriode())
                .periodeLibelle(cotisation.getPeriodeLibelle())
                .modePaiement(cotisation.getModePaiement())
                .datePaiement(cotisation.getDatePaiement())
                .build();
    }
}