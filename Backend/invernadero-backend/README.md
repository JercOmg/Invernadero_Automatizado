# Invernadero Backend - Spring Boot REST API

Sistema de Gestión de Invernadero Automatizado - Backend REST API

## 📋 Requisitos Previos

- **Java 17 o superior** (Detectado: Java 25.0.1 ✓)
- **Maven 3.6+** o usar el Maven Wrapper incluido
- **PostgreSQL 12+** para la base de datos

## 🚀 Instalación y Ejecución

### Opción 1: Con Maven instalado

```bash
# Compilar el proyecto
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

### Opción 2: Con Maven Wrapper (sin Maven instalado)

**Windows:**
```bash
# Primero instalar Maven desde: https://maven.apache.org/download.cgi
# O usar el wrapper después de descargar maven-wrapper.jar

.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw clean install
./mvnw spring-boot:run
```

## 🗄️ Configuración de Base de Datos

1. Crear la base de datos PostgreSQL:
```sql
CREATE DATABASE invernadero_db;
```

2. Ejecutar el script SQL generado:
```bash
psql -U postgres -d invernadero_db -f "../Base de Datos/crear_db_postgresql.sql"
```

3. Configurar credenciales en `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/invernadero_db
spring.datasource.username=postgres
spring.datasource.password=admin1234
```

## 📁 Estructura del Proyecto

```
invernadero-backend/
├── src/main/java/com/invernadero/invernadero_backend/
│   ├── InvernaderoBackendApplication.java    # Clase principal
│   ├── auth/                                   # Módulo de autenticación
│   │   ├── domain/model/                      # Entidad Usuario
│   │   ├── domain/repository/                 # UsuarioRepository
│   │   ├── application/service/               # AuthService
│   │   ├── application/dto/                   # DTOs de auth
│   │   └── infrastructure/
│   │       ├── rest/                          # AuthController
│   │       └── security/                      # JWT, SecurityConfig
│   ├── shared/                                # Clases compartidas
│   │   ├── exception/                         # Excepciones globales
│   │   └── dto/                               # DTOs base
│   ├── invernadero/                           # Módulo Invernadero
│   ├── zona/                                  # Módulo Zona
│   ├── cultivo/                               # Módulo Cultivo
│   ├── siembra/                               # Módulo Siembra
│   ├── sensor/                                # Módulo Sensor
│   ├── lectura_sensor/                        # Módulo Lectura Sensor
│   ├── riego/                                 # Módulo Riego
│   ├── alerta/                                # Módulo Alerta
│   ├── insumo/                                # Módulo Insumo
│   ├── aplicacion_insumo/                     # Módulo Aplicación Insumo
│   └── cosecha/                               # Módulo Cosecha
└── src/main/resources/
    ├── application.properties                 # Configuración principal
    ├── application-dev.properties             # Perfil desarrollo
    └── application-prod.properties            # Perfil producción
```

## 🔐 Autenticación y Seguridad

El sistema utiliza **JWT (JSON Web Tokens)** para autenticación:

### Endpoints Públicos (sin autenticación):
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/auth/health` - Health check

### Endpoints Protegidos:
Todos los demás endpoints requieren token JWT en el header:
```
Authorization: Bearer <token>
```

### Roles de Usuario:
- **ADMINISTRADOR** - Acceso completo (GET, POST, PUT, DELETE)
- **TECNICO** - Lectura, creación, actualización y eliminación
- **OPERARIO** - Lectura, creación y actualización
- **VISUALIZADOR** - Solo lectura (GET)

## 📚 Documentación API (Swagger)

Una vez iniciada la aplicación, acceder a:
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs JSON**: http://localhost:8080/api/api-docs

## 🔧 Configuración OAuth2 Google

Para habilitar login con Google, configurar en `application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=TU_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=TU_GOOGLE_CLIENT_SECRET
```

Obtener credenciales en: https://console.cloud.google.com/

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
mvn test

# Ejecutar pruebas con cobertura
mvn test jacoco:report
```

## 📦 Compilación para Producción

```bash
# Generar JAR ejecutable
mvn clean package -DskipTests

# El JAR se genera en: target/invernadero-backend-1.0.0.jar

# Ejecutar el JAR
java -jar target/invernadero-backend-1.0.0.jar --spring.profiles.active=prod
```

## 🌐 Variables de Entorno para Producción

```bash
export DATABASE_URL=jdbc:postgresql://host:5432/invernadero_db
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=tu_password_seguro
export JWT_SECRET=tu_clave_secreta_minimo_256_bits
export GOOGLE_CLIENT_ID=tu_google_client_id
export GOOGLE_CLIENT_SECRET=tu_google_client_secret
export FRONTEND_URL=https://tu-frontend.com
```

## 📊 Módulos Generados Automáticamente

Los siguientes módulos fueron generados automáticamente desde el modelo JSON usando `generar_desde_plantilla.py`:

1. **invernadero** - Gestión de invernaderos
2. **zona** - Zonas dentro de invernaderos
3. **cultivo** - Catálogo de cultivos
4. **siembra** - Registro de siembras
5. **sensor** - Dispositivos de medición
6. **lectura_sensor** - Lecturas de sensores
7. **riego** - Eventos de riego
8. **alerta** - Sistema de alertas
9. **insumo** - Inventario de insumos
10. **aplicacion_insumo** - Aplicación de insumos
11. **cosecha** - Registro de cosechas

Cada módulo incluye:
- ✅ Entidad JPA con anotaciones
- ✅ Repositorio Spring Data JPA
- ✅ Servicio con operaciones CRUD
- ✅ DTOs de Request y Response
- ✅ Controlador REST con Swagger
- ✅ Validaciones con Bean Validation

## 🛠️ Tecnologías Utilizadas

- **Spring Boot 3.2.5** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **Spring Security** - Autenticación y autorización
- **JWT (JJWT 0.12.5)** - Tokens de autenticación
- **PostgreSQL** - Base de datos relacional
- **Lombok** - Reducción de código boilerplate
- **SpringDoc OpenAPI 2.5.0** - Documentación Swagger
- **Bean Validation** - Validación de datos

## 📝 Notas Importantes

1. **Primer inicio**: La aplicación creará automáticamente las tablas en la base de datos (ddl-auto=update)
2. **Seguridad**: Cambiar `jwt.secret` en producción por una clave segura de al menos 256 bits
3. **CORS**: Configurado para desarrollo. Ajustar `cors.allowed-origins` en producción
4. **Logs**: Los logs se guardan en `logs/invernadero-backend.log`

## 🐛 Troubleshooting

### Error: "Table 'usuario' doesn't exist"
- Verificar que la base de datos esté creada
- Verificar credenciales en application.properties
- Ejecutar el script SQL de creación de tablas

### Error: "JWT signature does not match"
- Verificar que `jwt.secret` sea el mismo en todas las instancias
- El token puede haber expirado (24 horas por defecto)

### Error de compilación
- Verificar que Java 17+ esté instalado: `java -version`
- Limpiar y recompilar: `mvn clean install`

## 👥 Autores

Invernadero Team - 2026

## 📄 Licencia

Este proyecto es parte de un trabajo académico.
