/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Zona
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para Zona
 */
package com.invernadero.invernadero_backend.zona.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.invernadero.domain.model.Invernadero;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;

/**
 * Entidad Zona - Secciones o areas internas dentro de un invernadero con condiciones especificas
 * Tabla: zona
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "zona")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Zona {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_zona", nullable = false)
    private Integer idZona;

    @ManyToOne
    @JoinColumn(name = "id_invernadero", referencedColumnName = "id_invernadero", nullable = false)
    private Invernadero idInvernadero;

    @Column(name = "nombre_zona", nullable = false, length = 100)
    private String nombreZona;

    @Column(name = "area_m2")
    private BigDecimal areaM2;

    @Column(name = "descripcion")
    private String descripcion;


}
