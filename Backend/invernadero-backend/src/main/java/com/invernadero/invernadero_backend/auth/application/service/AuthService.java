package com.invernadero.invernadero_backend.auth.application.service;

import com.invernadero.invernadero_backend.auth.application.dto.AuthResponse;
import com.invernadero.invernadero_backend.auth.application.dto.LoginRequest;
import com.invernadero.invernadero_backend.auth.application.dto.RegisterRequest;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.auth.domain.repository.UsuarioRepository;
import com.invernadero.invernadero_backend.auth.infrastructure.security.JwtTokenProvider;
import com.invernadero.invernadero_backend.shared.exception.BusinessException;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Servicio de autenticacion y autorizacion
 * Maneja login, registro y operaciones relacionadas con JWT
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    
    /**
     * Autentica un usuario y genera tokens JWT
     * 
     * @param loginRequest Credenciales de login
     * @return Respuesta con tokens y datos del usuario
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        // Autenticar con Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generar tokens
        String accessToken = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(loginRequest.getEmail());
        
        // Obtener datos del usuario
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", loginRequest.getEmail()));
        
        return new AuthResponse(
                accessToken,
                refreshToken,
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getRol()
        );
    }
    
    /**
     * Registra un nuevo usuario en el sistema
     * 
     * @param registerRequest Datos del nuevo usuario
     * @return Respuesta con tokens y datos del usuario creado
     */
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BusinessException("El email ya esta registrado: " + registerRequest.getEmail());
        }
        
        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(registerRequest.getNombre());
        usuario.setApellido(registerRequest.getApellido());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        usuario.setRol(registerRequest.getRol() != null ? registerRequest.getRol() : Usuario.Rol.OPERARIO);
        usuario.setFechaRegistro(LocalDate.now());
        usuario.setActivo(true);
        usuario.setProveedorOauth(Usuario.ProveedorOAuth.LOCAL);
        
        usuario = usuarioRepository.save(usuario);
        
        // Generar tokens
        String accessToken = jwtTokenProvider.generateTokenFromEmail(usuario.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(usuario.getEmail());
        
        return new AuthResponse(
                accessToken,
                refreshToken,
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getRol()
        );
    }
    
    /**
     * Refresca el access token usando un refresh token valido
     * 
     * @param refreshToken Refresh token
     * @return Nuevo access token
     */
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        // Validar refresh token
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("Refresh token invalido o expirado");
        }
        
        // Obtener email del token
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        
        // Verificar que el usuario existe y esta activo
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));
        
        if (!usuario.getActivo()) {
            throw new BusinessException("Usuario inactivo");
        }
        
        // Generar nuevo access token
        String newAccessToken = jwtTokenProvider.generateTokenFromEmail(email);
        
        return new AuthResponse(
                newAccessToken,
                refreshToken,
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getRol()
        );
    }
    
    /**
     * Obtiene el usuario actualmente autenticado
     * 
     * @return Usuario autenticado
     */
    @Transactional(readOnly = true)
    public Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));
    }
}
