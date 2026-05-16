package com.invernadero.invernadero_backend.invernadero.application.service;

import com.invernadero.invernadero_backend.invernadero.application.dto.InvernaderoRequest;
import com.invernadero.invernadero_backend.invernadero.application.dto.InvernaderoResponse;
import com.invernadero.invernadero_backend.invernadero.domain.model.Invernadero;
import com.invernadero.invernadero_backend.invernadero.domain.repository.InvernaderoRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Invernadero
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class InvernaderoService {
    
    private final InvernaderoRepository invernaderoRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<InvernaderoResponse> findAll(Pageable pageable) {
        return invernaderoRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public InvernaderoResponse findById(Integer id) {
        Invernadero entity = invernaderoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invernadero", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public InvernaderoResponse create(InvernaderoRequest request) {
        Invernadero entity = convertToEntity(request);
        entity = invernaderoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public InvernaderoResponse update(Integer id, InvernaderoRequest request) {
        Invernadero entity = invernaderoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invernadero", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = invernaderoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!invernaderoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Invernadero", "id", id);
        }
        invernaderoRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Invernadero convertToEntity(InvernaderoRequest request) {
        Invernadero entity = new Invernadero();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Invernadero entity, InvernaderoRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private InvernaderoResponse convertToResponse(Invernadero entity) {
        InvernaderoResponse response = new InvernaderoResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
