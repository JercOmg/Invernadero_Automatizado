# 🔄 CI/CD Pipeline - Invernadero Automatizado

Pipeline completo de integración y despliegue continuo con GitHub Actions.

---

## 📋 Flujo del Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    PUSH / PULL REQUEST                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  🐍 Tests Python       │
         │  (Generadores)         │
         └────────┬───────────────┘
                  │
                  ├──────────────┬─────────────────┐
                  ▼              ▼                 ▼
         ┌────────────┐  ┌──────────────┐  ┌─────────────┐
         │ ☕ Tests    │  │ 🎨 Build     │  │ 🏗️ Build    │
         │  Backend   │  │  Frontend    │  │  Backend    │
         │  (JUnit)   │  │              │  │             │
         └────────┬───┘  └──────┬───────┘  └──────┬──────┘
                  │              │                 │
                  └──────────────┴─────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  🌐 Tests E2E          │
                    │  (Selenium)            │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │  🚀 Deploy             │
                    │  (solo en main)        │
                    └────────────────────────┘
```

---

## 🎯 Jobs del Pipeline

### 1️⃣ Tests Python (Generadores)
- **Propósito**: Validar scripts de generación de código
- **Herramienta**: pytest
- **Duración**: ~1-2 minutos
- **Artefactos**: Reporte XML de tests

**Tests ejecutados**:
- Generación de SQL
- Generación de diccionario de datos
- Validación del modelo JSON
- Verificación de archivos generados

### 2️⃣ Tests Backend (JUnit)
- **Propósito**: Validar API REST y lógica de negocio
- **Herramienta**: Maven + JUnit 5
- **Duración**: ~3-5 minutos
- **Artefactos**: Reporte de tests + Cobertura de código

**Tests ejecutados**:
- Tests de autenticación (JWT)
- Tests de módulos CRUD
- Tests de seguridad
- Tests de validación

### 3️⃣ Build Backend
- **Propósito**: Compilar JAR ejecutable
- **Herramienta**: Maven
- **Duración**: ~2-3 minutos
- **Artefactos**: `invernadero-backend-1.0.0.jar`

### 4️⃣ Build Frontend
- **Propósito**: Compilar aplicación React para producción
- **Herramienta**: Vite
- **Duración**: ~1-2 minutos
- **Artefactos**: Carpeta `dist/` optimizada

### 5️⃣ Tests E2E (Selenium)
- **Propósito**: Validar flujos completos de usuario
- **Herramienta**: Selenium + pytest
- **Duración**: ~5-8 minutos
- **Servicios**: PostgreSQL, Backend, Frontend

**Tests ejecutados**:
- Flujo de registro
- Flujo de login
- Navegación entre módulos
- Operaciones CRUD desde UI
- Cambio de idioma

### 6️⃣ Deploy (solo en main)
- **Propósito**: Desplegar a producción
- **Plataformas**: Render (Backend) + Vercel (Frontend)
- **Duración**: ~3-5 minutos
- **Trigger**: Solo en push a `main`

---

## 🚨 Integración con Taiga

Cuando un job falla, el pipeline automáticamente:

1. ✅ Crea un **issue en GitHub** con:
   - Título descriptivo con hash del commit
   - Link a los logs del workflow
   - Labels: `bug`, `ci-failure`, `[componente]`

2. 🔄 **Opcional**: Integración con Taiga API
   - Crear tarea en el sprint actual
   - Asignar al responsable del commit
   - Incluir link al issue de GitHub

### Configurar Integración con Taiga

```yaml
# Agregar al workflow (en cada job que falla)
- name: 🚨 Crear tarea en Taiga
  if: failure()
  run: |
    python scripts/create_taiga_task.py \
      --project "${{ secrets.TAIGA_PROJECT_ID }}" \
      --title "[CI/CD] Tests fallaron - ${{ github.sha }}" \
      --description "Ver: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}" \
      --token "${{ secrets.TAIGA_AUTH_TOKEN }}"
