import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublishBlog,
  toggleFeaturedBlog,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

// Protected instructor/admin routes
router.post('/', protect, authorize('instructor', 'admin'), createBlog);
router.put('/:id', protect, authorize('instructor', 'admin'), updateBlog);
router.put('/:id/publish', protect, authorize('instructor', 'admin'), togglePublishBlog);
router.put('/:id/featured', protect, authorize('instructor', 'admin'), toggleFeaturedBlog);

// Admin only routes
router.delete('/:id', protect, authorize('admin'), deleteBlog);

export default router;
