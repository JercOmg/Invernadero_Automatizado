package com.invernadero.invernadero_backend.aplicacion_insumo.domain.repository;

import com.invernadero.invernadero_backend.aplicacion_insumo.domain.model.AplicacionInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad AplicacionInsumo
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface AplicacionInsumoRepository extends JpaRepository<AplicacionInsumo, Integer> {
    
}
