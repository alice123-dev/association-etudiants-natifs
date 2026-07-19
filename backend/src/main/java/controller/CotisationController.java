package com.aen.backend.controller;

import com.aen.backend.dto.CotisationCreationDTO;
import com.aen.backend.dto.CotisationDTO;
import com.aen.backend.service.CotisationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cotisations")
@RequiredArgsConstructor
public class CotisationController {

    private final CotisationService cotisationService;

    @GetMapping
    public ResponseEntity<List<CotisationDTO>> findAll() {
        return ResponseEntity.ok(cotisationService.findAll());
    }

    @GetMapping("/membre/{membreId}")
    public ResponseEntity<List<CotisationDTO>> findByMembre(@PathVariable Long membreId) {
        return ResponseEntity.ok(cotisationService.findByMembre(membreId));
    }

    @GetMapping("/impayes")
    public ResponseEntity<List<CotisationService.MembreImpayeDTO>> findImpayes(
            @RequestParam String periode
    ) {
        return ResponseEntity.ok(cotisationService.findImpayes(periode));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @PostMapping
    public ResponseEntity<CotisationDTO> create(@Valid @RequestBody CotisationCreationDTO dto) {
        CotisationDTO created = cotisationService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cotisationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}