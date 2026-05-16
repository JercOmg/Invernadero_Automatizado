package com.invernadero.invernadero_backend.sensor.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

/**
 * Entidad Sensor - Dispositivos de medicion instalados en las zonas del invernadero
 * Tabla: sensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "sensor")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sensor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sensor", nullable = false)
    private Integer idSensor;

    @ManyToOne
    @JoinColumn(name = "id_zona", referencedColumnName = "id_zona", nullable = false)
    private Zona idZona;

    @Column(name = "tipo_sensor", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TipoSensor tipoSensor;

    @Column(name = "modelo", length = 100)
    private String modelo;

    @Column(name = "unidad_medida", nullable = false, length = 20)
    private String unidadMedida;

    @Column(name = "fecha_instalacion")
    private LocalDate fechaInstalacion;

    @Column(name = "estado", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Estado estado;

    /**
     * Enum para tipo_sensor
     */
    public enum TipoSensor {
        TEMPERATURA, HUMEDAD, CO2, LUMINOSIDAD, PH, HUMEDAD_SUELO
    }

    /**
     * Enum para estado
     */
    public enum Estado {
        ACTIVO, INACTIVO, FALLA
    }
}
