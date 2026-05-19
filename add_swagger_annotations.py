import os
import re
from datetime import datetime

JAVA_HEADER_TEMPLATE = """/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: {module}
 * Autor: Invernadero Team
 * Fecha: {date}
 * Descripcion: {description}
 */
"""

def process_java_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = os.path.basename(filepath)
    module_name = filename.replace('.java', '')
    
    # Check if header already exists
    if "Proyecto: Sistema Invernadero Automatizado" not in content:
        date_str = datetime.now().strftime("%Y-%m-%d")
        header = JAVA_HEADER_TEMPLATE.format(
            module=module_name,
            date=date_str,
            description=f"Clase para {module_name}"
        )
        # Find package declaration
        pkg_match = re.search(r'package\s+[\w\.]+;', content)
        if pkg_match:
            pkg_str = pkg_match.group(0)
            content = content.replace(pkg_str, f"{header}{pkg_str}")
    
    # Check if it's a controller to add Swagger annotations
    if '@RestController' in content and 'io.swagger.v3.oas.annotations.Operation' not in content:
        # Import statements
        imports_to_add = "import io.swagger.v3.oas.annotations.Operation;\nimport io.swagger.v3.oas.annotations.tags.Tag;\n"
        pkg_match = re.search(r'package\s+[\w\.]+;\n+', content)
        if pkg_match:
            content = content[:pkg_match.end()] + imports_to_add + content[pkg_match.end():]
            
        # Add @Tag to class
        class_match = re.search(r'(@RestController[\s\S]*?)(public\s+class\s+\w+)', content)
        if class_match and '@Tag' not in class_match.group(1):
            tag_annotation = f'@Tag(name = "{module_name}", description = "API para operaciones de {module_name}")\n'
            content = content.replace(class_match.group(2), f"{tag_annotation}{class_match.group(2)}")
            
        # Add @Operation to endpoints
        def replace_mapping(match):
            mapping = match.group(0)
            if '@Operation' in mapping:
                return mapping
            
            method_type = re.search(r'@(Get|Post|Put|Delete)Mapping', mapping).group(1)
            op_annotation = f'@Operation(summary = "Endpoint para {method_type} en {module_name}")\n    {mapping}'
            return op_annotation

        content = re.sub(r'@(Get|Post|Put|Delete)Mapping[^\n]*', replace_mapping, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    backend_dir = os.path.join(os.path.dirname(__file__), 'Backend', 'invernadero-backend', 'src', 'main', 'java')
    
    for root, _, files in os.walk(backend_dir):
        for file in files:
            if file.endswith('.java'):
                process_java_file(os.path.join(root, file))
                print(f"Processed: {file}")

if __name__ == "__main__":
    main()
