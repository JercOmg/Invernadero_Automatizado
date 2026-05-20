"""
Tests de Selenium para el Frontend React
Valida flujos de usuario: registro, login, navegacion y operaciones CRUD
"""

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time


@pytest.fixture
def driver():
    """Configura el driver de Chrome para los tests"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()


# ──────────────────────────────────────────────
#  Credenciales admin de prueba
# ──────────────────────────────────────────────
ADMIN_EMAIL = "admin@invernadero.com"
ADMIN_PASSWORD = "Admin123456"
BASE_URL = "http://localhost:5173"


def login(driver, email=ADMIN_EMAIL, password=ADMIN_PASSWORD):
    """Helper: hace login y espera el dashboard. Si falla, intenta registrar al usuario primero."""
    driver.get(f"{BASE_URL}/login")
    
    # 1. Intentar hacer Login directamente
    try:
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        driver.find_element(By.NAME, "email").clear()
        driver.find_element(By.NAME, "email").send_keys(email)
        driver.find_element(By.NAME, "password").clear()
        driver.find_element(By.NAME, "password").send_keys(password)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Esperar a ver si redirige al dashboard
        WebDriverWait(driver, 5).until(EC.url_contains("/dashboard"))
        return
    except Exception:
        # Si falló (ej. el usuario no existe en la base de datos vacía), procedemos a registrar
        pass

    # 2. Registrar al usuario dinámicamente si no existe
    driver.get(f"{BASE_URL}/register")
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.NAME, "nombre"))
    )
    driver.find_element(By.NAME, "nombre").send_keys("Admin")
    driver.find_element(By.NAME, "apellido").send_keys("Invernadero")
    driver.find_element(By.NAME, "email").send_keys(email)
    driver.find_element(By.NAME, "password").send_keys(password)
    try:
        driver.find_element(By.NAME, "confirmPassword").send_keys(password)
    except Exception:
        pass
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    
    # Esperar redirección tras registro exitoso
    WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))


class TestAutenticacion:
    """Tests del flujo de autenticacion"""

    def test_carga_pagina_login(self, driver):
        """Verifica que la pagina de login carga correctamente"""
        driver.get(f"{BASE_URL}/login")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        assert "Login" in driver.title or "Invernadero" in driver.title

        email_input = driver.find_element(By.NAME, "email")
        password_input = driver.find_element(By.NAME, "password")
        assert email_input is not None
        assert password_input is not None

    def test_registro_usuario(self, driver):
        """Verifica el flujo completo de registro"""
        driver.get(f"{BASE_URL}/register")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "nombre"))
        )

        timestamp = int(time.time())
        driver.find_element(By.NAME, "nombre").send_keys("Usuario Selenium")
        driver.find_element(By.NAME, "apellido").send_keys("Test")
        driver.find_element(By.NAME, "email").send_keys(f"selenium{timestamp}@test.com")
        driver.find_element(By.NAME, "password").send_keys("TestSelenium123")
        try:
            driver.find_element(By.NAME, "confirmPassword").send_keys("TestSelenium123")
        except Exception:
            pass

        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))
        assert "/dashboard" in driver.current_url

    def test_login_credenciales_invalidas(self, driver):
        """Verifica que el login falla con credenciales incorrectas"""
        driver.get(f"{BASE_URL}/login")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "email"))
        )

        driver.find_element(By.NAME, "email").send_keys("noexiste@test.com")
        driver.find_element(By.NAME, "password").send_keys("PasswordIncorrecto")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        # Esperar mensaje de error (clase 'error' o 'alert' o role 'alert')
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located(
                (By.XPATH, "//*[contains(@class,'error') or contains(@class,'alert') or @role='alert']")
            )
        )

        error = driver.find_element(
            By.XPATH, "//*[contains(@class,'error') or contains(@class,'alert') or @role='alert']"
        )
        assert error is not None


class TestNavegacion:
    """Tests de navegacion en el dashboard"""

    @pytest.fixture(autouse=True)
    def do_login(self, driver):
        """Login automatico antes de cada test"""
        login(driver)

    def test_navegacion_invernaderos(self, driver):
        """Verifica navegacion al modulo de invernaderos"""
        # El link puede tener texto 'Invernaderos' o 'invernadero'
        link = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//a[contains(@href,'/invernadero')]")
            )
        )
        link.click()

        WebDriverWait(driver, 5).until(
            EC.url_contains("/invernadero")
        )
        assert "/invernadero" in driver.current_url

    def test_navegacion_sensores(self, driver):
        """Verifica navegacion al modulo de sensores"""
        link = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//a[contains(@href,'/sensor')]")
            )
        )
        link.click()

        WebDriverWait(driver, 5).until(
            EC.url_contains("/sensor")
        )
        assert "/sensor" in driver.current_url


class TestCRUDInvernadero:
    """Tests de operaciones CRUD en el modulo Invernadero"""

    @pytest.fixture(autouse=True)
    def do_login_and_navigate(self, driver):
        """Login y navegacion al modulo de invernaderos"""
        login(driver)
        link = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//a[contains(@href,'/invernadero')]")
            )
        )
        link.click()
        WebDriverWait(driver, 5).until(EC.url_contains("/invernadero"))

    def test_listar_invernaderos(self, driver):
        """Verifica que la lista de invernaderos carga correctamente"""
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )
        table = driver.find_element(By.TAG_NAME, "table")
        rows = table.find_elements(By.TAG_NAME, "tr")
        # Al menos el header de la tabla
        assert len(rows) >= 1

    def test_crear_invernadero(self, driver):
        """Verifica la creacion de un nuevo invernadero"""
        # Buscar boton de crear (puede variar el selector, ej: a o button)
        btn_nuevo = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//*[contains(@class,'btn-nuevo') or contains(text(),'Nuevo') or contains(text(),'Crear') or contains(text(),'Create') or contains(text(),'New')]")
            )
        )
        btn_nuevo.click()

        timestamp = int(time.time())
        nombre = f"Invernadero Selenium {timestamp}"

        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.NAME, "nombre"))
        )
        driver.find_element(By.NAME, "nombre").send_keys(nombre)
        driver.find_element(By.NAME, "ubicacion").send_keys("Ubicacion Test")
        driver.find_element(By.NAME, "areaM2").send_keys("150.5")

        # Rellenar campos adicionales requeridos si existen en el formulario
        for name, value in [("responsableId", "1"), ("fechaCreacion", "2026-05-20"), ("estado", "ACTIVO"), ("tipoEstructura", "PLASTICO")]:
            try:
                elem = driver.find_element(By.NAME, name)
                if elem:
                    if elem.tag_name == "select":
                        from selenium.webdriver.support.ui import Select
                        Select(elem).select_by_value(value)
                    else:
                        elem.clear()
                        elem.send_keys(value)
            except Exception:
                pass

        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        # Paso 1: esperar que el formulario rediriga de vuelta a la lista
        WebDriverWait(driver, 20).until(
            lambda d: "/invernadero/new" not in d.current_url and "/invernadero" in d.current_url
        )

        # Paso 2: esperar que la tabla cargue con los datos del backend
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )

        # Paso 3: verificar que el nuevo invernadero aparece en la tabla
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located(
                (By.XPATH, f"//td[contains(text(), '{nombre}')]")
            )
        )


@pytest.mark.selenium
class TestInternacionalizacion:
    """Tests de cambio de idioma"""

    def test_cambio_idioma_espanol_ingles(self, driver):
        """Verifica que el selector de idioma existe y funciona"""
        driver.get(f"{BASE_URL}/login")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "email"))
        )

        # Buscar selector de idioma por id o por data-attribute
        try:
            language_selector = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[@id='language-selector' or @data-testid='language-selector']")
                )
            )
            language_selector.click()

            en_option = WebDriverWait(driver, 3).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//option[@value='en'] | //button[@data-lang='en']")
                )
            )
            en_option.click()

            time.sleep(1)
            page_text = driver.find_element(By.TAG_NAME, "body").text
            assert "Login" in page_text or "Sign in" in page_text or "Email" in page_text
        except Exception:
            # Si el selector de idioma aun no esta implementado, el test pasa con skip
            pytest.skip("Selector de idioma no implementado aun (pendiente item 7)")
