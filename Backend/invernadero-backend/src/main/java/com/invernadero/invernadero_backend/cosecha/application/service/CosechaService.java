package com.invernadero.invernadero_backend.cosecha.application.service;

import com.invernadero.invernadero_backend.cosecha.application.dto.CosechaRequest;
import com.invernadero.invernadero_backend.cosecha.application.dto.CosechaResponse;
import com.invernadero.invernadero_backend.cosecha.domain.model.Cosecha;
import com.invernadero.invernadero_backend.cosecha.domain.repository.CosechaRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Cosecha
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class CosechaService {
    
    private final CosechaRepository cosechaRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<CosechaResponse> findAll(Pageable pageable) {
        return cosechaRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public CosechaResponse findById(Integer id) {
        Cosecha entity = cosechaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cosecha", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public CosechaResponse create(CosechaRequest request) {
        Cosecha entity = convertToEntity(request);
        entity = cosechaRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public CosechaResponse update(Integer id, CosechaRequest request) {
        Cosecha entity = cosechaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cosecha", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = cosechaRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!cosechaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cosecha", "id", id);
        }
        cosechaRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Cosecha convertToEntity(CosechaRequest request) {
        Cosecha entity = new Cosecha();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Cosecha entity, CosechaRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private CosechaResponse convertToResponse(Cosecha entity) {
        CosechaResponse response = new CosechaResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
