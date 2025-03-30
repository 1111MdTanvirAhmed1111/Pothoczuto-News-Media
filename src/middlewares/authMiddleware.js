// authMiddleware.js (Prisma version)
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const { prisma } = require('@/config/dbConnect');



const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }, // Prisma uses 'id' instead of '_id'
    });
console.log(user, decoded.id)
    // Check if user exists
    // Note: This is a basic check. You might want to add more checks based on your application's requirements, such as checking if the user is still active, etc.
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check password match (if included in token)
    // Note: Including password in JWT is unusual and potentially insecure
    if (decoded.password) {
      const isMatch = await bcrypt.compare(decoded.password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' }); // Changed to 401 for auth failure
      }
    }

    // Set req.user with necessary fields
    req.user = {
      id: user.id,
      role: user.role, // Include role for authorization checks
      // Add other fields if needed, avoid sensitive data like password
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

module.exports = authMiddleware;