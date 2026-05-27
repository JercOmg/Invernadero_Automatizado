un pytest tests/test_selenium.py -v --tb=short --junitxml=../test-results/selenium-results.xml
============================= test session starts ==============================
platform linux -- Python 3.10.20, pytest-8.0.0, pluggy-1.6.0 -- /opt/hostedtoolcache/Python/3.10.20/x64/bin/python
cachedir: .pytest_cache
metadata: {'Python': '3.10.20', 'Platform': 'Linux-6.17.0-1013-azure-x86_64-with-glibc2.39', 'Packages': {'pytest': '8.0.0', 'pluggy': '1.6.0'}, 'Plugins': {'html': '4.1.1', 'cov': '4.1.0', 'metadata': '3.1.1'}, 'CI': 'true', 'JAVA_HOME': '/opt/hostedtoolcache/Java_Temurin-Hotspot_jdk/17.0.19-10/x64'}
rootdir: /home/runner/work/Invernadero_Automatizado/Invernadero_Automatizado
configfile: pytest.ini
plugins: html-4.1.1, cov-4.1.0, metadata-3.1.1
collecting ... collected 8 items

tests/test_selenium.py::TestAutenticacion::test_carga_pagina_login PASSED [ 12%]
tests/test_selenium.py::TestAutenticacion::test_registro_usuario PASSED  [ 25%]
tests/test_selenium.py::TestAutenticacion::test_login_credenciales_invalidas PASSED [ 37%]
tests/test_selenium.py::TestNavegacion::test_navegacion_invernaderos PASSED [ 50%]
tests/test_selenium.py::TestNavegacion::test_navegacion_sensores PASSED  [ 62%]
tests/test_selenium.py::TestCRUDInvernadero::test_listar_invernaderos PASSED [ 75%]
tests/test_selenium.py::TestCRUDInvernadero::test_crear_invernadero FAILED [ 87%]
tests/test_selenium.py::TestInternacionalizacion::test_cambio_idioma_espanol_ingles SKIPPED [100%]

=================================== FAILURES ===================================
__________________ TestCRUDInvernadero.test_crear_invernadero __________________
tests/test_selenium.py:298: in test_crear_invernadero
    raise e
tests/test_selenium.py:277: in test_crear_invernadero
    WebDriverWait(driver, 10).until(
/opt/hostedtoolcache/Python/3.10.20/x64/lib/python3.10/site-packages/selenium/webdriver/support/wait.py:105: in until
    raise TimeoutException(message, screen, stacktrace)
E   selenium.common.exceptions.TimeoutException: Message: 
E   Stacktrace:
E   #0 0x55697a82522a <unknown>
E   #1 0x55697a223ab9 <unknown>
E   #2 0x55697a278046 <unknown>
E   #3 0x55697a278281 <unknown>
E   #4 0x55697a2c2f74 <unknown>
E   #5 0x55697a2c0116 <unknown>
E   #6 0x55697a26b662 <unknown>
E   #7 0x55697a26c451 <unknown>
E   #8 0x55697a7e8d8b <unknown>
E   #9 0x55697a7ebc65 <unknown>
E   #10 0x55697a7d5458 <unknown>
E   #11 0x55697a7ec7f0 <unknown>
E   #12 0x55697a7bc1c0 <unknown>
E   #13 0x55697a812168 <unknown>
E   #14 0x55697a812305 <unknown>
E   #15 0x55697a823c5e <unknown>
E   #16 0x7f700d09caa4 <unknown>
E   #17 0x7f700d129c6c <unknown>
----------------------------- Captured stdout call -----------------------------

==================================================
🚨 DEBUG: test_crear_invernadero falló por timeout!
URL actual: http://localhost:5173/invernadero/new
No se encontró ningún elemento de alerta/error explícito.
Texto del body (primeros 1000 caracteres):
🌱 Invernadero Automatizado
Dashboard
Invernaderos
Zonas
Cultivos
Siembras
Sensores
Alertas
Español
Inglés
Admin Invernadero (OPERARIO)
Cerrar sesión
Crear Invernadero
Nombre
\n\n
Ubicacion
\n\n
Area M2
\n\n
Tipo Estructura
Seleccionar...
VIDRIO
\n              
POLICARBONATO
\n              
MALLA
\n              
PLASTICO
\n\n
Responsable Id
\n\n
Fecha Creacion
\n\n
Estado
Seleccionar...
ACTIVO
\n              
INACTIVO
\n              
MANTENIMIENTO
Guardar
Cancelar
© 2026 Sistema de Gestión de Invernadero Automatizado
==================================================

- generated xml file: /home/runner/work/Invernadero_Automatizado/Invernadero_Automatizado/test-results/selenium-results.xml -
=========================== short test summary info ============================
FAILED tests/test_selenium.py::TestCRUDInvernadero::test_crear_invernadero - selenium.common.exceptions.TimeoutException: Message: 
Stacktrace:
#0 0x55697a82522a <unknown>
#1 0x55697a223ab9 <unknown>
#2 0x55697a278046 <unknown>
#3 0x55697a278281 <unknown>
#4 0x55697a2c2f74 <unknown>
#5 0x55697a2c0116 <unknown>
#6 0x55697a26b662 <unknown>
#7 0x55697a26c451 <unknown>
#8 0x55697a7e8d8b <unknown>
#9 0x55697a7ebc65 <unknown>
#10 0x55697a7d5458 <unknown>
#11 0x55697a7ec7f0 <unknown>
#12 0x55697a7bc1c0 <unknown>
#13 0x55697a812168 <unknown>
#14 0x55697a812305 <unknown>
#15 0x55697a823c5e <unknown>
#16 0x7f700d09caa4 <unknown>
#17 0x7f700d129c6c <unknown>
=================== 1 failed, 6 passed, 1 skipped in 47.48s ====================
Error: Process completed with exit code 1.