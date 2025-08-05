const jwt = require('jsonwebtoken');

// PUBLIC_INTERFACE
function authenticateToken(req, res, next) {
  /**
   * Express middleware that validates JWT (from Authorization: Bearer <token> header).
   * Attaches user object to req if valid.
   */
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// PUBLIC_INTERFACE
function requireRole(role) {
  /**
   * Returns middleware that requires the user's JWT to have specified 'role'
   * e.g. use as requireRole('parent')
   */
  return function(req, res, next) {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden, role required: ' + role });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole };
