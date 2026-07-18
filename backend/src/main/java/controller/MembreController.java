package com.aen.backend.controller;

import com.aen.backend.dto.MembreCreationDTO;
import com.aen.backend.dto.MembreDTO;
import com.aen.backend.dto.MembreUpdateDTO;
import com.aen.backend.service.MembreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/membres")
@RequiredArgsConstructor
public class MembreController {

    private final MembreService membreService;

    @GetMapping
    public ResponseEntity<List<MembreDTO>> findAll() {
        return ResponseEntity.ok(membreService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembreDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(membreService.findById(id));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @PutMapping("/{id}")
    public ResponseEntity<MembreDTO> update(@PathVariable Long id, @Valid @RequestBody MembreUpdateDTO dto) {
        return ResponseEntity.ok(membreService.update(id, dto));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @PostMapping
    public ResponseEntity<MembreDTO> create(@Valid @RequestBody MembreCreationDTO dto) {
        MembreDTO created = membreService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@PathVariable Long id) {
        String nouveauMotDePasse = membreService.resetPassword(id);
        return ResponseEntity.ok(Map.of("motDePasse", nouveauMotDePasse));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        membreService.delete(id);
        return ResponseEntity.noContent().build();
    }
}