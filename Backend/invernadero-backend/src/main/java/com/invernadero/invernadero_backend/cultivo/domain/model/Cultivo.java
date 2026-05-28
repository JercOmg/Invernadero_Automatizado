/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Cultivo
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para Cultivo
 */
package com.invernadero.invernadero_backend.cultivo.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.math.BigDecimal;

/**
 * Entidad Cultivo - Catalogo maestro de especies y variedades cultivadas en el invernadero
 * Tabla: cultivo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "cultivo")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cultivo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cultivo", nullable = false)
    private Integer idCultivo;

    @Column(name = "nombre_comun", nullable = false, length = 100)
    private String nombreComun;

    @Column(name = "nombre_cientifico", length = 150)
    private String nombreCientifico;

    @Column(name = "tipo", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    @Column(name = "temp_min_c")
    private BigDecimal tempMinC;

    @Column(name = "temp_max_c")
    private BigDecimal tempMaxC;

    @Column(name = "humedad_min_pct")
    private BigDecimal humedadMinPct;

    @Column(name = "humedad_max_pct")
    private BigDecimal humedadMaxPct;

    @Column(name = "dias_ciclo")
    private Integer diasCiclo;

    @Column(name = "descripcion")
    private String descripcion;

    /**
     * Enum para tipo
     */
    public enum Tipo {
        HORTALIZA, FRUTA, FLOR, HIERBA, OTRO
    }
}
