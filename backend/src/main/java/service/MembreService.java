package com.aen.backend.service;

import com.aen.backend.dto.MembreCreationDTO;
import com.aen.backend.dto.MembreDTO;
import com.aen.backend.entity.Membre;
import com.aen.backend.entity.Role;
import com.aen.backend.entity.Utilisateur;
import com.aen.backend.exception.ResourceNotFoundException;
import com.aen.backend.mapper.MembreMapper;
import com.aen.backend.repository.MembreRepository;
import com.aen.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MembreService {

    private final MembreRepository membreRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final MembreMapper membreMapper;
    private final PasswordEncoder passwordEncoder;

    public List<MembreDTO> findAll() {
        return membreRepository.findAll()
                .stream()
                .map(membreMapper::toDTO)
                .toList();
    }

    public MembreDTO findById(Long id) {
        Membre membre = membreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membre introuvable avec l'id : " + id));
        return membreMapper.toDTO(membre);
    }

    @Transactional
    public MembreDTO create(MembreCreationDTO dto) {
        if (utilisateurRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
        }

        // Création du compte utilisateur associé, avec un mot de passe temporaire
        Utilisateur utilisateur = Utilisateur.builder()
                .email(dto.getEmail())
                .motDePasse(passwordEncoder.encode(UUID.randomUUID().toString()))
                .role(Role.MEMBRE)
                .actif(true)
                .build();
        utilisateur = utilisateurRepository.save(utilisateur);

        Membre membre = Membre.builder()
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .filiere(dto.getFiliere())
                .niveauEtudes(dto.getNiveauEtudes())
                .roleBureau(dto.getRoleBureau())
                .actif(true)
                .utilisateur(utilisateur)
                .build();

        membre = membreRepository.save(membre);
        return membreMapper.toDTO(membre);
    }

    public void delete(Long id) {
        if (!membreRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membre introuvable avec l'id : " + id);
        }
        membreRepository.deleteById(id);
    }
}