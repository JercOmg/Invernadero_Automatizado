/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: SiembraResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para SiembraResponse
 */
package com.invernadero.invernadero_backend.siembra.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO de respuesta para Siembra
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiembraResponse {
    
        private Integer idSiembra;
        private Integer idZonaId;
        private Integer idCultivoId;
        private Integer idUsuarioId;
        private LocalDate fechaSiembra;
        private LocalDate fechaCosechaEstimada;
        private Integer cantidadPlantas;
        private String estado;
        private String observaciones;
}
