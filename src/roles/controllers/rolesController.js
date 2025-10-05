import { serviceListarRoles, serviceAsignarRol } from '../services/rolesService.js'

export async function listarRolesHandler(req, res) {
  try {
    const roles = await serviceListarRoles()
    res.json(roles)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ message: err.message })
  }
}

export async function asignarRolHandler(req, res) {
  try {
    const { numeroCedula, rolCodigo } = req.body || {}
    const usuario = await serviceAsignarRol({ numeroCedula, rolCodigo })
    res.json(usuario)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ message: err.message })
  }
}


