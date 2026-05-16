package com.invernadero.invernadero_backend.cosecha.infrastructure.rest;

import com.invernadero.invernadero_backend.cosecha.application.dto.CosechaRequest;
import com.invernadero.invernadero_backend.cosecha.application.dto.CosechaResponse;
import com.invernadero.invernadero_backend.cosecha.application.service.CosechaService;
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
 * Controlador REST para Cosecha
 * Endpoints: /api/cosecha/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/cosecha")
@RequiredArgsConstructor
@Tag(name = "Cosecha", description = "Endpoints para gestion de cosecha")
public class CosechaController {
    
    private final CosechaService cosechaService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/cosecha
     */
    @GetMapping
    @Operation(summary = "Listar cosecha", description = "Obtiene todos los registros de cosecha paginados")
    public ResponseEntity<Page<CosechaResponse>> findAll(Pageable pageable) {
        Page<CosechaResponse> page = cosechaService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/cosecha/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener cosecha por ID", description = "Obtiene un registro de cosecha por su ID")
    public ResponseEntity<CosechaResponse> findById(@PathVariable Integer id) {
        CosechaResponse response = cosechaService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/cosecha
     */
    @PostMapping
    @Operation(summary = "Crear cosecha", description = "Crea un nuevo registro de cosecha")
    public ResponseEntity<CosechaResponse> create(@Valid @RequestBody CosechaRequest request) {
        CosechaResponse response = cosechaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/cosecha/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar cosecha", description = "Actualiza un registro existente de cosecha")
    public ResponseEntity<CosechaResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody CosechaRequest request) {
        CosechaResponse response = cosechaService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/cosecha/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar cosecha", description = "Elimina un registro de cosecha por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        cosechaService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
