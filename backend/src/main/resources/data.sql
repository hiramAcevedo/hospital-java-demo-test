-- Insertar doctores
INSERT INTO doctores (nombre, apellido_paterno, apellido_materno, especialidad) VALUES 
('Juan', 'García', 'Pérez', 'Medicina Interna'),
('María', 'López', 'Sánchez', 'Medicina Interna'),
('Roberto', 'Martínez', 'Rodríguez', 'Medicina Interna'),
('Ana', 'Hernández', 'González', 'Medicina Interna'),
('Carlos', 'Ramírez', 'Torres', 'Medicina Interna');

-- Insertar consultorios
INSERT INTO consultorios (numero_consultorio, piso) VALUES 
(101, 1),
(102, 1),
(201, 2),
(202, 2),
(301, 3);

-- Insertar pacientes
INSERT INTO pacientes (nombre, apellidos) VALUES
('Pedro', 'Sánchez Gómez'),
('Laura', 'Martínez López'),
('Miguel', 'González Ruiz'),
('Isabel', 'Rodríguez Flores'),
('José', 'Pérez García'); 