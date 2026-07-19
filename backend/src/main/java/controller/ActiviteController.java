package com.aen.backend.controller;

import com.aen.backend.dto.ActiviteCreationDTO;
import com.aen.backend.dto.ActiviteDTO;
import com.aen.backend.service.ActiviteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activites")
@RequiredArgsConstructor
public class ActiviteController {

    private final ActiviteService activiteService;

    @GetMapping
    public ResponseEntity<List<ActiviteDTO>> findAll() {
        return ResponseEntity.ok(activiteService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActiviteDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(activiteService.findById(id));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @PostMapping
    public ResponseEntity<ActiviteDTO> create(@Valid @RequestBody ActiviteCreationDTO dto) {
        ActiviteDTO created = activiteService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @PutMapping("/{id}")
    public ResponseEntity<ActiviteDTO> update(@PathVariable Long id, @Valid @RequestBody ActiviteCreationDTO dto) {
        return ResponseEntity.ok(activiteService.update(id, dto));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        activiteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}