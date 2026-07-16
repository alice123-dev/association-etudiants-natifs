package com.aen.backend.dto;

import com.aen.backend.entity.TypeAnnonce;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnonceDTO {

    private Long id;
    private String titre;
    private String contenu;
    private TypeAnnonce type;
    private boolean epinglee;
    private String auteurEmail;
    private LocalDateTime datePublication;
}