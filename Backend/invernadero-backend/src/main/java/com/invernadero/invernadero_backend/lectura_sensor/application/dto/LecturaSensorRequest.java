/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: LecturaSensorRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para LecturaSensorRequest
 */
package com.invernadero.invernadero_backend.lectura_sensor.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para crear/actualizar LecturaSensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LecturaSensorRequest {
    
    @NotNull(message = "El campo id_sensor es obligatorio")
    private Integer idSensorId;

    @NotNull(message = "El campo valor es obligatorio")
    private BigDecimal valor;

    @NotNull(message = "El campo fecha_hora es obligatorio")
    private LocalDateTime fechaHora;

    @NotNull(message = "El campo genera_alerta es obligatorio")
    private Boolean generaAlerta;

}
