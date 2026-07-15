package com.aen.backend.controller;

import com.aen.backend.dto.LoginRequestDTO;
import com.aen.backend.dto.LoginResponseDTO;
import com.aen.backend.entity.Utilisateur;
import com.aen.backend.repository.UtilisateurRepository;
import com.aen.backend.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getMotDePasse())
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(dto.getEmail())
                .orElseThrow();

        String token = jwtUtil.generateToken(utilisateur.getEmail(), utilisateur.getRole().name());

        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(token)
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().name())
                .build();

        return ResponseEntity.ok(response);
    }
}