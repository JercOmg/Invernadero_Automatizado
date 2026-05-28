/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AlertaService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AlertaService
 */
package com.invernadero.invernadero_backend.alerta.application.service;

import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import com.invernadero.invernadero_backend.sensor.domain.repository.SensorRepository;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import com.invernadero.invernadero_backend.zona.domain.repository.ZonaRepository;
import com.invernadero.invernadero_backend.alerta.application.dto.AlertaRequest;
import com.invernadero.invernadero_backend.alerta.application.dto.AlertaResponse;
import com.invernadero.invernadero_backend.alerta.domain.model.Alerta;
import com.invernadero.invernadero_backend.alerta.domain.repository.AlertaRepository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de Alerta
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class AlertaService {
    
    private final AlertaRepository alertaRepository;
    private final SensorRepository sensorRepository;
    private final ZonaRepository zonaRepository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<AlertaResponse> findAll(Pageable pageable) {
        return alertaRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public AlertaResponse findById(Integer id) {
        Alerta entity = alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", "id", id));
        return convertToResponse(entity);
    }
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public AlertaResponse create(AlertaRequest request) {
        Alerta entity = convertToEntity(request);
        entity = alertaRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public AlertaResponse update(Integer id, AlertaRequest request) {
        Alerta entity = alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = alertaRepository.save(entity);
        return convertToResponse(entity);
    }
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {
        if (!alertaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Alerta", "id", id);
        }
        alertaRepository.deleteById(id);
    }
    
    /**
     * Convierte Request DTO a Entidad
     */
    private Alerta convertToEntity(AlertaRequest request) {
        Alerta entity = new Alerta();
        updateEntityFromRequest(entity, request);
        return entity;
    }
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
        private void updateEntityFromRequest(Alerta entity, AlertaRequest request) {
        entity.setFechaHora(request.getFechaHora());
        if (request.getTipoAlerta() != null) {
            entity.setTipoAlerta(Alerta.TipoAlerta.valueOf(request.getTipoAlerta()));
        }
        entity.setMensaje(request.getMensaje());
        if (request.getLeida() != null) {
            entity.setLeida(request.getLeida());
        }
        if (request.getIdSensorId() != null) {
            Sensor s = sensorRepository.findById(request.getIdSensorId())
                .orElseThrow(() -> new ResourceNotFoundException("Sensor", "id", request.getIdSensorId()));
            entity.setIdSensor(s);
        }
        if (request.getIdZonaId() != null) {
            Zona z = zonaRepository.findById(request.getIdZonaId())
                .orElseThrow(() -> new ResourceNotFoundException("Zona", "id", request.getIdZonaId()));
            entity.setIdZona(z);
        }
    }
    
    /**
     * Convierte Entidad a Response DTO
     */
        private AlertaResponse convertToResponse(Alerta entity) {
        AlertaResponse response = new AlertaResponse();
        response.setIdAlerta(entity.getIdAlerta());
        response.setFechaHora(entity.getFechaHora());
        response.setTipoAlerta(entity.getTipoAlerta() != null ? entity.getTipoAlerta().name() : null);
        response.setMensaje(entity.getMensaje());
        response.setLeida(entity.getLeida());
        if (entity.getIdSensor() != null) {
            response.setIdSensorId(entity.getIdSensor().getIdSensor());
        }
        if (entity.getIdZona() != null) {
            response.setIdZonaId(entity.getIdZona().getIdZona());
        }
        return response;
    }
}
