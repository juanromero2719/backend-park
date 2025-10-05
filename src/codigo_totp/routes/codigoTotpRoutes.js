import { Router } from 'express'
import { enviarCodigoHandler, verificarCodigoHandler, autenticarHandler } from '../controllers/codigoTotpController.js'

const router = Router()

router.post('/enviar', enviarCodigoHandler)
router.post('/verificar', verificarCodigoHandler)
router.post('/autenticar', autenticarHandler)

export default router


