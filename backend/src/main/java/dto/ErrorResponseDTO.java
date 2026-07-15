package com.aen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
public class ErrorResponseDTO {

    private LocalDateTime timestamp;
    private int status;
    private String message;
    private Map<String, String> errors;
}