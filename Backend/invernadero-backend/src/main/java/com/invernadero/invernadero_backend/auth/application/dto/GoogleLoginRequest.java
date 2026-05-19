/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: GoogleLoginRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para GoogleLoginRequest
 */
package com.invernadero.invernadero_backend.auth.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para enviar el idToken obtenido de Google desde el frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequest {

    @NotBlank(message = "El token de Google es obligatorio")
    private String idToken;

}
