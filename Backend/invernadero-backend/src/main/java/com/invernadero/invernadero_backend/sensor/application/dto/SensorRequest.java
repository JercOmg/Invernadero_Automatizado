package com.invernadero.invernadero_backend.sensor.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

/**
 * DTO para crear/actualizar Sensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorRequest {
    
    @NotNull(message = "El campo id_zona es obligatorio")
    private Integer idZonaId;

    @NotBlank(message = "El campo tipo_sensor es obligatorio")
    @Size(max = 50, message = "El campo tipo_sensor no puede exceder 50 caracteres")
    private String tipoSensor;

    @Size(max = 100, message = "El campo modelo no puede exceder 100 caracteres")
    private String modelo;

    @NotBlank(message = "El campo unidad_medida es obligatorio")
    @Size(max = 20, message = "El campo unidad_medida no puede exceder 20 caracteres")
    private String unidadMedida;


    private LocalDate fechaInstalacion;

    @NotBlank(message = "El campo estado es obligatorio")
    @Size(max = 20, message = "El campo estado no puede exceder 20 caracteres")
    private String estado;

}
