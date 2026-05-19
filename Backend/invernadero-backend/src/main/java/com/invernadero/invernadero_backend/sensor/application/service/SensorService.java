/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: SensorService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para SensorService
 */
package com.invernadero.invernadero_backend.sensor.application.service;

import com.invernadero.invernadero_backend.sensor.application.dto.SensorRequest;
import com.invernadero.invernadero_backend.sensor.application.dto.SensorResponse;
import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import com.invernadero.invernadero_backend.sensor.domain.repository.SensorRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Sensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class SensorService {
    
    private final SensorRepository sensorRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<SensorResponse> findAll(Pageable pageable) {
        return sensorRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public SensorResponse findById(Integer id) {
        Sensor entity = sensorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sensor", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public SensorResponse create(SensorRequest request) {
        Sensor entity = convertToEntity(request);
        entity = sensorRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public SensorResponse update(Integer id, SensorRequest request) {
        Sensor entity = sensorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sensor", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = sensorRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!sensorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sensor", "id", id);
        }
        sensorRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Sensor convertToEntity(SensorRequest request) {
        Sensor entity = new Sensor();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Sensor entity, SensorRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private SensorResponse convertToResponse(Sensor entity) {
        SensorResponse response = new SensorResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
