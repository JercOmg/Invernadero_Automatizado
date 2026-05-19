/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AplicacionInsumoRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AplicacionInsumoRequest
 */
package com.invernadero.invernadero_backend.aplicacion_insumo.application.dto;

import jakarta.validation.constraints.*;
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
 * DTO para crear/actualizar AplicacionInsumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AplicacionInsumoRequest {
    
    @NotNull(message = "El campo id_insumo es obligatorio")
    private Integer idInsumoId;


    private Integer idSiembraId;


    private Integer idZonaId;

    @NotNull(message = "El campo id_usuario es obligatorio")
    private Integer idUsuarioId;

    @NotNull(message = "El campo fecha_hora es obligatorio")
    private LocalDateTime fechaHora;

    @NotNull(message = "El campo cantidad es obligatorio")
    private BigDecimal cantidad;

    @Size(max = 50, message = "El campo metodo no puede exceder 50 caracteres")
    private String metodo;


    private String observaciones;

}
