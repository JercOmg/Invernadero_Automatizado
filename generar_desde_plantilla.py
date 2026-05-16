#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar automaticamente modulos Spring Boot desde el modelo JSON
Genera: Entidades JPA, Repositorios, Servicios, DTOs y Controladores REST

Autor: Invernadero Team
Version: 1.0.0
Fecha: 2026-05-15
"""

import json
import os
from pathlib import Path
from datetime import datetime

# Configuracion de rutas
BASE_DIR = Path(__file__).parent
JSON_PATH = BASE_DIR / "Base de Datos" / "base_datos_invernadero.json"
BACKEND_DIR = BASE_DIR / "Backend" / "invernadero-backend" / "src" / "main" / "java" / "com" / "invernadero" / "invernadero_backend"

# Mapeo de tipos SQL a tipos Java
TIPO_JAVA_MAP = {
    "INT": "Integer",
    "BIGINT": "Long",
    "VARCHAR": "String",
    "TEXT": "String",
    "DATE": "LocalDate",
    "DATETIME": "LocalDateTime",
    "TIMESTAMP": "LocalDateTime",
    "BOOLEAN": "Boolean",
    "DECIMAL": "BigDecimal",
    "FLOAT": "Float",
    "DOUBLE": "Double"
}

def cargar_modelo_json():
    """Carga el modelo JSON desde el archivo"""
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def obtener_tipo_java(tipo_sql):
    """Convierte un tipo SQL a su equivalente en Java"""
    # Extraer el tipo base (sin parametros como VARCHAR(100))
    tipo_base = tipo_sql.split('(')[0].upper()
    return TIPO_JAVA_MAP.get(tipo_base, "String")

def capitalizar(texto):
    """Capitaliza la primera letra de un texto"""
    return texto[0].upper() + texto[1:] if texto else texto

def snake_to_camel(snake_str):
    """Convierte snake_case a camelCase"""
    components = snake_str.split('_')
    return components[0] + ''.join(capitalizar(x) for x in components[1:])

def snake_to_pascal(snake_str):
    """Convierte snake_case a PascalCase"""
    components = snake_str.split('_')
    return ''.join(capitalizar(x) for x in components)

def obtener_nombre_campo_java(nombre_campo):
    """Obtiene el nombre del campo en formato Java"""
    return snake_to_camel(nombre_campo)

def obtener_imports_necesarios(campos):
    """Determina los imports necesarios basandose en los tipos de campos"""
    imports = set()
    
    for campo_info in campos.values():
        tipo_sql = campo_info['tipo']
        tipo_java = obtener_tipo_java(tipo_sql)
        
        if tipo_java == "LocalDate":
            imports.add("import java.time.LocalDate;")
        elif tipo_java == "LocalDateTime":
            imports.add("import java.time.LocalDateTime;")
        elif tipo_java == "BigDecimal":
            imports.add("import java.math.BigDecimal;")
        
        if campo_info.get('fk'):
            imports.add("import jakarta.persistence.ManyToOne;")
            imports.add("import jakarta.persistence.JoinColumn;")
            # Agregar import de la clase referenciada
            tabla_ref = campo_info['fk'].split('.')[0]
            clase_ref = snake_to_pascal(tabla_ref)
            # Casos especiales para auth
            if tabla_ref == 'usuario':
                imports.add("import com.invernadero.invernadero_backend.auth.domain.model.Usuario;")
            else:
                imports.add(f"import com.invernadero.invernadero_backend.{tabla_ref}.domain.model.{clase_ref};")
    
    return sorted(list(imports))

def generar_entidad(nombre_tabla, info_tabla):
    """Genera la clase de entidad JPA"""
    nombre_clase = snake_to_pascal(nombre_tabla)
    campos = info_tabla['campos']
    
    # Encontrar la clave primaria
    pk_field = None
    for campo_nombre, campo_info in campos.items():
        if campo_info.get('pk'):
            pk_field = campo_nombre
            break
    
    # Imports necesarios
    imports = obtener_imports_necesarios(campos)
    imports_str = '\n'.join(imports)
    
    # Generar campos de la entidad
    campos_codigo = []
    for campo_nombre, campo_info in campos.items():
        tipo_java = obtener_tipo_java(campo_info['tipo'])
        nombre_java = obtener_nombre_campo_java(campo_nombre)
        
        # Anotaciones del campo
        anotaciones = []
        
        if campo_info.get('pk'):
            anotaciones.append("    @Id")
            if campo_info.get('autoincrement'):
                anotaciones.append("    @GeneratedValue(strategy = GenerationType.IDENTITY)")
        
        # Relaciones FK (antes de @Column para evitar duplicados)
        if campo_info.get('fk'):
            tabla_ref, campo_ref = campo_info['fk'].split('.')
            clase_ref = snake_to_pascal(tabla_ref)
            # Determinar si es nullable (por defecto True si no se especifica)
            es_nullable = campo_info.get('nullable', True)
            anotaciones.append("    @ManyToOne")
            anotaciones.append(f'    @JoinColumn(name = "{campo_nombre}", referencedColumnName = "{campo_ref}", nullable = {str(es_nullable).lower()})')
            tipo_java = clase_ref
        else:
            # Columna (solo si NO es FK)
            col_attrs = [f'name = "{campo_nombre}"']
            if not campo_info.get('nullable', True):
                col_attrs.append('nullable = false')
            if campo_info.get('unique'):
                col_attrs.append('unique = true')
            
            # Longitud para strings
            if 'VARCHAR' in campo_info['tipo']:
                longitud = campo_info['tipo'].split('(')[1].split(')')[0]
                col_attrs.append(f'length = {longitud}')
            
            anotaciones.append(f"    @Column({', '.join(col_attrs)})")
        
        # Enums (cambiar tipo a enum)
        if campo_info.get('valores'):
            anotaciones.append("    @Enumerated(EnumType.STRING)")
            tipo_java = snake_to_pascal(campo_nombre)
        
        campos_codigo.append('\n'.join(anotaciones))
        campos_codigo.append(f"    private {tipo_java} {nombre_java};")
        campos_codigo.append("")
    
    campos_str = '\n'.join(campos_codigo)
    
    # Generar enums si existen
    enums_codigo = []
    for campo_nombre, campo_info in campos.items():
        if campo_info.get('valores'):
            nombre_enum = snake_to_pascal(campo_nombre)
            valores_enum = ', '.join(campo_info['valores'])
            enums_codigo.append(f"""    /**
     * Enum para {campo_nombre}
     */
    public enum {nombre_enum} {{
        {valores_enum}
    }}""")
    
    enums_str = '\n\n'.join(enums_codigo) if enums_codigo else ""
    
    codigo = f"""package com.invernadero.invernadero_backend.{nombre_tabla}.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
{imports_str}

