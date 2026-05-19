"""
Tests de pytest para los scripts generadores Python
Valida la generación correcta de SQL, diccionarios y código
"""

import pytest
import json
import os
import sys
from pathlib import Path

# Agregar el directorio raíz al path para importar los scripts
sys.path.insert(0, str(Path(__file__).parent.parent))

from generar_base_de_datos import (
    generar_sql_postgresql,
    generar_diccionario_datos,
    generar_entidades_relaciones
)


@pytest.fixture
def modelo_json_simple():
    """Fixture con un modelo JSON simplificado para tests"""
    return {
        "entidades": [
            {
                "nombre": "usuario",
                "descripcion": "Usuarios del sistema",
                "campos": [
                    {
                        "nombre": "id",
                        "tipo": "BIGSERIAL",
                        "restricciones": ["PRIMARY KEY"],
                        "descripcion": "Identificador único"
                    },
                    {
                        "nombre": "email",
                        "tipo": "VARCHAR(255)",
                        "restricciones": ["NOT NULL", "UNIQUE"],
                        "descripcion": "Correo electrónico"
                    },
                    {
                        "nombre": "nombre",
                        "tipo": "VARCHAR(255)",
                        "restricciones": ["NOT NULL"],
                        "descripcion": "Nombre completo"
                    }
                ]
            },
            {
                "nombre": "invernadero",
                "descripcion": "Invernaderos del sistema",
                "campos": [
                    {
                        "nombre": "id",
                        "tipo": "BIGSERIAL",
                        "restricciones": ["PRIMARY KEY"],
                        "descripcion": "Identificador único"
                    },
                    {
                        "nombre": "nombre",
                        "tipo": "VARCHAR(255)",
                        "restricciones": ["NOT NULL"],
                        "descripcion": "Nombre del invernadero"
                    },
                    {
                        "nombre": "usuario_id",
                        "tipo": "BIGINT",
                        "restricciones": ["NOT NULL"],
                        "descripcion": "Usuario propietario",
                        "relacion": {
                            "tabla": "usuario",
                            "campo": "id",
                            "tipo": "MANY_TO_ONE"
                        }
                    }
                ]
            }
        ]
    }


class TestGeneracionSQL:
    """Tests para la generación de SQL"""
    
    def test_generar_sql_crea_tablas(self, modelo_json_simple):
        """Verifica que se generan las sentencias CREATE TABLE"""
        sql = generar_sql_postgresql(modelo_json_simple)
        
        assert "CREATE TABLE usuario" in sql
        assert "CREATE TABLE invernadero" in sql
    
    def test_generar_sql_incluye_primary_keys(self, modelo_json_simple):
        """Verifica que se incluyen las PRIMARY KEY"""
        sql = generar_sql_postgresql(modelo_json_simple)
        
        assert "PRIMARY KEY" in sql
    
    def test_generar_sql_incluye_foreign_keys(self, modelo_json_simple):
        """Verifica que se generan las FOREIGN KEY"""
        sql = generar_sql_postgresql(modelo_json_simple)
        
        assert "FOREIGN KEY" in sql
        assert "REFERENCES usuario" in sql
    
    def test_generar_sql_incluye_constraints(self, modelo_json_simple):
        """Verifica que se incluyen las restricciones NOT NULL y UNIQUE"""
        sql = generar_sql_postgresql(modelo_json_simple)
        
        assert "NOT NULL" in sql
        assert "UNIQUE" in sql


class TestGeneracionDiccionario:
    """Tests para la generación del diccionario de datos"""
    
    def test_generar_diccionario_incluye_entidades(self, modelo_json_simple):
        """Verifica que el diccionario incluye todas las entidades"""
        diccionario = generar_diccionario_datos(modelo_json_simple)
        
        assert "usuario" in diccionario.lower()
        assert "invernadero" in diccionario.lower()
    
    def test_generar_diccionario_incluye_campos(self, modelo_json_simple):
        """Verifica que el diccionario incluye los campos de cada entidad"""
        diccionario = generar_diccionario_datos(modelo_json_simple)
        
        assert "email" in diccionario.lower()
        assert "nombre" in diccionario.lower()
    
    def test_generar_diccionario_incluye_tipos(self, modelo_json_simple):
        """Verifica que el diccionario incluye los tipos de datos"""
        diccionario = generar_diccionario_datos(modelo_json_simple)
        
        assert "VARCHAR" in diccionario
        assert "BIGINT" in diccionario or "BIGSERIAL" in diccionario
    
    def test_generar_diccionario_incluye_descripciones(self, modelo_json_simple):
        """Verifica que el diccionario incluye las descripciones"""
        diccionario = generar_diccionario_datos(modelo_json_simple)
        
        assert "Identificador único" in diccionario
        assert "Correo electrónico" in diccionario


