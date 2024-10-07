-- Crear la tabla devices
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    isCardSwitch BOOLEAN NOT NULL DEFAULT FALSE
);

-- Insertar datos variados
INSERT INTO devices (name, description, isCardSwitch) VALUES
('ESP32', 'Controlador IoT para automatización en la sala principal.', TRUE),
('Raspberry Pi', 'Computadora para gestionar dispositivos como el aire acondicionado.', TRUE),
('STM32', 'Microcontrolador para aplicaciones embebidas sin control remoto.', FALSE);
