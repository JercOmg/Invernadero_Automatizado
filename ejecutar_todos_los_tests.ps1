# ============================================
# SCRIPT PARA EJECUTAR TODOS LOS TESTS
# Invernadero Automatizado
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EJECUTANDO TODOS LOS TESTS DEL PROYECTO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$testsFallidos = 0

# 1. Tests Python (generadores)
Write-Host "`n[1/3] Ejecutando tests Python (generadores)..." -ForegroundColor Yellow
pytest tests/test_generadores.py -v --tb=short
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests Python fallaron" -ForegroundColor Red
    $testsFallidos++
} else {
    Write-Host "✅ Tests Python completados exitosamente" -ForegroundColor Green
}

# 2. Tests Backend (JUnit)
Write-Host "`n[2/3] Ejecutando tests Backend (JUnit)..." -ForegroundColor Yellow
Push-Location "Backend\invernadero-backend"
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
mvn test -q
$backendResult = $LASTEXITCODE
Pop-Location

if ($backendResult -ne 0) {
    Write-Host "❌ Tests Backend fallaron" -ForegroundColor Red
    $testsFallidos++
} else {
    Write-Host "✅ Tests Backend completados exitosamente" -ForegroundColor Green
}

# 3. Tests Frontend (Selenium)
Write-Host "`n[3/3] Ejecutando tests Frontend (Selenium)..." -ForegroundColor Yellow
Write-Host "NOTA: Backend y Frontend deben estar corriendo en localhost:8080 y localhost:5173" -ForegroundColor Yellow

# Verificar si los servicios están corriendo
try {
    $backendCheck = Invoke-WebRequest -Uri "http://localhost:8080/api/actuator/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    
    Push-Location "Frontend"
    pytest tests/test_selenium.py -v --tb=short
    $seleniumResult = $LASTEXITCODE
    Pop-Location
    
    if ($seleniumResult -ne 0) {
        Write-Host "❌ Tests Frontend fallaron" -ForegroundColor Red
        $testsFallidos++
    } else {
        Write-Host "✅ Tests Frontend completados exitosamente" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend o Frontend no están corriendo. Saltando tests de Selenium." -ForegroundColor Yellow
    Write-Host "   Para ejecutar tests de Selenium, inicia ambos servicios primero." -ForegroundColor Yellow
}

# Resumen final
Write-Host "`n========================================" -ForegroundColor Cyan
if ($testsFallidos -eq 0) {
    Write-Host "✅ TODOS LOS TESTS COMPLETADOS EXITOSAMENTE" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "❌ $testsFallidos GRUPO(S) DE TESTS FALLARON" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "`nRevisa los logs arriba para más detalles." -ForegroundColor Yellow
    exit 1
}
