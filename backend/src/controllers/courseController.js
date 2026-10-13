import { Course } from '../models/courseModel.js';
import { Lesson } from '../models/lessonModel.js';

/**
 * Get all courses with optional SQL filtering & search
 * GET /api/courses?published=true&category=Linux&level=beginner&search=docker
 */
export const getCourses = async (req, res) => {
  try {
    const { published, category, level, search } = req.query;

    const courses = await Course.findAll({
      isPublished: published !== undefined ? published : null,
      category,
      level,
      search,
    });

    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
};

/**
 * Get single course by slug with its lessons
 * GET /api/courses/:slug
 */
export const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Course slug is required' });
    }

    const course = await Course.findBySlug(slug);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Include lessons sorted by sort_order
    const lessons = await Lesson.findAllByCourseId(course.id);

    res.status(200).json({
      success: true,
      data: {
        ...course,
        lessons,
      },
    });
  } catch (error) {
    console.error('Get course by slug error:', error);
    res.status(500).json({ success: false, message: 'Error fetching course details' });
  }
};

/**
 * Create a new course (Instructor / Admin only)
 * POST /api/courses
 */
export const createCourse = async (req, res) => {
  try {
    const { title, slug, category, level, price, description, shortDescription } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Course title is required' });
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check slug uniqueness
    const existing = await Course.findBySlug(generatedSlug);
    if (existing) {
      return res.status(400).json({ success: false, message: `A course with slug '${generatedSlug}' already exists` });
    }

    const newCourse = await Course.create({
      ...req.body,
      title: title.trim(),
      slug: generatedSlug,
      category: category || 'General',
      instructorId: req.user.id,
    });

    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, message: 'Error creating course', error: error.message });
  }
};

/**
 * Update course details
 * PUT /api/courses/:id
 */
export const updateCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const existing = await Course.findById(courseId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const updated = await Course.update(courseId, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Error updating course' });
  }
};

/**
 * Delete course (Admin only)
 * DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const deleted = await Course.delete(courseId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, message: 'Error deleting course' });
  }
};

/**
 * Toggle publish status of a course
 * PUT /api/courses/:id/publish
 */
export const publishCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const { isPublished } = req.body;
    if (isPublished === undefined) {
      return res.status(400).json({ success: false, message: 'isPublished status is required in body' });
    }

    const updated = await Course.updatePublishStatus(courseId, Boolean(isPublished));
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: `Course ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ success: false, message: 'Error updating publish status' });
  }
};

/**
 * Upload and set course thumbnail
 * POST /api/courses/:id/thumbnail
 */
export const uploadThumbnail = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const thumbnailPath = `/uploads/${req.file.filename}`;
    const updated = await Course.updateThumbnail(courseId, thumbnailPath);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course thumbnail uploaded successfully',
      thumbnail: thumbnailPath,
      data: updated,
    });
  } catch (error) {
    console.error('Upload thumbnail error:', error);
    res.status(500).json({ success: false, message: 'Error uploading thumbnail' });
  }
};
