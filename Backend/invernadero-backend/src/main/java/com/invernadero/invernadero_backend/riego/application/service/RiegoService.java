/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: RiegoService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para RiegoService
 */
package com.invernadero.invernadero_backend.riego.application.service;

import com.invernadero.invernadero_backend.riego.application.dto.RiegoRequest;
import com.invernadero.invernadero_backend.riego.application.dto.RiegoResponse;
import com.invernadero.invernadero_backend.riego.domain.model.Riego;
import com.invernadero.invernadero_backend.riego.domain.repository.RiegoRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Riego
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class RiegoService {
    
    private final RiegoRepository riegoRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<RiegoResponse> findAll(Pageable pageable) {
        return riegoRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public RiegoResponse findById(Integer id) {
        Riego entity = riegoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Riego", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public RiegoResponse create(RiegoRequest request) {
        Riego entity = convertToEntity(request);
        entity = riegoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public RiegoResponse update(Integer id, RiegoRequest request) {
        Riego entity = riegoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Riego", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = riegoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!riegoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Riego", "id", id);
        }
        riegoRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Riego convertToEntity(RiegoRequest request) {
        Riego entity = new Riego();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Riego entity, RiegoRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private RiegoResponse convertToResponse(Riego entity) {
        RiegoResponse response = new RiegoResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
