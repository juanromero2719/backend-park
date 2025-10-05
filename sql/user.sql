CREATE TABLE IF NOT EXISTS public.usuario (
  numero_cedula VARCHAR(20) PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  correo_electronico VARCHAR(255) NOT NULL
);