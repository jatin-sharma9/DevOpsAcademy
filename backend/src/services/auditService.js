import { query } from '../config/db.js';
import { logger } from '../utils/logger.js';

export const auditService = {
  /**
   * Record an administrative audit action
   * 
   * @param {Object} entry
   * @param {number} [entry.userId] - Administrator user ID
   * @param {string} [entry.username] - Administrator username
   * @param {string} entry.action - Action name (e.g. 'ISSUE_CERTIFICATE', 'UPDATE_USER_ROLE')
   * @param {string} entry.resource - Target resource type (e.g. 'certificate', 'user', 'email_settings')
   * @param {string|number} [entry.resourceId] - ID of affected entity
   * @param {Object} [entry.details={}] - Payload or state change details
   * @param {Object} [entry.req] - Express request object for IP and User-Agent extraction
   * @returns {Promise<Object>} Created audit log row
   */
  async log({
    userId = null,
    username = null,
    action,
    resource,
    resourceId = null,
    details = {},
    req = null,
  }) {
    try {
      const ip = req ? (req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown') : 'system';
      const userAgent = req ? (req.headers['user-agent'] || 'unknown') : 'system';
      const finalUserId = userId || (req?.user?.id) || null;
      const finalUsername = username || (req?.user?.username) || 'System';

      const res = await query(
        `INSERT INTO audit_logs (
          user_id, username, action, resource, resource_id, details, ip_address, user_agent
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          finalUserId,
          finalUsername,
          action,
          resource,
          resourceId !== null ? String(resourceId) : null,
          JSON.stringify(details),
          String(ip).slice(0, 50),
          String(userAgent).slice(0, 255),
        ]
      );

      // Also log via structured Winston logger with correlation
      logger.info(`[AUDIT] ${finalUsername} executed ${action} on ${resource}${resourceId ? ` (ID: ${resourceId})` : ''}`, {
        auditAction: action,
        resource,
        resourceId,
        actor: finalUsername,
        actorId: finalUserId,
        ip,
        details,
      });

      return res.rows[0];
    } catch (error) {
      logger.error('Failed to write audit log to database:', { error: error.message, action, resource });
      return null;
    }
  },

  /**
   * Retrieve audit logs with filtering and pagination
   * 
   * @param {Object} [filters]
   * @param {string} [filters.action]
   * @param {string} [filters.resource]
   * @param {number} [filters.userId]
   * @param {number} [filters.limit=50]
   * @param {number} [filters.offset=0]
   * @returns {Promise<Array>}
   */
  async getAuditLogs({ action, resource, userId, limit = 50, offset = 0 } = {}) {
    let sql = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (action) {
      params.push(action.trim().toUpperCase());
      sql += ` AND UPPER(action) = $${params.length}`;
    }

    if (resource) {
      params.push(resource.trim().toLowerCase());
      sql += ` AND LOWER(resource) = $${params.length}`;
    }

    if (userId) {
      params.push(parseInt(userId, 10));
      sql += ` AND user_id = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';

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
   * Get audit statistics (top actions, active admins)
   */
  async getAuditStats() {
    const totalRes = await query('SELECT COUNT(*)::int as total FROM audit_logs');
    const actionsRes = await query(
      `SELECT action, COUNT(*)::int as count
       FROM audit_logs
       GROUP BY action
       ORDER BY count DESC
       LIMIT 10`
    );
    const recentRes = await query(
      `SELECT id, username, action, resource, resource_id, created_at
       FROM audit_logs
       ORDER BY created_at DESC
       LIMIT 5`
    );

    const total = totalRes.rows[0]?.total || 0;
    return {
      total,
      totalAuditLogs: total,
      byAction: actionsRes.rows,
      actionBreakdown: actionsRes.rows,
      recentActions: recentRes.rows,
    };
  }
};

export default auditService;
