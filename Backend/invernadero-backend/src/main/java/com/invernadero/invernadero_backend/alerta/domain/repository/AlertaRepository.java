/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: AlertaRepository
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para AlertaRepository
 */
package com.invernadero.invernadero_backend.alerta.domain.repository;

import com.invernadero.invernadero_backend.alerta.domain.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Alerta
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Integer> {
    
}
