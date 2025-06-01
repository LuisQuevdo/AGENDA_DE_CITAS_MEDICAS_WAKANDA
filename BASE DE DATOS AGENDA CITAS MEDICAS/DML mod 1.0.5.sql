-----------------------------
-- 1. Inserccion especialidades
-----------------------------
INSERT INTO especialidades (nombre, descripcion) VALUES
('Cardiologia', 'Especialidad en enfermedades del corazon'),
('Pediatria', 'Atencion medica infantil'),
('Dermatologia', 'Enfermedades de la piel'),
('Ginecologia', 'Salud reproductiva femenina'),
('Ortopedia', 'Trastornos musculoesqueleticos'),
('Oftalmologia', 'Enfermedades oculares'),
('Medicina General', 'Atencion primaria');

-----------------------------
-- 2. Insercion consultorios
-----------------------------
INSERT INTO consultorios (numero, piso, equipamiento) VALUES
('C-101', 1, 'Equipo basico, electrocardiografo'),
('C-205', 2, 'Equipo pediatrico completo'),
('C-302', 3, 'Ecografo ginecologico'),
('C-104', 1, 'Equipo oftalmologico completo'),
('C-207', 2, 'Equipo ortopedico y rayos X'),
('C-303', 3, 'Microscopio dermatologico'),
('C-105', 1, 'Equipo general de consulta');

-----------------------------
-- 3. Insercion medicos
-----------------------------
INSERT INTO medicos (nombre, dui, isss, nit, especialidad_id, consultorio_id, telefono, correo)
SELECT 
    nombre,
    dui,
    isss,
    nit,
    (SELECT id_especialidad FROM especialidades WHERE nombre = especialidad),
    (SELECT id_consultorio FROM consultorios WHERE numero = consultorio),
    telefono,
    correo
FROM (VALUES
    ('Dr. Carlos Ernesto Hernandez', '02345678-9', '987654321', '0614-198005-123-4', 'Cardiologia', 'C-101', '2222-1111', 'c.hernandez@clinica.com'),
    ('Dra. Maria Gabriela Flores', '13456789-0', '876543219', '0614-199112-234-5', 'Pediatria', 'C-205', '2555-2222', 'mg.flores@clinica.com'),
    ('Dr. Luis Antonio Quintanilla', '24567890-1', '765432198', '0614-197508-345-6', 'Ortopedia', 'C-207', '2333-3333', 'la.quintanilla@clinica.com'),
    ('Dra. Julia Margarita Sanchez', '35678901-2', '654321987', '0614-198811-456-7', 'Ginecologia', 'C-302', '2444-4444', 'jm.sanchez@clinica.com'),
    ('Dr. Jose Ernesto Romero', '46789012-3', '543219876', '0614-199303-567-8', 'Oftalmologia', 'C-104', '2666-5555', 'je.romero@clinica.com'),
    ('Dra. Silvia Carolina Herrera', '57890123-4', '432198765', '0614-198706-678-9', 'Dermatologia', 'C-303', '2777-6666', 'sc.herrera@clinica.com'),
    ('Dr. Roberto Carlos Portillo', '68901234-5', '321987654', '0614-197109-789-0', 'Medicina General', 'C-105', '2888-7777', 'rc.portillo@clinica.com')
) AS med(nombre, dui, isss, nit, especialidad, consultorio, telefono, correo);

-----------------------------
-- 4. Insercion pacientes
-----------------------------
INSERT INTO pacientes (nombre, dui, isss, nit, fecha_nacimiento, direccion, telefono, correo) VALUES
('Juan Pablo Martinez Garcia', '09876543-2', '123456789', '0614-200105-123-4', '2001-05-15', 'Col. Escalon, San Salvador', '7000-1234', 'jpmartinez@mail.com'),
('Maria Jose Ramirez de Hernandez', '98765432-1', '234567890', '0614-199512-234-5', '1995-12-20', 'Res. Las Magnolias, Soyapango', '7000-5678', 'mjramirez@mail.com'),
('Carlos Enrique Argueta Lopez', '87654321-0', '345678901', '0614-198008-345-6', '1980-08-10', 'Urb. La Cima, Santa Tecla', '7000-9012', 'cargueta@mail.com'),
('Ana Beatriz Orellana de Rodriguez', '76543210-9', '456789012', '0614-197511-456-7', '1975-11-03', 'Col. San Benito, San Salvador', '7000-3456', 'aborellana@mail.com'),
('Pedro Alfonso Vasquez Mendoza', '65432109-8', '567890123', '0614-200202-567-8', '2002-02-28', 'Ciudad Merliot, La Libertad', '7000-7890', 'pvasquez@mail.com'),
('Sofia Alejandra Bonilla Marroquín', '54321098-7', '678901234', '0614-199803-678-9', '1998-03-17', 'Col. Flor Blanca, San Salvador', '7000-2345', 'sbonilla@mail.com'),
('Luis Fernando Chavez Gonzalez', '43210987-6', '789012345', '0614-197106-789-0', '1971-06-05', 'Col. Miramonte, San Salvador', '7000-6789', 'lfchavez@mail.com');

-----------------------------
-- 5. Insercion metodos de pago
-----------------------------
INSERT INTO metodos_pago (nombre) VALUES
('Efectivo'),
('Tarjeta de credito'),
('Tarjeta de debito'),
('Transferencia bancaria'),
('Cheque'),
('Deposito'),
('Credito medico');

-----------------------------
-- 6. Insercion horarios
-----------------------------
INSERT INTO horarios (medico_id, consultorio_id, dia_semana, hora_inicio, hora_fin)
SELECT 
    (SELECT id_medico FROM medicos WHERE dui = m_dui),
    (SELECT id_consultorio FROM consultorios WHERE numero = c_num),
    dia_semana,
    hora_inicio::time,
    hora_fin::time
