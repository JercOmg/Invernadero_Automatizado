/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: InsumoResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para InsumoResponse
 */
package com.invernadero.invernadero_backend.insumo.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO de respuesta para Insumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsumoResponse {
    
        private Integer idInsumo;
        private String nombre;
        private String tipo;
        private String unidad;
        private BigDecimal stockActual;
        private BigDecimal stockMinimo;
        private String descripcion;
}
