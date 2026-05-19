"""
============================================================
Proyecto  : Sistema de Gestion de Invernadero Automatizado
Modulo    : generar_base_de_datos.py  (raiz del proyecto)
Descripcion: Adaptador/fachada que expone las funciones del generador
             ubicado en 'Base de Datos/' con los nombres que esperan
             los tests pytest y el pipeline CI/CD.

             Las funciones publicas son:
               - generar_sql_postgresql(modelo)  -> str
               - generar_diccionario_datos(modelo) -> str
               - generar_entidades_relaciones(modelo) -> str

             El modelo puede tener formato:
               A) {"tablas": {...}}     <- formato nativo del proyecto
               B) {"entidades": [...]}  <- formato alternativo de los tests

Uso directo: python generar_base_de_datos.py
             (genera todos los artefactos en 'Base de Datos/')
============================================================
"""

import sys
from pathlib import Path

# 'Base de Datos/' se agrega al path SOLO cuando se ejecuta directamente,
# no al importar como modulo, para evitar importacion circular.
_BASE_DATOS_DIR = Path(__file__).parent / "Base de Datos"


# ─────────────────────────────────────────────────────────────
#  NORMALIZADOR DE MODELO
# ─────────────────────────────────────────────────────────────
def _normalizar_modelo(modelo: dict) -> dict:
    """
    Normaliza el modelo al formato interno {'tablas': {...}}.

    Acepta dos formatos de entrada:
      Formato A (nativo):    {"tablas": {"tabla1": {"campos": {...}}, ...}}
      Formato B (tests):     {"entidades": [{"nombre": "...", "campos": [...]}]}

    Returns:
        dict con estructura {'tablas': {...}} compatible con el generador.
    """
    if "tablas" in modelo:
        return modelo  # Ya esta en formato nativo

    if "entidades" not in modelo:
        raise ValueError("El modelo debe tener 'tablas' o 'entidades'")

    # Convertir formato B → formato A
    tablas = {}
    for entidad in modelo["entidades"]:
        nombre = entidad["nombre"]
        campos_lista = entidad.get("campos", [])
        campos_dict = {}

        for campo in campos_lista:
            nombre_campo = campo["nombre"]
            restricciones = campo.get("restricciones", [])
            relacion = campo.get("relacion", None)

            props = {
                "tipo": campo.get("tipo", "VARCHAR(255)"),
                "nullable": "NOT NULL" not in restricciones,
                "descripcion": campo.get("descripcion", ""),
            }

            if "PRIMARY KEY" in restricciones:
                props["pk"] = True
                props["nullable"] = False
                # Normalizar tipo a INT para compatibilidad
                if props["tipo"] in ("BIGSERIAL", "SERIAL"):
                    props["tipo"] = "INT"

            if "UNIQUE" in restricciones:
                props["unique"] = True

            if relacion:
                ref_tabla = relacion.get("tabla", "")
                ref_campo = relacion.get("campo", "id")
                props["fk"] = f"{ref_tabla}.{ref_campo}"

            campos_dict[nombre_campo] = props

        tablas[nombre] = {
            "descripcion": entidad.get("descripcion", f"Entidad {nombre}"),
            "campos": campos_dict,
        }

    return {
        "metadata": {
            "proyecto": "Sistema de Gestion de Invernadero Automatizado",
            "version": "1.0.0",
            "motor_destino": "postgresql",
            "descripcion": "Generado desde modelo de tests",
            "conexion": {"nombre_db": "invernadero_db"},
        },
        "tablas": tablas,
    }


# ─────────────────────────────────────────────────────────────
#  API PUBLICA — funciones que los tests importan
# ─────────────────────────────────────────────────────────────
def generar_sql_postgresql(modelo: dict) -> str:
    """
    Genera el script SQL CREATE TABLE para PostgreSQL.

    Args:
        modelo: dict con formato 'tablas' o 'entidades'

    Returns:
        str con el SQL completo
    """
    from datetime import datetime

    modelo_norm = _normalizar_modelo(modelo)
    tablas = modelo_norm["tablas"]
    meta = modelo_norm.get("metadata", {})
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lineas = [
        "-- ============================================================",
        f"-- Proyecto : {meta.get('proyecto', 'Invernadero')}",
        f"-- Generado : {fecha}",
        "-- Motor    : PostgreSQL",
        "-- ============================================================",
        "",
        "-- DROP en orden inverso",
    ]

    for tabla in reversed(list(tablas.keys())):
        lineas.append(f"DROP TABLE IF EXISTS {tabla} CASCADE;")
    lineas.append("")

    for tabla, info in tablas.items():
        lineas += [
            f"-- Tabla: {tabla}",
            f"CREATE TABLE {tabla} (",
        ]
        campos = info["campos"]
        fks = {}
        col_defs = []

        for campo, props in campos.items():
            es_pk = props.get("pk", False)
            es_fk = "fk" in props
            tipo_raw = props["tipo"]
            base = tipo_raw.split("(")[0].upper()

            # Mapeo de tipos
            if es_pk and base == "INT":
                tipo = "SERIAL"
            elif base == "INT":
                tipo = "INTEGER"
            elif base in ("BIGSERIAL", "SERIAL"):
                tipo = tipo_raw
            elif base == "DATETIME":
                tipo = "TIMESTAMP"
            else:
                tipo = tipo_raw

            partes = [f"    {campo:<30} {tipo}"]
            if not props.get("nullable", True):
                partes.append("NOT NULL")
            if props.get("unique"):
                partes.append("UNIQUE")
            if props.get("default") is not None:
                v = props["default"]
                if isinstance(v, bool):
                    partes.append(f"DEFAULT {str(v).upper()}")
                elif isinstance(v, (int, float)):
                    partes.append(f"DEFAULT {v}")
                else:
                    partes.append(f"DEFAULT '{v}'")

            col_defs.append(" ".join(partes))

            if es_pk:
                col_defs.append(f"    CONSTRAINT pk_{tabla} PRIMARY KEY ({campo})")

            if es_fk:
                ref = props["fk"].split(".")
                fks[campo] = (ref[0], ref[1] if len(ref) > 1 else "id")

        for campo_fk, (ref_tabla, ref_campo) in fks.items():
            col_defs.append(
                f"    CONSTRAINT fk_{tabla}_{campo_fk} FOREIGN KEY ({campo_fk})\n"
                f"        REFERENCES {ref_tabla}({ref_campo})"
            )

        lineas.append(",\n".join(col_defs))
        lineas.append(");")
        lineas.append("")

    return "\n".join(lineas)


