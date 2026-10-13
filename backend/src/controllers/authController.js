import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { generateToken } from '../utils/jwt.js';
import { emailService } from '../services/emailService.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, role: rawRole } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username, email and password' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Role handling and security guard:
    // Admin accounts cannot be self-registered publicly. They are securely provisioned via system configuration
    // or promoted by existing administrators. Only student ('user') and instructor roles may self-register.
    const requestedRole = (rawRole || 'user').toLowerCase().trim();
    if (requestedRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator accounts cannot be registered publicly. Please sign in with existing administrator credentials or contact the system administrator.',
      });
    }

    const role = requestedRole === 'instructor' ? 'instructor' : 'user';

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already registered' 
      });
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username is already taken' 
      });
    }

    const user = await User.create({ username, email, password, role });
    const token = generateToken(user);

    // Send welcome onboarding email asynchronously
    emailService.sendWelcomeEmail({ username: user.username, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

/**
 * User & Admin Login
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, username, identifier: rawIdentifier, password } = req.body;
    const identifier = (rawIdentifier || username || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username/email and password' 
      });
    }

    // Lookup user by username or email (case-insensitive)
    const user = await User.findByIdentifier(identifier);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Validate password
    const isMatch = await User.validatePassword(password, user.password_hash, user);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate signed JWT token with user details (id, username, email, role)
    const token = generateToken(user);

    // Sanitize user object (exclude sensitive password_hash)
    const { password_hash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

/**
 * Get active user session / profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * Verify JWT token validity
 * GET /api/auth/verify
 */
export const verifyTokenHandler = async (req, res) => {
  res.status(200).json({
    success: true,
    valid: true,
    message: 'Token is valid',
    user: req.user,
  });
};

/**
 * Update authenticated user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.user.id;

    if (!username || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and email are required' 
      });
    }

    // Check if email is taken by another user
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail.id !== userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already taken' 
      });
    }

    // Check if username is taken by another user
    const existingUsername = await User.findByUsername(username);
    if (existingUsername && existingUsername.id !== userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username is already taken' 
      });
    }

    const updatedUser = await User.updateProfile(userId, { username, email, password });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during profile update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

/**
 * Request password reset email
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const user = await User.findByEmail(email) || await User.findByIdentifier(email);
    if (!user) {
      // Don't disclose user existence for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.',
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'devops_academy_super_secret_jwt_key_2026';
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, purpose: 'pwd_reset' },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5200';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    await emailService.sendPasswordResetEmail({
      email: user.email,
      username: user.username,
      resetToken,
      resetUrl,
      expiresMinutes: 30,
    });

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, password reset instructions have been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing password reset request',
    });
  }
};

/**
 * Reset password with verified token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'devops_academy_super_secret_jwt_key_2026';
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.purpose !== 'pwd_reset') {
        return res.status(400).json({ success: false, message: 'Invalid reset token' });
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Reset token is invalid or has expired' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.updateProfile(user.id, {
      username: user.username,
      email: user.email,
      password: newPassword,
    });

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting password',
    });
  }
};

