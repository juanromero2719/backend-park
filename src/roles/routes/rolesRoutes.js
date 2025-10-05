import { Router } from 'express'
import { listarRolesHandler, asignarRolHandler } from '../controllers/rolesController.js'
import { authJwt } from '../../middlewares/authJwt.js'
import { requireAdmin } from '../../middlewares/requireAdmin.js'

const router = Router()

router.get('/', authJwt, requireAdmin, listarRolesHandler)
router.post('/asignar', authJwt, requireAdmin, asignarRolHandler)

export default router


