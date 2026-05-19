/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: BusinessException
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para BusinessException
 */
package com.invernadero.invernadero_backend.shared.exception;

/**
 * Excepcion lanzada cuando hay un conflicto con el estado actual del recurso
 * Por ejemplo: intentar crear un recurso que ya existe
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
public class BusinessException extends RuntimeException {
    
    private String errorCode;
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}
