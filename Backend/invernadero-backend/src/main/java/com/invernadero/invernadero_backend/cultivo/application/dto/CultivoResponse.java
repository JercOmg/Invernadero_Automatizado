/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: CultivoResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para CultivoResponse
 */
package com.invernadero.invernadero_backend.cultivo.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO de respuesta para Cultivo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CultivoResponse {
    
        private Integer idCultivo;
        private String nombreComun;
        private String nombreCientifico;
        private String tipo;
        private BigDecimal tempMinC;
        private BigDecimal tempMaxC;
        private BigDecimal humedadMinPct;
        private BigDecimal humedadMaxPct;
        private Integer diasCiclo;
        private String descripcion;
}
