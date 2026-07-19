package com.aen.backend.controller;

import com.aen.backend.dto.PresenceUpdateDTO;
import com.aen.backend.dto.ReunionCreationDTO;
import com.aen.backend.dto.ReunionDTO;
import com.aen.backend.service.ReunionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reunions")
@RequiredArgsConstructor
public class ReunionController {

    private final ReunionService reunionService;

    @GetMapping
    public ResponseEntity<List<ReunionDTO>> findAll() {
        return ResponseEntity.ok(reunionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReunionDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reunionService.findById(id));
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @PostMapping
    public ResponseEntity<ReunionDTO> create(@Valid @RequestBody ReunionCreationDTO dto) {
        ReunionDTO created = reunionService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @PatchMapping("/participants/{participantId}/presence")
    public ResponseEntity<Void> updatePresence(
            @PathVariable Long participantId,
            @RequestBody PresenceUpdateDTO dto
    ) {
        reunionService.updatePresence(participantId, dto);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'BUREAU')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reunionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}