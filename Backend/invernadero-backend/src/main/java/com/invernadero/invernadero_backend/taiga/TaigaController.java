package com.invernadero.invernadero_backend.taiga;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: TaigaController
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: API Controller para integracion con Taiga
 */
@RestController
@RequestMapping("/taiga")
@Tag(name = "Taiga Integration", description = "Endpoints para la integracion con Taiga (Sprint actual e historias)")
public class TaigaController {

    @Autowired
    private TaigaService taigaService;

    @GetMapping("/sprint-actual")
    @Operation(summary = "Obtiene las historias de usuario del sprint activo")
    public ResponseEntity<Object> getCurrentSprint() {
        try {
            Object sprint = taigaService.getCurrentSprint();
            if (sprint == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(sprint);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/historia/{id}/criterios")
    @Operation(summary = "Obtiene los criterios de aceptacion de una historia de usuario")
    public ResponseEntity<Object> getStoryCriteria(@PathVariable String id) {
        try {
            Object criteria = taigaService.getStoryCriteria(id);
            if (criteria == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(criteria);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
