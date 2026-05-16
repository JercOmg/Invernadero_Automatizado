package com.invernadero.invernadero_backend.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para respuestas paginadas
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {
    
    private List<T> content;
    
    private int pageNumber;
    
    private int pageSize;
    
    private long totalElements;
    
    private int totalPages;
    
    private boolean last;
    
    private boolean first;
}
