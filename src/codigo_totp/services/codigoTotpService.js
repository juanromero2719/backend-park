import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import {
  guardarCodigoTotp,
  obtenerCodigoVigente,
  marcarCodigoComoUsado,
  eliminarCodigoPorId,
} from '../repositories/codigoTotpRepository.js'

function generarCodigoTotp() {
  const codigo = ('' + Math.floor(100000 + Math.random() * 900000))
  return codigo
}

function crearTransporterCorreo() {
  
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    const err = new Error('Configuración SMTP incompleta')
    err.statusCode = 500
    throw err
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function enviarCodigoTotp({ correoElectronico, minutosExpiracion = 10 }) {
  if (!correoElectronico) {
    const err = new Error('correoElectronico es requerido')
    err.statusCode = 400
    throw err
  }

  const codigo = generarCodigoTotp()
  await guardarCodigoTotp({ correoElectronico, codigo, expiraEn: minutosExpiracion })

  const emailDisabled = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true'
  if (emailDisabled) {
    return { enviadoA: correoElectronico, emailEnviado: false }
  }

  const transporter = crearTransporterCorreo()
  const from = process.env.MAIL_FROM || process.env.SMTP_USER

  await transporter.sendMail({
    from,
    to: correoElectronico,
    subject: 'Tu código TOTP',
    text: `Tu código es ${codigo}. Expira en ${minutosExpiracion} minutos.`,
    html: `<p>Tu código es <b>${codigo}</b>. Expira en ${minutosExpiracion} minutos.</p>`,
  })

  return { enviadoA: correoElectronico, emailEnviado: true }
}

export async function verificarCodigoTotp({ correoElectronico, codigo }) {
  if (!correoElectronico || !codigo) {
    const err = new Error('correoElectronico y codigo son requeridos')
    err.statusCode = 400
    throw err
  }

  const registro = await obtenerCodigoVigente({ correoElectronico, codigo })
  if (!registro) {
    const err = new Error('codigo inválido o expirado')
    err.statusCode = 400
    throw err
  }

  // Borrar el código verificado de la base de datos
  await eliminarCodigoPorId(registro.id)
  return { verificado: true }
}

export async function autenticarPorTotp({ numeroCedula, codigo, jwtExpiresIn }) {

  if (!numeroCedula || !codigo) {
    const err = new Error('numeroCedula y codigo son requeridos')
    err.statusCode = 400
    throw err
  }

  const { obtenerUsuarioPorCedula } = await import('../../user/repositories/userRepository.js')
  const usuario = await obtenerUsuarioPorCedula(numeroCedula)

  if (!usuario) {
    const err = new Error('usuario no encontrado')
    err.statusCode = 404
    throw err
  }

  const registro = await obtenerCodigoVigente({ correoElectronico: usuario.correo_electronico, codigo })
  if (!registro) {
    const err = new Error('codigo inválido o expirado')
    err.statusCode = 400
    throw err
  }

  await eliminarCodigoPorId(registro.id)

  const secret = process.env.JWT_SECRET
  if (!secret) {
    const err = new Error('JWT_SECRET no configurado')
    err.statusCode = 500
    throw err
  }

  const payload = {
    sub: usuario.numero_cedula,
    nombreCompleto: usuario.nombre_completo,
    correoElectronico: usuario.correo_electronico,
    rol: usuario.rol_codigo,
  }

  const effectiveExpiresIn = jwtExpiresIn || process.env.JWT_EXPIRES_IN || '15m'

  const token = jwt.sign(payload, secret, {
    issuer: 'backend-park',
    audience: 'frontend-clients',
    expiresIn: effectiveExpiresIn,
  })

  return { token, tipo: 'Bearer', expiraEn: effectiveExpiresIn }
}


