"""
============================================================
Proyecto  : Sistema de Gestion de Invernadero Automatizado
Modulo    : generar_base_de_datos.py
Descripcion: Lee el modelo JSON (base_datos_invernadero.json) y genera
             automaticamente:
               1. Script SQL para PostgreSQL
               2. Diccionario de datos en formato TXT
               3. Diccionario de datos en formato PDF
               4. Descripcion textual de entidades y relaciones (ERD)
Uso       : python generar_base_de_datos.py
Requisitos: pip install reportlab
============================================================
"""

import json
import os
from pathlib import Path
from datetime import datetime

# ─────────────────────────────────────────────────────────────
#  CONFIGURACION DE RUTAS
# ─────────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
JSON_MODELO  = SCRIPT_DIR / "base_datos_invernadero.json"
SQL_SALIDA   = SCRIPT_DIR / "crear_db_postgresql.sql"
DICT_TXT     = SCRIPT_DIR / "diccionario_datos.txt"
DICT_PDF     = SCRIPT_DIR / "diccionario_datos.pdf"
ERD_SALIDA   = SCRIPT_DIR / "entidades_relaciones.txt"

LINEA_SIMPLE  = "-" * 80
LINEA_DOBLE   = "=" * 80
FECHA_HOY     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")


# ─────────────────────────────────────────────────────────────
#  UTILIDADES
# ─────────────────────────────────────────────────────────────
def cargar_modelo() -> dict:
    """Carga y retorna el modelo JSON de la base de datos."""
    if not JSON_MODELO.exists():
        raise FileNotFoundError(
            f"\nERROR: No se encontro el archivo de modelo:\n  {JSON_MODELO}\n"
            f"Asegurate de que 'base_datos_invernadero.json' este en la misma carpeta."
        )
    with open(JSON_MODELO, encoding="utf-8") as f:
        return json.load(f)


def tipo_sql(tipo_abs: str) -> str:
    """Convierte el tipo abstracto del JSON al tipo SQL de PostgreSQL."""
    base = tipo_abs.split("(")[0].upper()
    mapeo = {
        "INT":      "SERIAL",
        "VARCHAR":  tipo_abs,
        "TEXT":     "TEXT",
        "DECIMAL":  tipo_abs.replace("DECIMAL", "DECIMAL"),
        "BOOLEAN":  "BOOLEAN",
        "DATE":     "DATE",
        "DATETIME": "TIMESTAMP",
    }
    return mapeo.get(base, tipo_abs)


def tipo_sql_campo(tipo_abs: str, es_pk: bool) -> str:
    """
    Devuelve el tipo SQL correcto.
    Las PKs de tipo INT usan SERIAL (autoincrement en PostgreSQL).
    Los demas INT usan INTEGER (para FKs y campos normales).
    """
    base = tipo_abs.split("(")[0].upper()
    if es_pk and base == "INT":
        return "SERIAL"
    if base == "INT":
        return "INTEGER"
    return tipo_sql(tipo_abs)


