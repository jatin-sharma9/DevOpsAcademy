import { Course } from '../models/courseModel.js';
import { Lesson } from '../models/lessonModel.js';

export const getCourses = async (req, res) => {
  try {
    const { published } = req.query;
    let courses = await Course.findAll();

    if (published === 'true') {
      courses = courses.filter(course => course.is_published);
    }

    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findBySlug(req.params.slug);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Include lessons in the course response
    const lessons = await Lesson.findAllByCourseId(course.id);

    res.status(200).json({
      success: true,
      data: {
        ...course,
        lessons
      }
    });
  } catch (error) {
    console.error('Get course by slug error:', error);
    res.status(500).json({ message: 'Error fetching course details' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create({
      ...req.body,
      instructorId: req.user.id
    });
    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};

/**
 * Toggle publish status of a course
 */
export const publishCourse = async (req, res) => {
  try {
    const { isPublished } = req.body;
    if (isPublished === undefined) {
      return res.status(400).json({ message: 'isPublished status is required in body' });
    }

    const updated = await Course.updatePublishStatus(req.params.id, isPublished);
    if (!updated) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({
      success: true,
      message: `Course ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: updated
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ message: 'Error updating publish status' });
  }
};

/**
 * Upload and set course thumbnail
 */
export const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const thumbnailPath = `/uploads/${req.file.filename}`;
    const updated = await Course.updateThumbnail(req.params.id, thumbnailPath);
    
    if (!updated) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course thumbnail uploaded successfully',
      thumbnail: thumbnailPath,
      data: updated
    });
  } catch (error) {
    console.error('Upload thumbnail error:', error);
    res.status(500).json({ message: 'Error uploading thumbnail' });
  }
};
