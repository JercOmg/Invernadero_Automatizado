# GUÍA DE EJECUCIÓN - PROYECTO INVERNADERO AUTOMATIZADO

**Fecha:** 2026-05-15  
**Stack:** PostgreSQL + Spring Boot + React

---

## 📋 REQUISITOS PREVIOS

Antes de comenzar, verifica que tengas instalado:

- ✅ **Java 17** - Instalado en: `C:\Program Files\Java\jdk-17`
- ✅ **Maven 3.9.5** - Instalado en: `C:\Users\Usuario\.maven\apache-maven-3.9.5`
- ✅ **Node.js 24.14.0** - Verificado
- ✅ **npm 11.13.0** - Verificado
- ⚠️ **PostgreSQL 12+** - NECESITA VERIFICACIÓN

---

## PASO 1: INSTALAR Y CONFIGURAR POSTGRESQL

### Opción A: Si PostgreSQL NO está instalado

1. **Descargar PostgreSQL:**
   - Ve a: https://www.postgresql.org/download/windows/
   - Descarga PostgreSQL 16 (versión más reciente)
   - Ejecuta el instalador

2. **Durante la instalación:**
   - Puerto: `5432` (por defecto)
   - Contraseña del superusuario (postgres): `admin1234`
   - Instalar Stack Builder: NO (opcional)

3. **Verificar instalación:**
   ```powershell
   psql --version
   ```

### Opción B: Si PostgreSQL YA está instalado

Verifica que esté corriendo:
```powershell
# Verificar servicio
Get-Service -Name postgresql*

# Si no está corriendo, iniciarlo
Start-Service postgresql-x64-16  # Ajusta el nombre según tu versión
```

---

## PASO 2: CREAR LA BASE DE DATOS

### Método 1: Usando pgAdmin (GUI)

1. Abre **pgAdmin 4**
2. Conecta al servidor local (contraseña: `admin1234`)
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `invernadero_db`
5. Click "Save"

### Método 2: Usando línea de comandos

```powershell
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql, ejecutar:
CREATE DATABASE invernadero_db;
\q
```

---

## PASO 3: EJECUTAR EL SCRIPT SQL

```powershell
# Navegar al directorio del proyecto
cd "C:\Users\Usuario\Desktop\Invernadero automatizado"

# Ejecutar el script SQL
psql -U postgres -d invernadero_db -f "Base de Datos\crear_db_postgresql.sql"

# Verificar que las tablas se crearon
psql -U postgres -d invernadero_db -c "\dt"
```

**Deberías ver 12 tablas:**
- usuario
- invernadero
- zona
- cultivo
- siembra
- sensor
- lectura_sensor
- riego
- alerta
- insumo
- aplicacion_insumo
- cosecha

---

## PASO 4: INICIAR EL BACKEND (Spring Boot)

### Terminal 1: Backend

```powershell
# Configurar Java 17
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Navegar al directorio del backend
cd "C:\Users\Usuario\Desktop\Invernadero automatizado\Backend\invernadero-backend"

# Opción A: Ejecutar con Maven
& "$env:USERPROFILE\.maven\apache-maven-3.9.5\bin\mvn.cmd" spring-boot:run

# Opción B: Ejecutar el JAR directamente
& "$env:JAVA_HOME\bin\java.exe" -jar "target\invernadero-backend-1.0.0.jar"
```

**El backend estará disponible en:**
- API Base: http://localhost:8080/api
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- Health Check: http://localhost:8080/api/auth/health

**Espera a ver este mensaje:**
```
Started InvernaderoBackendApplication in X.XXX seconds
```

---

## PASO 5: INICIAR EL FRONTEND (React)

### Terminal 2: Frontend

```powershell
# Navegar al directorio del frontend
cd "C:\Users\Usuario\Desktop\Invernadero automatizado\Frontend"

# Iniciar el servidor de desarrollo
npm run dev
```

**El frontend estará disponible en:**
- URL: http://localhost:5173

**Espera a ver este mensaje:**
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

---

## PASO 6: PROBAR LA APLICACIÓN

