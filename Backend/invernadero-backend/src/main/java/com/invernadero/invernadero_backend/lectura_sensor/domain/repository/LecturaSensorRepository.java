package com.invernadero.invernadero_backend.lectura_sensor.domain.repository;

import com.invernadero.invernadero_backend.lectura_sensor.domain.model.LecturaSensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad LecturaSensor
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface LecturaSensorRepository extends JpaRepository<LecturaSensor, Integer> {
    
}
