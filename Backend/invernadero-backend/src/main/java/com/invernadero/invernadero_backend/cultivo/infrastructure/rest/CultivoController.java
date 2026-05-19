/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: CultivoController
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para CultivoController
 */
package com.invernadero.invernadero_backend.cultivo.infrastructure.rest;

import com.invernadero.invernadero_backend.cultivo.application.dto.CultivoRequest;
import com.invernadero.invernadero_backend.cultivo.application.dto.CultivoResponse;
import com.invernadero.invernadero_backend.cultivo.application.service.CultivoService;
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
 * Controlador REST para Cultivo
 * Endpoints: /api/cultivo/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/cultivo")
@RequiredArgsConstructor
@Tag(name = "Cultivo", description = "Endpoints para gestion de cultivo")
public class CultivoController {
    
    private final CultivoService cultivoService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/cultivo
     */
    @GetMapping
    @Operation(summary = "Listar cultivo", description = "Obtiene todos los registros de cultivo paginados")
    public ResponseEntity<Page<CultivoResponse>> findAll(Pageable pageable) {
        Page<CultivoResponse> page = cultivoService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/cultivo/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener cultivo por ID", description = "Obtiene un registro de cultivo por su ID")
    public ResponseEntity<CultivoResponse> findById(@PathVariable Integer id) {
        CultivoResponse response = cultivoService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/cultivo
     */
    @PostMapping
    @Operation(summary = "Crear cultivo", description = "Crea un nuevo registro de cultivo")
    public ResponseEntity<CultivoResponse> create(@Valid @RequestBody CultivoRequest request) {
        CultivoResponse response = cultivoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/cultivo/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar cultivo", description = "Actualiza un registro existente de cultivo")
    public ResponseEntity<CultivoResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody CultivoRequest request) {
        CultivoResponse response = cultivoService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/cultivo/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar cultivo", description = "Elimina un registro de cultivo por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        cultivoService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
