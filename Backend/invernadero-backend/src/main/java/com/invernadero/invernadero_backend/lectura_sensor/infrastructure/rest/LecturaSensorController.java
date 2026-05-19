/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: LecturaSensorController
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para LecturaSensorController
 */
package com.invernadero.invernadero_backend.lectura_sensor.infrastructure.rest;

import com.invernadero.invernadero_backend.lectura_sensor.application.dto.LecturaSensorRequest;
import com.invernadero.invernadero_backend.lectura_sensor.application.dto.LecturaSensorResponse;
import com.invernadero.invernadero_backend.lectura_sensor.application.service.LecturaSensorService;
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
 * Controlador REST para LecturaSensor
 * Endpoints: /api/lectura_sensor/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/lectura_sensor")
@RequiredArgsConstructor
@Tag(name = "LecturaSensor", description = "Endpoints para gestion de lectura_sensor")
public class LecturaSensorController {
    
    private final LecturaSensorService lectura_sensorService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/lectura_sensor
     */
    @GetMapping
    @Operation(summary = "Listar lectura_sensor", description = "Obtiene todos los registros de lectura_sensor paginados")
    public ResponseEntity<Page<LecturaSensorResponse>> findAll(Pageable pageable) {
        Page<LecturaSensorResponse> page = lectura_sensorService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/lectura_sensor/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener lectura_sensor por ID", description = "Obtiene un registro de lectura_sensor por su ID")
    public ResponseEntity<LecturaSensorResponse> findById(@PathVariable Integer id) {
        LecturaSensorResponse response = lectura_sensorService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/lectura_sensor
     */
    @PostMapping
    @Operation(summary = "Crear lectura_sensor", description = "Crea un nuevo registro de lectura_sensor")
    public ResponseEntity<LecturaSensorResponse> create(@Valid @RequestBody LecturaSensorRequest request) {
        LecturaSensorResponse response = lectura_sensorService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/lectura_sensor/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar lectura_sensor", description = "Actualiza un registro existente de lectura_sensor")
    public ResponseEntity<LecturaSensorResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody LecturaSensorRequest request) {
        LecturaSensorResponse response = lectura_sensorService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/lectura_sensor/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar lectura_sensor", description = "Elimina un registro de lectura_sensor por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        lectura_sensorService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
