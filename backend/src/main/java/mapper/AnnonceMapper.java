package com.aen.backend.mapper;

import com.aen.backend.dto.AnnonceDTO;
import com.aen.backend.entity.Annonce;
import org.springframework.stereotype.Component;

@Component
public class AnnonceMapper {

    public AnnonceDTO toDTO(Annonce annonce) {
        if (annonce == null) {
            return null;
        }

        return AnnonceDTO.builder()
                .id(annonce.getId())
                .titre(annonce.getTitre())
                .contenu(annonce.getContenu())
                .type(annonce.getType())
                .epinglee(annonce.isEpinglee())
                .auteurEmail(annonce.getAuteur() != null ? annonce.getAuteur().getEmail() : null)
                .datePublication(annonce.getDatePublication())
                .build();
    }
}