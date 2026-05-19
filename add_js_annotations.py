import os
import re
from datetime import datetime

JS_HEADER_TEMPLATE = """/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: {module}
 * Autor: Invernadero Team
 * Fecha: {date}
 * Descripcion: {description}
 */
"""

def process_js_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = os.path.basename(filepath)
    module_name = filename.replace('.jsx', '').replace('.js', '')
    
    # Check if header already exists
    if "Proyecto: Sistema Invernadero Automatizado" not in content:
        date_str = datetime.now().strftime("%Y-%m-%d")
        header = JS_HEADER_TEMPLATE.format(
            module=module_name,
            date=date_str,
            description=f"Componente/Servicio {module_name}"
        )
        content = header + content
    
    # Check for basic JSDoc on React components (arrow functions starting with const)
    # This is a very simple regex, might not catch all but will add to main exports
    if filename.endswith('.jsx'):
        def replace_component(match):
            func_name = match.group(1)
            full_match = match.group(0)
            if '/**' in content.split(full_match)[0][-50:]: # Check if there's a comment right before
                return full_match
            jsdoc = f"/**\n * Componente {func_name}\n * @returns {{JSX.Element}}\n */\n"
            return jsdoc + full_match
            
        content = re.sub(r'const\s+([A-Z]\w+)\s*=\s*\([^)]*\)\s*=>\s*{', replace_component, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def create_readmes(frontend_dir):
    pages_dir = os.path.join(frontend_dir, 'src', 'pages')
    if not os.path.exists(pages_dir):
        return
        
    for module in os.listdir(pages_dir):
        module_path = os.path.join(pages_dir, module)
        if os.path.isdir(module_path):
            readme_path = os.path.join(module_path, 'README.md')
            if not os.path.exists(readme_path):
                readme_content = f"""# Modulo {module.capitalize()}

## Descripcion
Este modulo gestiona las vistas y operaciones relacionadas con `{module}`.

## Componentes Principales
- `{module.capitalize()}List.jsx`: Muestra la lista de registros.
- `{module.capitalize()}Form.jsx`: Formulario para crear y editar registros.

## Rutas
- `/{module}`: Vista de lista
- `/{module}/new`: Crear nuevo
- `/{module}/:id`: Editar existente

## Dependencias
- `react`, `react-router-dom`
- `react-i18next`
- Servicios del API (`{module}Service.js`)
"""
                with open(readme_path, 'w', encoding='utf-8') as f:
                    f.write(readme_content)
                print(f"Created README.md for {module}")

def main():
    frontend_dir = os.path.join(os.path.dirname(__file__), 'Frontend')
    src_dir = os.path.join(frontend_dir, 'src')
    
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.js') or file.endswith('.jsx'):
                process_js_file(os.path.join(root, file))
                print(f"Processed: {file}")
                
    create_readmes(frontend_dir)

if __name__ == "__main__":
    main()
