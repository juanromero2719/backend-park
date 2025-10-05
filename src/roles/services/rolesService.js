import { listarRoles as repoListarRoles, asignarRolAUsuario } from '../repositories/rolesRepository.js'

export async function serviceListarRoles() {
  return await repoListarRoles()
}

export async function serviceAsignarRol({ numeroCedula, rolCodigo }) {
  return await asignarRolAUsuario({ numeroCedula, rolCodigo })
}


