module.exports = role => {
  return (req, res, next) => {
    if (role === 'all' && req.user) {
      return next()
    }

    if (role.filter(item => item === req.user.role).length === 1) {
      return next()
    }

    if (!req.user || req.user.role !== role)
      return res.status(401).json({ message: 'Unauthorized request' })

    next()
  }
}
