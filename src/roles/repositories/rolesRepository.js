import supabase from '../../connection/database.js'

export async function listarRoles() {
  const { data, error } = await supabase
    .from('rol')
    .select('codigo, descripcion')
    .order('codigo', { ascending: true })

  if (error) throw error
  return data
}

export async function asignarRolAUsuario({ numeroCedula, rolCodigo }) {
  if (!numeroCedula || !rolCodigo) {
    const err = new Error('numeroCedula y rolCodigo son requeridos')
    err.statusCode = 400
    throw err
  }

  const { data, error } = await supabase
    .from('usuario')
    .update({ rol_codigo: rolCodigo })
    .eq('numero_cedula', numeroCedula)
    .select('numero_cedula, nombre_completo, rol_codigo')
    .maybeSingle()

  if (error) throw error
  if (!data) {
    const err = new Error('usuario no encontrado')
    err.statusCode = 404
    throw err
  }
  return data
}


