package com.aen.backend.service;

import com.aen.backend.dto.PresenceUpdateDTO;
import com.aen.backend.dto.ReunionCreationDTO;
import com.aen.backend.dto.ReunionDTO;
import com.aen.backend.entity.Membre;
import com.aen.backend.entity.ParticipantReunion;
import com.aen.backend.entity.Reunion;
import com.aen.backend.exception.ResourceNotFoundException;
import com.aen.backend.mapper.ReunionMapper;
import com.aen.backend.repository.MembreRepository;
import com.aen.backend.repository.ParticipantReunionRepository;
import com.aen.backend.repository.ReunionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReunionService {

    private final ReunionRepository reunionRepository;
    private final MembreRepository membreRepository;
    private final ParticipantReunionRepository participantReunionRepository;
    private final ReunionMapper reunionMapper;

    public List<ReunionDTO> findAll() {
        return reunionRepository.findAll()
                .stream()
                .map(reunionMapper::toDTO)
                .toList();
    }

    public ReunionDTO findById(Long id) {
        Reunion reunion = reunionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réunion introuvable avec l'id : " + id));
        return reunionMapper.toDTO(reunion);
    }

    @Transactional
    public ReunionDTO create(ReunionCreationDTO dto) {
        Reunion reunion = Reunion.builder()
                .titre(dto.getTitre())
                .description(dto.getDescription())
                .ordreDuJour(dto.getOrdreDuJour())
                .lieu(dto.getLieu())
                .dateHeure(dto.getDateHeure())
                .build();

        Reunion saved = reunionRepository.save(reunion);

        if (dto.getMembreIds() != null) {
            for (Long membreId : dto.getMembreIds()) {
                Membre membre = membreRepository.findById(membreId)
                        .orElseThrow(() -> new ResourceNotFoundException("Membre introuvable avec l'id : " + membreId));

                ParticipantReunion participant = ParticipantReunion.builder()
                        .reunion(saved)
                        .membre(membre)
                        .present(false)
                        .build();
                saved.getParticipants().add(participant);
            }
            reunionRepository.save(saved);
        }

        return reunionMapper.toDTO(saved);
    }

    @Transactional
    public void updatePresence(Long participantId, PresenceUpdateDTO dto) {
        ParticipantReunion participant = participantReunionRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant introuvable avec l'id : " + participantId));
        participant.setPresent(dto.isPresent());
        participantReunionRepository.save(participant);
    }

    public void delete(Long id) {
        if (!reunionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Réunion introuvable avec l'id : " + id);
        }
        reunionRepository.deleteById(id);
    }
}