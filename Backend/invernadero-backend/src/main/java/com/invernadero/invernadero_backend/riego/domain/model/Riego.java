/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Riego
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para Riego
 */
package com.invernadero.invernadero_backend.riego.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad Riego - Eventos de riego automaticos o manuales ejecutados en las zonas
 * Tabla: riego
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "riego")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Riego {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_riego", nullable = false)
    private Integer idRiego;

    @ManyToOne
    @JoinColumn(name = "id_zona", referencedColumnName = "id_zona", nullable = false)
    private Zona idZona;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = true)
    private Usuario idUsuario;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "duracion_min", nullable = false)
    private Integer duracionMin;

    @Column(name = "volumen_litros")
    private BigDecimal volumenLitros;

    @Column(name = "tipo", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    @Column(name = "observaciones")
    private String observaciones;

    /**
     * Enum para tipo
     */
    public enum Tipo {
        AUTOMATICO, MANUAL
    }
}
