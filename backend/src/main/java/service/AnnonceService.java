package com.aen.backend.service;

import com.aen.backend.dto.AnnonceCreationDTO;
import com.aen.backend.dto.AnnonceDTO;
import com.aen.backend.entity.Annonce;
import com.aen.backend.entity.Utilisateur;
import com.aen.backend.exception.ResourceNotFoundException;
import com.aen.backend.mapper.AnnonceMapper;
import com.aen.backend.repository.AnnonceRepository;
import com.aen.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnonceService {

    private final AnnonceRepository annonceRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final AnnonceMapper annonceMapper;

    public List<AnnonceDTO> findAll() {
        return annonceRepository.findAll()
                .stream()
                .sorted(
                        Comparator.comparing(Annonce::isEpinglee).reversed()
                                .thenComparing(Annonce::getDatePublication, Comparator.reverseOrder())
                )
                .map(annonceMapper::toDTO)
                .toList();
    }

    @Transactional
    public AnnonceDTO create(AnnonceCreationDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur auteur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        Annonce annonce = Annonce.builder()
                .titre(dto.getTitre())
                .contenu(dto.getContenu())
                .type(dto.getType())
                .epinglee(dto.isEpinglee())
                .auteur(auteur)
                .build();

        Annonce saved = annonceRepository.save(annonce);
        return annonceMapper.toDTO(saved);
    }

    public void delete(Long id) {
        if (!annonceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Annonce introuvable avec l'id : " + id);
        }
        annonceRepository.deleteById(id);
    }
}