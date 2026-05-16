package com.invernadero.invernadero_backend.alerta.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

/**
 * DTO para crear/actualizar Alerta
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertaRequest {
    

    private Integer idSensorId;


    private Integer idZonaId;

    @NotBlank(message = "El campo tipo_alerta es obligatorio")
    @Size(max = 50, message = "El campo tipo_alerta no puede exceder 50 caracteres")
    private String tipoAlerta;

    @NotBlank(message = "El campo descripcion es obligatorio")
    private String descripcion;

    @NotNull(message = "El campo fecha_hora es obligatorio")
    private LocalDateTime fechaHora;

    @NotBlank(message = "El campo nivel es obligatorio")
    @Size(max = 20, message = "El campo nivel no puede exceder 20 caracteres")
    private String nivel;

    @NotNull(message = "El campo resuelta es obligatorio")
    private Boolean resuelta;


    private LocalDateTime fechaResolucion;

}
