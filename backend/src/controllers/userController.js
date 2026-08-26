import { User } from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const updatedUser = await User.updateRole(req.params.id, role);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
