/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AlertaController
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AlertaController
 */
package com.invernadero.invernadero_backend.alerta.infrastructure.rest;

import com.invernadero.invernadero_backend.alerta.application.dto.AlertaRequest;
import com.invernadero.invernadero_backend.alerta.application.dto.AlertaResponse;
import com.invernadero.invernadero_backend.alerta.application.service.AlertaService;
import com.invernadero.invernadero_backend.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para Alerta
 * Endpoints: /api/alerta/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/alerta")
@RequiredArgsConstructor
@Tag(name = "Alerta", description = "Endpoints para gestion de alerta")
public class AlertaController {
    
    private final AlertaService alertaService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/alerta
     */
    @GetMapping
    @Operation(summary = "Listar alerta", description = "Obtiene todos los registros de alerta paginados")
    public ResponseEntity<Page<AlertaResponse>> findAll(Pageable pageable) {
        Page<AlertaResponse> page = alertaService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/alerta/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener alerta por ID", description = "Obtiene un registro de alerta por su ID")
    public ResponseEntity<AlertaResponse> findById(@PathVariable Integer id) {
        AlertaResponse response = alertaService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/alerta
     */
    @PostMapping
    @Operation(summary = "Crear alerta", description = "Crea un nuevo registro de alerta")
    public ResponseEntity<AlertaResponse> create(@Valid @RequestBody AlertaRequest request) {
        AlertaResponse response = alertaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/alerta/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar alerta", description = "Actualiza un registro existente de alerta")
    public ResponseEntity<AlertaResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody AlertaRequest request) {
        AlertaResponse response = alertaService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/alerta/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar alerta", description = "Elimina un registro de alerta por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        alertaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
