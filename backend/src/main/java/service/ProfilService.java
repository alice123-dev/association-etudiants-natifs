package com.aen.backend.service;

import com.aen.backend.dto.ChangePasswordDTO;
import com.aen.backend.dto.ProfilDTO;
import com.aen.backend.dto.ProfilUpdateDTO;
import com.aen.backend.entity.Membre;
import com.aen.backend.entity.Utilisateur;
import com.aen.backend.exception.ResourceNotFoundException;
import com.aen.backend.repository.MembreRepository;
import com.aen.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfilService {

    private final UtilisateurRepository utilisateurRepository;
    private final MembreRepository membreRepository;
    private final PasswordEncoder passwordEncoder;

    private String getCurrentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public ProfilDTO getProfil() {
        String email = getCurrentEmail();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        Membre membre = membreRepository.findByUtilisateurEmail(email).orElse(null);

        ProfilDTO.ProfilDTOBuilder builder = ProfilDTO.builder()
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole());

        if (membre != null) {
            builder.membreId(membre.getId())
                    .nom(membre.getNom())
                    .prenom(membre.getPrenom())
                    .telephone(membre.getTelephone())
                    .filiere(membre.getFiliere())
                    .niveauEtudes(membre.getNiveauEtudes())
                    .photoUrl(membre.getPhotoUrl());
        }

        return builder.build();
    }

    @Transactional
    public ProfilDTO updateProfil(ProfilUpdateDTO dto) {
        String email = getCurrentEmail();
        Membre membre = membreRepository.findByUtilisateurEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Profil membre introuvable"));

        membre.setTelephone(dto.getTelephone());
        membre.setFiliere(dto.getFiliere());
        membre.setNiveauEtudes(dto.getNiveauEtudes());
        membreRepository.save(membre);

        return getProfil();
    }

    @Transactional
    public void changePassword(ChangePasswordDTO dto) {
        String email = getCurrentEmail();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(dto.getAncienMotDePasse(), utilisateur.getMotDePasse())) {
            throw new IllegalArgumentException("L'ancien mot de passe est incorrect");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(dto.getNouveauMotDePasse()));
        utilisateurRepository.save(utilisateur);
    }
}