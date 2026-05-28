/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: ZonaService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para ZonaService
 */
package com.invernadero.invernadero_backend.zona.application.service;

import com.invernadero.invernadero_backend.zona.application.dto.ZonaRequest;
import com.invernadero.invernadero_backend.zona.application.dto.ZonaResponse;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import com.invernadero.invernadero_backend.zona.domain.repository.ZonaRepository;
import com.invernadero.invernadero_backend.invernadero.domain.model.Invernadero;
import com.invernadero.invernadero_backend.invernadero.domain.repository.InvernaderoRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Zona
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class ZonaService {
    
    private final ZonaRepository zonaRepository;
    private final InvernaderoRepository invernaderoRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<ZonaResponse> findAll(Pageable pageable) {
        return zonaRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public ZonaResponse findById(Integer id) {
        Zona entity = zonaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zona", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public ZonaResponse create(ZonaRequest request) {
        Zona entity = convertToEntity(request);
        entity = zonaRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public ZonaResponse update(Integer id, ZonaRequest request) {
        Zona entity = zonaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zona", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = zonaRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!zonaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Zona", "id", id);
        }
        zonaRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Zona convertToEntity(ZonaRequest request) {
        Zona entity = new Zona();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Zona entity, ZonaRequest request) {
        entity.setNombreZona(request.getNombreZona());
        entity.setAreaM2(request.getAreaM2());
        entity.setDescripcion(request.getDescripcion());
        if (request.getIdInvernaderoId() != null) {
            Invernadero inv = invernaderoRepository.findById(request.getIdInvernaderoId())
                .orElseThrow(() -> new ResourceNotFoundException("Invernadero", "id", request.getIdInvernaderoId()));
            entity.setIdInvernadero(inv);
        }
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private ZonaResponse convertToResponse(Zona entity) {
        ZonaResponse response = new ZonaResponse();
        response.setIdZona(entity.getIdZona());
        response.setNombreZona(entity.getNombreZona());
        response.setAreaM2(entity.getAreaM2());
        response.setDescripcion(entity.getDescripcion());
        if (entity.getIdInvernadero() != null) {
            response.setIdInvernaderoId(entity.getIdInvernadero().getIdInvernadero());
        }
        return response;
    }
}