### 1. Abrir el navegador

Abre: http://localhost:5173

### 2. Registrar un usuario

1. Click en "Regístrate aquí"
2. Completa el formulario:
   - Nombre: Tu nombre
   - Apellido: Tu apellido
   - Email: tu@email.com
   - Contraseña: 123456 (mínimo 6 caracteres)
3. Click "Registrarse"

### 3. Explorar el Dashboard

Deberías ver:
- Barra de navegación superior
- Dashboard con 11 tarjetas de módulos
- Tu nombre y rol en la esquina superior derecha

### 4. Probar un módulo CRUD

1. Click en "Invernaderos"
2. Click en "Crear Nuevo"
3. Completa el formulario
4. Click "Guardar"
5. Verifica que aparezca en la lista

---

## 🔍 VERIFICACIÓN DE INTEGRACIÓN

### Verificar Backend

```powershell
# Health check
curl http://localhost:8080/api/auth/health

# Debería responder:
# {"success":true,"message":"Servicio de autenticacion funcionando correctamente","data":"OK"}
```

### Verificar Base de Datos

```powershell
# Conectar a la base de datos
psql -U postgres -d invernadero_db

# Ver usuarios registrados
SELECT * FROM usuario;

# Salir
\q
```

### Verificar Frontend

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Deberías ver peticiones a `http://localhost:8080/api`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: Backend no inicia

**Error:** "Port 8080 is already in use"
```powershell
# Encontrar el proceso usando el puerto 8080
netstat -ano | findstr :8080

# Matar el proceso (reemplaza PID con el número que aparece)
taskkill /PID <PID> /F
```

**Error:** "Could not connect to database"
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `application.properties`
- Verifica que la base de datos `invernadero_db` exista

### Problema: Frontend no conecta con Backend

**Error:** "Network Error" en el navegador
- Verifica que el backend esté corriendo en puerto 8080
- Verifica el archivo `.env` en el frontend
- Revisa la consola del navegador para más detalles

### Problema: CORS errors

Si ves errores de CORS en la consola:
- Verifica que el frontend esté en `http://localhost:5173`
- Verifica la configuración de CORS en `application.properties`

---

## 📝 COMANDOS RÁPIDOS

### Detener todo

```powershell
# En cada terminal, presiona:
Ctrl + C
```

### Reiniciar Backend

```powershell
# Terminal 1
Ctrl + C
& "$env:USERPROFILE\.maven\apache-maven-3.9.5\bin\mvn.cmd" spring-boot:run
```

### Reiniciar Frontend

```powershell
# Terminal 2
Ctrl + C
npm run dev
```

---

## 🎯 FLUJO DE PRUEBA COMPLETO

1. ✅ Registrar usuario
2. ✅ Login con el usuario creado
3. ✅ Crear un invernadero
4. ✅ Crear una zona dentro del invernadero
5. ✅ Crear un cultivo
6. ✅ Crear una siembra
7. ✅ Crear un sensor
8. ✅ Registrar una lectura del sensor
9. ✅ Ver alertas generadas
10. ✅ Logout

---

## 📊 PUERTOS UTILIZADOS

| Servicio | Puerto | URL |
|----------|--------|-----|
| PostgreSQL | 5432 | localhost:5432 |
| Backend (Spring Boot) | 8080 | http://localhost:8080/api |
| Frontend (React) | 5173 | http://localhost:5173 |

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de reportar que todo funciona, verifica:

- [ ] PostgreSQL está corriendo
- [ ] Base de datos `invernadero_db` existe
- [ ] 12 tablas creadas en la base de datos
- [ ] Backend inicia sin errores
- [ ] Swagger UI accesible
- [ ] Frontend inicia sin errores
- [ ] Puedes registrar un usuario
- [ ] Puedes hacer login
- [ ] Dashboard se muestra correctamente
- [ ] Puedes crear un registro en cualquier módulo
- [ ] Los datos se guardan en la base de datos

---

**¡Listo! El proyecto completo debería estar funcionando.**

Si encuentras algún problema, avísame y te ayudo a resolverlo.
