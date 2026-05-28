/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Siembra
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para Siembra
 */
package com.invernadero.invernadero_backend.siembra.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.cultivo.domain.model.Cultivo;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

/**
 * Entidad Siembra - Registro de cada evento de siembra realizado en una zona del invernadero
 * Tabla: siembra
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "siembra")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Siembra {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_siembra", nullable = false)
    private Integer idSiembra;

    @ManyToOne
    @JoinColumn(name = "id_zona", referencedColumnName = "id_zona", nullable = false)
    private Zona idZona;

    @ManyToOne
    @JoinColumn(name = "id_cultivo", referencedColumnName = "id_cultivo", nullable = false)
    private Cultivo idCultivo;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = false)
    private Usuario idUsuario;

    @Column(name = "fecha_siembra", nullable = false)
    private LocalDate fechaSiembra;

    @Column(name = "fecha_cosecha_estimada")
    private LocalDate fechaCosechaEstimada;

    @Column(name = "cantidad_plantas", nullable = false)
    private Integer cantidadPlantas;

    @Column(name = "estado", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Column(name = "observaciones")
    private String observaciones;

    /**
     * Enum para estado
     */
    public enum Estado {
        EN_CRECIMIENTO, COSECHADO, PERDIDO, EN_CUARENTENA
    }
}