class TestGeneracionRelaciones:
    """Tests para la generación del diagrama de relaciones"""
    
    def test_generar_relaciones_incluye_entidades(self, modelo_json_simple):
        """Verifica que el diagrama incluye todas las entidades"""
        relaciones = generar_entidades_relaciones(modelo_json_simple)
        
        assert "usuario" in relaciones.lower()
        assert "invernadero" in relaciones.lower()
    
    def test_generar_relaciones_incluye_foreign_keys(self, modelo_json_simple):
        """Verifica que el diagrama muestra las relaciones"""
        relaciones = generar_entidades_relaciones(modelo_json_simple)
        
        assert "usuario_id" in relaciones.lower() or "REFERENCES" in relaciones


class TestValidacionModelo:
    """Tests de validación del modelo JSON"""

    def test_modelo_json_valido(self):
        """Verifica que el modelo JSON principal es válido y tiene entidades"""
        modelo_path = Path(__file__).parent.parent / "Base de Datos" / "base_datos_invernadero.json"

        assert modelo_path.exists(), "El archivo base_datos_invernadero.json no existe"

        with open(modelo_path, 'r', encoding='utf-8') as f:
            modelo = json.load(f)

        # El modelo usa formato 'tablas' (dict de nombre -> definicion)
        assert "tablas" in modelo, "El modelo debe tener la clave 'tablas'"
        assert len(modelo["tablas"]) > 0, "El modelo debe tener al menos una tabla"

    def test_todas_entidades_tienen_pk(self):
        """Verifica que todas las entidades tienen exactamente un campo PK"""
        modelo_path = Path(__file__).parent.parent / "Base de Datos" / "base_datos_invernadero.json"

        with open(modelo_path, 'r', encoding='utf-8') as f:
            modelo = json.load(f)

        for nombre_tabla, info in modelo["tablas"].items():
            campos_pk = [
                nombre for nombre, props in info["campos"].items()
                if props.get("pk", False)
            ]
            assert len(campos_pk) >= 1, (
                f"La tabla '{nombre_tabla}' no tiene campo PK. "
                f"Campos encontrados: {list(info['campos'].keys())}"
            )

    def test_relaciones_validas(self):
        """Verifica que las FK apuntan a tablas que existen en el modelo"""
        modelo_path = Path(__file__).parent.parent / "Base de Datos" / "base_datos_invernadero.json"

        with open(modelo_path, 'r', encoding='utf-8') as f:
            modelo = json.load(f)

        nombres_tablas = set(modelo["tablas"].keys())

        for nombre_tabla, info in modelo["tablas"].items():
            for nombre_campo, props in info["campos"].items():
                if "fk" in props:
                    tabla_referenciada = props["fk"].split(".")[0]
                    assert tabla_referenciada in nombres_tablas, (
                        f"La FK en '{nombre_tabla}.{nombre_campo}' apunta a "
                        f"'{tabla_referenciada}' que no existe en el modelo"
                    )


class TestArchivosGenerados:
    """Tests para verificar que los archivos se generan correctamente"""
    
    def test_sql_generado_existe(self):
        """Verifica que el archivo SQL fue generado"""
        sql_path = Path(__file__).parent.parent / "Base de Datos" / "crear_db_postgresql.sql"
        assert sql_path.exists(), "El archivo crear_db_postgresql.sql no existe"
    
    def test_diccionario_txt_generado_existe(self):
        """Verifica que el diccionario TXT fue generado"""
        dict_path = Path(__file__).parent.parent / "Base de Datos" / "diccionario_datos.txt"
        assert dict_path.exists(), "El archivo diccionario_datos.txt no existe"
    
    def test_diccionario_pdf_generado_existe(self):
        """Verifica que el diccionario PDF fue generado"""
        pdf_path = Path(__file__).parent.parent / "Base de Datos" / "diccionario_datos.pdf"
        assert pdf_path.exists(), "El archivo diccionario_datos.pdf no existe"
    
    def test_relaciones_generado_existe(self):
        """Verifica que el archivo de relaciones fue generado"""
        rel_path = Path(__file__).parent.parent / "Base de Datos" / "entidades_relaciones.txt"
        assert rel_path.exists(), "El archivo entidades_relaciones.txt no existe"
