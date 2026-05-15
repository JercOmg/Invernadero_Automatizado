================================================================================
-- Proyecto : Sistema de Gestion de Invernadero Automatizado
-- Version  : 1.0.0
-- Generado : 2026-05-15 16:57:17
-- Motor    : PostgreSQL
-- Script   : crear_db_postgresql.sql
================================================================================

-- Eliminar tablas en orden inverso (respeta FK)
DROP TABLE IF EXISTS cosecha CASCADE;
DROP TABLE IF EXISTS aplicacion_insumo CASCADE;
DROP TABLE IF EXISTS insumo CASCADE;
DROP TABLE IF EXISTS alerta CASCADE;
DROP TABLE IF EXISTS riego CASCADE;
DROP TABLE IF EXISTS lectura_sensor CASCADE;
DROP TABLE IF EXISTS sensor CASCADE;
DROP TABLE IF EXISTS siembra CASCADE;
DROP TABLE IF EXISTS cultivo CASCADE;
DROP TABLE IF EXISTS zona CASCADE;
DROP TABLE IF EXISTS invernadero CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
-- Tabla: usuario
-- Usuarios del sistema con roles y permisos de acceso al invernadero automatizado
--------------------------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario                     SERIAL NOT NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    nombre                         VARCHAR(100) NOT NULL,
    apellido                       VARCHAR(100) NOT NULL,
    email                          VARCHAR(150) NOT NULL UNIQUE,
    password_hash                  VARCHAR(255),
    rol                            VARCHAR(30) NOT NULL DEFAULT 'OPERARIO' CHECK (rol IN ('ADMINISTRADOR', 'TECNICO', 'OPERARIO', 'VISUALIZADOR')),
    fecha_registro                 DATE NOT NULL,
    activo                         BOOLEAN NOT NULL DEFAULT TRUE,
    proveedor_oauth                VARCHAR(30) CHECK (proveedor_oauth IN ('LOCAL', 'GOOGLE'))
);


--------------------------------------------------------------------------------
-- Tabla: invernadero
-- Informacion general de cada instalacion fisica de invernadero
--------------------------------------------------------------------------------
CREATE TABLE invernadero (
    id_invernadero                 SERIAL NOT NULL,
    CONSTRAINT pk_invernadero PRIMARY KEY (id_invernadero),
    nombre                         VARCHAR(100) NOT NULL,
    ubicacion                      VARCHAR(200) NOT NULL,
    area_m2                        DECIMAL(10,2) NOT NULL,
    tipo_estructura                VARCHAR(50) CHECK (tipo_estructura IN ('VIDRIO', 'POLICARBONATO', 'MALLA', 'PLASTICO')),
    responsable_id                 INTEGER NOT NULL,
    fecha_creacion                 DATE NOT NULL,
    estado                         VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'MANTENIMIENTO')),
    CONSTRAINT fk_invernadero_responsable_id FOREIGN KEY (responsable_id)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_invernadero_responsable_id ON invernadero(responsable_id);

