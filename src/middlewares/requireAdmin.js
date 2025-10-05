export function requireAdmin(req, res, next) {
  const user = req.user
  if (!user) return res.status(401).json({ message: 'no autenticado' })
  if (user.rol === 'admin') return next()
  return res.status(403).json({ message: 'requiere rol administrador' })
}


