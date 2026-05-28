/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: InvernaderoRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para InvernaderoRequest
 */
package com.invernadero.invernadero_backend.invernadero.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para crear/actualizar Invernadero
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvernaderoRequest {
    
    @NotBlank(message = "El campo nombre es obligatorio")
    @Size(max = 100, message = "El campo nombre no puede exceder 100 caracteres")
    private String nombre;

    @NotBlank(message = "El campo ubicacion es obligatorio")
    @Size(max = 200, message = "El campo ubicacion no puede exceder 200 caracteres")
    private String ubicacion;

    @NotNull(message = "El campo area_m2 es obligatorio")
    private BigDecimal areaM2;

    @Size(max = 50, message = "El campo tipo_estructura no puede exceder 50 caracteres")
    private String tipoEstructura;

    @NotNull(message = "El campo responsable_id es obligatorio")
    private Integer responsableId;

    @NotNull(message = "El campo fecha_creacion es obligatorio")
    private LocalDate fechaCreacion;

    @NotBlank(message = "El campo estado es obligatorio")
    @Size(max = 20, message = "El campo estado no puede exceder 20 caracteres")
    private String estado;

}
