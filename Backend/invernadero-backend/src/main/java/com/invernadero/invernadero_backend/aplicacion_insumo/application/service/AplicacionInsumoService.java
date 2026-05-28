/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AplicacionInsumoService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AplicacionInsumoService
 */
package com.invernadero.invernadero_backend.aplicacion_insumo.application.service;

import com.invernadero.invernadero_backend.insumo.domain.model.Insumo;
import com.invernadero.invernadero_backend.insumo.domain.repository.InsumoRepository;
import com.invernadero.invernadero_backend.siembra.domain.model.Siembra;
import com.invernadero.invernadero_backend.siembra.domain.repository.SiembraRepository;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import com.invernadero.invernadero_backend.zona.domain.repository.ZonaRepository;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.auth.domain.repository.UsuarioRepository;
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
        entity.setFechaHora(request.getFechaHora());
        entity.setCantidad(request.getCantidad());
        if (request.getMetodo() != null) {
            entity.setMetodo(AplicacionInsumo.Metodo.valueOf(request.getMetodo()));
        }
        entity.setObservaciones(request.getObservaciones());
        if (request.getIdInsumoId() != null) {
            Insumo ins = insumoRepository.findById(request.getIdInsumoId())
                .orElseThrow(() -> new ResourceNotFoundException("Insumo", "id", request.getIdInsumoId()));
            entity.setIdInsumo(ins);
        }
        if (request.getIdSiembraId() != null) {
            Siembra s = siembraRepository.findById(request.getIdSiembraId())
                .orElseThrow(() -> new ResourceNotFoundException("Siembra", "id", request.getIdSiembraId()));
            entity.setIdSiembra(s);
        }
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
        private AplicacionInsumoResponse convertToResponse(AplicacionInsumo entity) {
        AplicacionInsumoResponse response = new AplicacionInsumoResponse();
        response.setIdAplicacion(entity.getIdAplicacion());
        response.setFechaHora(entity.getFechaHora());
        response.setCantidad(entity.getCantidad());
        response.setMetodo(entity.getMetodo() != null ? entity.getMetodo().name() : null);
        response.setObservaciones(entity.getObservaciones());
        if (entity.getIdInsumo() != null) {
            response.setIdInsumoId(entity.getIdInsumo().getIdInsumo());
        }
        if (entity.getIdSiembra() != null) {
            response.setIdSiembraId(entity.getIdSiembra().getIdSiembra());
        }
        if (entity.getIdZona() != null) {
            response.setIdZonaId(entity.getIdZona().getIdZona());
        }
        if (entity.getIdUsuario() != null) {
            response.setIdUsuarioId(entity.getIdUsuario().getIdUsuario());
        }
        return response;
    }
}
