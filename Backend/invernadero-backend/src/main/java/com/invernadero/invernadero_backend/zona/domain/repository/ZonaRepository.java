package com.invernadero.invernadero_backend.zona.domain.repository;

import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Zona
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface ZonaRepository extends JpaRepository<Zona, Integer> {
    
}
