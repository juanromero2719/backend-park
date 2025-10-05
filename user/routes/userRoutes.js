import { Router } from 'express'
import {
  crearUsuarioHandler,
  obtenerUsuarioPorCedulaHandler,
  listarUsuariosHandler,
} from '../controllers/userController.js'

const router = Router()

router.post('/', crearUsuarioHandler)
router.get('/', listarUsuariosHandler)
router.get('/:numero_cedula', obtenerUsuarioPorCedulaHandler)

export default router


