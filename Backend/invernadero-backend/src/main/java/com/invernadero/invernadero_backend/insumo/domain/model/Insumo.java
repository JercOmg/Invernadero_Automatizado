/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Insumo
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para Insumo
 */
package com.invernadero.invernadero_backend.insumo.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.math.BigDecimal;

/**
 * Entidad Insumo - Catalogo de insumos con control de inventario para el invernadero
 * Tabla: insumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "insumo")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Insumo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo", nullable = false)
    private Integer idInsumo;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "tipo", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    @Column(name = "unidad", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Unidad unidad;

    @Column(name = "stock_actual", nullable = false)
    private BigDecimal stockActual;

    @Column(name = "stock_minimo")
    private BigDecimal stockMinimo;

    @Column(name = "descripcion")
    private String descripcion;

    /**
     * Enum para tipo
     */
    public enum Tipo {
        FERTILIZANTE, PESTICIDA, FUNGICIDA, SUSTRATO, AGUA, OTRO
    }

    /**
     * Enum para unidad
     */
    public enum Unidad {
        kg, g, L, mL, unidad
    }
}