--------------------------------------------------------------------------------
-- Tabla: zona
-- Secciones o areas internas dentro de un invernadero con condiciones especificas
--------------------------------------------------------------------------------
CREATE TABLE zona (
    id_zona                        SERIAL NOT NULL,
    CONSTRAINT pk_zona PRIMARY KEY (id_zona),
    id_invernadero                 INTEGER NOT NULL,
    nombre_zona                    VARCHAR(100) NOT NULL,
    area_m2                        DECIMAL(10,2),
    descripcion                    TEXT,
    CONSTRAINT fk_zona_id_invernadero FOREIGN KEY (id_invernadero)
        REFERENCES invernadero(id_invernadero) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_zona_id_invernadero ON zona(id_invernadero);

--------------------------------------------------------------------------------
-- Tabla: cultivo
-- Catalogo maestro de especies y variedades cultivadas en el invernadero
--------------------------------------------------------------------------------
CREATE TABLE cultivo (
    id_cultivo                     SERIAL NOT NULL,
    CONSTRAINT pk_cultivo PRIMARY KEY (id_cultivo),
    nombre_comun                   VARCHAR(100) NOT NULL,
    nombre_cientifico              VARCHAR(150),
    tipo                           VARCHAR(50) NOT NULL CHECK (tipo IN ('HORTALIZA', 'FRUTA', 'FLOR', 'HIERBA', 'OTRO')),
    temp_min_c                     DECIMAL(5,2),
    temp_max_c                     DECIMAL(5,2),
    humedad_min_pct                DECIMAL(5,2),
    humedad_max_pct                DECIMAL(5,2),
    dias_ciclo                     INTEGER,
    descripcion                    TEXT
);


--------------------------------------------------------------------------------
-- Tabla: siembra
-- Registro de cada evento de siembra realizado en una zona del invernadero
--------------------------------------------------------------------------------
CREATE TABLE siembra (
    id_siembra                     SERIAL NOT NULL,
    CONSTRAINT pk_siembra PRIMARY KEY (id_siembra),
    id_zona                        INTEGER NOT NULL,
    id_cultivo                     INTEGER NOT NULL,
    id_usuario                     INTEGER NOT NULL,
    fecha_siembra                  DATE NOT NULL,
    fecha_cosecha_estimada         DATE,
    cantidad_plantas               INTEGER NOT NULL,
    estado                         VARCHAR(30) NOT NULL DEFAULT 'EN_CRECIMIENTO' CHECK (estado IN ('EN_CRECIMIENTO', 'COSECHADO', 'PERDIDO', 'EN_CUARENTENA')),
    observaciones                  TEXT,
    CONSTRAINT fk_siembra_id_zona FOREIGN KEY (id_zona)
        REFERENCES zona(id_zona) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_siembra_id_cultivo FOREIGN KEY (id_cultivo)
        REFERENCES cultivo(id_cultivo) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_siembra_id_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_siembra_id_zona ON siembra(id_zona);
CREATE INDEX idx_siembra_id_cultivo ON siembra(id_cultivo);
CREATE INDEX idx_siembra_id_usuario ON siembra(id_usuario);

--------------------------------------------------------------------------------
-- Tabla: sensor
-- Dispositivos de medicion instalados en las zonas del invernadero
--------------------------------------------------------------------------------
CREATE TABLE sensor (
    id_sensor                      SERIAL NOT NULL,
    CONSTRAINT pk_sensor PRIMARY KEY (id_sensor),
    id_zona                        INTEGER NOT NULL,
    tipo_sensor                    VARCHAR(50) NOT NULL CHECK (tipo_sensor IN ('TEMPERATURA', 'HUMEDAD', 'CO2', 'LUMINOSIDAD', 'PH', 'HUMEDAD_SUELO')),
    modelo                         VARCHAR(100),
    unidad_medida                  VARCHAR(20) NOT NULL,
    fecha_instalacion              DATE,
    estado                         VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'FALLA')),
    CONSTRAINT fk_sensor_id_zona FOREIGN KEY (id_zona)
        REFERENCES zona(id_zona) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_sensor_id_zona ON sensor(id_zona);

--------------------------------------------------------------------------------
-- Tabla: lectura_sensor
-- Serie temporal de mediciones registradas por cada sensor del invernadero
--------------------------------------------------------------------------------
CREATE TABLE lectura_sensor (
    id_lectura                     SERIAL NOT NULL,
    CONSTRAINT pk_lectura_sensor PRIMARY KEY (id_lectura),
    id_sensor                      INTEGER NOT NULL,
    valor                          DECIMAL(10,4) NOT NULL,
    fecha_hora                     TIMESTAMP NOT NULL,
    genera_alerta                  BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_lectura_sensor_id_sensor FOREIGN KEY (id_sensor)
        REFERENCES sensor(id_sensor) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_lectura_sensor_id_sensor ON lectura_sensor(id_sensor);

--------------------------------------------------------------------------------
-- Tabla: riego
-- Eventos de riego automaticos o manuales ejecutados en las zonas
--------------------------------------------------------------------------------
CREATE TABLE riego (
    id_riego                       SERIAL NOT NULL,
    CONSTRAINT pk_riego PRIMARY KEY (id_riego),
    id_zona                        INTEGER NOT NULL,
    id_usuario                     INTEGER,
    fecha_hora                     TIMESTAMP NOT NULL,
    duracion_min                   INTEGER NOT NULL,
    volumen_litros                 DECIMAL(10,2),
    tipo                           VARCHAR(20) NOT NULL CHECK (tipo IN ('AUTOMATICO', 'MANUAL')),
    observaciones                  TEXT,
    CONSTRAINT fk_riego_id_zona FOREIGN KEY (id_zona)
        REFERENCES zona(id_zona) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_riego_id_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_riego_id_zona ON riego(id_zona);
CREATE INDEX idx_riego_id_usuario ON riego(id_usuario);

--------------------------------------------------------------------------------
-- Tabla: alerta
-- Notificaciones generadas por condiciones anomalas detectadas en el invernadero
--------------------------------------------------------------------------------
CREATE TABLE alerta (
    id_alerta                      SERIAL NOT NULL,
    CONSTRAINT pk_alerta PRIMARY KEY (id_alerta),
    id_sensor                      INTEGER,
    id_zona                        INTEGER,
    tipo_alerta                    VARCHAR(50) NOT NULL CHECK (tipo_alerta IN ('TEMPERATURA_ALTA', 'TEMPERATURA_BAJA', 'HUMEDAD_ALTA', 'HUMEDAD_BAJA', 'CO2_ALTO', 'PH_FUERA_RANGO', 'FALLA_SENSOR', 'PLAGA_ENFERMEDAD')),
    descripcion                    TEXT NOT NULL,
    fecha_hora                     TIMESTAMP NOT NULL,
    nivel                          VARCHAR(20) NOT NULL CHECK (nivel IN ('INFORMATIVA', 'ADVERTENCIA', 'CRITICA')),
    resuelta                       BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_resolucion               TIMESTAMP,
    CONSTRAINT fk_alerta_id_sensor FOREIGN KEY (id_sensor)
        REFERENCES sensor(id_sensor) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_alerta_id_zona FOREIGN KEY (id_zona)
        REFERENCES zona(id_zona) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_alerta_id_sensor ON alerta(id_sensor);
CREATE INDEX idx_alerta_id_zona ON alerta(id_zona);

--------------------------------------------------------------------------------
-- Tabla: insumo
-- Catalogo de insumos con control de inventario para el invernadero
--------------------------------------------------------------------------------
CREATE TABLE insumo (
    id_insumo                      SERIAL NOT NULL,
    CONSTRAINT pk_insumo PRIMARY KEY (id_insumo),
    nombre                         VARCHAR(100) NOT NULL,
    tipo                           VARCHAR(50) NOT NULL CHECK (tipo IN ('FERTILIZANTE', 'PESTICIDA', 'FUNGICIDA', 'SUSTRATO', 'AGUA', 'OTRO')),
    unidad                         VARCHAR(20) NOT NULL CHECK (unidad IN ('kg', 'g', 'L', 'mL', 'unidad')),
    stock_actual                   DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_minimo                   DECIMAL(10,2),
    descripcion                    TEXT
);


--------------------------------------------------------------------------------
-- Tabla: aplicacion_insumo
-- Historial de aplicaciones de insumos realizadas en siembras o zonas
--------------------------------------------------------------------------------
CREATE TABLE aplicacion_insumo (
    id_aplicacion                  SERIAL NOT NULL,
    CONSTRAINT pk_aplicacion_insumo PRIMARY KEY (id_aplicacion),
    id_insumo                      INTEGER NOT NULL,
    id_siembra                     INTEGER,
    id_zona                        INTEGER,
    id_usuario                     INTEGER NOT NULL,
    fecha_hora                     TIMESTAMP NOT NULL,
    cantidad                       DECIMAL(10,2) NOT NULL,
    metodo                         VARCHAR(50) CHECK (metodo IN ('FOLIAR', 'RIEGO', 'SUELO', 'INYECCION')),
    observaciones                  TEXT,
    CONSTRAINT fk_aplicacion_insumo_id_insumo FOREIGN KEY (id_insumo)
        REFERENCES insumo(id_insumo) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_aplicacion_insumo_id_siembra FOREIGN KEY (id_siembra)
        REFERENCES siembra(id_siembra) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_aplicacion_insumo_id_zona FOREIGN KEY (id_zona)
        REFERENCES zona(id_zona) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_aplicacion_insumo_id_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_aplicacion_insumo_id_insumo ON aplicacion_insumo(id_insumo);
CREATE INDEX idx_aplicacion_insumo_id_siembra ON aplicacion_insumo(id_siembra);
CREATE INDEX idx_aplicacion_insumo_id_zona ON aplicacion_insumo(id_zona);
CREATE INDEX idx_aplicacion_insumo_id_usuario ON aplicacion_insumo(id_usuario);

--------------------------------------------------------------------------------
-- Tabla: cosecha
-- Registro de produccion cosechada por cada evento de siembra
--------------------------------------------------------------------------------
CREATE TABLE cosecha (
    id_cosecha                     SERIAL NOT NULL,
    CONSTRAINT pk_cosecha PRIMARY KEY (id_cosecha),
    id_siembra                     INTEGER NOT NULL,
    id_usuario                     INTEGER NOT NULL,
    fecha_cosecha                  DATE NOT NULL,
    cantidad_kg                    DECIMAL(10,2) NOT NULL,
    calidad                        VARCHAR(20) CHECK (calidad IN ('PREMIUM', 'ESTANDAR', 'SEGUNDA', 'DESCARTE')),
    observaciones                  TEXT,
    CONSTRAINT fk_cosecha_id_siembra FOREIGN KEY (id_siembra)
        REFERENCES siembra(id_siembra) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_cosecha_id_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_cosecha_id_siembra ON cosecha(id_siembra);
CREATE INDEX idx_cosecha_id_usuario ON cosecha(id_usuario);

================================================================================
-- Fin del script generado el 2026-05-15 16:57:17
================================================================================