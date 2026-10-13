import { query } from '../config/db.js';

export const QuizAttempt = {
  /**
   * Record a new quiz attempt in PostgreSQL
   * 
   * @param {Object} params
   * @param {number} params.userId - Authenticated user ID
   * @param {string} params.quizId - Identifier for the quiz (e.g. 'quiz-k8s-basics')
   * @param {number} [params.courseId] - Optional associated course ID
   * @param {number} params.score - Score attained (0-100)
   * @param {boolean} [params.passed] - Pass flag (auto-calculated as score >= 70 if omitted)
   * @param {number} [params.totalQuestions=0] - Total questions in quiz
   * @param {number} [params.correctCount=0] - Correct answers count
   * @returns {Promise<Object>} Created attempt record
   */
  async create({
    userId,
    quizId,
    courseId = null,
    score,
    passed,
    totalQuestions = 0,
    correctCount = 0,
    answers = {},
    percentage = null,
  }) {
    const isPassed = passed !== undefined ? Boolean(passed) : score >= 70;
    const parsedTotal = parseInt(totalQuestions, 10) || 0;
    const parsedCorrect = parseInt(correctCount, 10) || 0;
    const numericScore = Math.max(0, Math.min(100, parseInt(score, 10)));
    const calcPercentage = percentage !== null && percentage !== undefined
      ? parseFloat(percentage)
      : (parsedTotal > 0 ? Math.round((parsedCorrect / parsedTotal) * 10000) / 100 : numericScore);

    const res = await query(
      `INSERT INTO quiz_attempts (
        user_id, quiz_id, course_id, score, passed, total_questions, correct_count, answers, percentage
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        userId,
        quizId.trim(),
        courseId ? parseInt(courseId, 10) : null,
        numericScore,
        isPassed,
        parsedTotal,
        parsedCorrect,
        answers ? JSON.stringify(answers) : '{}',
        calcPercentage,
      ]
    );

    const row = res.rows[0];
    if (row && row.percentage !== null && row.percentage !== undefined) {
      row.percentage = parseFloat(row.percentage);
    }
    return row;
  },

  /**
   * Retrieve quiz attempts for a specific student with course joins
   * 
   * @param {number} userId
   * @param {Object} [filters]
   * @param {string} [filters.quizId]
   * @param {number} [filters.courseId]
   * @param {number} [filters.limit=50]
   * @param {number} [filters.offset=0]
   * @returns {Promise<Array>}
   */
  async findByUserId(userId, { quizId, courseId, limit = 50, offset = 0 } = {}) {
    let sql = `
      SELECT qa.*,
             c.title as course_title,
             c.slug as course_slug,
             c.category as course_category
      FROM quiz_attempts qa
      LEFT JOIN courses c ON qa.course_id = c.id
      WHERE qa.user_id = $1
    `;
    const params = [userId];

    if (quizId) {
      params.push(quizId.trim());
      sql += ` AND qa.quiz_id = $${params.length}`;
    }

    if (courseId) {
      params.push(parseInt(courseId, 10));
      sql += ` AND qa.course_id = $${params.length}`;
    }

    sql += ` ORDER BY qa.created_at DESC`;

    if (limit) {
      params.push(Math.min(100, Math.max(1, parseInt(limit, 10))));
      sql += ` LIMIT $${params.length}`;
    }

    if (offset) {
      params.push(Math.max(0, parseInt(offset, 10)));
      sql += ` OFFSET $${params.length}`;
    }

    const res = await query(sql, params);
    return res.rows;
  },

  /**
   * Get aggregate statistics for a specific quiz
   * 
   * @param {string} quizId
   * @returns {Promise<Object>} Aggregate stats
   */
  async getQuizStats(quizId) {
    const cleanQuizId = (quizId || '').trim();

    // 1. Overall stats
    const statsRes = await query(
      `SELECT
        COUNT(*)::int as total_attempts,
        COUNT(DISTINCT user_id)::int as unique_users,
        COUNT(*) FILTER (WHERE passed = TRUE)::int as pass_count,
        ROUND(COALESCE(AVG(score), 0), 1)::float as average_score,
        COALESCE(MAX(score), 0)::int as highest_score,
        COALESCE(MIN(score), 0)::int as lowest_score
      FROM quiz_attempts
      WHERE quiz_id = $1`,
      [cleanQuizId]
    );

    const s = statsRes.rows[0] || {};
    const total = s.total_attempts || 0;
    const passes = s.pass_count || 0;
    const passRate = total > 0 ? Math.round((passes / total) * 1000) / 10 : 0;

    // 2. Recent attempts sample
    const recentRes = await query(
      `SELECT qa.id, qa.score, qa.passed, qa.correct_count, qa.total_questions, qa.created_at,
              u.username
       FROM quiz_attempts qa
       JOIN users u ON qa.user_id = u.id
       WHERE qa.quiz_id = $1
       ORDER BY qa.created_at DESC
       LIMIT 5`,
      [cleanQuizId]
    );

    return {
      quizId: cleanQuizId,
      totalAttempts: total,
      uniqueUsers: s.unique_users || 0,
      passCount: passes,
      passRate,
      averageScore: s.average_score || 0,
      highestScore: s.highest_score || 0,
      lowestScore: s.lowest_score || 0,
      recentAttempts: recentRes.rows,
    };
  },

  /**
   * Find a single quiz attempt by ID
   */
  async findById(id) {
    const res = await query(
      `SELECT qa.*, u.username, c.title as course_title
       FROM quiz_attempts qa
       JOIN users u ON qa.user_id = u.id
       LEFT JOIN courses c ON qa.course_id = c.id
       WHERE qa.id = $1`,
      [id]
    );
    return res.rows[0];
  }
};
