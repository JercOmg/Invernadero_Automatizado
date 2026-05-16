package com.invernadero.invernadero_backend.invernadero.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entidad Invernadero - Informacion general de cada instalacion fisica de invernadero
 * Tabla: invernadero
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "invernadero")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invernadero {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_invernadero", nullable = false)
    private Integer idInvernadero;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "ubicacion", nullable = false, length = 200)
    private String ubicacion;

    @Column(name = "area_m2", nullable = false)
    private BigDecimal areaM2;

    @Column(name = "tipo_estructura", length = 50)
    @Enumerated(EnumType.STRING)
    private TipoEstructura tipoEstructura;

    @ManyToOne
    @JoinColumn(name = "responsable_id", referencedColumnName = "id_usuario", nullable = false)
    private Usuario responsableId;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "estado", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Estado estado;

    /**
     * Enum para tipo_estructura
     */
    public enum TipoEstructura {
        VIDRIO, POLICARBONATO, MALLA, PLASTICO
    }

    /**
     * Enum para estado
     */
    public enum Estado {
        ACTIVO, INACTIVO, MANTENIMIENTO
    }
}
