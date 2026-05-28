/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: InvernaderoResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para InvernaderoResponse
 */
package com.invernadero.invernadero_backend.invernadero.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO de respuesta para Invernadero
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvernaderoResponse {
    
        private Integer idInvernadero;
        private String nombre;
        private String ubicacion;
        private BigDecimal areaM2;
        private String tipoEstructura;
        private Integer responsableId;
        private LocalDate fechaCreacion;
        private String estado;
}
