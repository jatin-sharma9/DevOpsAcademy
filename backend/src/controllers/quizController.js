import { QuizAttempt } from '../models/quizAttemptModel.js';
import { Course } from '../models/courseModel.js';

/**
 * Record a new quiz attempt
 * POST /api/quizzes/attempts
 */
export const recordAttempt = async (req, res) => {
  try {
    const {
      quizId: rawQuizId,
      quiz_id,
      courseId: rawCourseId,
      course_id,
      score: rawScore,
      passed,
      totalQuestions: rawTotal,
      total_questions,
      correctCount: rawCorrect,
      correct_count,
      answers,
      percentage: rawPercentage,
    } = req.body;

    const quizId = (rawQuizId || quiz_id || '').trim();
    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID is required (e.g., "quiz-k8s-basics")',
      });
    }

    if (rawScore === undefined || rawScore === null) {
      return res.status(400).json({
        success: false,
        message: 'Numeric score between 0 and 100 is required',
      });
    }

    const score = parseInt(rawScore, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Score must be an integer between 0 and 100',
      });
    }

    if (answers !== undefined && answers !== null && (typeof answers !== 'object')) {
      return res.status(400).json({
        success: false,
        message: 'Answers must be an object containing question-answer pairs',
      });
    }

    let parsedPercentage = null;
    if (rawPercentage !== undefined && rawPercentage !== null) {
      const pct = parseFloat(rawPercentage);
      if (isNaN(pct) || pct < 0 || pct > 100) {
        return res.status(400).json({
          success: false,
          message: 'Percentage must be a valid number between 0 and 100',
        });
      }
      parsedPercentage = pct;
    }

    let courseId = rawCourseId !== undefined ? rawCourseId : course_id;
    if (courseId) {
      const parsedCourseId = parseInt(courseId, 10);
      if (isNaN(parsedCourseId)) {
        return res.status(400).json({ success: false, message: 'Invalid courseId format' });
      }
      const course = await Course.findById(parsedCourseId);
      if (!course) {
        return res.status(404).json({ success: false, message: `Course with ID ${courseId} not found` });
      }
      courseId = parsedCourseId;
    }

    const totalQuestions = parseInt(rawTotal !== undefined ? rawTotal : (total_questions || 0), 10);
    const correctCount = parseInt(rawCorrect !== undefined ? rawCorrect : (correct_count || 0), 10);

    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      quizId,
      courseId: courseId || null,
      score,
      passed,
      totalQuestions,
      correctCount,
      answers: answers || {},
      percentage: parsedPercentage,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz attempt recorded successfully',
      data: attempt,
    });
  } catch (error) {
    console.error('Record quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording quiz attempt',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get the current student's quiz attempts
 * GET /api/quizzes/my-attempts
 */
export const getMyAttempts = async (req, res) => {
  try {
    const { quizId, courseId, limit, offset } = req.query;

    const attempts = await QuizAttempt.findByUserId(req.user.id, {
      quizId,
      courseId,
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    console.error('Get my quiz attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving quiz attempts',
    });
  }
};

/**
 * Get aggregate statistics and pass rates for a specific quiz
 * GET /api/quizzes/:quizId/stats
 */
export const getQuizStats = async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!quizId || !quizId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID parameter is required',
      });
    }

    const stats = await QuizAttempt.getQuizStats(quizId.trim());

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving quiz statistics',
    });
  }
};
