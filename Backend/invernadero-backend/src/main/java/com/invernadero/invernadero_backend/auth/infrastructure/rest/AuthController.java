package com.invernadero.invernadero_backend.auth.infrastructure.rest;

import com.invernadero.invernadero_backend.auth.application.dto.AuthResponse;
import com.invernadero.invernadero_backend.auth.application.dto.GoogleLoginRequest;
import com.invernadero.invernadero_backend.auth.application.dto.LoginRequest;
import com.invernadero.invernadero_backend.auth.application.dto.RefreshTokenRequest;
import com.invernadero.invernadero_backend.auth.application.dto.RegisterRequest;
import com.invernadero.invernadero_backend.auth.application.service.AuthService;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para autenticacion y autorizacion
 * Endpoints: /api/auth/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacion", description = "Endpoints para autenticacion y autorizacion de usuarios")
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Endpoint para login de usuarios
     * POST /api/auth/login
     * 
     * @param loginRequest Credenciales de login
     * @return Respuesta con tokens JWT y datos del usuario
     */
    @PostMapping("/login")
    @Operation(summary = "Login de usuario", description = "Autentica un usuario y retorna tokens JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para registro de nuevos usuarios
     * POST /api/auth/register
     * 
     * @param registerRequest Datos del nuevo usuario
     * @return Respuesta con tokens JWT y datos del usuario creado
     */
    @PostMapping("/register")
    @Operation(summary = "Registro de usuario", description = "Registra un nuevo usuario en el sistema")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint para login con Google
     * POST /api/auth/google
     * 
     * @param googleLoginRequest Request conteniendo el idToken de Google
     * @return Respuesta con tokens JWT
     */
    @PostMapping("/google")
    @Operation(summary = "Login con Google", description = "Autentica o registra un usuario usando su ID token de Google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest googleLoginRequest) {
        AuthResponse response = authService.loginWithGoogle(googleLoginRequest);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para refrescar el access token
     * POST /api/auth/refresh
     * 
     * @param refreshTokenRequest Refresh token
     * @return Nuevo access token
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refrescar token", description = "Genera un nuevo access token usando un refresh token valido")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        AuthResponse response = authService.refreshToken(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para obtener informacion del usuario autenticado
     * GET /api/auth/me
     * 
     * @return Datos del usuario autenticado
     */
    @GetMapping("/me")
    @Operation(summary = "Usuario actual", description = "Obtiene la informacion del usuario autenticado")
    public ResponseEntity<Usuario> getCurrentUser() {
        Usuario usuario = authService.getCurrentUser();
        return ResponseEntity.ok(usuario);
    }
    
    /**
     * Endpoint de health check para autenticacion
     * GET /api/auth/health
     * 
     * @return Mensaje de estado
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Verifica que el servicio de autenticacion esta funcionando")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Servicio de autenticacion funcionando correctamente", "OK"));
    }
}
