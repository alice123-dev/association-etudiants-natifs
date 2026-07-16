package com.aen.backend.controller;

import com.aen.backend.dto.AnnonceCreationDTO;
import com.aen.backend.dto.AnnonceDTO;
import com.aen.backend.service.AnnonceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/annonces")
@RequiredArgsConstructor
public class AnnonceController {

    private final AnnonceService annonceService;

    @GetMapping
    public ResponseEntity<List<AnnonceDTO>> findAll() {
        return ResponseEntity.ok(annonceService.findAll());
    }

    @PostMapping
    public ResponseEntity<AnnonceDTO> create(@Valid @RequestBody AnnonceCreationDTO dto) {
        AnnonceDTO created = annonceService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        annonceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}