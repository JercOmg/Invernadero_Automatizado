/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: CosechaRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para CosechaRequest
 */
package com.invernadero.invernadero_backend.cosecha.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.siembra.domain.model.Siembra;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para crear/actualizar Cosecha
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CosechaRequest {
    
    @NotNull(message = "El campo id_siembra es obligatorio")
    private Integer idSiembraId;

    @NotNull(message = "El campo id_usuario es obligatorio")
    private Integer idUsuarioId;

    @NotNull(message = "El campo fecha_cosecha es obligatorio")
    private LocalDate fechaCosecha;

    @NotNull(message = "El campo cantidad_kg es obligatorio")
    private BigDecimal cantidadKg;

    @Size(max = 20, message = "El campo calidad no puede exceder 20 caracteres")
    private String calidad;


    private String observaciones;

}
