import { pool } from './db.js';

export const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('Running database migrations...');
    await client.query('BEGIN');

    // Schema Migrations Tracking Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'instructor', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        short_description TEXT,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
        price NUMERIC(10, 2) DEFAULT 0.00,
        is_pro BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT FALSE,
        youtube_video_url VARCHAR(500),
        instructor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        thumbnail VARCHAR(500),
        duration_hours INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add columns if they don't exist (for existing tables)
    await client.query(`
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS youtube_video_url VARCHAR(500);
    `);

    // Lessons table
    await client.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        video_url VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        duration_minutes INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(course_id, slug)
      );
    `);

    // Enrollments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        completed BOOLEAN DEFAULT FALSE,
        enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE,
        UNIQUE(user_id, course_id)
      );
    `);

    // Lesson Completions table (tracks progress per lesson)
    await client.query(`
      CREATE TABLE IF NOT EXISTS lesson_completions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );
    `);

    // Certificates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        certificate_hash VARCHAR(255) UNIQUE NOT NULL,
        issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id)
      );
    `);

    // Contact Messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL, -- 'enrollment', 'contact', 'other'
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Learning Goals table (Daily Learning Tracker goals/tasks per user per day)
    await client.query(`
      CREATE TABLE IF NOT EXISTS learning_goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        completed BOOLEAN DEFAULT FALSE,
        target_date DATE DEFAULT CURRENT_DATE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_learning_goals_user_date
        ON learning_goals (user_id, target_date);
    `);

    // User Streaks table (one row per user, tracks consecutive active days)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_streaks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_activity_date DATE,
        total_days_active INTEGER DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Daily Learning Activity table (minutes logged + goals completed per user per day)
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_learning_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        activity_date DATE DEFAULT CURRENT_DATE,
        minutes_spent INTEGER DEFAULT 0,
        goals_completed INTEGER DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, activity_date)
      );
    `);

    // Blogs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'DevOps',
        tags TEXT[] DEFAULT '{}',
        author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        author_name VARCHAR(100) DEFAULT 'Jatin Sharma',
        author_title VARCHAR(100) DEFAULT 'Senior DevOps Engineer',
        cover_image VARCHAR(500),
        read_time_minutes INTEGER DEFAULT 5,
        view_count INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Quiz Attempts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        quiz_id VARCHAR(100) NOT NULL,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
        passed BOOLEAN DEFAULT FALSE,
        total_questions INTEGER DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        answers JSONB DEFAULT '{}'::jsonb,
        percentage NUMERIC(5, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS percentage NUMERIC(5, 2);
      ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
    `);

    // Lesson Notes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS lesson_notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );
    `);

    // User Badges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        badge_id VARCHAR(100) NOT NULL,
        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, badge_id)
      );
    `);

    // Email Settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_settings (
        id SERIAL PRIMARY KEY,
        admin_email VARCHAR(255) DEFAULT 'jatinsharma932002@gmail.com',
        smtp_host VARCHAR(255) DEFAULT 'smtp.gmail.com',
        smtp_port INTEGER DEFAULT 465,
        smtp_user VARCHAR(255) DEFAULT 'jatinsharma932002@gmail.com',
        notify_on_registration BOOLEAN DEFAULT TRUE,
        notify_on_enrollment BOOLEAN DEFAULT TRUE,
        notify_on_contact BOOLEAN DEFAULT TRUE,
        notify_on_support BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Email Logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        recipient VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        payload JSONB DEFAULT '{}'::jsonb,
        status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failure')),
        error TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Course Reviews table
    await client.query(`
      CREATE TABLE IF NOT EXISTS course_reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id)
      );
    `);

    // Course Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT 'Layers',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

      -- Seed standard DevOps curriculum categories
      INSERT INTO categories (name, slug, description, sort_order)
      VALUES
        ('Operating Systems & Shell', 'os-shell', 'Linux command line, bash scripting, kernel debugging, and system administration.', 1),
        ('Version Control', 'version-control', 'Git branching strategies, monorepo management, and code review automation.', 2),
        ('Containerization', 'containerization', 'Docker daemon, multi-stage builds, rootless containers, and image optimization.', 3),
        ('Orchestration & Kubernetes', 'orchestration', 'K8s cluster architecture, Helm, ingress controllers, operators, and stateful workloads.', 4),
        ('Infrastructure as Code', 'iac', 'Terraform HCL, state management, provider configuration, and Terragrunt workflows.', 5),
        ('CI/CD Automation', 'cicd', 'GitHub Actions, Jenkins pipelines, automated testing gates, and canary releases.', 6),
        ('Cloud & AWS', 'aws', 'VPC networking, IAM policies, EKS clusters, ECS services, and cost optimization.', 7),
        ('Observability & SRE', 'sre', 'Prometheus metrics, Grafana dashboards, OpenTelemetry, and incident management.', 8)
      ON CONFLICT (slug) DO NOTHING;
    `);

    // Audit Logs table for security and admin action tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        username VARCHAR(100),
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id VARCHAR(100),
        details JSONB DEFAULT '{}'::jsonb,
        ip_address VARCHAR(50),
        user_agent VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    `);

    // Indexes for query optimization
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
      CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
      CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
      CREATE INDEX IF NOT EXISTS idx_certificates_user_course ON certificates(user_id, course_id);
      CREATE INDEX IF NOT EXISTS idx_certificates_hash ON certificates(certificate_hash);
      CREATE INDEX IF NOT EXISTS idx_learning_goals_user_date ON learning_goals(user_id, target_date);
      CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_learning_activity(user_id, activity_date);
      CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
      CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
      CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
      CREATE INDEX IF NOT EXISTS idx_lesson_notes_user_lesson ON lesson_notes(user_id, lesson_id);
      CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews(course_id);
      CREATE INDEX IF NOT EXISTS idx_course_reviews_approved ON course_reviews(is_approved);
    `);

    // Record schema versions in migration tracking table
    const migrationBatches = [
      ['001_core_platform_schema', 'Initial users, courses, lessons, enrollments, certificates, and learning trackers'],
      ['002_email_dispatch_and_settings', 'Email dispatch logs and administrative notification settings'],
      ['003_phase2_missing_apis', 'Curriculum categories, quiz attempts, lesson notes, and moderated course reviews'],
      ['004_observability_audit_logs', 'Administrative audit logging trail and performance indexes'],
    ];

    for (const [version, description] of migrationBatches) {
      await client.query(
        `INSERT INTO schema_migrations (version, name)
         VALUES ($1, $2)
         ON CONFLICT (version) DO NOTHING`,
        [version, description]
      );
    }

    await client.query('COMMIT');
    console.log('Migrations completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get all applied migrations and timestamps
 */
export const getMigrationStatus = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM schema_migrations ORDER BY id ASC');
    return res.rows;
  } finally {
    client.release();
  }
};

if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  if (process.argv.includes('--status')) {
    getMigrationStatus()
      .then((rows) => {
        console.log('\n📊 [DevOps Academy Schema Migration Status]');
        console.table(rows);
        process.exit(0);
      })
      .catch((err) => {
        console.error('Failed to get migration status:', err.message);
        process.exit(1);
      });
  } else {
    migrate().then(() => process.exit(0)).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  }
}

