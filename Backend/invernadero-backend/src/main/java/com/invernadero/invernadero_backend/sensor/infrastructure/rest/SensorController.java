package com.invernadero.invernadero_backend.sensor.infrastructure.rest;

import com.invernadero.invernadero_backend.sensor.application.dto.SensorRequest;
import com.invernadero.invernadero_backend.sensor.application.dto.SensorResponse;
import com.invernadero.invernadero_backend.sensor.application.service.SensorService;
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
 * Controlador REST para Sensor
 * Endpoints: /api/sensor/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/sensor")
@RequiredArgsConstructor
@Tag(name = "Sensor", description = "Endpoints para gestion de sensor")
public class SensorController {
    
    private final SensorService sensorService;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/sensor
     */
    @GetMapping
    @Operation(summary = "Listar sensor", description = "Obtiene todos los registros de sensor paginados")
    public ResponseEntity<Page<SensorResponse>> findAll(Pageable pageable) {
        Page<SensorResponse> page = sensorService.findAll(pageable);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Obtiene un registro por ID
     * GET /api/sensor/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener sensor por ID", description = "Obtiene un registro de sensor por su ID")
    public ResponseEntity<SensorResponse> findById(@PathVariable Integer id) {
        SensorResponse response = sensorService.findById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Crea un nuevo registro
     * POST /api/sensor
     */
    @PostMapping
    @Operation(summary = "Crear sensor", description = "Crea un nuevo registro de sensor")
    public ResponseEntity<SensorResponse> create(@Valid @RequestBody SensorRequest request) {
        SensorResponse response = sensorService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Actualiza un registro existente
     * PUT /api/sensor/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar sensor", description = "Actualiza un registro existente de sensor")
    public ResponseEntity<SensorResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody SensorRequest request) {
        SensorResponse response = sensorService.update(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un registro por ID
     * DELETE /api/sensor/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar sensor", description = "Elimina un registro de sensor por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        sensorService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }
}
