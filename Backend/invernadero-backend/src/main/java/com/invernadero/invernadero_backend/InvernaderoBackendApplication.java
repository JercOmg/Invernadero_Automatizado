/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: InvernaderoBackendApplication
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Clase para InvernaderoBackendApplication
 */
package com.invernadero.invernadero_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;

/**
 * Clase principal de la aplicacion Spring Boot
 * Sistema de Gestion de Invernadero Automatizado
 * 
 * @author Invernadero Team
 * @version 1.0.0
 * @since 2026-05-15
 */
@SpringBootApplication
@EnableJpaAuditing
public class InvernaderoBackendApplication {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods}")
    private String allowedMethods;

    @Value("${cors.allowed-headers}")
    private String allowedHeaders;

    @Value("${cors.allow-credentials}")
    private boolean allowCredentials;

    @Value("${cors.max-age}")
    private long maxAge;

    public static void main(String[] args) {
        SpringApplication.run(InvernaderoBackendApplication.class, args);
    }

    /**
     * Configuracion global de CORS para permitir peticiones desde el frontend
     * 
     * @return WebMvcConfigurer con la configuracion de CORS
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins.split(","))
                        .allowedMethods(allowedMethods.split(","))
                        .allowedHeaders(allowedHeaders.split(","))
                        .allowCredentials(allowCredentials)
                        .maxAge(maxAge);
            }
        };
    }
}
