import { Lesson } from '../models/lessonModel.js';
import { Course } from '../models/courseModel.js';

export const getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.findAllByCourseId(courseId);
    res.status(200).json({ success: true, count: lessons.length, data: lessons });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ message: 'Error fetching lessons for this course' });
  }
};

export const getLessonBySlug = async (req, res) => {
  try {
    const { courseId, slug } = req.params;
    const lesson = await Lesson.findBySlug(courseId, slug);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    console.error('Get lesson by slug error:', error);
    res.status(500).json({ message: 'Error fetching lesson' });
  }
};

export const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newLesson = await Lesson.create({
      ...req.body,
      courseId: parseInt(courseId, 10)
    });

    res.status(201).json({ success: true, data: newLesson });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ message: 'Error creating lesson', error: error.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Lesson.update(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: 'Error updating lesson' });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lesson.delete(id);
    if (!deleted) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ message: 'Error deleting lesson' });
  }
};
