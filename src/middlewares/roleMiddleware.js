// roleMiddleware.js (Prisma version)

const roleMiddleware = (requiredRole) => async (req, res, next) => {
  try {
    // Ensure req.user is set by authMiddleware
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Check if user's role matches the required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  } catch (err) {
    console.error('Role middleware error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = roleMiddleware;