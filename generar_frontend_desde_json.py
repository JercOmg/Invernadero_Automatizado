#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar automaticamente paginas CRUD de React desde el modelo JSON
Genera: Servicios API, Componentes List, Componentes Form, CSS y Rutas

Autor: Invernadero Team
Version: 1.0.0
Fecha: 2026-05-15
"""

import json
import os
from pathlib import Path

# Configuracion de rutas
BASE_DIR = Path(__file__).parent
JSON_PATH = BASE_DIR / "Base de Datos" / "base_datos_invernadero.json"
FRONTEND_DIR = BASE_DIR / "Frontend" / "src"

def cargar_modelo_json():
    """Carga el modelo JSON desde el archivo"""
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def capitalizar(texto):
    """Capitaliza la primera letra de un texto"""
    return texto[0].upper() + texto[1:] if texto else texto

def snake_to_camel(snake_str):
    """Convierte snake_case a camelCase"""
    components = snake_str.split('_')
    return components[0] + ''.join(capitalizar(x) for x in components[1:])

def snake_to_pascal(snake_str):
    """Convierte snake_case a PascalCase"""
    components = snake_str.split('_')
    return ''.join(capitalizar(x) for x in components)

def obtener_tipo_input(tipo_sql, campo_info):
    """Determina el tipo de input HTML basado en el tipo SQL"""
    tipo_base = tipo_sql.split('(')[0].upper()
    
    if tipo_base in ['INT', 'BIGINT', 'DECIMAL', 'FLOAT', 'DOUBLE']:
        return 'number'
    elif tipo_base == 'DATE':
        return 'date'
    elif tipo_base == 'DATETIME' or tipo_base == 'TIMESTAMP':
        return 'datetime-local'
    elif tipo_base == 'BOOLEAN':
        return 'checkbox'
    elif tipo_base == 'TEXT':
        return 'textarea'
    elif campo_info.get('valores'):
        return 'select'
    else:
        return 'text'

def generar_servicio(nombre_tabla, nombre_clase):
    """Genera el archivo de servicio API para una entidad"""
    codigo = f"""import apiClient from './api';

/**
 * Servicio para operaciones CRUD de {nombre_clase}
 */
const {snake_to_camel(nombre_tabla)}Service = {{
  /**
   * Obtener todos los registros
   */
  getAll: async (page = 0, size = 10) => {{
    const response = await apiClient.get('/{nombre_tabla}', {{
      params: {{ page, size }}
    }});
    return response.data;
  }},

  /**
   * Obtener un registro por ID
   */
  getById: async (id) => {{
    const response = await apiClient.get(`/{nombre_tabla}/${{id}}`);
    return response.data;
  }},

  /**
   * Crear un nuevo registro
   */
  create: async (data) => {{
    const response = await apiClient.post('/{nombre_tabla}', data);
    return response.data;
  }},

  /**
   * Actualizar un registro existente
   */
  update: async (id, data) => {{
    const response = await apiClient.put(`/{nombre_tabla}/${{id}}`, data);
    return response.data;
  }},

  /**
   * Eliminar un registro
   */
  delete: async (id) => {{
    const response = await apiClient.delete(`/{nombre_tabla}/${{id}}`);
    return response.data;
  }},
}};

export default {snake_to_camel(nombre_tabla)}Service;
"""
    return codigo

def generar_componente_list(nombre_tabla, nombre_clase, info_tabla):
    """Genera el componente List para mostrar registros en tabla"""
    campos = info_tabla['campos']
    
    # Obtener los primeros 5 campos para mostrar en la tabla (excluyendo PK)
    campos_mostrar = []
    for campo_nombre, campo_info in list(campos.items())[:6]:
        if not campo_info.get('pk'):
            campos_mostrar.append({
                'nombre': campo_nombre,
                'label': campo_nombre.replace('_', ' ').title()
            })
    
    # Generar headers de tabla
    headers = '\n            '.join([f'<th>{campo["label"]}</th>' for campo in campos_mostrar])
    
    # Generar celdas de tabla
    celdas = '\n                '.join([f'<td>{{item.{snake_to_camel(campo["nombre"])}}}</td>' for campo in campos_mostrar])
    
    codigo = f"""import React, {{ useState, useEffect }} from 'react';