/**
 * Entidad {nombre_clase} - {info_tabla['descripcion']}
 * Tabla: {nombre_tabla}
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Entity
@Table(name = "{nombre_tabla}")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class {nombre_clase} {{
    
{campos_str}
{enums_str}
}}
"""
    return codigo

def generar_repositorio(nombre_tabla):
    """Genera la interfaz de repositorio JPA"""
    nombre_clase = snake_to_pascal(nombre_tabla)
    
    codigo = f"""package com.invernadero.invernadero_backend.{nombre_tabla}.domain.repository;

import com.invernadero.invernadero_backend.{nombre_tabla}.domain.model.{nombre_clase};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad {nombre_clase}
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Repository
public interface {nombre_clase}Repository extends JpaRepository<{nombre_clase}, Integer> {{
    
}}
"""
    return codigo

def generar_dto_request(nombre_tabla, info_tabla):
    """Genera el DTO para peticiones (crear/actualizar)"""
    nombre_clase = snake_to_pascal(nombre_tabla)
    campos = info_tabla['campos']
    
    imports = obtener_imports_necesarios(campos)
    imports_str = '\n'.join(imports)
    
    # Generar campos del DTO (excluir PK y campos autogenerados)
    campos_codigo = []
    for campo_nombre, campo_info in campos.items():
        if campo_info.get('pk') or campo_info.get('autoincrement'):
            continue
        
        tipo_java = obtener_tipo_java(campo_info['tipo'])
        nombre_java = obtener_nombre_campo_java(campo_nombre)
        
        # Validaciones
        validaciones = []
        if not campo_info.get('nullable', True):
            if tipo_java == "String":
                validaciones.append('    @NotBlank(message = "El campo ' + campo_nombre + ' es obligatorio")')
            else:
                validaciones.append('    @NotNull(message = "El campo ' + campo_nombre + ' es obligatorio")')
        
        if 'VARCHAR' in campo_info['tipo']:
            longitud = campo_info['tipo'].split('(')[1].split(')')[0]
            validaciones.append(f'    @Size(max = {longitud}, message = "El campo {campo_nombre} no puede exceder {longitud} caracteres")')
        
        if campo_info.get('fk'):
            tipo_java = "Integer"
            nombre_java = nombre_java.replace("Id", "") + "Id"
        
        campos_codigo.append('\n'.join(validaciones))
        campos_codigo.append(f"    private {tipo_java} {nombre_java};")
        campos_codigo.append("")
    
    campos_str = '\n'.join(campos_codigo)
    
    codigo = f"""package com.invernadero.invernadero_backend.{nombre_tabla}.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
{imports_str}

/**
 * DTO para crear/actualizar {nombre_clase}
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class {nombre_clase}Request {{
    
{campos_str}
}}
"""
    return codigo

def generar_dto_response(nombre_tabla, info_tabla):
    """Genera el DTO para respuestas"""
    nombre_clase = snake_to_pascal(nombre_tabla)
    campos = info_tabla['campos']
    
    imports = obtener_imports_necesarios(campos)
    imports_str = '\n'.join(imports)
    
    # Generar todos los campos
    campos_codigo = []
    for campo_nombre, campo_info in campos.items():
        tipo_java = obtener_tipo_java(campo_info['tipo'])
        nombre_java = obtener_nombre_campo_java(campo_nombre)
        
        if campo_info.get('fk'):
            tipo_java = "Integer"
            nombre_java = nombre_java.replace("Id", "") + "Id"
        
        campos_codigo.append(f"    private {tipo_java} {nombre_java};")
    
    campos_str = '\n    '.join(campos_codigo)
    
    codigo = f"""package com.invernadero.invernadero_backend.{nombre_tabla}.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
{imports_str}

/**
 * DTO de respuesta para {nombre_clase}
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class {nombre_clase}Response {{
    
    {campos_str}
}}
"""
    return codigo

def generar_servicio(nombre_tabla, info_tabla):
    """Genera la clase de servicio con operaciones CRUD"""
    nombre_clase = snake_to_pascal(nombre_tabla)
    
    # Encontrar el nombre del campo PK
    pk_field = None
    for campo_nombre, campo_info in info_tabla['campos'].items():
        if campo_info.get('pk'):
            pk_field = obtener_nombre_campo_java(campo_nombre)
            break
    
    codigo = f"""package com.invernadero.invernadero_backend.{nombre_tabla}.application.service;

import com.invernadero.invernadero_backend.{nombre_tabla}.application.dto.{nombre_clase}Request;
import com.invernadero.invernadero_backend.{nombre_tabla}.application.dto.{nombre_clase}Response;
import com.invernadero.invernadero_backend.{nombre_tabla}.domain.model.{nombre_clase};
import com.invernadero.invernadero_backend.{nombre_tabla}.domain.repository.{nombre_clase}Repository;
import com.invernadero.invernadero_backend.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para operaciones CRUD de {nombre_clase}
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class {nombre_clase}Service {{
    
    private final {nombre_clase}Repository {nombre_tabla}Repository;
    
    /**
     * Obtiene todos los registros paginados
     */
    @Transactional(readOnly = true)
    public Page<{nombre_clase}Response> findAll(Pageable pageable) {{
        return {nombre_tabla}Repository.findAll(pageable)
                .map(this::convertToResponse);
    }}
    
    /**
     * Obtiene un registro por ID
     */
    @Transactional(readOnly = true)
    public {nombre_clase}Response findById(Integer id) {{
        {nombre_clase} entity = {nombre_tabla}Repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("{nombre_clase}", "id", id));
        return convertToResponse(entity);
    }}
    
    /**
     * Crea un nuevo registro
     */
    @Transactional
    public {nombre_clase}Response create({nombre_clase}Request request) {{
        {nombre_clase} entity = convertToEntity(request);
        entity = {nombre_tabla}Repository.save(entity);
        return convertToResponse(entity);
    }}
    
    /**
     * Actualiza un registro existente
     */
    @Transactional
    public {nombre_clase}Response update(Integer id, {nombre_clase}Request request) {{
        {nombre_clase} entity = {nombre_tabla}Repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("{nombre_clase}", "id", id));
        
        updateEntityFromRequest(entity, request);
        entity = {nombre_tabla}Repository.save(entity);
        return convertToResponse(entity);
    }}
    
    /**
     * Elimina un registro por ID
     */
    @Transactional
    public void delete(Integer id) {{
        if (!{nombre_tabla}Repository.existsById(id)) {{
            throw new ResourceNotFoundException("{nombre_clase}", "id", id);
        }}
        {nombre_tabla}Repository.deleteById(id);
    }}
    
    /**
     * Convierte Request DTO a Entidad
     */
    private {nombre_clase} convertToEntity({nombre_clase}Request request) {{
        {nombre_clase} entity = new {nombre_clase}();
        updateEntityFromRequest(entity, request);
        return entity;
    }}
    
    /**
     * Actualiza una entidad desde un Request DTO
     */
    private void updateEntityFromRequest({nombre_clase} entity, {nombre_clase}Request request) {{
        // TODO: Implementar mapeo de campos desde request a entity
        // Usar BeanUtils.copyProperties o mapeo manual
    }}
    
    /**
     * Convierte Entidad a Response DTO
     */
    private {nombre_clase}Response convertToResponse({nombre_clase} entity) {{
        {nombre_clase}Response response = new {nombre_clase}Response();
        // TODO: Implementar mapeo de campos desde entity a response
        // Usar BeanUtils.copyProperties o mapeo manual
        return response;
    }}
}}
"""
    return codigo

def generar_controlador(nombre_tabla):
    """Genera el controlador REST"""
    nombre_clase = snake_to_pascal(nombre_tabla)
    
    codigo = f"""package com.invernadero.invernadero_backend.{nombre_tabla}.infrastructure.rest;

