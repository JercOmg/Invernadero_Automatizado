package com.invernadero.invernadero_backend.cultivo.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO para crear/actualizar Cultivo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CultivoRequest {
    
    @NotBlank(message = "El campo nombre_comun es obligatorio")
    @Size(max = 100, message = "El campo nombre_comun no puede exceder 100 caracteres")
    private String nombreComun;

    @Size(max = 150, message = "El campo nombre_cientifico no puede exceder 150 caracteres")
    private String nombreCientifico;

    @NotBlank(message = "El campo tipo es obligatorio")
    @Size(max = 50, message = "El campo tipo no puede exceder 50 caracteres")
    private String tipo;


    private BigDecimal tempMinC;


    private BigDecimal tempMaxC;


    private BigDecimal humedadMinPct;


    private BigDecimal humedadMaxPct;


    private Integer diasCiclo;


    private String descripcion;

}
