// authController.js (Prisma version)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const { validateInput } = require('@/utils/validateInput');
const { prisma } = require('@/config/dbConnect');



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

      // Find user by id (exclude password from response) and include followers/following
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          profilePic: true,
          coverPic: true,
          followers: {
            select: {
              follower: {
                select: {
                  id: true,
                  username: true,
                  profilePic: true
                }
              }
            }
          },
          following: {
            select: {
              following: {
                select: {
                  id: true,
                  username: true,
                  profilePic: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Transform followers and following data
      const followers = user.followers.map(f => f.follower);
      const following = user.following.map(f => f.following);

      // Return user data with followers and following
      res.status(200).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        coverPic: user.coverPic,
        followers: followers,
        following: following
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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
        
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePic: true,
        coverPic: true,
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
                profilePic: true
              }
            }
          }
        },
        following: {
          select: {
            following: {
              select: {
                id: true,
                username: true,
                profilePic: true
              }
            }
          }
        }
      }
    }); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
};

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Password reset request and OTP generation
exports.forgotPassword = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  });

  const { error } = validateInput(req.body, schema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP in database
    await prisma.oTP.create({
      data: {
        code: otp,
        expiresAt,
        userId: user.id
      }
    });

    // Send OTP via email
    const { sendOTPEmail } = require('@/utils/emailService');
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email.' });
    }

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
  });

  const { error } = validateInput(req.body, schema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email, otp } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find valid OTP
    const validOTP = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        code: otp,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!validOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: validOTP.id },
      data: { isUsed: true }
    });

    // Generate temporary token for password reset
    const resetToken = jwt.sign(
      { id: user.id, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.status(200).json({ message: 'OTP verified successfully.', resetToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const schema = Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  });

  const { error } = validateInput(req.body, schema);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { resetToken, newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: 'Invalid reset token.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    res.status(500).json({ message: err.message });
  }
}