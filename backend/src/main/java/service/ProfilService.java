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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfilService {

    private final UtilisateurRepository utilisateurRepository;
    private final MembreRepository membreRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.upload.dir}")
    private String uploadDir;

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

    @Transactional
    public String uploadPhoto(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide");
        }

        String email = getCurrentEmail();
        Membre membre = membreRepository.findByUtilisateurEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Profil membre introuvable"));

        try {
            Path dossier = Paths.get(uploadDir);
            if (!Files.exists(dossier)) {
                Files.createDirectories(dossier);
            }

            String nomOriginal = file.getOriginalFilename();
            String extension = (nomOriginal != null && nomOriginal.contains("."))
                    ? nomOriginal.substring(nomOriginal.lastIndexOf('.'))
                    : ".jpg";
            String nomFichier = UUID.randomUUID() + extension;
            Path cheminFichier = dossier.resolve(nomFichier);

            Files.copy(file.getInputStream(), cheminFichier);

            String url = "/uploads/photos/" + nomFichier;
            membre.setPhotoUrl(url);
            membreRepository.save(membre);

            return url;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement de la photo", e);
        }
    }
}