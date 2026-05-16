package com.invernadero.invernadero_backend.riego.domain.repository;

import com.invernadero.invernadero_backend.riego.domain.model.Riego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Riego
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface RiegoRepository extends JpaRepository<Riego, Integer> {
    
}
