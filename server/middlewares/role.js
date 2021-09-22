module.exports = role => {
  return (req, res, next) => {
    if (role === ' all' && req.user) {
      next()
    }

    if (!req.user || req.user.role !== role)
      return res.status(401).json({ message: 'Unauthorize request' })

    next()
  }
}
