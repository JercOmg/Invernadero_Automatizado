package com.invernadero.invernadero_backend.riego.application.dto;

import jakarta.validation.constraints.*;
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
 * DTO para crear/actualizar Riego
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiegoRequest {
    
    @NotNull(message = "El campo id_zona es obligatorio")
    private Integer idZonaId;


    private Integer idUsuarioId;

    @NotNull(message = "El campo fecha_hora es obligatorio")
    private LocalDateTime fechaHora;

    @NotNull(message = "El campo duracion_min es obligatorio")
    private Integer duracionMin;


    private BigDecimal volumenLitros;

    @NotBlank(message = "El campo tipo es obligatorio")
    @Size(max = 20, message = "El campo tipo no puede exceder 20 caracteres")
    private String tipo;


    private String observaciones;

}
