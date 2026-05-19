/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: LecturaSensorResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para LecturaSensorResponse
 */
package com.invernadero.invernadero_backend.lectura_sensor.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para LecturaSensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LecturaSensorResponse {
    
        private Integer idLectura;
        private Integer idSensorId;
        private BigDecimal valor;
        private LocalDateTime fechaHora;
        private Boolean generaAlerta;
}
