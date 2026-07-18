package com.aen.backend.controller;

import com.aen.backend.dto.ChangePasswordDTO;
import com.aen.backend.dto.ProfilDTO;
import com.aen.backend.dto.ProfilUpdateDTO;
import com.aen.backend.service.ProfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profil")
@RequiredArgsConstructor
public class ProfilController {

    private final ProfilService profilService;

    @GetMapping
    public ResponseEntity<ProfilDTO> getProfil() {
        return ResponseEntity.ok(profilService.getProfil());
    }

    @PutMapping
    public ResponseEntity<ProfilDTO> updateProfil(@RequestBody ProfilUpdateDTO dto) {
        return ResponseEntity.ok(profilService.updateProfil(dto));
    }

    @PutMapping("/mot-de-passe")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
        profilService.changePassword(dto);
        return ResponseEntity.noContent().build();
    }
}