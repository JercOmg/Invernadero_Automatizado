/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AplicacionInsumoController
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AplicacionInsumoController
 */
package com.invernadero.invernadero_backend.aplicacion_insumo.infrastructure.rest;

import com.invernadero.invernadero_backend.aplicacion_insumo.application.dto.AplicacionInsumoRequest;
import com.invernadero.invernadero_backend.aplicacion_insumo.application.dto.AplicacionInsumoResponse;
import com.invernadero.invernadero_backend.aplicacion_insumo.application.service.AplicacionInsumoService;
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
 * Controlador REST para AplicacionInsumo
 * Endpoints: /api/aplicacion_insumo/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/aplicacion_insumo")
@RequiredArgsConstructor
@Tag(name = "AplicacionInsumo", description = "Endpoints para gestion de aplicacion_insumo")
public class AplicacionInsumoController {
    
    private final AplicacionInsumoService aplicacion_insumoService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/aplicacion_insumo
     */
    @GetMapping
    @Operation(summary = "Listar aplicacion_insumo", description = "Obtiene todos los registros de aplicacion_insumo paginados")
    public ResponseEntity<Page<AplicacionInsumoResponse>> findAll(Pageable pageable) {
        Page<AplicacionInsumoResponse> page = aplicacion_insumoService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/aplicacion_insumo/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener aplicacion_insumo por ID", description = "Obtiene un registro de aplicacion_insumo por su ID")
    public ResponseEntity<AplicacionInsumoResponse> findById(@PathVariable Integer id) {
        AplicacionInsumoResponse response = aplicacion_insumoService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/aplicacion_insumo
     */
    @PostMapping
    @Operation(summary = "Crear aplicacion_insumo", description = "Crea un nuevo registro de aplicacion_insumo")
    public ResponseEntity<AplicacionInsumoResponse> create(@Valid @RequestBody AplicacionInsumoRequest request) {
        AplicacionInsumoResponse response = aplicacion_insumoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/aplicacion_insumo/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar aplicacion_insumo", description = "Actualiza un registro existente de aplicacion_insumo")
    public ResponseEntity<AplicacionInsumoResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody AplicacionInsumoRequest request) {
        AplicacionInsumoResponse response = aplicacion_insumoService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/aplicacion_insumo/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar aplicacion_insumo", description = "Elimina un registro de aplicacion_insumo por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        aplicacion_insumoService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
