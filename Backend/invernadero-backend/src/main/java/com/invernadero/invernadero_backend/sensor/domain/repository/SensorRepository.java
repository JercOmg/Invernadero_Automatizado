/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: SensorRepository
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para SensorRepository
 */
package com.invernadero.invernadero_backend.sensor.domain.repository;

import com.invernadero.invernadero_backend.sensor.domain.model.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Sensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface SensorRepository extends JpaRepository<Sensor, Integer> {
    
}
