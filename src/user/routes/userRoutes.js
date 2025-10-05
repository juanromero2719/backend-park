import { Router } from 'express'
import {
  crearUsuarioHandler,
  obtenerUsuarioPorCedulaHandler,
  listarUsuariosHandler,
} from '../controllers/userController.js'
import { authJwt } from '../../middlewares/authJwt.js'

const router = Router()

router.post('/', crearUsuarioHandler)
router.get('/', authJwt, listarUsuariosHandler)
router.get('/:numero_cedula', obtenerUsuarioPorCedulaHandler)

export default router


