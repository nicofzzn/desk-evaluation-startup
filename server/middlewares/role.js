module.exports = role => {
  return (req, res, next) => {
    if (req.user && role === 'all') return next()
    if (!req.user || req.user.role !== role)
      return res.status(401).json({ message: 'Unauthorize request' })

    next()
  }
}
