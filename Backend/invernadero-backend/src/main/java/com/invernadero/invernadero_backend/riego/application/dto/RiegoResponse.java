/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: RiegoResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para RiegoResponse
 */
package com.invernadero.invernadero_backend.riego.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para Riego
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiegoResponse {
    
        private Integer idRiego;
        private Integer idZonaId;
        private Integer idUsuarioId;
        private LocalDateTime fechaHora;
        private Integer duracionMin;
        private BigDecimal volumenLitros;
        private String tipo;
        private String observaciones;
}
