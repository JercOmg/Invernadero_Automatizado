package com.invernadero.invernadero_backend.zona.infrastructure.rest;

import com.invernadero.invernadero_backend.zona.application.dto.ZonaRequest;
import com.invernadero.invernadero_backend.zona.application.dto.ZonaResponse;
import com.invernadero.invernadero_backend.zona.application.service.ZonaService;
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
 * Controlador REST para Zona
 * Endpoints: /api/zona/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/zona")
@RequiredArgsConstructor
@Tag(name = "Zona", description = "Endpoints para gestion de zona")
public class ZonaController {
    
    private final ZonaService zonaService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/zona
     */
    @GetMapping
    @Operation(summary = "Listar zona", description = "Obtiene todos los registros de zona paginados")
    public ResponseEntity<Page<ZonaResponse>> findAll(Pageable pageable) {
        Page<ZonaResponse> page = zonaService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/zona/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener zona por ID", description = "Obtiene un registro de zona por su ID")
    public ResponseEntity<ZonaResponse> findById(@PathVariable Integer id) {
        ZonaResponse response = zonaService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/zona
     */
    @PostMapping
    @Operation(summary = "Crear zona", description = "Crea un nuevo registro de zona")
    public ResponseEntity<ZonaResponse> create(@Valid @RequestBody ZonaRequest request) {
        ZonaResponse response = zonaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/zona/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar zona", description = "Actualiza un registro existente de zona")
    public ResponseEntity<ZonaResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody ZonaRequest request) {
        ZonaResponse response = zonaService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/zona/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar zona", description = "Elimina un registro de zona por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        zonaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
