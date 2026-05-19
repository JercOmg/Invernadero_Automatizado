/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Alerta
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para Alerta
 */
package com.invernadero.invernadero_backend.alerta.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

/**
 * Entidad Alerta - Notificaciones generadas por condiciones anomalas detectadas en el invernadero
 * Tabla: alerta
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "alerta")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alerta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alerta", nullable = false)
    private Integer idAlerta;

    @ManyToOne
    @JoinColumn(name = "id_sensor", referencedColumnName = "id_sensor", nullable = true)
    private Sensor idSensor;

    @ManyToOne
    @JoinColumn(name = "id_zona", referencedColumnName = "id_zona", nullable = true)
    private Zona idZona;

    @Column(name = "tipo_alerta", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TipoAlerta tipoAlerta;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "nivel", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Nivel nivel;

    @Column(name = "resuelta", nullable = false)
    private Boolean resuelta;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    /**
     * Enum para tipo_alerta
     */
    public enum TipoAlerta {
        TEMPERATURA_ALTA, TEMPERATURA_BAJA, HUMEDAD_ALTA, HUMEDAD_BAJA, CO2_ALTO, PH_FUERA_RANGO, FALLA_SENSOR, PLAGA_ENFERMEDAD
    }

    /**
     * Enum para nivel
     */
    public enum Nivel {
        INFORMATIVA, ADVERTENCIA, CRITICA
    }
}
