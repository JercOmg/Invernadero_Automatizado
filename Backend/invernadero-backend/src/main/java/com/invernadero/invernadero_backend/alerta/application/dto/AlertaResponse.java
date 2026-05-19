/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AlertaResponse
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AlertaResponse
 */
package com.invernadero.invernadero_backend.alerta.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para Alerta
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertaResponse {
    
        private Integer idAlerta;
        private Integer idSensorId;
        private Integer idZonaId;
        private String tipoAlerta;
        private String descripcion;
        private LocalDateTime fechaHora;
        private String nivel;
        private Boolean resuelta;
        private LocalDateTime fechaResolucion;
}
