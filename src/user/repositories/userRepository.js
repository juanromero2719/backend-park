import supabase from '../../connection/database.js'

export async function crearUsuario({ numero_cedula, nombre_completo, telefono, correo_electronico }) {
  
  if (!numero_cedula || !nombre_completo || !telefono || !correo_electronico) {
    throw new Error('numero_cedula, nombre_completo, telefono y correo_electronico son requeridos')
  }

  const { data, error } = await supabase
    .from('usuario')
    .insert({ numero_cedula, nombre_completo, telefono, correo_electronico })
    .select()
    .single()

  if (error) {
    const message = (error.message || '').toLowerCase()
    const isDuplicate = error.code === '23505' || message.includes('duplicate key value')
    if (isDuplicate) {
      const err = new Error('ya existe un usuario con este numero de cedula')
      err.statusCode = 409
      throw err
    }
    throw error
  }

  return data
}

export async function obtenerUsuarioPorCedula(numero_cedula) {
  
  if (!numero_cedula) {
    throw new Error('numero_cedula es requerido')
  }

  const { data, error } = await supabase
    .from('usuario')
    .select('numero_cedula, nombre_completo, telefono, correo_electronico')
    .eq('numero_cedula', numero_cedula)
    .maybeSingle()

  if (error) throw error
  
  return data
}

export async function listarUsuarios({ limit = 50, offset = 0 } = {}) {
  
  const { data, error } = await supabase
    .from('usuario')
    .select('numero_cedula, nombre_completo, telefono, correo_electronico')
    .range(offset, offset + limit - 1)

  if (error) throw error
  
  return data
}


