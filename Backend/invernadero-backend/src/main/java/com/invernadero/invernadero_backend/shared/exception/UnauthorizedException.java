/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: UnauthorizedException
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para UnauthorizedException
 */
package com.invernadero.invernadero_backend.shared.exception;

/**
 * Excepcion lanzada cuando hay un error de autenticacion o autorizacion
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
