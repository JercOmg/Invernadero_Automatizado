package com.invernadero.invernadero_backend.insumo.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO para crear/actualizar Insumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsumoRequest {
    
    @NotBlank(message = "El campo nombre es obligatorio")
    @Size(max = 100, message = "El campo nombre no puede exceder 100 caracteres")
    private String nombre;

    @NotBlank(message = "El campo tipo es obligatorio")
    @Size(max = 50, message = "El campo tipo no puede exceder 50 caracteres")
    private String tipo;

    @NotBlank(message = "El campo unidad es obligatorio")
    @Size(max = 20, message = "El campo unidad no puede exceder 20 caracteres")
    private String unidad;

    @NotNull(message = "El campo stock_actual es obligatorio")
    private BigDecimal stockActual;


    private BigDecimal stockMinimo;


    private String descripcion;

}
