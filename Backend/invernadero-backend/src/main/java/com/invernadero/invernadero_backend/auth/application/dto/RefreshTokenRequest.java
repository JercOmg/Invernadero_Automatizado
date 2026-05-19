/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: RefreshTokenRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para RefreshTokenRequest
 */
package com.invernadero.invernadero_backend.auth.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para solicitud de refresh token
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenRequest {
    
    @NotBlank(message = "El refresh token es obligatorio")
    private String refreshToken;
}
