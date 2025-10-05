CREATE TABLE IF NOT EXISTS public.rol (
  id serial PRIMARY KEY,
  codigo text NOT NULL UNIQUE, 
  descripcion text
);

INSERT INTO public.rol (codigo, descripcion)
VALUES
  ('usuario', 'Rol básico por defecto'),
  ('admin', 'Administrador'),
  ('cajero', 'Cajero')
ON CONFLICT (codigo) DO NOTHING;

ALTER TABLE public.usuario
  ADD COLUMN IF NOT EXISTS rol_codigo text;

ALTER TABLE public.usuario
  ALTER COLUMN rol_codigo SET DEFAULT 'usuario';

UPDATE public.usuario
SET rol_codigo = 'usuario'
WHERE rol_codigo IS NULL;

ALTER TABLE public.usuario
  ALTER COLUMN rol_codigo SET NOT NULL;

ALTER TABLE public.usuario
  ADD CONSTRAINT usuario_rol_codigo_fkey
  FOREIGN KEY (rol_codigo) REFERENCES public.rol(codigo)
  ON UPDATE CASCADE ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_usuario_rol_codigo
ON public.usuario (rol_codigo);

