package com.invernadero.invernadero_backend.cultivo.domain.repository;

import com.invernadero.invernadero_backend.cultivo.domain.model.Cultivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Cultivo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface CultivoRepository extends JpaRepository<Cultivo, Integer> {
    
}