FROM (VALUES
    ('02345678-9', 'C-101', 1, '08:00', '12:00'),
    ('02345678-9', 'C-101', 3, '14:00', '18:00'),
    ('13456789-0', 'C-205', 2, '07:30', '12:30'),
    ('24567890-1', 'C-207', 5, '09:00', '13:00'),
    ('35678901-2', 'C-302', 4, '08:00', '12:00'),
    ('46789012-3', 'C-104', 3, '14:00', '18:00'),
    ('57890123-4', 'C-303', 6, '10:00', '14:00')
) AS hor(m_dui, c_num, dia_semana, hora_inicio, hora_fin);

-----------------------------
-- 7. Insercion citas
-----------------------------
INSERT INTO citas (paciente_id, medico_id, fecha_hora, consultorio_id, estado, notas)
SELECT 
    (SELECT id_paciente FROM pacientes WHERE dui = p_dui),
    (SELECT id_medico FROM medicos WHERE dui = m_dui),
    fecha_hora::TIMESTAMP,
    (SELECT id_consultorio FROM consultorios WHERE numero = c_num),
    estado,
    notas
FROM (VALUES
    ('09876543-2', '02345678-9', '2024-05-20 09:00:00', 'C-101', 'completada', 'Control presion arterial'),
    ('98765432-1', '13456789-0', '2024-05-21 10:30:00', 'C-205', 'programada', 'Vacunacion infantil'),
    ('87654321-0', '24567890-1', '2024-05-22 11:00:00', 'C-207', 'cancelada', 'Dolor en rodilla'),
    ('76543210-9', '35678901-2', '2024-05-23 14:00:00', 'C-302', 'programada', 'Control anual'),
    ('65432109-8', '46789012-3', '2024-05-24 08:30:00', 'C-104', 'programada', 'Examen de la vista'),
    ('54321098-7', '57890123-4', '2024-05-25 10:00:00', 'C-303', 'programada', 'Consulta dermatitis'),
    ('43210987-6', '68901234-5', '2024-05-26 11:30:00', 'C-105', 'programada', 'Chequeo general')
) AS cit(p_dui, m_dui, fecha_hora, c_num, estado, notas);

-----------------------------
-- 8. Insercion facturas
-----------------------------
INSERT INTO facturas (cita_id, numero_factura, nit_paciente, subtotal, iva)
SELECT 
    (SELECT id_cita FROM citas WHERE notas = nota_cita),
    numero_factura,
    nit_paciente,
    subtotal,
    subtotal * 0.13  -- IVA 13%
FROM (VALUES
    ('Control presion arterial', 'FACT-2024-0001', '0614-200105-123-4', 50.00),
    ('Vacunacion infantil', 'FACT-2024-0002', '0614-199512-234-5', 35.00),
    ('Dolor en rodilla', 'FACT-2024-0003', '0614-198008-345-6', 80.00),
    ('Control anual', 'FACT-2024-0004', '0614-197511-456-7', 60.00),
    ('Examen de la vista', 'FACT-2024-0005', '0614-200202-567-8', 45.00),
    ('Consulta dermatitis', 'FACT-2024-0006', '0614-199803-678-9', 55.00),
    ('Chequeo general', 'FACT-2024-0007', '0614-197106-789-0', 40.00)
) AS fac(nota_cita, numero_factura, nit_paciente, subtotal);

-----------------------------
-- 9. Insercion pagos
-----------------------------
INSERT INTO pagos (factura_id, monto, metodo_pago_id, referencia)
SELECT 
    (SELECT id_factura FROM facturas WHERE numero_factura = num_fact),
    total,
    (SELECT id_metodo_pago FROM metodos_pago WHERE nombre = metodo),
    referencia
FROM (VALUES
    ('FACT-2024-0001', 56.50, 'Tarjeta de credito', 'PAG-TC-001'),
    ('FACT-2024-0002', 39.55, 'Efectivo', 'REC-EF-002'),
    ('FACT-2024-0003', 90.40, 'Transferencia bancaria', 'TRF-003'),
    ('FACT-2024-0004', 67.80, 'Tarjeta de debito', 'PAG-TD-004'),
    ('FACT-2024-0005', 50.85, 'Efectivo', 'REC-EF-005'),
    ('FACT-2024-0006', 62.15, 'Deposito', 'DEP-006'),
    ('FACT-2024-0007', 45.20, 'Credito medico', 'CRED-007')
) AS pag(num_fact, total, metodo, referencia);

-----------------------------
-- 10. Insercion notificaciones
-----------------------------
INSERT INTO notificaciones (cita_id, tipo, contenido, estado)
SELECT 
    (SELECT id_cita FROM citas WHERE notas = nota_cita),
    tipo,
    contenido,
    estado
FROM (VALUES
    ('Control presion arterial', 'sms', 'Recordatorio de cita completada', 'enviado'),
    ('Vacunacion infantil', 'email', 'Confirmacion de vacunacion', 'pendiente'),
    ('Dolor en rodilla', 'app', 'Cita cancelada por el paciente', 'enviado'),
    ('Control anual', 'sms', 'Recordatorio de cita programada', 'pendiente'),
    ('Examen de la vista', 'email', 'Instrucciones pre-examen', 'enviado'),
    ('Consulta dermatitis', 'app', 'Confirmación de cita', 'fallido'),
    ('Chequeo general', 'sms', 'Recordatorio de chequeo', 'pendiente')
) AS notif(nota_cita, tipo, contenido, estado);