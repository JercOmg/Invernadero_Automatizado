package com.invernadero.invernadero_backend.auth.application.dto;

import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de autenticacion exitosa
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String accessToken;
    
    private String refreshToken;
    
    private String tokenType = "Bearer";
    
    private Integer userId;
    
    private String email;
    
    private String nombre;
    
    private String apellido;
    
    private Usuario.Rol rol;
    
    public AuthResponse(String accessToken, String refreshToken, Integer userId, 
                       String email, String nombre, String apellido, Usuario.Rol rol) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rol = rol;
    }
}
