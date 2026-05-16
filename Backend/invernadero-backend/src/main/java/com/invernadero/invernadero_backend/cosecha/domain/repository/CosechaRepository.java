package com.invernadero.invernadero_backend.cosecha.domain.repository;

import com.invernadero.invernadero_backend.cosecha.domain.model.Cosecha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Cosecha
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface CosechaRepository extends JpaRepository<Cosecha, Integer> {
    
}
