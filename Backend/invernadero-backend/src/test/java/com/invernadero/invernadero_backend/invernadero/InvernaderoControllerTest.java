package com.invernadero.invernadero_backend.invernadero;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.invernadero.invernadero_backend.auth.application.dto.RegisterRequest;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.invernadero.application.dto.InvernaderoRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para el módulo Invernadero.
 * Valida operaciones CRUD con autenticación JWT.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class InvernaderoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;
    private Integer responsableId;

    @BeforeEach
    public void setup() throws Exception {
        // Registrar usuario admin y obtener token JWT
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setNombre("Test");
        registerRequest.setApellido("User");
        registerRequest.setEmail("testuser@invernadero.com");
        registerRequest.setPassword("Test123456");
        registerRequest.setRol(Usuario.Rol.ADMINISTRADOR);

        MvcResult result = mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(response).get("accessToken").asText();
        responsableId = objectMapper.readTree(response).get("userId").asInt();
    }

    private InvernaderoRequest buildRequest(String nombre) {
        InvernaderoRequest req = new InvernaderoRequest();
        req.setNombre(nombre);
        req.setUbicacion("Ubicación Test");
        req.setAreaM2(BigDecimal.valueOf(100.5));
        req.setTipoEstructura("VIDRIO");
        req.setResponsableId(responsableId);
        req.setFechaCreacion(LocalDate.now());
        req.setEstado("ACTIVO");
        return req;
    }

    @Test
    public void testCrearInvernadero() throws Exception {
        mockMvc.perform(post("/invernadero")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildRequest("Invernadero Test"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Invernadero Test"))
                .andExpect(jsonPath("$.ubicacion").value("Ubicación Test"))
                .andExpect(jsonPath("$.estado").value("ACTIVO"));
    }

    @Test
    public void testListarInvernaderos() throws Exception {
        // Crear uno primero
        mockMvc.perform(post("/invernadero")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildRequest("Invernadero Lista"))))
                .andExpect(status().isCreated());

        // Listar — retorna Page<>, no array directo
        mockMvc.perform(get("/invernadero")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].nombre").exists());
    }

    @Test
    public void testActualizarInvernadero() throws Exception {
        // Crear
        MvcResult createResult = mockMvc.perform(post("/invernadero")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildRequest("Invernadero Original"))))
                .andExpect(status().isCreated())
                .andReturn();

        Integer id = objectMapper.readTree(
                createResult.getResponse().getContentAsString()
        ).get("idInvernadero").asInt();

        // Actualizar
        InvernaderoRequest updateRequest = buildRequest("Invernadero Actualizado");
        updateRequest.setEstado("MANTENIMIENTO");

        mockMvc.perform(put("/invernadero/" + id)
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Invernadero Actualizado"))
                .andExpect(jsonPath("$.estado").value("MANTENIMIENTO"));
    }

    @Test
    public void testEliminarInvernadero() throws Exception {
        // Crear
        MvcResult createResult = mockMvc.perform(post("/invernadero")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildRequest("Invernadero a Eliminar"))))
                .andExpect(status().isCreated())
                .andReturn();

        Integer id = objectMapper.readTree(
                createResult.getResponse().getContentAsString()
        ).get("idInvernadero").asInt();

        // Eliminar
        mockMvc.perform(delete("/invernadero/" + id)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());

        // Verificar que ya no existe → 404
        mockMvc.perform(get("/invernadero/" + id)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testAccesoSinAutenticacion() throws Exception {
        mockMvc.perform(get("/invernadero"))
                .andExpect(status().isUnauthorized());
    }
}
