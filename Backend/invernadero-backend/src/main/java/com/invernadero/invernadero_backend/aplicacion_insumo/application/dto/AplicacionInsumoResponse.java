/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AplicacionInsumoResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AplicacionInsumoResponse
 */
package com.invernadero.invernadero_backend.aplicacion_insumo.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.insumo.domain.model.Insumo;
import com.invernadero.invernadero_backend.siembra.domain.model.Siembra;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para AplicacionInsumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AplicacionInsumoResponse {
    
        private Integer idAplicacion;
        private Integer idInsumoId;
        private Integer idSiembraId;
        private Integer idZonaId;
        private Integer idUsuarioId;
        private LocalDateTime fechaHora;
        private BigDecimal cantidad;
        private String metodo;
        private String observaciones;
}
