/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AplicacionInsumo
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AplicacionInsumo
 */
package com.invernadero.invernadero_backend.aplicacion_insumo.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.insumo.domain.model.Insumo;
import com.invernadero.invernadero_backend.siembra.domain.model.Siembra;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad AplicacionInsumo - Historial de aplicaciones de insumos realizadas en siembras o zonas
 * Tabla: aplicacion_insumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "aplicacion_insumo")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AplicacionInsumo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_aplicacion", nullable = false)
    private Integer idAplicacion;

    @ManyToOne
    @JoinColumn(name = "id_insumo", referencedColumnName = "id_insumo", nullable = false)
    private Insumo idInsumo;

    @ManyToOne
    @JoinColumn(name = "id_siembra", referencedColumnName = "id_siembra", nullable = true)
    private Siembra idSiembra;

    @ManyToOne
    @JoinColumn(name = "id_zona", referencedColumnName = "id_zona", nullable = true)
    private Zona idZona;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = false)
    private Usuario idUsuario;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "cantidad", nullable = false)
    private BigDecimal cantidad;

    @Column(name = "metodo", length = 50)
    @Enumerated(EnumType.STRING)
    private Metodo metodo;

    @Column(name = "observaciones")
    private String observaciones;

    /**
     * Enum para metodo
     */
    public enum Metodo {
        FOLIAR, RIEGO, SUELO, INYECCION
    }
}
