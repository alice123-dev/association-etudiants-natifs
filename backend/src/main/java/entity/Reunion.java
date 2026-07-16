package com.aen.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reunions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reunion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String ordreDuJour;

    private String lieu;

    @NotNull(message = "La date et l'heure sont obligatoires")
    @Column(nullable = false)
    private LocalDateTime dateHeure;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Builder.Default
    @OneToMany(mappedBy = "reunion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParticipantReunion> participants = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
    }
}