import com.invernadero.invernadero_backend.{nombre_tabla}.application.dto.{nombre_clase}Request;
import com.invernadero.invernadero_backend.{nombre_tabla}.application.dto.{nombre_clase}Response;
import com.invernadero.invernadero_backend.{nombre_tabla}.application.service.{nombre_clase}Service;
import com.invernadero.invernadero_backend.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para {nombre_clase}
 * Endpoints: /api/{nombre_tabla}/*
 * 
 * @author Invernadero Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/{nombre_tabla}")
@RequiredArgsConstructor
@Tag(name = "{nombre_clase}", description = "Endpoints para gestion de {nombre_tabla}")
public class {nombre_clase}Controller {{
    
    private final {nombre_clase}Service {nombre_tabla}Service;
    
    /**
     * Obtiene todos los registros paginados
     * GET /api/{nombre_tabla}
     */
    @GetMapping
    @Operation(summary = "Listar {nombre_tabla}", description = "Obtiene todos los registros de {nombre_tabla} paginados")
    public ResponseEntity<Page<{nombre_clase}Response>> findAll(Pageable pageable) {{
        Page<{nombre_clase}Response> page = {nombre_tabla}Service.findAll(pageable);
        return ResponseEntity.ok(page);
    }}
    
    /**
     * Obtiene un registro por ID
     * GET /api/{nombre_tabla}/{{id}}
     */
    @GetMapping("/{{id}}")
    @Operation(summary = "Obtener {nombre_tabla} por ID", description = "Obtiene un registro de {nombre_tabla} por su ID")
    public ResponseEntity<{nombre_clase}Response> findById(@PathVariable Integer id) {{
        {nombre_clase}Response response = {nombre_tabla}Service.findById(id);
        return ResponseEntity.ok(response);
    }}
    
    /**
     * Crea un nuevo registro
     * POST /api/{nombre_tabla}
     */
    @PostMapping
    @Operation(summary = "Crear {nombre_tabla}", description = "Crea un nuevo registro de {nombre_tabla}")
    public ResponseEntity<{nombre_clase}Response> create(@Valid @RequestBody {nombre_clase}Request request) {{
        {nombre_clase}Response response = {nombre_tabla}Service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }}
    
    /**
     * Actualiza un registro existente
     * PUT /api/{nombre_tabla}/{{id}}
     */
    @PutMapping("/{{id}}")
    @Operation(summary = "Actualizar {nombre_tabla}", description = "Actualiza un registro existente de {nombre_tabla}")
    public ResponseEntity<{nombre_clase}Response> update(
            @PathVariable Integer id,
            @Valid @RequestBody {nombre_clase}Request request) {{
        {nombre_clase}Response response = {nombre_tabla}Service.update(id, request);
        return ResponseEntity.ok(response);
    }}
    
    /**
     * Elimina un registro por ID
     * DELETE /api/{nombre_tabla}/{{id}}
     */
    @DeleteMapping("/{{id}}")
    @Operation(summary = "Eliminar {nombre_tabla}", description = "Elimina un registro de {nombre_tabla} por su ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {{
        {nombre_tabla}Service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Registro eliminado exitosamente"));
    }}
}}
"""
    return codigo

def crear_directorios_modulo(nombre_tabla):
    """Crea la estructura de directorios para un modulo"""
    modulo_dir = BACKEND_DIR / nombre_tabla
    
    directorios = [
        modulo_dir / "domain" / "model",
        modulo_dir / "domain" / "repository",
        modulo_dir / "application" / "service",
        modulo_dir / "application" / "dto",
        modulo_dir / "infrastructure" / "rest"
    ]
    
    for directorio in directorios:
        directorio.mkdir(parents=True, exist_ok=True)
    
    return modulo_dir

def generar_modulo_completo(nombre_tabla, info_tabla):
    """Genera todos los archivos de un modulo"""
    print(f"Generando modulo: {nombre_tabla}...")
    
    # Crear directorios
    modulo_dir = crear_directorios_modulo(nombre_tabla)
    nombre_clase = snake_to_pascal(nombre_tabla)
    
    # Generar y guardar archivos
    archivos = {
        f"domain/model/{nombre_clase}.java": generar_entidad(nombre_tabla, info_tabla),
        f"domain/repository/{nombre_clase}Repository.java": generar_repositorio(nombre_tabla),
        f"application/dto/{nombre_clase}Request.java": generar_dto_request(nombre_tabla, info_tabla),
        f"application/dto/{nombre_clase}Response.java": generar_dto_response(nombre_tabla, info_tabla),
        f"application/service/{nombre_clase}Service.java": generar_servicio(nombre_tabla, info_tabla),
        f"infrastructure/rest/{nombre_clase}Controller.java": generar_controlador(nombre_tabla)
    }
    
    for ruta_relativa, contenido in archivos.items():
        ruta_completa = modulo_dir / ruta_relativa
        with open(ruta_completa, 'w', encoding='utf-8') as f:
            f.write(contenido)
    
    print(f"  ✓ Modulo {nombre_tabla} generado exitosamente")

def main():
    """Funcion principal"""
    print("=" * 80)
    print("GENERADOR DE MODULOS SPRING BOOT DESDE JSON")
    print("=" * 80)
    print()
    
    # Cargar modelo JSON
    print("Cargando modelo JSON...")
    modelo = cargar_modelo_json()
    tablas = modelo['tablas']
    
    # Excluir la tabla usuario (ya fue creada manualmente)
    tablas_a_generar = {k: v for k, v in tablas.items() if k != 'usuario'}
    
    print(f"Tablas a generar: {len(tablas_a_generar)}")
    print()
    
    # Generar cada modulo
    for nombre_tabla, info_tabla in tablas_a_generar.items():
        try:
            generar_modulo_completo(nombre_tabla, info_tabla)
        except Exception as e:
            print(f"  ✗ Error generando {nombre_tabla}: {str(e)}")
    
    print()
    print("=" * 80)
    print("GENERACION COMPLETADA")
    print("=" * 80)
    print()
    print(f"Total de modulos generados: {len(tablas_a_generar)}")
    print(f"Ubicacion: {BACKEND_DIR}")

if __name__ == "__main__":
    main()
