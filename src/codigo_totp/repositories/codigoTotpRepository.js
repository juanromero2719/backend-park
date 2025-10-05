import supabase from '../../connection/database.js'

export async function eliminarCodigosPrevios(correoElectronico) {
  // Borra cualquier código previo para ese correo
  await supabase
    .from('codigo_totp')
    .delete()
    .eq('correo_electronico', correoElectronico)
}

export async function guardarCodigoTotp({ correoElectronico, codigo, expiraEn }) {
  const expiracion = new Date(Date.now() + expiraEn * 60 * 1000).toISOString()

  // Asegura que solo quede el nuevo código
  await eliminarCodigosPrevios(correoElectronico)

  const { data, error } = await supabase
    .from('codigo_totp')
    .insert({ correo_electronico: correoElectronico, codigo, expiracion, usado: false })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function obtenerCodigoVigente({ correoElectronico, codigo }) {
  const ahoraIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('codigo_totp')
    .select('id, correo_electronico, codigo, expiracion, usado')
    .eq('correo_electronico', correoElectronico)
    .eq('codigo', codigo)
    .eq('usado', false)
    .gt('expiracion', ahoraIso)
    .order('expiracion', { ascending: false })
    .maybeSingle()

  if (error) throw error
  return data
}

export async function marcarCodigoComoUsado(id) {
  // Mantener por compatibilidad: marcar como usado si se requiere
  const { data, error } = await supabase
    .from('codigo_totp')
    .update({ usado: true })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarCodigoPorId(id) {
  const { error } = await supabase
    .from('codigo_totp')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}


