/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: ZonaResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para ZonaResponse
 */
package com.invernadero.invernadero_backend.zona.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO de respuesta para Zona
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZonaResponse {
    
        private Integer idZona;
        private Integer idInvernaderoId;
        private String nombreZona;
        private BigDecimal areaM2;
        private String descripcion;
}
