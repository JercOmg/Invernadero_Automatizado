package com.invernadero.invernadero_backend.insumo.domain.repository;

import com.invernadero.invernadero_backend.insumo.domain.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Insumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Integer> {
    
}
