import sys
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

driver = webdriver.Chrome(options=chrome_options)
driver.implicitly_wait(10)

BASE_URL = "http://localhost:5173"
ADMIN_EMAIL = "admin@invernadero.com"
ADMIN_PASSWORD = "Admin123456"

try:
    print("1. Cargando login...")
    driver.get(f"{BASE_URL}/login")
    
    # Login
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.NAME, "email")))
    driver.find_element(By.NAME, "email").send_keys(ADMIN_EMAIL)
    driver.find_element(By.NAME, "password").send_keys(ADMIN_PASSWORD)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    
    print("2. Esperando dashboard...")
    WebDriverWait(driver, 5).until(EC.url_contains("/dashboard"))
    
    # Navegar a invernaderos
    print("3. Navegando a invernaderos...")
    link = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, "//a[contains(@href,'/invernadero')]")))
    link.click()
    # Esperar a que la URL contenga /invernadero pero no /new
    WebDriverWait(driver, 5).until(lambda d: "/invernadero" in d.current_url and "/new" not in d.current_url)
    
    # Buscar el boton de nuevo usando el xpath especifico que arreglamos
    print("4. Buscando boton de nuevo...")
    xpath_specific = "//a[contains(@href, '/invernadero/new')] | //button[contains(., 'Nuevo') or contains(., 'Crear')]"
    btn_nuevo = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, xpath_specific)))
    btn_nuevo.click()
    
    # Esperar input nombre
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.NAME, "nombre")))
    print("5. Llegamos a la página de creación.")
    
    # Obtener userId real
    try:
        user_id = driver.execute_script("return JSON.parse(localStorage.getItem('user')).userId;")
        responsable_val = str(user_id)
    except Exception:
        responsable_val = "1"
    print(f"Responsable ID real: {responsable_val}")

    # Método de rellenado compatible con React 16+
    def fill_field_react(name, value):
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
                print(f"  Rellenado {name} -> {value}")
        except Exception as e:
            print(f"  Error rellenando {name}: {e}")

    # Rellenar
    fill_field_react("nombre", f"Invernadero React {int(time.time())}")
    fill_field_react("ubicacion", "Ubicación React")
    fill_field_react("areaM2", "200.5")
    fill_field_react("tipoEstructura", "POLICARBONATO")
    fill_field_react("responsableId", responsable_val)
    fill_field_react("fechaCreacion", "2026-05-25")
    fill_field_react("estado", "ACTIVO")
    
    # Clic en guardar
    print("6. Haciendo clic en Guardar...")
    submit_btn = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
    )
    submit_btn.click()
    
    # Esperar redirección a listado
    print("7. Esperando redirección a /invernadero (sin /new)...")
    WebDriverWait(driver, 5).until(lambda d: "/invernadero" in d.current_url and "/new" not in d.current_url)
    print(f"¡Éxito! Redirigido a: {driver.current_url}")

except Exception as e:
    print(f"🚨 Error durante la depuración: {e}")
    try:
        print(f"URL actual al fallar: {driver.current_url}")
        print("\n--- BROWSER CONSOLE LOGS ---")
        logs = driver.get_log('browser')
        for entry in logs:
            print(f"[{entry['level']}] {entry['timestamp']} - {entry['message']}")
        print("----------------------------\n")
        
        # Intentar extraer mensaje de error en pantalla
        try:
            err_msg = driver.find_element(By.CLASS_NAME, "error-message").text
            print(f"Mensaje de error en pantalla: {err_msg}")
        except Exception:
            pass
            
        print(f"Cuerpo de la página:\n{driver.find_element(By.TAG_NAME, 'body').text[:1000]}")
    except Exception as log_err:
        print(f"No se pudieron extraer los logs del navegador: {log_err}")
finally:
    driver.quit()
