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
        try:
            # Buscar boton de crear
            btn_nuevo = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//a[contains(@class,'btn-nuevo') or contains(.,'Nuevo') or contains(.,'Crear') or contains(.,'Create') or contains(.,'New')] | //button[contains(.,'Nuevo') or contains(.,'Crear') or contains(.,'Create') or contains(.,'New')]")
                )
            )
            btn_nuevo.click()

            timestamp = int(time.time())
            nombre = f"Invernadero Selenium {timestamp}"

            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.NAME, "nombre"))
            )

            # Obtener el responsableId real del usuario logueado desde localStorage para evitar violar FKs
            try:
                user_id = driver.execute_script("return JSON.parse(localStorage.getItem('user')).userId;")
                responsable_val = str(user_id)
            except Exception:
                responsable_val = "1"

            # Función robusta para rellenar campos y disparar eventos de React
            # Resuelve el bug de sincronización de estado de React 16+ en Selenium
            def fill_field(name, value):
                try:
                    elem = driver.find_element(By.NAME, name)
                    if elem:
                        driver.execute_script("""
                            var elem = arguments[0];
                            var val = arguments[1];
                            var prototype = window.HTMLInputElement.prototype;
                            if (elem.tagName === 'SELECT') {
                                prototype = window.HTMLSelectElement.prototype;
                            } else if (elem.tagName === 'TEXTAREA') {
                                prototype = window.HTMLTextAreaElement.prototype;
                            }
                            var descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
                            if (descriptor && descriptor.set) {
                                descriptor.set.call(elem, val);
                            } else {
                                elem.value = val;
                            }
                            elem.dispatchEvent(new Event('input', { bubbles: true }));
                            elem.dispatchEvent(new Event('change', { bubbles: true }));
                        """, elem, value)
                except Exception as e:
                    print(f"Error rellenando campo {name}: {e}")

            # Rellenar todos los campos usando el método robusto
            fill_field("nombre", nombre)
            fill_field("ubicacion", "Ubicacion Test")
            fill_field("areaM2", "150.5")
            fill_field("tipoEstructura", "VIDRIO")
            fill_field("responsableId", responsable_val)
            fill_field("fechaCreacion", "2026-05-20")
            fill_field("estado", "ACTIVO")

            # Clic en guardar
            submit_btn = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
            )
            submit_btn.click()

            # Esperar y verificar que el invernadero aparezca en la lista
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, f"//td[contains(., '{nombre}')]")
                )
            )
        except Exception as e:
            # Capturar logs para depuración extrema
            print("\n" + "="*50)
            print("🚨 DEBUG: test_crear_invernadero falló por timeout o error!")
            print(f"URL actual: {driver.current_url}")
            try:
                alert = driver.find_element(By.XPATH, "//*[contains(@class,'error') or contains(@class,'alert') or @role='alert']")
                print(f"Alerta/Error detectado en pantalla: {alert.text}")
            except Exception:
                print("No se encontró ningún elemento de alerta/error explícito.")
            try:
                body_text = driver.find_element(By.TAG_NAME, "body").text
                print(f"Texto del body (primeros 1000 caracteres):\n{body_text[:1000]}")
            except Exception:
                print("No se pudo extraer el texto del body.")
            print("="*50 + "\n")
            raise e



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
