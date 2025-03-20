// authController.js (Prisma version)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { validateInput } = require('@/utils/validateInput');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = validateInput(req.body, schema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = validateInput(req.body, schema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, password }, // Use 'id' instead of '_id'
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token });
    } else {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Find user by id (exclude password from response)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }, // Use 'id' instead of '_id'
        select: {
          id: true, // Explicitly select fields to exclude password
          username: true,
          email: true,
          role: true,
          profilePic: true, // Optional: include if needed
          coverPic: true,   // Optional: include if needed
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return user data
      res.status(200).json({
        _id: user.id, // Match Mongoose response format
        username: user.username,
        email: user.email,
        role: user.role,
        // Add other fields if needed
      });
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};