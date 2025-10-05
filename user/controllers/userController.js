import {
  serviceCrearUsuario,
  serviceObtenerUsuarioPorCedula,
  serviceListarUsuarios,
} from '../services/userService.js'

export async function crearUsuarioHandler(req, res) {
  
  try {
    const created = await serviceCrearUsuario(req.body)
    res.status(201).json(created)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ message: err.message })
  }
}

export async function obtenerUsuarioPorCedulaHandler(req, res) {
  try {
    const user = await serviceObtenerUsuarioPorCedula(req.params.numero_cedula)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ message: err.message })
  }
}

export async function listarUsuariosHandler(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined
    const offset = req.query.offset ? parseInt(req.query.offset) : undefined
    const users = await serviceListarUsuarios({ limit, offset })
    res.json(users)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ message: err.message })
  }
}


