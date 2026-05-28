/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: SiembraService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para SiembraService
 */
package com.invernadero.invernadero_backend.siembra.application.service;

import com.invernadero.invernadero_backend.siembra.application.dto.SiembraRequest;
import com.invernadero.invernadero_backend.siembra.application.dto.SiembraResponse;
import com.invernadero.invernadero_backend.siembra.domain.model.Siembra;
import com.invernadero.invernadero_backend.siembra.domain.repository.SiembraRepository;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import com.invernadero.invernadero_backend.zona.domain.repository.ZonaRepository;
import com.invernadero.invernadero_backend.cultivo.domain.model.Cultivo;
import com.invernadero.invernadero_backend.cultivo.domain.repository.CultivoRepository;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.auth.domain.repository.UsuarioRepository;
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
    private final ZonaRepository zonaRepository;
    private final CultivoRepository cultivoRepository;
    private final UsuarioRepository usuarioRepository;
    
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
        entity.setFechaSiembra(request.getFechaSiembra());
        entity.setFechaCosechaEstimada(request.getFechaCosechaEstimada());
        entity.setCantidadPlantas(request.getCantidadPlantas());
        if (request.getEstado() != null) {
            entity.setEstado(Siembra.Estado.valueOf(request.getEstado()));
        }
        entity.setObservaciones(request.getObservaciones());

        if (request.getIdZonaId() != null) {
            Zona zona = zonaRepository.findById(request.getIdZonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Zona", "id", request.getIdZonaId()));
            entity.setIdZona(zona);
        }
        if (request.getIdCultivoId() != null) {
            Cultivo cultivo = cultivoRepository.findById(request.getIdCultivoId())
                .orElseThrow(() -> new ResourceNotFoundException("Cultivo", "id", request.getIdCultivoId()));
            entity.setIdCultivo(cultivo);
        }
        if (request.getIdUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(request.getIdUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", request.getIdUsuarioId()));
            entity.setIdUsuario(usuario);
        }
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
    private SiembraResponse convertToResponse(Siembra entity) {
        SiembraResponse response = new SiembraResponse();
        response.setIdSiembra(entity.getIdSiembra());
        response.setFechaSiembra(entity.getFechaSiembra());
        response.setFechaCosechaEstimada(entity.getFechaCosechaEstimada());
        response.setCantidadPlantas(entity.getCantidadPlantas());
        response.setEstado(entity.getEstado() != null ? entity.getEstado().name() : null);
        response.setObservaciones(entity.getObservaciones());

        if (entity.getIdZona() != null) {
            response.setIdZonaId(entity.getIdZona().getIdZona());
        }
        if (entity.getIdCultivo() != null) {
            response.setIdCultivoId(entity.getIdCultivo().getIdCultivo());
        }
        if (entity.getIdUsuario() != null) {
            response.setIdUsuarioId(entity.getIdUsuario().getIdUsuario());
        }
        return response;
    }
}