import {{ Link, useNavigate }} from 'react-router-dom';
import {snake_to_camel(nombre_tabla)}Service from '../../services/{snake_to_camel(nombre_tabla)}Service';
import './{nombre_clase}List.css';

/**
 * Componente para listar {nombre_clase}
 */
const {nombre_clase}List = () => {{
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {{
    loadItems();
  }}, []);

  const loadItems = async () => {{
    try {{
      setLoading(true);
      const data = await {snake_to_camel(nombre_tabla)}Service.getAll();
      setItems(data.content || data);
    }} catch (err) {{
      setError('Error al cargar los datos');
      console.error(err);
    }} finally {{
      setLoading(false);
    }}
  }};

  const handleDelete = async (id) => {{
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {{
      try {{
        await {snake_to_camel(nombre_tabla)}Service.delete(id);
        loadItems();
      }} catch (err) {{
        alert('Error al eliminar el registro');
        console.error(err);
      }}
    }}
  }};

  if (loading) {{
    return <div className="loading"><div className="spinner"></div></div>;
  }}

  if (error) {{
    return <div className="error-message">{{error}}</div>;
  }}

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>{nombre_clase}</h1>
        <Link to="/{nombre_tabla}/new" className="btn btn-primary">
          Crear Nuevo
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {headers}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {{items.length === 0 ? (
              <tr>
                <td colSpan="{{100}}" style={{{{ textAlign: 'center' }}}}>
                  No hay registros disponibles
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={{item.id{nombre_clase} || item.id}}>
                  {celdas}
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={{() => navigate(`/{nombre_tabla}/${{item.id{nombre_clase} || item.id}}`)}}
                        className="btn btn-sm btn-primary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={{() => handleDelete(item.id{nombre_clase} || item.id)}}
                        className="btn btn-sm btn-danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}}
          </tbody>
        </table>
      </div>
    </div>
  );
}};

export default {nombre_clase}List;
"""
    return codigo

def generar_componente_form(nombre_tabla, nombre_clase, info_tabla):
    """Genera el componente Form para crear/editar registros"""
    campos = info_tabla['campos']
    
    # Generar campos del formulario (excluir PK y autoincrementales)
    campos_form = []
    for campo_nombre, campo_info in campos.items():
        if campo_info.get('pk') or campo_info.get('autoincrement'):
            continue
        
        tipo_input = obtener_tipo_input(campo_info['tipo'], campo_info)
        nombre_camel = snake_to_camel(campo_nombre)
        label = campo_nombre.replace('_', ' ').title()
        required = 'required' if not campo_info.get('nullable', True) else ''
        
        if tipo_input == 'select' and campo_info.get('valores'):
            opciones = '\n              '.join([
                f'<option value="{val}">{val}</option>' 
                for val in campo_info['valores']
            ])
            campos_form.append(f"""          <div className="form-group">
            <label htmlFor="{nombre_camel}">{label}</label>
            <select
              id="{nombre_camel}"
              name="{nombre_camel}"
              value={{formData.{nombre_camel} || ''}}
              onChange={{handleChange}}
              {required}
            >
              <option value="">Seleccionar...</option>
              {opciones}
            </select>
          </div>""")
        elif tipo_input == 'textarea':
            campos_form.append(f"""          <div className="form-group">
            <label htmlFor="{nombre_camel}">{label}</label>
            <textarea
              id="{nombre_camel}"
              name="{nombre_camel}"
              value={{formData.{nombre_camel} || ''}}
              onChange={{handleChange}}
              rows="4"
              {required}
            />
          </div>""")
        elif tipo_input == 'checkbox':
            campos_form.append(f"""          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="{nombre_camel}"
                checked={{formData.{nombre_camel} || false}}
                onChange={{handleChange}}
              />
              {label}
            </label>
          </div>""")
        else:
            campos_form.append(f"""          <div className="form-group">
            <label htmlFor="{nombre_camel}">{label}</label>
            <input
              type="{tipo_input}"
              id="{nombre_camel}"
              name="{nombre_camel}"
              value={{formData.{nombre_camel} || ''}}
              onChange={{handleChange}}
              {required}
            />
          </div>""")
    
    campos_html = '\n\n'.join(campos_form)
    
    codigo = f"""import React, {{ useState, useEffect }} from 'react';
import {{ useNavigate, useParams }} from 'react-router-dom';
import {snake_to_camel(nombre_tabla)}Service from '../../services/{snake_to_camel(nombre_tabla)}Service';
import './{nombre_clase}Form.css';

/**
 * Componente para crear/editar {nombre_clase}
 */
const {nombre_clase}Form = () => {{
  const [formData, setFormData] = useState({{}});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {{ id }} = useParams();
  const isEdit = !!id;

  useEffect(() => {{
    if (isEdit) {{
      loadItem();
    }}
  }}, [id]);

  const loadItem = async () => {{
    try {{
      setLoading(true);
      const data = await {snake_to_camel(nombre_tabla)}Service.getById(id);
      setFormData(data);
    }} catch (err) {{
      setError('Error al cargar los datos');
      console.error(err);
    }} finally {{
      setLoading(false);
    }}
  }};

  const handleChange = (e) => {{
    const {{ name, value, type, checked }} = e.target;
    setFormData({{
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    }});
  }};

  const handleSubmit = async (e) => {{
    e.preventDefault();
    setError('');
    setLoading(true);

    try {{
      if (isEdit) {{
        await {snake_to_camel(nombre_tabla)}Service.update(id, formData);
      }} else {{
        await {snake_to_camel(nombre_tabla)}Service.create(formData);
      }}
      navigate('/{nombre_tabla}');
    }} catch (err) {{
      setError(err.response?.data?.message || 'Error al guardar los datos');
      console.error(err);
    }} finally {{
      setLoading(false);
    }}
  }};

  if (loading && isEdit) {{
    return <div className="loading"><div className="spinner"></div></div>;
  }}

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>{{isEdit ? 'Editar' : 'Crear'}} {nombre_clase}</h1>

        {{error && <div className="error-message">{{error}}</div>}}

        <form onSubmit={{handleSubmit}}>
{campos_html}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={{loading}}>
              {{loading ? 'Guardando...' : 'Guardar'}}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={{() => navigate('/{nombre_tabla}')}}
              disabled={{loading}}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}};

export default {nombre_clase}Form;
"""
    return codigo

def generar_css_list():
    """Genera CSS para componentes List"""
    return """.list-container {
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.list-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
}

.table-container {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}
"""

def generar_css_form():
    """Genera CSS para componentes Form"""
    return """.form-page {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.form-container h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 25px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.form-actions button {
  flex: 1;
}
"""

def crear_directorios_modulo(nombre_tabla):
    """Crea la estructura de directorios para un modulo"""
    pages_dir = FRONTEND_DIR / "pages" / nombre_tabla
    pages_dir.mkdir(parents=True, exist_ok=True)
    return pages_dir

def generar_modulo_completo(nombre_tabla, info_tabla):
    """Genera todos los archivos de un modulo"""
    print(f"Generando modulo frontend: {nombre_tabla}...")
    
    nombre_clase = snake_to_pascal(nombre_tabla)
    pages_dir = crear_directorios_modulo(nombre_tabla)
    
    # Generar servicio
    servicio_path = FRONTEND_DIR / "services" / f"{snake_to_camel(nombre_tabla)}Service.js"
    with open(servicio_path, 'w', encoding='utf-8') as f:
        f.write(generar_servicio(nombre_tabla, nombre_clase))
    
    # Generar componente List
    list_path = pages_dir / f"{nombre_clase}List.jsx"
    with open(list_path, 'w', encoding='utf-8') as f:
        f.write(generar_componente_list(nombre_tabla, nombre_clase, info_tabla))
    
    # Generar CSS List
    list_css_path = pages_dir / f"{nombre_clase}List.css"
    with open(list_css_path, 'w', encoding='utf-8') as f:
        f.write(generar_css_list())
    
    # Generar componente Form
    form_path = pages_dir / f"{nombre_clase}Form.jsx"
    with open(form_path, 'w', encoding='utf-8') as f:
        f.write(generar_componente_form(nombre_tabla, nombre_clase, info_tabla))
    
    # Generar CSS Form
    form_css_path = pages_dir / f"{nombre_clase}Form.css"
    with open(form_css_path, 'w', encoding='utf-8') as f:
        f.write(generar_css_form())
    
    print(f"  ✓ Modulo {nombre_tabla} generado exitosamente")

def generar_rutas(tablas):
    """Genera el codigo de rutas para App.jsx"""
    rutas = []
    imports = []
    
    for nombre_tabla in tablas.keys():
        if nombre_tabla == 'usuario':
            continue
        
        nombre_clase = snake_to_pascal(nombre_tabla)
        imports.append(f"import {nombre_clase}List from './pages/{nombre_tabla}/{nombre_clase}List';")
        imports.append(f"import {nombre_clase}Form from './pages/{nombre_tabla}/{nombre_clase}Form';")
        
        rutas.append(f'            <Route path="{nombre_tabla}" element={{<{nombre_clase}List />}} />')
        rutas.append(f'            <Route path="{nombre_tabla}/new" element={{<{nombre_clase}Form />}} />')
        rutas.append(f'            <Route path="{nombre_tabla}/:id" element={{<{nombre_clase}Form />}} />')
    
    return '\n'.join(imports), '\n'.join(rutas)

def main():
    """Funcion principal"""
    print("=" * 80)
    print("GENERADOR DE PAGINAS CRUD REACT DESDE JSON")
    print("=" * 80)
    print()
    
    # Cargar modelo JSON
    print("Cargando modelo JSON...")
    modelo = cargar_modelo_json()
    tablas = modelo['tablas']
    
    # Excluir la tabla usuario (ya fue creada manualmente)
    tablas_a_generar = {k: v for k, v in tablas.items() if k != 'usuario'}
    
    print(f"Tablas a generar: {len(tablas_a_generar)}")
    print()
    
    # Generar cada modulo
    for nombre_tabla, info_tabla in tablas_a_generar.items():
        try:
            generar_modulo_completo(nombre_tabla, info_tabla)
        except Exception as e:
            print(f"  ✗ Error generando {nombre_tabla}: {str(e)}")
    
    # Generar rutas
    print()
    print("Generando codigo de rutas...")
    imports_code, rutas_code = generar_rutas(tablas)
    
    rutas_file = FRONTEND_DIR / "routes_generated.txt"
    with open(rutas_file, 'w', encoding='utf-8') as f:
        f.write("// IMPORTS - Agregar al inicio de App.jsx\n")
        f.write(imports_code)
        f.write("\n\n// RUTAS - Agregar dentro del Layout Route\n")
        f.write(rutas_code)
    
    print(f"  ✓ Codigo de rutas generado en: {rutas_file}")
    
    print()
    print("=" * 80)
    print("GENERACION COMPLETADA")
    print("=" * 80)
    print()
    print(f"Total de modulos generados: {len(tablas_a_generar)}")
    print(f"Ubicacion: {FRONTEND_DIR}")
    print()
    print("NOTA: Debes agregar manualmente las rutas generadas a App.jsx")

if __name__ == "__main__":
    main()