# ─────────────────────────────────────────────────────────────
#  GENERADOR 1: SQL POSTGRESQL
# ─────────────────────────────────────────────────────────────
def generar_sql(modelo: dict):
    """
    Genera el script SQL completo para PostgreSQL a partir del modelo JSON.
    Incluye: DROP TABLE, CREATE TABLE con PK/FK/UNIQUE/DEFAULT/CHECK,
    e indices basicos.
    """
    meta   = modelo["metadata"]
    tablas = modelo["tablas"]
    lineas = []

    # Encabezado
    lineas += [
        LINEA_DOBLE,
        f"-- Proyecto : {meta['proyecto']}",
        f"-- Version  : {meta['version']}",
        f"-- Generado : {FECHA_HOY}",
        f"-- Motor    : PostgreSQL",
        f"-- Script   : crear_db_postgresql.sql",
        LINEA_DOBLE,
        "",
        "-- Eliminar tablas en orden inverso (respeta FK)",
    ]

    # DROP TABLE en orden inverso para respetar FK
    for tabla in reversed(list(tablas.keys())):
        lineas.append(f"DROP TABLE IF EXISTS {tabla} CASCADE;")

    lineas += ["", LINEA_SIMPLE, ""]

    # CREATE TABLE por cada tabla
    for tabla, info in tablas.items():
        lineas += [
            LINEA_SIMPLE,
            f"-- Tabla: {tabla}",
            f"-- {info['descripcion']}",
            LINEA_SIMPLE,
            f"CREATE TABLE {tabla} (",
        ]

        campos   = info["campos"]
        fks      = {}
        col_defs = []

        for campo, props in campos.items():
            es_pk      = props.get("pk", False)
            es_fk      = "fk" in props
            tipo       = tipo_sql_campo(props["tipo"], es_pk)
            nullable   = props.get("nullable", True)
            unique     = props.get("unique", False)
            default    = props.get("default", None)
            valores    = props.get("valores", [])

            partes = [f"    {campo:<30} {tipo}"]

            if not nullable:
                partes.append("NOT NULL")
            if unique:
                partes.append("UNIQUE")
            if default is not None:
                if isinstance(default, bool):
                    partes.append(f"DEFAULT {str(default).upper()}")
                elif isinstance(default, (int, float)):
                    partes.append(f"DEFAULT {default}")
                else:
                    partes.append(f"DEFAULT '{default}'")
            if valores:
                vals = ", ".join(f"'{v}'" for v in valores)
                partes.append(f"CHECK ({campo} IN ({vals}))")

            col_defs.append(" ".join(partes))

            if es_pk:
                col_defs.append(f"    CONSTRAINT pk_{tabla} PRIMARY KEY ({campo})")

            if es_fk:
                ref_tabla = props["fk"].split(".")[0]
                ref_campo = props["fk"].split(".")[1]
                fks[campo] = (ref_tabla, ref_campo)

        # FK al final de la tabla
        for campo_fk, (ref_tabla, ref_campo) in fks.items():
            nombre_fk = f"fk_{tabla}_{campo_fk}"
            col_defs.append(
                f"    CONSTRAINT {nombre_fk} FOREIGN KEY ({campo_fk})\n"
                f"        REFERENCES {ref_tabla}({ref_campo}) ON DELETE RESTRICT ON UPDATE CASCADE"
            )

        lineas.append(",\n".join(col_defs))
        lineas.append(");")
        lineas.append("")

        # Indices basicos en FK
        for campo_fk in fks:
            lineas.append(f"CREATE INDEX idx_{tabla}_{campo_fk} ON {tabla}({campo_fk});")
        lineas.append("")

    # Pie del script
    lineas += [
        LINEA_DOBLE,
        f"-- Fin del script generado el {FECHA_HOY}",
        LINEA_DOBLE,
    ]

    SQL_SALIDA.write_text("\n".join(lineas), encoding="utf-8")
    print(f"  [+] SQL generado: {SQL_SALIDA.name}")


# ─────────────────────────────────────────────────────────────
#  GENERADOR 2: DICCIONARIO DE DATOS (TXT)
# ─────────────────────────────────────────────────────────────
def generar_diccionario_txt(modelo: dict):
    """
    Genera el diccionario de datos completo en formato de texto plano.
    Para cada tabla: descripcion, y por cada campo: nombre, tipo, restricciones,
    descripcion y valores permitidos (si aplica).
    """
    meta   = modelo["metadata"]
    tablas = modelo["tablas"]
    lineas = []

    lineas += [
        LINEA_DOBLE,
        f"  DICCIONARIO DE DATOS",
        f"  Proyecto : {meta['proyecto']}",
        f"  Version  : {meta['version']}",
        f"  Fecha    : {FECHA_HOY}",
        LINEA_DOBLE,
        "",
        f"  Total de entidades: {len(tablas)}",
        "",
    ]

    for i, (tabla, info) in enumerate(tablas.items(), 1):
        campos = info["campos"]
        lineas += [
            LINEA_DOBLE,
            f"  ENTIDAD {i:02d}: {tabla.upper()}",
            f"  Descripcion: {info['descripcion']}",
            f"  Total de campos: {len(campos)}",
            LINEA_DOBLE,
        ]

        # Encabezado de tabla
        lineas.append(
            f"  {'Campo':<28} {'Tipo':<22} {'Nulo':<6} {'PK':<4} {'FK':<4} {'Unico':<7} {'Default':<15} Descripcion"
        )
        lineas.append("  " + LINEA_SIMPLE)

        for campo, props in campos.items():
            es_pk    = "SI" if props.get("pk",      False) else "NO"
            es_fk    = "SI" if "fk"   in props             else "NO"
            nulo     = "SI" if props.get("nullable", True)  else "NO"
            unico    = "SI" if props.get("unique",  False)  else "NO"
            default  = str(props.get("default", "—"))
            tipo     = props["tipo"]
            desc     = props.get("descripcion", "—")

            lineas.append(
                f"  {campo:<28} {tipo:<22} {nulo:<6} {es_pk:<4} {es_fk:<4} {unico:<7} {default:<15} {desc}"
            )

            # Valores permitidos
            if props.get("valores"):
                vals = " | ".join(str(v) for v in props["valores"])
                lineas.append(f"  {'':>28} Valores permitidos: {vals}")

            # Referencia FK
            if "fk" in props:
                lineas.append(f"  {'':>28} Referencia FK: {props['fk']}")

        lineas.append("")

    # Resumen de relaciones
    lineas += [
        LINEA_DOBLE,
        "  RESUMEN DE RELACIONES (FK)",
        LINEA_DOBLE,
    ]
    for tabla, info in tablas.items():
        for campo, props in info["campos"].items():
            if "fk" in props:
                lineas.append(f"  {tabla}.{campo}  →  {props['fk']}")
    lineas.append("")
    lineas.append(LINEA_DOBLE)

    DICT_TXT.write_text("\n".join(lineas), encoding="utf-8")
    print(f"  [+] Diccionario TXT: {DICT_TXT.name}")


