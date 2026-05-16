package com.invernadero.invernadero_backend.alerta.application.service;

import com.invernadero.invernadero_backend.alerta.application.dto.AlertaRequest;
import com.invernadero.invernadero_backend.alerta.application.dto.AlertaResponse;
import com.invernadero.invernadero_backend.alerta.domain.model.Alerta;
import com.invernadero.invernadero_backend.alerta.domain.repository.AlertaRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Alerta
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class AlertaService {
    
    private final AlertaRepository alertaRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<AlertaResponse> findAll(Pageable pageable) {
        return alertaRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public AlertaResponse findById(Integer id) {
        Alerta entity = alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public AlertaResponse create(AlertaRequest request) {
        Alerta entity = convertToEntity(request);
        entity = alertaRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public AlertaResponse update(Integer id, AlertaRequest request) {
        Alerta entity = alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = alertaRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!alertaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Alerta", "id", id);
        }
        alertaRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Alerta convertToEntity(AlertaRequest request) {
        Alerta entity = new Alerta();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Alerta entity, AlertaRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private AlertaResponse convertToResponse(Alerta entity) {
        AlertaResponse response = new AlertaResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
