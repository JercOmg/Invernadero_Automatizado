package com.invernadero.invernadero_backend.aplicacion_insumo.application.service;

import com.invernadero.invernadero_backend.aplicacion_insumo.application.dto.AplicacionInsumoRequest;
import com.invernadero.invernadero_backend.aplicacion_insumo.application.dto.AplicacionInsumoResponse;
import com.invernadero.invernadero_backend.aplicacion_insumo.domain.model.AplicacionInsumo;
import com.invernadero.invernadero_backend.aplicacion_insumo.domain.repository.AplicacionInsumoRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de AplicacionInsumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class AplicacionInsumoService {
    
    private final AplicacionInsumoRepository aplicacion_insumoRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<AplicacionInsumoResponse> findAll(Pageable pageable) {
        return aplicacion_insumoRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public AplicacionInsumoResponse findById(Integer id) {
        AplicacionInsumo entity = aplicacion_insumoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AplicacionInsumo", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public AplicacionInsumoResponse create(AplicacionInsumoRequest request) {
        AplicacionInsumo entity = convertToEntity(request);
        entity = aplicacion_insumoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public AplicacionInsumoResponse update(Integer id, AplicacionInsumoRequest request) {
        AplicacionInsumo entity = aplicacion_insumoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AplicacionInsumo", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = aplicacion_insumoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!aplicacion_insumoRepository.existsById(id)) {
            throw new ResourceNotFoundException("AplicacionInsumo", "id", id);
        }
        aplicacion_insumoRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private AplicacionInsumo convertToEntity(AplicacionInsumoRequest request) {
        AplicacionInsumo entity = new AplicacionInsumo();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(AplicacionInsumo entity, AplicacionInsumoRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private AplicacionInsumoResponse convertToResponse(AplicacionInsumo entity) {
        AplicacionInsumoResponse response = new AplicacionInsumoResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
