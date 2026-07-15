package com.aen.backend.service;

import com.aen.backend.dto.CotisationCreationDTO;
import com.aen.backend.dto.CotisationDTO;
import com.aen.backend.entity.Cotisation;
import com.aen.backend.entity.Membre;
import com.aen.backend.exception.ResourceNotFoundException;
import com.aen.backend.mapper.CotisationMapper;
import com.aen.backend.repository.CotisationRepository;
import com.aen.backend.repository.MembreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CotisationService {

    private final CotisationRepository cotisationRepository;
    private final MembreRepository membreRepository;
    private final CotisationMapper cotisationMapper;

    public List<CotisationDTO> findAll() {
        return cotisationRepository.findAll()
                .stream()
                .map(cotisationMapper::toDTO)
                .toList();
    }

    public List<CotisationDTO> findByMembre(Long membreId) {
        return cotisationRepository.findByMembreId(membreId)
                .stream()
                .map(cotisationMapper::toDTO)
                .toList();
    }

    @Transactional
    public CotisationDTO create(CotisationCreationDTO dto) {
        Membre membre = membreRepository.findById(dto.getMembreId())
                .orElseThrow(() -> new ResourceNotFoundException("Membre introuvable avec l'id : " + dto.getMembreId()));

        Cotisation cotisation = Cotisation.builder()
                .membre(membre)
                .montant(dto.getMontant())
                .typePeriode(dto.getTypePeriode())
                .periodeLibelle(dto.getPeriodeLibelle())
                .modePaiement(dto.getModePaiement())
                .datePaiement(dto.getDatePaiement())
                .build();

        Cotisation saved = cotisationRepository.save(cotisation);
        return cotisationMapper.toDTO(saved);
    }

    public void delete(Long id) {
        if (!cotisationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cotisation introuvable avec l'id : " + id);
        }
        cotisationRepository.deleteById(id);
    }

    public List<MembreImpayeDTO> findImpayes(String periodeLibelle) {
        List<Membre> membresActifs = membreRepository.findByActifTrue();

        return membresActifs.stream()
                .filter(membre -> !cotisationRepository.existsByMembreIdAndPeriodeLibelle(membre.getId(), periodeLibelle))
                .map(membre -> new MembreImpayeDTO(
                        membre.getId(),
                        membre.getPrenom() + " " + membre.getNom(),
                        membre.getUtilisateur() != null ? membre.getUtilisateur().getEmail() : null
                ))
                .toList();
    }

    public record MembreImpayeDTO(Long membreId, String nomComplet, String email) {}
}