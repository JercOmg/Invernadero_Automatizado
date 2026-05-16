package com.invernadero.invernadero_backend.siembra.application.service;

import com.invernadero.invernadero_backend.siembra.application.dto.SiembraRequest;
import com.invernadero.invernadero_backend.siembra.application.dto.SiembraResponse;
import com.invernadero.invernadero_backend.siembra.domain.model.Siembra;
import com.invernadero.invernadero_backend.siembra.domain.repository.SiembraRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Siembra
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class SiembraService {
    
    private final SiembraRepository siembraRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<SiembraResponse> findAll(Pageable pageable) {
        return siembraRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public SiembraResponse findById(Integer id) {
        Siembra entity = siembraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Siembra", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public SiembraResponse create(SiembraRequest request) {
        Siembra entity = convertToEntity(request);
        entity = siembraRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public SiembraResponse update(Integer id, SiembraRequest request) {
        Siembra entity = siembraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Siembra", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = siembraRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!siembraRepository.existsById(id)) {
            throw new ResourceNotFoundException("Siembra", "id", id);
        }
        siembraRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Siembra convertToEntity(SiembraRequest request) {
        Siembra entity = new Siembra();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Siembra entity, SiembraRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private SiembraResponse convertToResponse(Siembra entity) {
        SiembraResponse response = new SiembraResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
