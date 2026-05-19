/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: UsuarioRepository
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para UsuarioRepository
 */
package com.invernadero.invernadero_backend.auth.domain.repository;

import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad Usuario
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    /**
     * Busca un usuario por su email
     * 
     * @param email Email del usuario
     * @return Optional con el usuario si existe
     */
    Optional<Usuario> findByEmail(String email);
    
    /**
     * Verifica si existe un usuario con el email dado
     * 
     * @param email Email a verificar
     * @return true si existe, false en caso contrario
     */
    boolean existsByEmail(String email);
}
