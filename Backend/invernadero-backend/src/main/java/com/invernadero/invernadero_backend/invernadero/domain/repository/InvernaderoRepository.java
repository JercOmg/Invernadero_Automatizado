package com.invernadero.invernadero_backend.invernadero.domain.repository;

import com.invernadero.invernadero_backend.invernadero.domain.model.Invernadero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Invernadero
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface InvernaderoRepository extends JpaRepository<Invernadero, Integer> {
    
}
