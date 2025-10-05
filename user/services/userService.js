import {
  crearUsuario,
  obtenerUsuarioPorCedula,
  listarUsuarios,
} from '../repositories/userRepository.js'

export async function serviceCrearUsuario(input) {
  
  const { numero_cedula, nombre_completo, telefono, correo_electronico } = input || {}

  if (!numero_cedula || !nombre_completo || !telefono || !correo_electronico) {
    
    const missing = [
      !numero_cedula && 'numero_cedula',
      !nombre_completo && 'nombre_completo',
      !telefono && 'telefono',
      !correo_electronico && 'correo_electronico',
    ].filter(Boolean)
    
    const message = `Campos requeridos faltantes: ${missing.join(', ')}`
    const err = new Error(message)
    err.statusCode = 400
    throw err
  }

  return await crearUsuario({ numero_cedula, nombre_completo, telefono, correo_electronico })
}

export async function serviceObtenerUsuarioPorCedula(numero_cedula) {
  if (!numero_cedula) {
    const err = new Error('numero_cedula es requerido')
    err.statusCode = 400
    throw err
  }
  return await obtenerUsuarioPorCedula(numero_cedula)
}

export async function serviceListarUsuarios({ limit = 50, offset = 0 } = {}) {
  return await listarUsuarios({ limit, offset })
}


