/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: InsumoService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para InsumoService
 */
package com.invernadero.invernadero_backend.insumo.application.service;

import com.invernadero.invernadero_backend.insumo.application.dto.InsumoRequest;
import com.invernadero.invernadero_backend.insumo.application.dto.InsumoResponse;
import com.invernadero.invernadero_backend.insumo.domain.model.Insumo;
import com.invernadero.invernadero_backend.insumo.domain.repository.InsumoRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Insumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class InsumoService {
    
    private final InsumoRepository insumoRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<InsumoResponse> findAll(Pageable pageable) {
        return insumoRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public InsumoResponse findById(Integer id) {
        Insumo entity = insumoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public InsumoResponse create(InsumoRequest request) {
        Insumo entity = convertToEntity(request);
        entity = insumoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public InsumoResponse update(Integer id, InsumoRequest request) {
        Insumo entity = insumoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = insumoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!insumoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Insumo", "id", id);
        }
        insumoRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Insumo convertToEntity(InsumoRequest request) {
        Insumo entity = new Insumo();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Insumo entity, InsumoRequest request) {
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private InsumoResponse convertToResponse(Insumo entity) {
        InsumoResponse response = new InsumoResponse();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }
}
