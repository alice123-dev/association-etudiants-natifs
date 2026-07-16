package com.aen.backend.service;

import com.aen.backend.dto.ActiviteCreationDTO;
import com.aen.backend.dto.ActiviteDTO;
import com.aen.backend.entity.Activite;
import com.aen.backend.entity.Membre;
import com.aen.backend.exception.ResourceNotFoundException;
import com.aen.backend.mapper.ActiviteMapper;
import com.aen.backend.repository.ActiviteRepository;
import com.aen.backend.repository.MembreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActiviteService {

    private final ActiviteRepository activiteRepository;
    private final MembreRepository membreRepository;
    private final ActiviteMapper activiteMapper;

    public List<ActiviteDTO> findAll() {
        return activiteRepository.findAll()
                .stream()
                .map(activiteMapper::toDTO)
                .toList();
    }

    public ActiviteDTO findById(Long id) {
        Activite activite = activiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activité introuvable avec l'id : " + id));
        return activiteMapper.toDTO(activite);
    }

    @Transactional
    public ActiviteDTO create(ActiviteCreationDTO dto) {
        Membre responsable = null;
        if (dto.getResponsableId() != null) {
            responsable = membreRepository.findById(dto.getResponsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Membre introuvable avec l'id : " + dto.getResponsableId()));
        }

        Activite activite = Activite.builder()
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .categorie(dto.getCategorie())
                .date(dto.getDate())
                .heure(dto.getHeure())
                .lieu(dto.getLieu())
                .responsable(responsable)
                .nombreParticipants(dto.getNombreParticipants() != null ? dto.getNombreParticipants() : 0)
                .photoUrl(dto.getPhotoUrl())
                .build();

        Activite saved = activiteRepository.save(activite);
        return activiteMapper.toDTO(saved);
    }

    @Transactional
    public ActiviteDTO update(Long id, ActiviteCreationDTO dto) {
        Activite activite = activiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activité introuvable avec l'id : " + id));

        Membre responsable = null;
        if (dto.getResponsableId() != null) {
            responsable = membreRepository.findById(dto.getResponsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Membre introuvable avec l'id : " + dto.getResponsableId()));
        }

        activite.setTitre(dto.getTitre());
        activite.setDescription(dto.getDescription());
        activite.setCategorie(dto.getCategorie());
        activite.setDate(dto.getDate());
        activite.setHeure(dto.getHeure());
        activite.setLieu(dto.getLieu());
        activite.setResponsable(responsable);
        activite.setNombreParticipants(dto.getNombreParticipants() != null ? dto.getNombreParticipants() : 0);
        activite.setPhotoUrl(dto.getPhotoUrl());

        Activite updated = activiteRepository.save(activite);
        return activiteMapper.toDTO(updated);
    }

    public void delete(Long id) {
        if (!activiteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Activité introuvable avec l'id : " + id);
        }
        activiteRepository.deleteById(id);
    }
}