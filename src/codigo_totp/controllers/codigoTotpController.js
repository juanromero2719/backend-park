import { enviarCodigoTotp, verificarCodigoTotp, autenticarPorTotp } from '../services/codigoTotpService.js'

export async function enviarCodigoHandler(req, res) {
  try {
    const { correoElectronico, minutosExpiracion } = req.body || {}
    const result = await enviarCodigoTotp({ correoElectronico, minutosExpiracion })
    res.status(201).json(result)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ message: err.message })
  }
}

export async function verificarCodigoHandler(req, res) {
  try {
    const { correoElectronico, codigo } = req.body || {}
    const result = await verificarCodigoTotp({ correoElectronico, codigo })
    res.json(result)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ message: err.message })
  }
}

export async function autenticarHandler(req, res) {
  try {
    const { numeroCedula, codigo } = req.body || {}
    const result = await autenticarPorTotp({ numeroCedula, codigo })
    res.json(result)
  } catch (err) {
    const status = err.statusCode || 500
    res.status(status).json({ message: err.message })
  }
}


