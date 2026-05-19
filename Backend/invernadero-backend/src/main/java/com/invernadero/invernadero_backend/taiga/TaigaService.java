package com.invernadero.invernadero_backend.taiga;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: TaigaService
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Servicio para integracion con la API de Taiga
 */
@Service
public class TaigaService {

    @Value("${taiga.api.url}")
    private String taigaApiUrl;

    @Value("${taiga.api.token}")
    private String taigaToken;

    @Value("${taiga.project.id}")
    private String taigaProjectId;

    private final RestTemplate restTemplate;

    public TaigaService() {
        this.restTemplate = new RestTemplate();
    }

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + taigaToken);
        headers.set("Content-Type", "application/json");
        return headers;
    }

    public Object getCurrentSprint() {
        // 1. Obtener los milestones (sprints) del proyecto
        String milestonesUrl = taigaApiUrl + "/milestones?project=" + taigaProjectId;
        HttpEntity<String> entity = new HttpEntity<>(getHeaders());
        
        ResponseEntity<List> response = restTemplate.exchange(
            milestonesUrl,
            HttpMethod.GET,
            entity,
            List.class
        );
        
        List milestones = response.getBody();
        if (milestones == null || milestones.isEmpty()) {
            return null;
        }

        // 2. Buscar el sprint activo (el que no esta cerrado)
        Map activeSprint = null;
        for (Object obj : milestones) {
            Map milestone = (Map) obj;
            if (Boolean.FALSE.equals(milestone.get("closed"))) {
                activeSprint = milestone;
                break;
            }
        }
        
        if (activeSprint == null) {
            return null;
        }

        // 3. Traer las user stories de ese sprint
        String sprintId = String.valueOf(activeSprint.get("id"));
        String storiesUrl = taigaApiUrl + "/userstories?milestone=" + sprintId;
        
        ResponseEntity<List> storiesResponse = restTemplate.exchange(
            storiesUrl,
            HttpMethod.GET,
            entity,
            List.class
        );
        
        activeSprint.put("user_stories", storiesResponse.getBody());
        return activeSprint;
    }

    public Object getStoryCriteria(String storyId) {
        // En Taiga, los criterios de aceptacion suelen ir en la descripcion o atributos personalizados.
        // Aqui traemos el detalle de la user story.
        String storyUrl = taigaApiUrl + "/userstories/" + storyId;
        HttpEntity<String> entity = new HttpEntity<>(getHeaders());
        
        ResponseEntity<Map> response = restTemplate.exchange(
            storyUrl,
            HttpMethod.GET,
            entity,
            Map.class
        );
        
        Map story = response.getBody();
        if (story == null) return null;
        
        return Map.of(
            "id", story.get("id"),
            "ref", story.get("ref"),
            "subject", story.get("subject"),
            "description", story.get("description"),
            "status_extra_info", story.get("status_extra_info")
        );
    }
}
