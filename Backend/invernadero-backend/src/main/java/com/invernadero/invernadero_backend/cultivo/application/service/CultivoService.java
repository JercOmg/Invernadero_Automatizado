/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: CultivoService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para CultivoService
 */
package com.invernadero.invernadero_backend.cultivo.application.service;

import com.invernadero.invernadero_backend.cultivo.application.dto.CultivoRequest;
import com.invernadero.invernadero_backend.cultivo.application.dto.CultivoResponse;
import com.invernadero.invernadero_backend.cultivo.domain.model.Cultivo;
import com.invernadero.invernadero_backend.cultivo.domain.repository.CultivoRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Cultivo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class CultivoService {
    
    private final CultivoRepository cultivoRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<CultivoResponse> findAll(Pageable pageable) {
        return cultivoRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public CultivoResponse findById(Integer id) {
        Cultivo entity = cultivoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cultivo", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public CultivoResponse create(CultivoRequest request) {
        Cultivo entity = convertToEntity(request);
        entity = cultivoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public CultivoResponse update(Integer id, CultivoRequest request) {
        Cultivo entity = cultivoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cultivo", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = cultivoRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!cultivoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cultivo", "id", id);
        }
        cultivoRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Cultivo convertToEntity(CultivoRequest request) {
        Cultivo entity = new Cultivo();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest(Cultivo entity, CultivoRequest request) {
        entity.setNombreComun(request.getNombreComun());
        entity.setNombreCientifico(request.getNombreCientifico());
        if (request.getTipo() != null) {
            entity.setTipo(Cultivo.Tipo.valueOf(request.getTipo()));
        }
        entity.setTempMinC(request.getTempMinC());
        entity.setTempMaxC(request.getTempMaxC());
        entity.setHumedadMinPct(request.getHumedadMinPct());
        entity.setHumedadMaxPct(request.getHumedadMaxPct());
        entity.setDiasCiclo(request.getDiasCiclo());
        entity.setDescripcion(request.getDescripcion());
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private CultivoResponse convertToResponse(Cultivo entity) {
        CultivoResponse response = new CultivoResponse();
        response.setIdCultivo(entity.getIdCultivo());
        response.setNombreComun(entity.getNombreComun());
        response.setNombreCientifico(entity.getNombreCientifico());
        response.setTipo(entity.getTipo() != null ? entity.getTipo().name() : null);
        response.setTempMinC(entity.getTempMinC());
        response.setTempMaxC(entity.getTempMaxC());
        response.setHumedadMinPct(entity.getHumedadMinPct());
        response.setHumedadMaxPct(entity.getHumedadMaxPct());
        response.setDiasCiclo(entity.getDiasCiclo());
        response.setDescripcion(entity.getDescripcion());
        return response;
    }
}
