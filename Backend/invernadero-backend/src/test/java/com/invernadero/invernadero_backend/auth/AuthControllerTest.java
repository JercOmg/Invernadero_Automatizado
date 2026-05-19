package com.invernadero.invernadero_backend.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.invernadero.invernadero_backend.auth.application.dto.LoginRequest;
import com.invernadero.invernadero_backend.auth.application.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para el controlador de autenticación.
 * Valida registro, login y generación de tokens JWT.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegistroExitoso() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setNombre("Usuario Test");
        request.setApellido("Apellido Test");
        request.setEmail("test@invernadero.com");
        request.setPassword("Test123456");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                // /auth/register retorna 201 CREATED
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.email").value("test@invernadero.com"));
    }

    @Test
    public void testRegistroEmailDuplicado() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setNombre("Usuario Test");
        request.setApellido("Apellido");
        request.setEmail("duplicado@invernadero.com");
        request.setPassword("Test123456");

        // Primer registro debe funcionar
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Segundo registro con mismo email debe fallar con 4xx
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void testLoginExitoso() throws Exception {
        // Primero registrar usuario
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setNombre("Usuario Login");
        registerRequest.setApellido("Apellido Login");
        registerRequest.setEmail("login@invernadero.com");
        registerRequest.setPassword("Login123456");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Luego intentar login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login@invernadero.com");
        loginRequest.setPassword("Login123456");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    public void testLoginCredencialesInvalidas() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("noexiste@invernadero.com");
        loginRequest.setPassword("PasswordIncorrecto");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testRegistroConDatosInvalidos() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setNombre("");
        request.setApellido("");
        request.setEmail("email-invalido");
        request.setPassword("123");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }
}
