import { Review } from '../models/reviewModel.js';
import { Course } from '../models/courseModel.js';
import { Enrollment } from '../models/enrollmentModel.js';
import { auditService } from '../services/auditService.js';

/**
 * Helper to resolve course ID from slug or numeric ID
 */
const resolveCourse = async (identifier) => {
  if (!identifier) return null;
  const numId = parseInt(identifier, 10);
  if (!isNaN(numId) && String(numId) === String(identifier).trim()) {
    return Course.findById(numId);
  }
  return Course.findBySlug(String(identifier).trim());
};

/**
 * Get reviews and aggregate rating breakdown for a course
 * GET /api/courses/:courseId/reviews
 */
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { approvedOnly, limit, offset } = req.query;

    const course = await resolveCourse(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course '${courseId}' not found`,
      });
    }

    const isOnlyApproved = approvedOnly !== undefined ? approvedOnly === 'true' : true;

    const result = await Review.findByCourse(course.id, {
      approvedOnly: isOnlyApproved,
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    res.status(200).json({
      success: true,
      courseId: course.id,
      courseTitle: course.title,
      count: result.reviews.length,
      data: result.reviews,
      stats: result.stats,
    });
  } catch (error) {
    console.error('Get course reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course reviews',
    });
  }
};

/**
 * Submit or update a student review for a course
 * POST /api/courses/:courseId/reviews
 */
export const createCourseReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating: rawRating, reviewText, review_text } = req.body;

    if (rawRating === undefined || rawRating === null) {
      return res.status(400).json({
        success: false,
        message: 'Rating score (1 to 5) is required',
      });
    }

    const rating = parseInt(rawRating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5',
      });
    }

    const course = await resolveCourse(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course '${courseId}' not found`,
      });
    }

    // Only enrolled users (or admin) can submit reviews
    const enrollment = await Enrollment.findByUserAndCourse(req.user.id, course.id);
    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only enrolled students can submit reviews for this course',
      });
    }

    const text = (reviewText !== undefined ? reviewText : (review_text || '')).trim();
    if (text.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Review text cannot exceed 2000 characters',
      });
    }

    const review = await Review.upsert(req.user.id, course.id, {
      rating,
      reviewText: text,
      isApproved: true, // Default approved; admin can moderate if flagged
    });

    res.status(201).json({
      success: true,
      message: 'Course review submitted successfully',
      data: review,
    });
  } catch (error) {
    console.error('Create course review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting course review',
    });
  }
};

/**
 * Moderate review status (Admin only)
 * PUT /api/admin/reviews/:id/moderate
 */
export const moderateReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    if (isNaN(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID parameter',
      });
    }

    const { isApproved } = req.body;
    if (isApproved === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isApproved boolean status is required in body',
      });
    }

    const updated = await Review.moderate(reviewId, Boolean(isApproved));
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Review with ID ${reviewId} not found`,
      });
    }

    // Record audit log
    auditService.log({
      action: 'MODERATE_REVIEW',
      resource: 'review',
      resourceId: reviewId,
      details: { isApproved: Boolean(isApproved), courseId: updated.course_id },
      req,
    });

    res.status(200).json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'hidden/moderated'} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error moderating review',
    });
  }
};

/**
 * Get all reviews across platform for admin moderation
 * GET /api/admin/reviews
 */
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { isApproved, limit, offset } = req.query;

    let approvedFilter = undefined;
    if (isApproved !== undefined) {
      approvedFilter = isApproved === 'true';
    }

    const reviews = await Review.findAllAdmin({
      isApproved: approvedFilter,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Get all admin reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving platform reviews',
    });
  }
};

/**
 * Delete a review (Admin only)
 * DELETE /api/admin/reviews/:id
 */
export const deleteReviewAdmin = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    if (isNaN(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID parameter',
      });
    }

    const deleted = await Review.delete(reviewId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Review with ID ${reviewId} not found`,
      });
    }

    // Record audit log
    auditService.log({
      action: 'DELETE_REVIEW',
      resource: 'review',
      resourceId: reviewId,
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
    });
  }
};
