package com.invernadero.invernadero_backend.taiga;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
        // Usamos JdkClientHttpRequestFactory para dar soporte nativo a solicitudes PATCH en Java 17+
        this.restTemplate = new RestTemplate(new JdkClientHttpRequestFactory());
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
        
        // Traer las tareas asociadas a esta historia de usuario
        String tasksUrl = taigaApiUrl + "/tasks?user_story=" + storyId;
        List tasksList = List.of();
        try {
            ResponseEntity<List> tasksResponse = restTemplate.exchange(
                tasksUrl,
                HttpMethod.GET,
                entity,
                List.class
            );
            tasksList = tasksResponse.getBody() != null ? tasksResponse.getBody() : List.of();
        } catch (Exception e) {
            System.err.println("Error recuperando tareas de la historia: " + e.getMessage());
        }
        
        // Creamos un mapa mutable para armar el resultado
        Map<String, Object> result = new HashMap<>();
        result.put("id", story.get("id"));
        result.put("ref", story.get("ref"));
        result.put("subject", story.get("subject"));
        result.put("description", story.get("description"));
        result.put("status_extra_info", story.get("status_extra_info"));
        result.put("assigned_to_extra_info", story.get("assigned_to_extra_info"));
        result.put("tasks", tasksList);
        
        return result;
    }

    public Object getMembers() {
        String url = taigaApiUrl + "/memberships?project=" + taigaProjectId;
        HttpEntity<String> entity = new HttpEntity<>(getHeaders());
        
        ResponseEntity<List> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            List.class
        );
        return response.getBody();
    }

    public Object createUserStory(Map<String, Object> data) {
        String url = taigaApiUrl + "/userstories";
        
        // Aseguramos asociar el ID del proyecto
        data.put("project", Integer.parseInt(taigaProjectId));
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(data, getHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );
        return response.getBody();
    }

    public Object assignUserStory(String storyId, Map<String, Object> data) {
        String url = taigaApiUrl + "/userstories/" + storyId;
        
        // PATCH requiere enviar únicamente los campos que deseamos actualizar
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(data, getHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.PATCH,
            entity,
            Map.class
        );
        return response.getBody();
    }

    public Object createTask(Map<String, Object> data) {
        String url = taigaApiUrl + "/tasks";
        
        // Aseguramos asociar el ID del proyecto
        data.put("project", Integer.parseInt(taigaProjectId));
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(data, getHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );
        return response.getBody();
    }
}
