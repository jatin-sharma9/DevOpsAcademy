import { Note } from '../models/noteModel.js';
import { Lesson } from '../models/lessonModel.js';

/**
 * Get student's notes for a specific lesson
 * GET /api/lessons/:lessonId/notes
 */
export const getLessonNotes = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lesson ID parameter',
      });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: `Lesson with ID ${lessonId} not found`,
      });
    }

    const note = await Note.findByUserAndLesson(req.user.id, lessonId);

    res.status(200).json({
      success: true,
      data: note,
      message: note ? 'Note retrieved successfully' : 'No notes found for this lesson yet',
    });
  } catch (error) {
    console.error('Get lesson notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lesson notes',
    });
  }
};

/**
 * Create or update student's notes for a specific lesson (upsert)
 * PUT /api/lessons/:lessonId/notes
 */
export const saveLessonNotes = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lesson ID parameter',
      });
    }

    const { content } = req.body;
    if (content === undefined || content === null) {
      return res.status(400).json({
        success: false,
        message: 'Note content field is required',
      });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: `Lesson with ID ${lessonId} not found`,
      });
    }

    const savedNote = await Note.upsert(req.user.id, lessonId, String(content));

    res.status(200).json({
      success: true,
      message: 'Lesson note saved successfully',
      data: savedNote,
    });
  } catch (error) {
    console.error('Save lesson notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving lesson notes',
    });
  }
};

/**
 * Delete student's notes for a specific lesson
 * DELETE /api/lessons/:lessonId/notes
 */
export const deleteLessonNotes = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lesson ID parameter',
      });
    }

    const deleted = await Note.delete(req.user.id, lessonId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'No note found to delete for this lesson',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson note deleted successfully',
      data: deleted,
    });
  } catch (error) {
    console.error('Delete lesson notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lesson note',
    });
  }
};

/**
 * Get all notes created by active student
 * GET /api/lessons/notes/my
 */
export const getMyNotes = async (req, res) => {
  try {
    const { courseId } = req.query;
    const notes = await Note.findAllByUserId(req.user.id, courseId);

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error('Get my notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user notes',
    });
  }
};
