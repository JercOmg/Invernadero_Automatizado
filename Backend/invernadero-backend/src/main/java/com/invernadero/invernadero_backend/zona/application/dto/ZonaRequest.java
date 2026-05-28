/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: ZonaRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para ZonaRequest
 */
package com.invernadero.invernadero_backend.zona.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO para crear/actualizar Zona
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZonaRequest {
    
    @NotNull(message = "El campo id_invernadero es obligatorio")
    private Integer idInvernaderoId;

    @NotBlank(message = "El campo nombre_zona es obligatorio")
    @Size(max = 100, message = "El campo nombre_zona no puede exceder 100 caracteres")
    private String nombreZona;


    private BigDecimal areaM2;


    private String descripcion;

}
