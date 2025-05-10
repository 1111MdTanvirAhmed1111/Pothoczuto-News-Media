// authController.js (Prisma version)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { validateInput } = require('@/utils/validateInput');
const { prisma } = require('@/config/dbConnect');
const { sendOTPEmail, sendMail } = require('@/utils/emailService');
const { ResetotpMailText } = require('@/utils/Mails/allMails');



exports.register = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = validateInput(req.body, schema);
  if (error) return res.status(400).json({ message: error.details[0].message, status: 400 });

  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if(existingUser && !existingUser.verified){
      const otp = generateOTP().toString();
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { otpCode: otp },
      });
      await sendMail(email, 'Verify your email for user Register', ResetotpMailText(otp));
      return res.status(400).json({ message: 'Verifiy By Otp Which is sent on your Email', status: 400 });
    }
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.', status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
const otp = generateOTP().toString();
    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        otpCode: otp
      },
    });
   await sendMail(email, 'Verify your email for user Register', `Your OTP is ${otp}`);

    res.status(201).json({ message: 'User registered successfully.', status: 201 });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 500 });
  }
};

exports.verifyRegister = async (req, res) => {
  try {
    const { email,otp } = req.body;

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    
    if (!user) return res.status(400).json({ message: 'User not found.', status: 400 });
    if(user.verified){
      return res.status(400).json({ message: 'User already verified.', status: 400 });
    }
    if (user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.', status: 400 });
    }

    // Update user's verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true , otpCode: ''},
    });

    res.status(200).json({ message: 'User verified successfully.', status: 200 });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 500 });
  }
};


exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = validateInput(req.body, schema);
  if (error) return res.status(400).json({ message: error.details[0].message, status: 400 });

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.', status: 400 });
    if(!user.verified) return res.status(400).json({ message: 'Please verify your email.', status: 400 });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, password }, // Use 'id' instead of '_id'
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token , status:200});
    } else {
      return res.status(400).json({ message: 'Invalid email or password.', status:400 });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, status:500 });
  }
};

exports.getUserData = async (req, res) => {

    // Get the token from the Authorization header


    try {


      // Find user by id (exclude password from response) and include followers/following
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          votes: true,
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
      res.status(200).json({...user, status: 200});
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      throw err;
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