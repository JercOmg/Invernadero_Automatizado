/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: SiembraController
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para SiembraController
 */
package com.invernadero.invernadero_backend.siembra.infrastructure.rest;

import com.invernadero.invernadero_backend.siembra.application.dto.SiembraRequest;
import com.invernadero.invernadero_backend.siembra.application.dto.SiembraResponse;
import com.invernadero.invernadero_backend.siembra.application.service.SiembraService;
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
 * Controlador REST para Siembra
 * Endpoints: /api/siembra/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/siembra")
@RequiredArgsConstructor
@Tag(name = "Siembra", description = "Endpoints para gestion de siembra")
public class SiembraController {
    
    private final SiembraService siembraService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/siembra
     */
    @GetMapping
    @Operation(summary = "Listar siembra", description = "Obtiene todos los registros de siembra paginados")
    public ResponseEntity<Page<SiembraResponse>> findAll(Pageable pageable) {
        Page<SiembraResponse> page = siembraService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/siembra/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener siembra por ID", description = "Obtiene un registro de siembra por su ID")
    public ResponseEntity<SiembraResponse> findById(@PathVariable Integer id) {
        SiembraResponse response = siembraService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/siembra
     */
    @PostMapping
    @Operation(summary = "Crear siembra", description = "Crea un nuevo registro de siembra")
    public ResponseEntity<SiembraResponse> create(@Valid @RequestBody SiembraRequest request) {
        SiembraResponse response = siembraService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/siembra/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar siembra", description = "Actualiza un registro existente de siembra")
    public ResponseEntity<SiembraResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody SiembraRequest request) {
        SiembraResponse response = siembraService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/siembra/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar siembra", description = "Elimina un registro de siembra por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        siembraService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