def generar_diccionario_datos(modelo: dict) -> str:
    """
    Genera el diccionario de datos en texto plano.

    Args:
        modelo: dict con formato 'tablas' o 'entidades'

    Returns:
        str con el diccionario completo
    """
    from datetime import datetime

    modelo_norm = _normalizar_modelo(modelo)
    tablas = modelo_norm["tablas"]
    meta = modelo_norm.get("metadata", {})
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sep = "=" * 80
    lineas = [
        sep,
        "  DICCIONARIO DE DATOS",
        f"  Proyecto : {meta.get('proyecto', 'Invernadero')}",
        f"  Fecha    : {fecha}",
        sep,
        f"  Total de entidades: {len(tablas)}",
        "",
    ]

    for i, (tabla, info) in enumerate(tablas.items(), 1):
        campos = info["campos"]
        lineas += [
            sep,
            f"  ENTIDAD {i:02d}: {tabla.upper()}",
            f"  Descripcion: {info.get('descripcion', '')}",
            sep,
            f"  {'Campo':<28} {'Tipo':<20} {'Nulo':<6} {'PK':<4} {'FK':<4} {'Unico':<7} Descripcion",
            "  " + "-" * 80,
        ]

        for campo, props in campos.items():
            es_pk = "SI" if props.get("pk", False) else "NO"
            es_fk = "SI" if "fk" in props else "NO"
            nulo = "SI" if props.get("nullable", True) else "NO"
            unico = "SI" if props.get("unique", False) else "NO"
            tipo = props.get("tipo", "VARCHAR")
            desc = props.get("descripcion", "—")

            lineas.append(
                f"  {campo:<28} {tipo:<20} {nulo:<6} {es_pk:<4} {es_fk:<4} {unico:<7} {desc}"
            )
            if props.get("valores"):
                vals = " | ".join(str(v) for v in props["valores"])
                lineas.append(f"  {'':>28} Valores: {vals}")
            if "fk" in props:
                lineas.append(f"  {'':>28} FK -> {props['fk']}")

        lineas.append("")

    return "\n".join(lineas)


def generar_entidades_relaciones(modelo: dict) -> str:
    """
    Genera el ERD textual con mapa de relaciones.

    Args:
        modelo: dict con formato 'tablas' o 'entidades'

    Returns:
        str con el ERD textual
    """
    from datetime import datetime

    modelo_norm = _normalizar_modelo(modelo)
    tablas = modelo_norm["tablas"]
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sep = "=" * 80
    lineas = [
        sep,
        "  ENTIDADES Y RELACIONES (ERD textual)",
        f"  Generado : {fecha}",
        sep,
        "",
        "  MAPA DE RELACIONES",
        "-" * 80,
    ]

    for tabla, info in tablas.items():
        for campo, props in info["campos"].items():
            if "fk" in props:
                partes = props["fk"].split(".")
                ref_tabla = partes[0]
                ref_campo = partes[1] if len(partes) > 1 else "id"
                lineas.append(f"  {tabla:<20} |--[{campo}]--> {ref_tabla}({ref_campo})")

    lineas += ["", "-" * 80, "", "  DETALLE DE ENTIDADES"]

    for tabla, info in tablas.items():
        lineas += [
            "",
            f"  +{'─' * 60}+",
            f"  | ENTIDAD: {tabla.upper():<49}|",
            f"  | {info.get('descripcion', '')[:58]:<58}|",
            f"  +{'─' * 60}+",
        ]
        for campo, props in info["campos"].items():
            marcas = []
            if props.get("pk"):
                marcas.append("PK")
            if "fk" in props:
                marcas.append(f"FK->{props['fk']}")
            if not props.get("nullable", True):
                marcas.append("NOT NULL")
            marca_str = f"  [{', '.join(marcas)}]" if marcas else ""
            lineas.append(f"  | {campo:<28} {props.get('tipo', ''):<18}{marca_str}")
        lineas.append(f"  +{'─' * 60}+")

    lineas += ["", sep]
    return "\n".join(lineas)


# ─────────────────────────────────────────────────────────────
#  ENTRY POINT — ejecuta el generador original completo
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Importacion diferida para evitar circular import al importar como modulo
    sys.path.insert(0, str(_BASE_DATOS_DIR))
    from generar_base_de_datos import main as _main_original  # noqa: E402 F401
    _main_original()
