/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Cosecha
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para Cosecha
 */
package com.invernadero.invernadero_backend.cosecha.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.siembra.domain.model.Siembra;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entidad Cosecha - Registro de produccion cosechada por cada evento de siembra
 * Tabla: cosecha
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "cosecha")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cosecha {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cosecha", nullable = false)
    private Integer idCosecha;

    @ManyToOne
    @JoinColumn(name = "id_siembra", referencedColumnName = "id_siembra", nullable = false)
    private Siembra idSiembra;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = false)
    private Usuario idUsuario;

    @Column(name = "fecha_cosecha", nullable = false)
    private LocalDate fechaCosecha;

    @Column(name = "cantidad_kg", nullable = false)
    private BigDecimal cantidadKg;

    @Column(name = "calidad", length = 20)
    @Enumerated(EnumType.STRING)
    private Calidad calidad;

    @Column(name = "observaciones")
    private String observaciones;

    /**
     * Enum para calidad
     */
    public enum Calidad {
        PREMIUM, ESTANDAR, SEGUNDA, DESCARTE
    }
}
