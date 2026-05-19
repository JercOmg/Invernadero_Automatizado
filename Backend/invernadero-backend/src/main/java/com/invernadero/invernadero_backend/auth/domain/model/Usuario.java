/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: Usuario
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para Usuario
 */
package com.invernadero.invernadero_backend.auth.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

/**
 * Entidad Usuario - Usuarios del sistema con roles y permisos
 * Tabla: usuario
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "usuario", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;
    
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;
    
    @Column(name = "password_hash", length = 255)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 30)
    private Rol rol = Rol.OPERARIO;
    
    @CreatedDate
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDate fechaRegistro;
    
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "proveedor_oauth", length = 30)
    private ProveedorOAuth proveedorOauth;
    
    /**
     * Enum para los roles de usuario
     */
    public enum Rol {
        ADMINISTRADOR,
        TECNICO,
        OPERARIO,
        VISUALIZADOR
    }
    
    /**
     * Enum para los proveedores de autenticacion OAuth
     */
    public enum ProveedorOAuth {
        LOCAL,
        GOOGLE
    }
}
