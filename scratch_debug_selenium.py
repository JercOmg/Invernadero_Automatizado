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
    print(f"Login exitoso, URL actual: {driver.current_url}")
    
    # Navegar a invernaderos
    print("3. Navegando a invernaderos...")
    link = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, "//a[contains(@href,'/invernadero')]")))
    link.click()
    WebDriverWait(driver, 5).until(EC.url_contains("/invernadero"))
    print(f"URL actual: {driver.current_url}")
    
    # Buscar el boton de nuevo usando el xpath original
    print("4. Intentando buscar boton de nuevo con XPath original...")
    xpath_original = "//*[contains(@class,'btn-nuevo') or contains(.,'Nuevo') or contains(.,'Crear') or contains(.,'Create') or contains(.,'New')]"
    elements = driver.find_elements(By.XPATH, xpath_original)
    print(f"Se encontraron {len(elements)} elementos para el XPath original:")
    for idx, elem in enumerate(elements):
        try:
            print(f"  [{idx}] Tag: {elem.tag_name}, Class: {elem.get_attribute('class')}, Text (first 50 chars): {elem.text[:50]!r}, Clickable: {elem.is_displayed() and elem.is_enabled()}")
        except Exception as e:
            print(f"  [{idx}] Error leyendo elemento: {e}")
            
    # Intentar buscar especificando tag name y text
    print("\n5. Buscando especificamente un boton o link clickable...")
    xpath_specific = "//a[contains(@href, '/invernadero/new')] | //button[contains(., 'Nuevo') or contains(., 'Crear')] | //a[contains(., 'Nuevo') or contains(., 'Crear')]"
    specific_elements = driver.find_elements(By.XPATH, xpath_specific)
    print(f"Se encontraron {len(specific_elements)} elementos específicos:")
    for idx, elem in enumerate(specific_elements):
        print(f"  [{idx}] Tag: {elem.tag_name}, Class: {elem.get_attribute('class')}, Text: {elem.text!r}")
        
    # Hacer clic con el específico
    if specific_elements:
        print("\n6. Haciendo clic en el botón específico...")
        specific_elements[0].click()
        time.sleep(1)
        print(f"URL tras clic: {driver.current_url}")
        
        # Esperar input nombre
        try:
            WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.NAME, "nombre")))
            print("¡Éxito! Se encontró el input con name='nombre'")
        except Exception:
            print("Error: No se encontró el input con name='nombre' tras hacer clic en el botón específico.")
            print(f"Cuerpo de la pagina actual:\n{driver.find_element(By.TAG_NAME, 'body').text[:1000]}")
            
except Exception as e:
    print(f"🚨 Error durante la depuración: {e}")
finally:
    driver.quit()
