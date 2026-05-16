package com.invernadero.invernadero_backend.siembra.domain.repository;

import com.invernadero.invernadero_backend.siembra.domain.model.Siembra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Siembra
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface SiembraRepository extends JpaRepository<Siembra, Integer> {
    
}
