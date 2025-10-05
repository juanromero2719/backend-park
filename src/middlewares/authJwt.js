import jwt from 'jsonwebtoken'

export function authJwt(req, res, next) {
  const header = req.headers['authorization'] || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'token faltante o inválido' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ message: 'JWT_SECRET no configurado' })
  }

  try {
    const payload = jwt.verify(token, secret, {
      issuer: 'backend-park',
      audience: 'frontend-clients',
    })
    req.user = payload
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'token inválido o expirado' })
  }
}