```

---

## 🔐 Secrets Requeridos

Configurar en: **Settings → Secrets and variables → Actions**

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `TAIGA_PROJECT_ID` | ID del proyecto en Taiga | `123456` |
| `TAIGA_AUTH_TOKEN` | Token de autenticación Taiga | `Bearer abc123...` |
| `RENDER_DEPLOY_HOOK_BACKEND` | Webhook de deploy en Render | `https://api.render.com/deploy/...` |
| `VERCEL_TOKEN` | Token de Vercel para deploy | `vercel_abc123...` |

---

## 📊 Reportes y Artefactos

### Reportes de Tests

Los resultados de tests se publican automáticamente en:
- **GitHub Actions → Checks** (resumen visual)
- **Pull Request → Checks** (comentario automático)

### Artefactos Descargables

Disponibles por 7 días después de cada ejecución:

1. **backend-jar**: JAR compilado del backend
2. **frontend-dist**: Build de producción del frontend
3. **backend-coverage-report**: Reporte de cobertura de código

**Descargar artefactos**:
```bash
# Desde la página del workflow en GitHub
Actions → [Workflow Run] → Artifacts → Download
```

---

## 🎮 Triggers del Pipeline

### Push a main/develop
```bash
git push origin main
# ✅ Ejecuta: Tests → Build → E2E → Deploy (solo main)
```

### Pull Request
```bash
gh pr create --base main --head feature/nueva-funcionalidad
# ✅ Ejecuta: Tests → Build → E2E (sin deploy)
```

### Manual (workflow_dispatch)
```bash
# Desde GitHub UI:
Actions → CI/CD Pipeline → Run workflow
```

---

## 🐛 Troubleshooting

### ❌ Tests Python fallan

**Error común**: `ModuleNotFoundError`
```yaml
# Solución: Verificar requirements-test.txt
- name: 📦 Instalar dependencias
  run: pip install -r requirements-test.txt
```

### ❌ Tests Backend fallan

**Error común**: `Connection refused to H2`
```yaml
# Solución: Verificar application-test.properties
spring.datasource.url=jdbc:h2:mem:testdb
```

### ❌ Tests E2E fallan

**Error común**: `Backend no responde`
```yaml
# Solución: Aumentar tiempo de espera
run: |
  java -jar target/*.jar &
  sleep 30  # Aumentar si es necesario
```

### ❌ Deploy falla

**Error común**: `Secrets no configurados`
```bash
# Solución: Configurar secrets en GitHub
Settings → Secrets → New repository secret
```

---

## 📈 Métricas del Pipeline

### Tiempos Estimados

| Job | Duración | Crítico |
|-----|----------|---------|
| Tests Python | 1-2 min | ⚠️ Sí |
| Tests Backend | 3-5 min | ⚠️ Sí |
| Build Backend | 2-3 min | ✅ No |
| Build Frontend | 1-2 min | ✅ No |
| Tests E2E | 5-8 min | ⚠️ Sí |
| Deploy | 3-5 min | ✅ No |
| **TOTAL** | **15-25 min** | |

### Cobertura de Código

**Objetivo**: > 80% de cobertura en Backend

```bash
# Ver reporte de cobertura
Actions → [Workflow Run] → Artifacts → backend-coverage-report
```

---

## 🔄 Flujo de Trabajo Recomendado

### Para Desarrolladores

1. **Crear rama de feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollar y hacer commits**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   ```

3. **Ejecutar tests localmente** (antes de push)
   ```bash
   .\ejecutar_todos_los_tests.ps1
   ```

4. **Push y crear PR**
   ```bash
   git push origin feature/nueva-funcionalidad
   gh pr create
   ```

5. **Esperar CI/CD** ✅
   - Si pasa → Merge
   - Si falla → Fix y push de nuevo

### Para Revisores

1. **Revisar código** en GitHub
2. **Verificar que CI/CD pasó** ✅
3. **Revisar cobertura de tests**
4. **Aprobar y hacer merge**

---

## 🚀 Próximos Pasos

### Mejoras Futuras

- [ ] Agregar análisis de código estático (SonarQube)
- [ ] Agregar tests de performance (JMeter)
- [ ] Agregar notificaciones a Slack/Discord
- [ ] Agregar deploy automático a staging
- [ ] Agregar rollback automático si deploy falla

---

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Taiga API Documentation](https://docs.taiga.io/api.html)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [Vercel CLI](https://vercel.com/docs/cli)

---

**Última actualización**: 2026-05-15
