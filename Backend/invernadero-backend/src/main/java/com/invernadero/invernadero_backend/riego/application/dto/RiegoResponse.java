package com.invernadero.invernadero_backend.riego.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.invernadero.invernadero_backend.auth.domain.model.Usuario;
import com.invernadero.invernadero_backend.zona.domain.model.Zona;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para Riego
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiegoResponse {
    
        private Integer idRiego;
        private Integer idZonaId;
        private Integer idUsuarioId;
        private LocalDateTime fechaHora;
        private Integer duracionMin;
        private BigDecimal volumenLitros;
        private String tipo;
        private String observaciones;
}
