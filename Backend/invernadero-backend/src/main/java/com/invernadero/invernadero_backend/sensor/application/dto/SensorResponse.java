package com.invernadero.invernadero_backend.sensor.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

/**
 * DTO de respuesta para Sensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorResponse {
    
        private Integer idSensor;
        private Integer idZonaId;
        private String tipoSensor;
        private String modelo;
        private String unidadMedida;
        private LocalDate fechaInstalacion;
        private String estado;
}
