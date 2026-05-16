package com.invernadero.invernadero_backend.lectura_sensor.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad LecturaSensor - Serie temporal de mediciones registradas por cada sensor del invernadero
 * Tabla: lectura_sensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "lectura_sensor")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LecturaSensor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lectura", nullable = false)
    private Integer idLectura;

    @ManyToOne
    @JoinColumn(name = "id_sensor", referencedColumnName = "id_sensor", nullable = false)
    private Sensor idSensor;

    @Column(name = "valor", nullable = false)
    private BigDecimal valor;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "genera_alerta", nullable = false)
    private Boolean generaAlerta;


}
