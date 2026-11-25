-- NETX: Base de datos inicial del Sprint 1
-- MySQL 8.0 / Motor InnoDB

CREATE DATABASE IF NOT EXISTS netx_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE netx_db;

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- 2. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
) ENGINE=InnoDB;

-- 3. CATEGORIAS EMPRESARIALES
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activa BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- 4. MIEMBROS
CREATE TABLE IF NOT EXISTS miembros (
    id_miembro INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE,
    id_categoria INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    empresa VARCHAR(150),
    fecha_ingreso DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    id_referido_por INT NULL,

    -- Evita dos miembros activos con la misma categoria.
    -- Permite reutilizarla si el miembro anterior esta inactivo.
    categoria_activa INT GENERATED ALWAYS AS (
        CASE WHEN activo = TRUE THEN id_categoria ELSE NULL END
    ) STORED,

    UNIQUE KEY uq_categoria_activa (categoria_activa),

    CONSTRAINT fk_miembros_usuarios
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_miembros_categorias
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria),

    CONSTRAINT fk_miembros_referido
        FOREIGN KEY (id_referido_por)
        REFERENCES miembros(id_miembro)
) ENGINE=InnoDB;

-- 5. REGLAS DEL CAPITULO
CREATE TABLE IF NOT EXISTS reglas_capitulo (
    id_regla INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    valor DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(30) NOT NULL,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- 5.1 REFERIDOS (HU-18, HU-19)
-- Un miembro (generador) entrega un prospecto a otro miembro (receptor).
-- Estados del embudo: Referido -> Contacto -> Reunion 1-a-1 -> Oportunidad
-- -> Cotizacion -> Ganado | Perdido. Los 5 primeros se consideran "activos".
CREATE TABLE IF NOT EXISTS referidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_generador INT NOT NULL,
    id_receptor INT NOT NULL,
    prospecto_nombre VARCHAR(150) NOT NULL,
    prospecto_empresa VARCHAR(150) NOT NULL,
    prospecto_telefono VARCHAR(20),
    prospecto_email VARCHAR(150),
    giro_requerido VARCHAR(100),
    necesidad VARCHAR(500) NOT NULL,
    es_urgente BOOLEAN NOT NULL DEFAULT FALSE,
    estado ENUM('Referido', 'Contacto', 'Reunión 1-a-1', 'Oportunidad',
                'Cotización', 'Ganado', 'Perdido')
           NOT NULL DEFAULT 'Referido',
    -- Solo > 0 cuando estado = 'Ganado' (HU-21).
    monto_ganado DECIMAL(12,2) NOT NULL DEFAULT 0,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,

    -- Acelera el candado de duplicados activos por receptor (HU-19).
    INDEX idx_referidos_receptor_estado (id_receptor, estado),
    INDEX idx_referidos_generador (id_generador),

    CONSTRAINT fk_referidos_generador
        FOREIGN KEY (id_generador)
        REFERENCES miembros(id_miembro),

    CONSTRAINT fk_referidos_receptor
        FOREIGN KEY (id_receptor)
        REFERENCES miembros(id_miembro),

    CONSTRAINT chk_referidos_distintos
        CHECK (id_generador <> id_receptor),

    CONSTRAINT chk_referidos_monto
        CHECK ((estado = 'Ganado' AND monto_ganado > 0)
            OR (estado <> 'Ganado' AND monto_ganado = 0))
) ENGINE=InnoDB;

-- 6. ROLES INICIALES
INSERT IGNORE INTO roles (nombre, descripcion)
VALUES
('administrador', 'Administracion general del sistema'),
('coordinador', 'Gestion de reuniones y actividades'),
('miembro', 'Integrante del capitulo');

-- 7. REGLAS INICIALES
INSERT IGNORE INTO reglas_capitulo
(nombre, valor, unidad, descripcion)
VALUES
('nuevos_miembros_anuales', 1, 'miembros',
 'Meta de nuevos miembros en 12 meses'),

('max_inasistencias', 2, 'faltas',
 'Maximo de inasistencias sin suplente'),

('duracion_pitch', 2, 'minutos',
 'Duracion del pitch semanal'),

('presentaciones_reunion', 2, 'presentaciones',
 'Cantidad de presentaciones por reunion'),

('duracion_presentacion', 10, 'minutos',
 'Duracion de cada presentacion'),

('referidos_semanales', 2, 'referidos',
 'Meta minima semanal de referidos');

-- 8. COMPROBAR LAS TABLAS
SHOW TABLES;

-- 9. CONSULTAR LOS ROLES
SELECT * FROM roles;

-- 10. CONSULTAR LAS REGLAS
SELECT * FROM reglas_capitulo;