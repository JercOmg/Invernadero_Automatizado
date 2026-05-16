package com.invernadero.invernadero_backend.riego.infrastructure.rest;

import com.invernadero.invernadero_backend.riego.application.dto.RiegoRequest;
import com.invernadero.invernadero_backend.riego.application.dto.RiegoResponse;
import com.invernadero.invernadero_backend.riego.application.service.RiegoService;
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
 * Controlador REST para Riego
 * Endpoints: /api/riego/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/riego")
@RequiredArgsConstructor
@Tag(name = "Riego", description = "Endpoints para gestion de riego")
public class RiegoController {
    
    private final RiegoService riegoService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/riego
     */
    @GetMapping
    @Operation(summary = "Listar riego", description = "Obtiene todos los registros de riego paginados")
    public ResponseEntity<Page<RiegoResponse>> findAll(Pageable pageable) {
        Page<RiegoResponse> page = riegoService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/riego/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener riego por ID", description = "Obtiene un registro de riego por su ID")
    public ResponseEntity<RiegoResponse> findById(@PathVariable Integer id) {
        RiegoResponse response = riegoService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/riego
     */
    @PostMapping
    @Operation(summary = "Crear riego", description = "Crea un nuevo registro de riego")
    public ResponseEntity<RiegoResponse> create(@Valid @RequestBody RiegoRequest request) {
        RiegoResponse response = riegoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/riego/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar riego", description = "Actualiza un registro existente de riego")
    public ResponseEntity<RiegoResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody RiegoRequest request) {
        RiegoResponse response = riegoService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/riego/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar riego", description = "Elimina un registro de riego por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        riegoService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
