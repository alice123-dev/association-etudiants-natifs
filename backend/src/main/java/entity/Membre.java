package com.aen.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "membres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Column(nullable = false)
    private String prenom;

    private String telephone;

    private String photoUrl;

    private String filiere;

    private String niveauEtudes;

    @Enumerated(EnumType.STRING)
    private RoleBureau roleBureau;

    @Column(nullable = false)
    private boolean actif = true;

    @Column(nullable = false, updatable = false)
    private LocalDate dateAdhesion;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", referencedColumnName = "id", unique = true)
    private Utilisateur utilisateur;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        if (this.dateAdhesion == null) {
            this.dateAdhesion = LocalDate.now();
        }
    }
}