/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: CosechaResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para CosechaResponse
 */
package com.invernadero.invernadero_backend.cosecha.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO de respuesta para Cosecha
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CosechaResponse {
    
        private Integer idCosecha;
        private Integer idSiembraId;
        private Integer idUsuarioId;
        private LocalDate fechaCosecha;
        private BigDecimal cantidadKg;
        private String calidad;
        private String observaciones;
}
