# 🧪 GUÍA DE PRUEBAS - INVERNADERO AUTOMATIZADO

Guía completa para ejecutar todas las pruebas del proyecto: Backend (JUnit), Frontend (Selenium) y Python (pytest).

---

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Tests Backend (JUnit)](#tests-backend-junit)
3. [Tests Frontend (Selenium)](#tests-frontend-selenium)
4. [Tests Python (pytest)](#tests-python-pytest)
5. [Ejecución Completa](#ejecución-completa)
6. [Integración con CI/CD](#integración-con-cicd)

---

## 🔧 Requisitos Previos

### Backend
- Java 17
- Maven 3.9+
- Base de datos H2 (incluida en dependencias)

### Frontend
- Node.js 24+
- Chrome/Chromium instalado
- ChromeDriver (se instala automáticamente con webdriver-manager)

### Python
- Python 3.10+
- pip instalado

### Instalación de Dependencias

```powershell
# Backend - ya incluido en pom.xml
cd Backend\invernadero-backend

# Frontend - instalar Selenium
pip install -r ..\..\requirements-test.txt

# Python - instalar pytest
pip install -r requirements-test.txt
```

---

## 🟢 Tests Backend (JUnit)

### Estructura de Tests

```
Backend/invernadero-backend/src/test/java/
├── com/invernadero/invernadero_backend/
│   ├── auth/
│   │   └── AuthControllerTest.java          # Tests de autenticación
│   └── invernadero/
│       └── InvernaderoControllerTest.java   # Tests CRUD Invernadero
└── resources/
    └── application-test.properties          # Configuración de test
```

### Tests Incluidos

**AuthControllerTest** (5 tests):
- ✅ `testRegistroExitoso()` - Registro de usuario válido
- ✅ `testRegistroEmailDuplicado()` - Validación de email único
- ✅ `testLoginExitoso()` - Login con credenciales válidas
- ✅ `testLoginCredencialesInvalidas()` - Login con credenciales incorrectas
- ✅ `testRegistroConDatosInvalidos()` - Validación de datos de entrada

**InvernaderoControllerTest** (6 tests):
- ✅ `testCrearInvernadero()` - Crear nuevo invernadero
- ✅ `testListarInvernaderos()` - Listar todos los invernaderos
- ✅ `testActualizarInvernadero()` - Actualizar invernadero existente
- ✅ `testEliminarInvernadero()` - Eliminar invernadero
- ✅ `testAccesoSinAutenticacion()` - Validación de seguridad

### Ejecutar Tests Backend

```powershell
# Navegar al directorio del backend
cd Backend\invernadero-backend

# Ejecutar todos los tests
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
mvn test

# Ejecutar tests específicos
mvn test -Dtest=AuthControllerTest
mvn test -Dtest=InvernaderoControllerTest

# Ejecutar con reporte de cobertura
mvn test jacoco:report

# Ver reporte de cobertura
# Abrir: target/site/jacoco/index.html
```

### Configuración de Test

Los tests usan:
- **Base de datos**: H2 en memoria (no afecta PostgreSQL)
- **Perfil**: `test` (application-test.properties)
- **Transacciones**: Rollback automático después de cada test

---

## 🔵 Tests Frontend (Selenium)

### Estructura de Tests

```
Frontend/tests/
└── test_selenium.py    # Tests E2E con Selenium
```

### Tests Incluidos

**TestAutenticacion** (3 tests):
- ✅ `test_carga_pagina_login()` - Carga de página de login
- ✅ `test_registro_usuario()` - Flujo completo de registro
- ✅ `test_login_credenciales_invalidas()` - Validación de credenciales

**TestNavegacion** (2 tests):
- ✅ `test_navegacion_invernaderos()` - Navegación al módulo
- ✅ `test_navegacion_sensores()` - Navegación al módulo

**TestCRUDInvernadero** (2 tests):
- ✅ `test_crear_invernadero()` - Crear desde UI
- ✅ `test_listar_invernaderos()` - Listar en tabla

**TestInternacionalizacion** (1 test):
- ✅ `test_cambio_idioma_espanol_ingles()` - Cambio de idioma

### Requisitos Previos

**IMPORTANTE**: Antes de ejecutar los tests de Selenium:

1. **Backend debe estar corriendo** en `http://localhost:8080`
2. **Frontend debe estar corriendo** en `http://localhost:5173`
3. **Crear usuario admin** para los tests de navegación:
   - Email: `admin@invernadero.com`
   - Password: `Admin123456`

### Ejecutar Tests Frontend

```powershell
# Navegar al directorio del frontend
cd Frontend

# Ejecutar todos los tests de Selenium
pytest tests/test_selenium.py -v

# Ejecutar test específico
pytest tests/test_selenium.py::TestAutenticacion::test_registro_usuario -v

# Ejecutar con reporte HTML
pytest tests/test_selenium.py -v --html=report.html --self-contained-html

# Ejecutar sin modo headless (ver el navegador)
# Editar test_selenium.py y comentar la línea:
# chrome_options.add_argument("--headless")
```

### Troubleshooting Selenium

Si los tests fallan:

1. **ChromeDriver no encontrado**:
   ```powershell
   pip install webdriver-manager --upgrade
   ```

2. **Backend/Frontend no responde**:
   - Verificar que ambos servicios estén corriendo
   - Verificar URLs en `test_selenium.py` (BASE_URL)

3. **Timeout en elementos**:
   - Aumentar `implicitly_wait` en el fixture `driver`

---

## 🟡 Tests Python (pytest)

### Estructura de Tests

```
tests/
└── test_generadores.py    # Tests de scripts generadores
```

### Tests Incluidos

**TestGeneracionSQL** (4 tests):
- ✅ `test_generar_sql_crea_tablas()` - Generación de CREATE TABLE
- ✅ `test_generar_sql_incluye_primary_keys()` - Validación de PKs
- ✅ `test_generar_sql_incluye_foreign_keys()` - Validación de FKs
- ✅ `test_generar_sql_incluye_constraints()` - Validación de constraints

**TestGeneracionDiccionario** (4 tests):
- ✅ `test_generar_diccionario_incluye_entidades()` - Entidades en diccionario
- ✅ `test_generar_diccionario_incluye_campos()` - Campos en diccionario
- ✅ `test_generar_diccionario_incluye_tipos()` - Tipos de datos
- ✅ `test_generar_diccionario_incluye_descripciones()` - Descripciones

**TestGeneracionRelaciones** (2 tests):
- ✅ `test_generar_relaciones_incluye_entidades()` - Entidades en ERD
- ✅ `test_generar_relaciones_incluye_foreign_keys()` - Relaciones en ERD

**TestValidacionModelo** (3 tests):
- ✅ `test_modelo_json_valido()` - Validación de JSON
- ✅ `test_todas_entidades_tienen_id()` - Validación de PKs
- ✅ `test_relaciones_validas()` - Validación de integridad referencial

**TestArchivosGenerados** (4 tests):
- ✅ `test_sql_generado_existe()` - Archivo SQL generado
- ✅ `test_diccionario_txt_generado_existe()` - Diccionario TXT generado
- ✅ `test_diccionario_pdf_generado_existe()` - Diccionario PDF generado
- ✅ `test_relaciones_generado_existe()` - Archivo de relaciones generado

### Ejecutar Tests Python

```powershell
# Navegar al directorio raíz
cd "C:\Users\Usuario\Desktop\Invernadero automatizado"

# Ejecutar todos los tests
pytest tests/test_generadores.py -v

# Ejecutar con cobertura
pytest tests/test_generadores.py -v --cov=. --cov-report=html

# Ver reporte de cobertura
# Abrir: htmlcov/index.html

# Ejecutar test específico
pytest tests/test_generadores.py::TestGeneracionSQL::test_generar_sql_crea_tablas -v
```

---

## 🚀 Ejecución Completa

### Script para Ejecutar Todos los Tests

```powershell
# ejecutar_todos_los_tests.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EJECUTANDO TODOS LOS TESTS DEL PROYECTO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Tests Python (generadores)
Write-Host "`n[1/3] Ejecutando tests Python..." -ForegroundColor Yellow
pytest tests/test_generadores.py -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests Python fallaron" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Tests Python completados" -ForegroundColor Green

# 2. Tests Backend (JUnit)
Write-Host "`n[2/3] Ejecutando tests Backend..." -ForegroundColor Yellow
cd Backend\invernadero-backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
mvn test -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests Backend fallaron" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Tests Backend completados" -ForegroundColor Green
cd ..\..

# 3. Tests Frontend (Selenium)
Write-Host "`n[3/3] Ejecutando tests Frontend..." -ForegroundColor Yellow
Write-Host "NOTA: Backend y Frontend deben estar corriendo" -ForegroundColor Yellow
cd Frontend
pytest tests/test_selenium.py -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests Frontend fallaron" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Tests Frontend completados" -ForegroundColor Green
cd ..

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ TODOS LOS TESTS COMPLETADOS EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
```

### Ejecutar el Script

```powershell
.\ejecutar_todos_los_tests.ps1
```

---

## 🔄 Integración con CI/CD

### GitHub Actions Workflow

Los tests se ejecutarán automáticamente en cada push y pull request. Ver `.github/workflows/ci-cd.yml` para la configuración completa.

**Orden de ejecución en CI/CD**:
1. ✅ Tests Python (generadores)
2. ✅ Tests Backend (JUnit)
3. ✅ Tests Frontend (Selenium)
4. ✅ Build y Deploy (si todos los tests pasan)

### Integración con Taiga

Si algún test falla en CI/CD:
- Se crea automáticamente una tarea en Taiga
- La tarea incluye el log del error
- Se asigna al sprint actual

---

## 📊 Resumen de Cobertura

### Objetivo de Cobertura

- **Backend**: > 80% de cobertura de código
- **Frontend**: Tests E2E de flujos críticos
- **Python**: 100% de funciones generadoras

### Comandos de Cobertura

```powershell
# Backend
cd Backend\invernadero-backend
mvn test jacoco:report
# Ver: target/site/jacoco/index.html

# Python
pytest tests/test_generadores.py --cov=. --cov-report=html
# Ver: htmlcov/index.html
```

---

## 🐛 Troubleshooting

### Backend Tests Fallan

**Error**: `Connection refused to PostgreSQL`
- **Solución**: Los tests usan H2, no PostgreSQL. Verificar `application-test.properties`

**Error**: `JWT secret too short`
- **Solución**: Verificar que `application-test.properties` tiene un secret válido

### Frontend Tests Fallan

**Error**: `Connection refused to localhost:5173`
- **Solución**: Iniciar el frontend con `npm run preview`

**Error**: `Element not found`
- **Solución**: Aumentar timeout o verificar selectores en `test_selenium.py`

### Python Tests Fallan

**Error**: `ModuleNotFoundError: No module named 'generar_base_de_datos'`
- **Solución**: Ejecutar desde el directorio raíz del proyecto

**Error**: `FileNotFoundError: base_datos_invernadero.json`
- **Solución**: Ejecutar primero `python generar_base_de_datos.py`

---

## ✅ Checklist de Pruebas

Antes de hacer commit/push:

- [ ] Tests Python pasan (`pytest tests/test_generadores.py`)
- [ ] Tests Backend pasan (`mvn test`)
- [ ] Tests Frontend pasan (`pytest Frontend/tests/test_selenium.py`)
- [ ] Cobertura Backend > 80%
- [ ] No hay warnings en los tests
- [ ] Todos los servicios se detienen correctamente

---

## 📚 Referencias

- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Selenium Python Documentation](https://selenium-python.readthedocs.io/)
- [pytest Documentation](https://docs.pytest.org/)
- [Spring Boot Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)

---

**Última actualización**: 2026-05-15
