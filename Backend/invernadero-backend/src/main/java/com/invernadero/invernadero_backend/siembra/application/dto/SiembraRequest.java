/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: SiembraRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para SiembraRequest
 */
package com.invernadero.invernadero_backend.siembra.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.cultivo.domain.model.Cultivo;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

/**
 * DTO para crear/actualizar Siembra
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiembraRequest {
    
    @NotNull(message = "El campo id_zona es obligatorio")
    private Integer idZonaId;

    @NotNull(message = "El campo id_cultivo es obligatorio")
    private Integer idCultivoId;

    @NotNull(message = "El campo id_usuario es obligatorio")
    private Integer idUsuarioId;

    @NotNull(message = "El campo fecha_siembra es obligatorio")
    private LocalDate fechaSiembra;


    private LocalDate fechaCosechaEstimada;

    @NotNull(message = "El campo cantidad_plantas es obligatorio")
    private Integer cantidadPlantas;

    @NotBlank(message = "El campo estado es obligatorio")
    @Size(max = 30, message = "El campo estado no puede exceder 30 caracteres")
    private String estado;


    private String observaciones;

}
