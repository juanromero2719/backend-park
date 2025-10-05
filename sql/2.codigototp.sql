CREATE TABLE IF NOT EXISTS public.codigo_totp (
  id bigserial PRIMARY KEY,
  correo_electronico text NOT NULL,
  codigo varchar(6) NOT NULL,
  expiracion timestamptz NOT NULL,
  usado boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_codigo_totp_correo ON public.codigo_totp (correo_electronico);

CREATE INDEX IF NOT EXISTS idx_codigo_totp_expiracion
ON public.codigo_totp (expiracion);

CREATE EXTENSION IF NOT EXISTS pg_cron;


SELECT cron.schedule(
  'cleanup_codigo_totp',           
  '*/5 * * * *',                   
  $$
  DELETE FROM public.codigo_totp
  WHERE expiracion <= NOW();
  $$
);

CREATE OR REPLACE FUNCTION public.codigo_totp_cleanup_on_write()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.codigo_totp WHERE expiracion <= NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS codigo_totp_cleanup_on_write ON public.codigo_totp;
CREATE TRIGGER codigo_totp_cleanup_on_write
AFTER INSERT OR UPDATE ON public.codigo_totp
FOR EACH STATEMENT
EXECUTE FUNCTION public.codigo_totp_cleanup_on_write();


