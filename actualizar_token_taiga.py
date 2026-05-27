import os
import re
import urllib.request
import urllib.error
import json
import getpass

print("🌱 Actualizador de Token de Taiga para Invernadero Automatizado")
print("="*60)

# 1. Pedir credenciales de Taiga de forma segura
username = input("Introduce tu usuario o email de Taiga: ").strip()
password = getpass.getpass("Introduce tu contraseña de Taiga (no se mostrará en pantalla): ").strip()

if not username or not password:
    print("❌ Error: El usuario y la contraseña no pueden estar vacíos.")
    exit(1)

# 2. Realizar petición de autenticación a la API de Taiga
auth_url = "https://api.taiga.io/api/v1/auth"
payload = {
    "type": "normal",
    "username": username,
    "password": password
}
data_bytes = json.dumps(payload).encode("utf-8")

req = urllib.request.Request(
    auth_url,
    data=data_bytes,
    headers={"Content-Type": "application/json"}
)

try:
    print("\n🔑 Conectando con Taiga Agile API...")
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        token = res_data.get("auth_token")
        
        if token:
            print("✅ ¡Autenticación exitosa! Token recuperado correctamente.")
            
            # 3. Ruta del archivo de properties
            prop_path = os.path.join(
                "Backend", "invernadero-backend", "src", "main", "resources", "application.properties"
            )
            
            if not os.path.exists(prop_path):
                print(f"❌ Error: No se encontró el archivo '{prop_path}'. ¿Estás corriendo el script en la raíz del proyecto?")
                exit(1)
                
            # 4. Leer y reemplazar el token en application.properties
            with open(prop_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                
            updated = False
            for idx, line in enumerate(lines):
                if line.startswith("taiga.api.token="):
                    # Reemplazamos la propiedad respetando el fallback de variables de entorno de Spring
                    lines[idx] = f"taiga.api.token=${{TAIGA_BEARER_TOKEN:{token}}}\n"
                    updated = True
                    break
            
            if updated:
                with open(prop_path, "w", encoding="utf-8") as f:
                    f.writelines(lines)
                print(f"📝 Archivo '{prop_path}' actualizado exitosamente con tu nuevo token.")
                print("\n🚀 ¡Listo! El backend de Spring Boot se reiniciará automáticamente si está corriendo.")
            else:
                print("❌ Error: No se encontró la propiedad 'taiga.api.token' en el archivo.")
        else:
            print("❌ Error: La API no devolvió un token de autorización válido.")
            
except urllib.error.HTTPError as e:
    print(f"❌ Error de autenticación ({e.code}): Credenciales inválidas o error del servidor.")
    try:
        err_msg = json.loads(e.read().decode("utf-8"))
        print(f"Detalle de Taiga: {err_msg.get('_error_message', 'Desconocido')}")
    except Exception:
        pass
except Exception as e:
    print(f"❌ Error inesperado: {e}")
