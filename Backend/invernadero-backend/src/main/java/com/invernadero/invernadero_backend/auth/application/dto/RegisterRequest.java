/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: RegisterRequest
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para RegisterRequest
 */
package com.invernadero.invernadero_backend.auth.application.dto;

import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para solicitud de registro de nuevo usuario
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
    private String apellido;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser valido")
    @Size(max = 150, message = "El email no puede exceder 150 caracteres")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    private String password;
    
    private Usuario.Rol rol = Usuario.Rol.OPERARIO;
}
