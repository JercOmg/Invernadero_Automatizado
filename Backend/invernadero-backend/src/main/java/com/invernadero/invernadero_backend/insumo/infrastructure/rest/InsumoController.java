/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: InsumoController
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para InsumoController
 */
package com.invernadero.invernadero_backend.insumo.infrastructure.rest;

import com.invernadero.invernadero_backend.insumo.application.dto.InsumoRequest;
import com.invernadero.invernadero_backend.insumo.application.dto.InsumoResponse;
import com.invernadero.invernadero_backend.insumo.application.service.InsumoService;
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
 * Controlador REST para Insumo
 * Endpoints: /api/insumo/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/insumo")
@RequiredArgsConstructor
@Tag(name = "Insumo", description = "Endpoints para gestion de insumo")
public class InsumoController {
    
    private final InsumoService insumoService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/insumo
     */
    @GetMapping
    @Operation(summary = "Listar insumo", description = "Obtiene todos los registros de insumo paginados")
    public ResponseEntity<Page<InsumoResponse>> findAll(Pageable pageable) {
        Page<InsumoResponse> page = insumoService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/insumo/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener insumo por ID", description = "Obtiene un registro de insumo por su ID")
    public ResponseEntity<InsumoResponse> findById(@PathVariable Integer id) {
        InsumoResponse response = insumoService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/insumo
     */
    @PostMapping
    @Operation(summary = "Crear insumo", description = "Crea un nuevo registro de insumo")
    public ResponseEntity<InsumoResponse> create(@Valid @RequestBody InsumoRequest request) {
        InsumoResponse response = insumoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/insumo/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar insumo", description = "Actualiza un registro existente de insumo")
    public ResponseEntity<InsumoResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody InsumoRequest request) {
        InsumoResponse response = insumoService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/insumo/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar insumo", description = "Elimina un registro de insumo por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        insumoService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
