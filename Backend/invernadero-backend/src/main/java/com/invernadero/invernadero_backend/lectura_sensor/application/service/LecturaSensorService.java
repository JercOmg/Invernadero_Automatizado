package com.invernadero.invernadero_backend.lectura_sensor.application.service;

import com.invernadero.invernadero_backend.lectura_sensor.application.dto.LecturaSensorRequest;
import com.invernadero.invernadero_backend.lectura_sensor.application.dto.LecturaSensorResponse;
import com.invernadero.invernadero_backend.lectura_sensor.domain.model.LecturaSensor;
import com.invernadero.invernadero_backend.lectura_sensor.domain.repository.LecturaSensorRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de LecturaSensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class LecturaSensorService {
    
    private final LecturaSensorRepository lectura_sensorRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<LecturaSensorResponse> findAll(Pageable pageable) {
        return lectura_sensorRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public LecturaSensorResponse findById(Integer id) {
        LecturaSensor entity = lectura_sensorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LecturaSensor", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public LecturaSensorResponse create(LecturaSensorRequest request) {
        LecturaSensor entity = convertToEntity(request);
        entity = lectura_sensorRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public LecturaSensorResponse update(Integer id, LecturaSensorRequest request) {
        LecturaSensor entity = lectura_sensorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LecturaSensor", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = lectura_sensorRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!lectura_sensorRepository.existsById(id)) {
            throw new ResourceNotFoundException("LecturaSensor", "id", id);
        }
        lectura_sensorRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private LecturaSensor convertToEntity(LecturaSensorRequest request) {
        LecturaSensor entity = new LecturaSensor();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(LecturaSensor entity, LecturaSensorRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private LecturaSensorResponse convertToResponse(LecturaSensor entity) {
        LecturaSensorResponse response = new LecturaSensorResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
