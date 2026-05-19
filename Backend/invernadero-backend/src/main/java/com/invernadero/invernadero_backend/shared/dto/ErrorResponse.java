/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: ErrorResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para ErrorResponse
 */
package com.invernadero.invernadero_backend.shared.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para respuestas de error estandarizadas en toda la API
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private int status;
    
    private String error;
    
    private String message;
    
    private String path;
}
