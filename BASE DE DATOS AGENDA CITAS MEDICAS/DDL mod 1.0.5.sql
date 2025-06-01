-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Tabla de Telefonos
CREATE TABLE telefonos (
    id_telefonos UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    codigo_pais VARCHAR(5) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    UNIQUE (codigo_pais, numero)
);


-- Tabla de Especialidades Medicas
CREATE TABLE especialidades (
    id_especialidad UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla de Consultorios
CREATE TABLE consultorios (
    id_consultorio UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero VARCHAR(20) NOT NULL UNIQUE,
    piso INT NOT NULL CHECK (piso BETWEEN 1 AND 10),
    equipamiento TEXT
);

-- Tabla de Medicos
CREATE TABLE medicos (
    id_medico UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    dui VARCHAR(10) NOT NULL UNIQUE 
        CHECK (dui ~ '^\d{8}-\d$'),
    isss VARCHAR(9) NOT NULL UNIQUE 
        CHECK (isss ~ '^\d{9}$'),
    nit VARCHAR(17) UNIQUE 
        CHECK (nit ~ '^\d{4}-\d{6}-\d{3}-\d$'),
    especialidad_id UUID NOT NULL REFERENCES especialidades(id_especialidad) ON DELETE RESTRICT,
    consultorio_id UUID REFERENCES consultorios(id_consultorio) ON DELETE SET NULL,
    telefono VARCHAR(15) CHECK (telefono ~ '^\d{4}-\d{4}$'),
    correo VARCHAR(100) CHECK (correo ~ '^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$')
);

-- Tabla de Pacientes
CREATE TABLE pacientes (
    id_paciente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    dui VARCHAR(10) UNIQUE 
        CHECK (dui ~ '^\d{8}-\d$'),
    isss VARCHAR(9) UNIQUE 
        CHECK (isss ~ '^\d{9}$'),
    nit VARCHAR(17) UNIQUE 
        CHECK (nit ~ '^\d{4}-\d{6}-\d{3}-\d$'),
    fecha_nacimiento DATE NOT NULL 
        CHECK (fecha_nacimiento BETWEEN '1900-01-01' AND CURRENT_DATE),
    direccion TEXT,
    telefono VARCHAR(15) CHECK (telefono ~ '^\d{4}-\d{4}$'),
    correo VARCHAR(100) CHECK (correo ~ '^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$')
);

-- Tabla de Horarios con restricción de solapamiento
CREATE TABLE horarios (
    id_horario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medico_id UUID NOT NULL REFERENCES medicos(id_medico) ON DELETE CASCADE,
    consultorio_id UUID REFERENCES consultorios(id_consultorio) ON DELETE SET NULL,
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    CHECK (hora_inicio < hora_fin),
    EXCLUDE USING gist (
        medico_id WITH =,
        dia_semana WITH =,
        tsrange(
            (DATE '2000-01-01' + (dia_semana - 1) * INTERVAL '1 day' + hora_inicio)::TIMESTAMP,
            (DATE '2000-01-01' + (dia_semana - 1) * INTERVAL '1 day' + hora_fin)::TIMESTAMP
        ) WITH &&
    )
);

-- Tabla de Citas
CREATE TABLE citas (
    id_cita UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
    medico_id UUID NOT NULL REFERENCES medicos(id_medico) ON DELETE CASCADE,
    fecha_hora TIMESTAMP NOT NULL,
    consultorio_id UUID NOT NULL REFERENCES consultorios(id_consultorio) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'programada' 
        CHECK (estado IN ('programada', 'completada', 'cancelada')),
    notas TEXT
);

-- Tabla de Facturas
CREATE TABLE facturas (
    id_factura UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cita_id UUID NOT NULL REFERENCES citas(id_cita) ON DELETE CASCADE,
    numero_factura VARCHAR(20) NOT NULL UNIQUE 
        CHECK (numero_factura ~ '^FACT-\d{4}-\d{4}$'),
    fecha_emision DATE DEFAULT CURRENT_DATE,
    nit_paciente VARCHAR(17) NOT NULL 
        CHECK (nit_paciente ~ '^\d{4}-\d{6}-\d{3}-\d$'),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal > 0),
    iva DECIMAL(10,2) NOT NULL CHECK (iva >= 0),
    total DECIMAL(10,2) GENERATED ALWAYS AS (subtotal + iva) STORED
);

-- Tabla de Metodos de Pago
CREATE TABLE metodos_pago (
    id_metodo_pago SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de Pagos
CREATE TABLE pagos (
    id_pago UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factura_id UUID NOT NULL REFERENCES facturas(id_factura) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago_id INT NOT NULL REFERENCES metodos_pago(id_metodo_pago) ON DELETE RESTRICT,
    referencia VARCHAR(100)
);

-- Tabla de Notificaciones
CREATE TABLE notificaciones (
    id_notificacion UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cita_id UUID REFERENCES citas(id_cita) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL 
        CHECK (tipo IN ('email','whatsapp', 'sms', 'app')),
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente' 
        CHECK (estado IN ('pendiente', 'enviado', 'fallido'))
);

-- Índices para optimización de consultas
CREATE INDEX idx_citas_fecha ON citas(fecha_hora);
CREATE INDEX idx_pacientes_dui ON pacientes(dui);
CREATE INDEX idx_pacientes_nit ON pacientes(nit);
CREATE INDEX idx_medicos_dui ON medicos(dui);
CREATE INDEX idx_medicos_especialidad ON medicos(especialidad_id);
CREATE INDEX idx_facturas_cita ON facturas(cita_id);
CREATE INDEX idx_horarios_medico ON horarios(medico_id);