# ─────────────────────────────────────────────────────────────
#  GENERADOR 3: DICCIONARIO DE DATOS (PDF)
# ─────────────────────────────────────────────────────────────
def generar_diccionario_pdf(modelo: dict):
    """
    Genera el diccionario de datos en formato PDF usando reportlab.
    Cada entidad ocupa una seccion con tabla de campos.
    Requiere: pip install reportlab
    """
    try:
        from reportlab.lib.pagesizes import A4, landscape
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
            PageBreak, HRFlowable
        )
        from reportlab.lib.enums import TA_CENTER, TA_LEFT
    except ImportError:
        print("  [!] reportlab no instalado. Ejecuta: pip install reportlab")
        print("      El PDF no fue generado, pero SQL y TXT si.")
        return

    meta   = modelo["metadata"]
    tablas = modelo["tablas"]

    doc = SimpleDocTemplate(
        str(DICT_PDF),
        pagesize=landscape(A4),
        rightMargin=1.5*cm, leftMargin=1.5*cm,
        topMargin=2*cm,    bottomMargin=1.5*cm,
    )

    styles = getSampleStyleSheet()

    # Estilos personalizados
    estilo_titulo = ParagraphStyle(
        "titulo",
        parent=styles["Title"],
        fontSize=18,
        textColor=colors.HexColor("#1B5E20"),
        spaceAfter=6,
        alignment=TA_CENTER,
    )
    estilo_subtitulo = ParagraphStyle(
        "subtitulo",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.HexColor("#2E7D32"),
        alignment=TA_CENTER,
        spaceAfter=2,
    )
    estilo_entidad = ParagraphStyle(
        "entidad",
        parent=styles["Heading2"],
        fontSize=13,
        textColor=colors.white,
        backColor=colors.HexColor("#2E7D32"),
        spaceBefore=12,
        spaceAfter=4,
        leftIndent=6,
    )
    estilo_desc = ParagraphStyle(
        "desc",
        parent=styles["Normal"],
        fontSize=9,
        textColor=colors.HexColor("#424242"),
        spaceAfter=4,
    )
    estilo_celda = ParagraphStyle(
        "celda",
        parent=styles["Normal"],
        fontSize=8,
        leading=10,
    )

    historia = []

    # ── Portada / Encabezado ──────────────────────────────────
    historia.append(Spacer(1, 0.5*cm))
    historia.append(Paragraph("DICCIONARIO DE DATOS", estilo_titulo))
    historia.append(Paragraph(meta["proyecto"], estilo_subtitulo))
    historia.append(Paragraph(f"Version {meta['version']} — Generado: {FECHA_HOY}", estilo_subtitulo))
    historia.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2E7D32")))
    historia.append(Spacer(1, 0.4*cm))

    # Resumen general
    resumen_data = [
        ["Total de entidades", str(len(tablas))],
        ["Motor de BD",         meta["motor_destino"].upper()],
        ["Base de datos",       meta["conexion"]["nombre_db"]],
        ["Descripcion",         meta["descripcion"]],
    ]
    tabla_resumen = Table(resumen_data, colWidths=[5*cm, 20*cm])
    tabla_resumen.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (0, -1), colors.HexColor("#E8F5E9")),
        ("FONTNAME",    (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, -1), 9),
        ("GRID",        (0, 0), (-1, -1), 0.5, colors.HexColor("#C8E6C9")),
        ("ROWBACKGROUND", (0, 0), (-1, -1), [colors.white, colors.HexColor("#F1F8E9")]),
        ("VALIGN",      (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",  (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    historia.append(tabla_resumen)
    historia.append(Spacer(1, 0.5*cm))

    # ── Tabla por cada entidad ────────────────────────────────
    COL_WIDTHS = [4.0*cm, 3.5*cm, 1.5*cm, 1.2*cm, 1.2*cm, 1.5*cm, 2.5*cm, 12.0*cm]
    CABECERA   = ["Campo", "Tipo", "Nulo", "PK", "FK", "Unico", "Default", "Descripcion / Valores"]

    for i, (tabla, info) in enumerate(tablas.items(), 1):
        historia.append(PageBreak() if i > 1 else Spacer(1, 0.1*cm))
        historia.append(Paragraph(f"Entidad {i:02d}: {tabla.upper()}", estilo_entidad))
        historia.append(Paragraph(info["descripcion"], estilo_desc))

        filas = [CABECERA]

        for campo, props in info["campos"].items():
            es_pk   = "SI" if props.get("pk",      False) else "NO"
            es_fk   = "SI" if "fk" in props               else "NO"
            nulo    = "SI" if props.get("nullable", True)  else "NO"
            unico   = "SI" if props.get("unique",  False)  else "NO"
            default = str(props.get("default", "—"))
            tipo    = props["tipo"]
            desc    = props.get("descripcion", "—")

            # Enriquecer descripcion con valores permitidos y FK
            extras = []
            if props.get("valores"):
                extras.append("Valores: " + " | ".join(str(v) for v in props["valores"]))
            if "fk" in props:
                extras.append(f"FK → {props['fk']}")
            desc_completa = desc
            if extras:
                desc_completa += "\n" + "\n".join(extras)

            filas.append([
                Paragraph(f"<b>{campo}</b>" if es_pk == "SI" else campo, estilo_celda),
                Paragraph(tipo,            estilo_celda),
                Paragraph(nulo,            estilo_celda),
                Paragraph(es_pk,           estilo_celda),
                Paragraph(es_fk,           estilo_celda),
                Paragraph(unico,           estilo_celda),
                Paragraph(default,         estilo_celda),
                Paragraph(desc_completa,   estilo_celda),
            ])

        t = Table(filas, colWidths=COL_WIDTHS, repeatRows=1)
        t.setStyle(TableStyle([
            # Encabezado
            ("BACKGROUND",    (0, 0), (-1, 0),  colors.HexColor("#388E3C")),
            ("TEXTCOLOR",     (0, 0), (-1, 0),  colors.white),
            ("FONTNAME",      (0, 0), (-1, 0),  "Helvetica-Bold"),
            ("FONTSIZE",      (0, 0), (-1, 0),  8),
            ("ALIGN",         (0, 0), (-1, 0),  "CENTER"),
            # Filas
            ("FONTSIZE",      (0, 1), (-1, -1), 7.5),
            ("ROWBACKGROUND", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F9FBE7")]),
            ("GRID",          (0, 0), (-1, -1), 0.4, colors.HexColor("#C8E6C9")),
            ("VALIGN",        (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING",    (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING",   (0, 0), (-1, -1), 4),
        ]))
        historia.append(t)
        historia.append(Spacer(1, 0.3*cm))

    doc.build(historia)
    print(f"  [+] Diccionario PDF: {DICT_PDF.name}")


# ─────────────────────────────────────────────────────────────
#  GENERADOR 4: ENTIDADES Y RELACIONES (ERD textual)
# ─────────────────────────────────────────────────────────────
def generar_erd(modelo: dict):
    """
    Genera un archivo de texto con las entidades, sus atributos
    y un mapa de relaciones entre tablas (ERD textual).
    """
    meta   = modelo["metadata"]
    tablas = modelo["tablas"]
    lineas = []

    lineas += [
        LINEA_DOBLE,
        f"  ENTIDADES Y RELACIONES (ERD textual)",
        f"  Proyecto : {meta['proyecto']}",
        f"  Version  : {meta['version']}",
        f"  Generado : {FECHA_HOY}",
        LINEA_DOBLE,
        "",
    ]

    # Diagrama de relaciones
    lineas += [
        "  MAPA DE RELACIONES",
        LINEA_SIMPLE,
    ]
    for tabla, info in tablas.items():
        for campo, props in info["campos"].items():
            if "fk" in props:
                ref_tabla = props["fk"].split(".")[0]
                ref_campo = props["fk"].split(".")[1]
                lineas.append(
                    f"  {tabla:<20} |--[{campo}]-->| {ref_tabla}({ref_campo})"
                )
    lineas += ["", LINEA_SIMPLE, ""]

    # Detalle por entidad
    lineas += ["  DETALLE DE ENTIDADES", LINEA_SIMPLE]
    for tabla, info in tablas.items():
        lineas += [
            "",
            f"  +{'─' * 60}+",
            f"  | ENTIDAD: {tabla.upper():<49}|",
            f"  | {info['descripcion'][:58]:<58}|",
            f"  +{'─' * 60}+",
        ]
        for campo, props in info["campos"].items():
            marcas = []
            if props.get("pk"):    marcas.append("PK")
            if "fk" in props:      marcas.append(f"FK->{props['fk']}")
            if props.get("unique"): marcas.append("UNIQUE")
            if not props.get("nullable", True): marcas.append("NOT NULL")
            marca_str = f"  [{', '.join(marcas)}]" if marcas else ""
            lineas.append(f"  | {campo:<28} {props['tipo']:<18}{marca_str}")
        lineas.append(f"  +{'─' * 60}+")

    lineas += ["", LINEA_DOBLE]

    ERD_SALIDA.write_text("\n".join(lineas), encoding="utf-8")
    print(f"  [+] ERD textual: {ERD_SALIDA.name}")


# ─────────────────────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────────────────────
def main():
    print("\n" + LINEA_DOBLE)
    print("   INVERNADERO AUTOMATIZADO")
    print("   Generador de artefactos desde modelo JSON")
    print("   v1.0.0")
    print(LINEA_DOBLE + "\n")

    # 1. Cargar modelo
    print("[1/4] Cargando modelo JSON...")
    modelo = cargar_modelo()
    n_tablas = len(modelo["tablas"])
    print(f"  → Modelo cargado: {n_tablas} entidades encontradas")
    print(f"  → Entidades: {', '.join(modelo['tablas'].keys())}")

    # 2. Generar SQL
    print("\n[2/4] Generando script SQL (PostgreSQL)...")
    generar_sql(modelo)

    # 3. Generar diccionario TXT
    print("\n[3/4] Generando diccionario de datos (TXT)...")
    generar_diccionario_txt(modelo)

    # 4. Generar diccionario PDF
    print("\n[4/4] Generando diccionario de datos (PDF)...")
    generar_diccionario_pdf(modelo)

    # 5. Generar ERD textual
    print("\n[5/5] Generando entidades y relaciones (ERD)...")
    generar_erd(modelo)

    print("\n" + LINEA_DOBLE)
    print("   ARCHIVOS GENERADOS:")
    archivos = [SQL_SALIDA, DICT_TXT, DICT_PDF, ERD_SALIDA]
    for f in archivos:
        estado = "OK" if f.exists() else "NO GENERADO"
        print(f"   [{estado}] {f.name}")
    print(LINEA_DOBLE)
    print("\n   PROXIMOS PASOS:")
    print("   1. Revisa 'crear_db_postgresql.sql' antes de ejecutarlo")
    print("   2. Ejecuta el SQL en tu instancia de PostgreSQL")
    print("   3. Revisa el PDF y TXT del diccionario para la entrega")
    print("   4. Procede con 'generar_desde_plantilla.py' para el backend\n")


if __name__ == "__main__":
    main()
