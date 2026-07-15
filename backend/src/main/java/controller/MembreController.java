package com.aen.backend.controller;

import com.aen.backend.dto.MembreCreationDTO;
import com.aen.backend.dto.MembreDTO;
import com.aen.backend.service.MembreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aen.backend.dto.MembreUpdateDTO;

import java.util.List;

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
    @PutMapping("/{id}")
    public ResponseEntity<MembreDTO> update(@PathVariable Long id, @Valid @RequestBody MembreUpdateDTO dto) {
        return ResponseEntity.ok(membreService.update(id, dto));
    }
    @PostMapping
    public ResponseEntity<MembreDTO> create(@Valid @RequestBody MembreCreationDTO dto) {
        MembreDTO created = membreService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        membreService.delete(id);
        return ResponseEntity.noContent().build();
    }
}