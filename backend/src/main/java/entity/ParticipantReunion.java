package com.aen.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "participants_reunion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipantReunion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reunion_id", nullable = false)
    private Reunion reunion;

    @ManyToOne
    @JoinColumn(name = "membre_id", nullable = false)
    private Membre membre;

    @Column(nullable = false)
    @Builder.Default
    private boolean present = false;
}