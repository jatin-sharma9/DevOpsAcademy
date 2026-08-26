import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'devops_academy_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email and password' });
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide username/email and password' });
    }

    // Find by email if it contains '@', otherwise try username
    let user;
    if (identifier.includes('@')) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findByUsername(identifier);
    }

    // Fallback search
    if (!user) {
      user = await User.findByEmail(identifier) || await User.findByUsername(identifier);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await User.validatePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    const { password_hash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.user.id;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    // Check if email is taken by another user
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail.id !== userId) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    // Check if username is taken by another user
    const existingUsername = await User.findByUsername(username);
    if (existingUsername && existingUsername.id !== userId) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const updatedUser = await User.updateProfile(userId, { username, email, password });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

