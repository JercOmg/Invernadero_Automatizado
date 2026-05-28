/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: RiegoService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para RiegoService
 */
package com.invernadero.invernadero_backend.riego.application.service;

import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import com.invernadero.invernadero_backend.zona.domain.repository.ZonaRepository;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.auth.domain.repository.UsuarioRepository;
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
    private final ZonaRepository zonaRepository;
    private final UsuarioRepository usuarioRepository;
    
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
        entity.setFechaHora(request.getFechaHora());
        entity.setDuracionMin(request.getDuracionMin());
        entity.setVolumenLitros(request.getVolumenLitros());
        if (request.getTipo() != null) {
            entity.setTipo(Riego.Tipo.valueOf(request.getTipo()));
        }
        entity.setObservaciones(request.getObservaciones());
        if (request.getIdZonaId() != null) {
            Zona z = zonaRepository.findById(request.getIdZonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Zona", "id", request.getIdZonaId()));
            entity.setIdZona(z);
        }
        if (request.getIdUsuarioId() != null) {
            Usuario u = usuarioRepository.findById(request.getIdUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", request.getIdUsuarioId()));
            entity.setIdUsuario(u);
        }
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private RiegoResponse convertToResponse(Riego entity) {
        RiegoResponse response = new RiegoResponse();
        response.setIdRiego(entity.getIdRiego());
        response.setFechaHora(entity.getFechaHora());
        response.setDuracionMin(entity.getDuracionMin());
        response.setVolumenLitros(entity.getVolumenLitros());
        response.setTipo(entity.getTipo() != null ? entity.getTipo().name() : null);
        response.setObservaciones(entity.getObservaciones());
        if (entity.getIdZona() != null) {
            response.setIdZonaId(entity.getIdZona().getIdZona());
        }
        if (entity.getIdUsuario() != null) {
            response.setIdUsuarioId(entity.getIdUsuario().getIdUsuario());
        }
        return response;
    }
}
