import { User } from '../models/userModel.js';
import { auditService } from '../services/auditService.js';

/**
 * Get all registered users (Admin only)
 * GET /api/users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

/**
 * Get single user profile by ID (Admin only)
 * GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};

/**
 * Update user role (Admin only)
 * PUT /api/users/:id/role
 */
export const updateUserRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    const normalizedRole = role === 'student' ? 'user' : role.toLowerCase();
    if (!['user', 'instructor', 'admin'].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Permitted values: 'user' ('student'), 'instructor', 'admin'",
      });
    }

    // Guard: Prevent admin from demoting their own active account
    if (userId === req.user.id && normalizedRole !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote your own admin account. Have another admin change your role.',
      });
    }

    const updatedUser = await User.updateRole(userId, normalizedRole);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Record audit log
    auditService.log({
      action: 'UPDATE_USER_ROLE',
      resource: 'user',
      resourceId: userId,
      details: { newRole: normalizedRole, username: updatedUser.username },
      req,
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${normalizedRole}`,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ success: false, message: 'Error updating user role' });
  }
};

/**
 * Delete user account (Admin only)
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Guard: Prevent admin from deleting their own active session account
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own active administrator account.',
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const defaultAdmin = (process.env.DEFAULT_ADMIN_USERNAME || 'Jatin_Sharma').toLowerCase();
    if (targetUser.username.toLowerCase() === defaultAdmin) {
      return res.status(400).json({
        success: false,
        message: 'The default administrator account cannot be deleted.',
      });
    }

    await User.delete(userId);

    // Record audit log
    auditService.log({
      action: 'DELETE_USER',
      resource: 'user',
      resourceId: userId,
      details: { username: targetUser.username, email: targetUser.email },
      req,
    });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
};
