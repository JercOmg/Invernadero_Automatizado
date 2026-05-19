/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: InvernaderoController
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para InvernaderoController
 */
package com.invernadero.invernadero_backend.invernadero.infrastructure.rest;

import com.invernadero.invernadero_backend.invernadero.application.dto.InvernaderoRequest;
import com.invernadero.invernadero_backend.invernadero.application.dto.InvernaderoResponse;
import com.invernadero.invernadero_backend.invernadero.application.service.InvernaderoService;
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
 * Controlador REST para Invernadero
 * Endpoints: /api/invernadero/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/invernadero")
@RequiredArgsConstructor
@Tag(name = "Invernadero", description = "Endpoints para gestion de invernadero")
public class InvernaderoController {
    
    private final InvernaderoService invernaderoService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/invernadero
     */
    @GetMapping
    @Operation(summary = "Listar invernadero", description = "Obtiene todos los registros de invernadero paginados")
    public ResponseEntity<Page<InvernaderoResponse>> findAll(Pageable pageable) {
        Page<InvernaderoResponse> page = invernaderoService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/invernadero/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener invernadero por ID", description = "Obtiene un registro de invernadero por su ID")
    public ResponseEntity<InvernaderoResponse> findById(@PathVariable Integer id) {
        InvernaderoResponse response = invernaderoService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/invernadero
     */
    @PostMapping
    @Operation(summary = "Crear invernadero", description = "Crea un nuevo registro de invernadero")
    public ResponseEntity<InvernaderoResponse> create(@Valid @RequestBody InvernaderoRequest request) {
        InvernaderoResponse response = invernaderoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/invernadero/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar invernadero", description = "Actualiza un registro existente de invernadero")
    public ResponseEntity<InvernaderoResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody InvernaderoRequest request) {
        InvernaderoResponse response = invernaderoService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/invernadero/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar invernadero", description = "Elimina un registro de invernadero por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        invernaderoService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
