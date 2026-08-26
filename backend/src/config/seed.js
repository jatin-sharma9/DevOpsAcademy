import bcrypt from 'bcryptjs';
import { query } from './db.js';

export const seed = async () => {
  try {
    console.log('Seeding initial database data...');

    const salt = await bcrypt.genSalt(10);
    
    // Hash passwords
    const adminPass = await bcrypt.hash('J@tinS93', salt);
    const userPass = await bcrypt.hash('user123', salt);

    // Insert Admin
    const adminRes = await query(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES ('Jatin.Sharma93', 'jatinsharma932002@gmail.com', $1, 'admin')
      ON CONFLICT (email) DO UPDATE SET 
        username = EXCLUDED.username, 
        password_hash = EXCLUDED.password_hash, 
        role = EXCLUDED.role
      RETURNING id;
    `, [adminPass]);

    const adminId = adminRes.rows[0]?.id;

    // Insert Sample User
    await query(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES ('jatin', 'jatin@devopsacademy.com', $1, 'user')
      ON CONFLICT (email) DO NOTHING;
    `, [userPass]);

    // Insert Sample Course
    const courseRes = await query(`
      INSERT INTO courses (title, slug, short_description, description, category, level, price, is_pro, is_featured, is_published, instructor_id, duration_hours, thumbnail)
      VALUES (
        'Linux Fundamentals for DevOps',
        'linux-fundamentals',
        'Master command line, file systems, processes, networking, and shell scripting.',
        'Comprehensive Linux course for aspiring DevOps engineers. Learn command line tools, file navigation, permission management, process handling, and basic shell scripting.',
        'Linux',
        'beginner',
        0.00,
        false,
        true,
        true,
        $1,
        12,
        'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=600'
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        level = EXCLUDED.level,
        price = EXCLUDED.price,
        is_pro = EXCLUDED.is_pro,
        is_featured = EXCLUDED.is_featured,
        is_published = EXCLUDED.is_published,
        instructor_id = COALESCE(courses.instructor_id, EXCLUDED.instructor_id),
        duration_hours = EXCLUDED.duration_hours,
        thumbnail = EXCLUDED.thumbnail
      RETURNING id;
    `, [adminId || null]);

    const courseId = courseRes.rows[0]?.id;

    if (courseId) {
      // Seed Lessons for the course
      const lessons = [
        {
          title: 'Introduction to Linux & Shell',
          slug: 'intro-to-linux',
          description: 'Learn the history of Linux and how to interact with the shell.',
          content: 'Linux is a family of open-source Unix-like operating systems based on the Linux kernel. In this lesson, we cover basic shell interface, terminals, and command formatting.',
          video_url: 'https://www.youtube.com/embed/wbpKdQyGaaM',
          sort_order: 1,
          duration_minutes: 45
        },
        {
          title: 'Navigating the File System',
          slug: 'file-system-navigation',
          description: 'Master commands like cd, ls, pwd, and file paths.',
          content: 'Understanding how to move around directories and perform file listings is fundamental. We explore absolute vs relative paths, hidden files, and directory structure.',
          video_url: 'https://www.youtube.com/embed/42iQKuQodW4',
          sort_order: 2,
          duration_minutes: 60
        },
        {
          title: 'File Permissions & Security',
          slug: 'file-permissions',
          description: 'Understand chmod, chown, users, and groups.',
          content: 'Linux has a robust permission model. We learn read, write, and execute permissions, numeric vs symbolic notation, and how to change file ownership.',
          video_url: 'https://www.youtube.com/embed/HcbUq8Ksp_k',
          sort_order: 3,
          duration_minutes: 50
        }
      ];

      for (const lesson of lessons) {
        await query(`
          INSERT INTO lessons (course_id, title, slug, description, content, video_url, sort_order, duration_minutes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (course_id, slug) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            content = EXCLUDED.content,
            video_url = EXCLUDED.video_url,
            sort_order = EXCLUDED.sort_order,
            duration_minutes = EXCLUDED.duration_minutes;
        `, [courseId, lesson.title, lesson.slug, lesson.description, lesson.content, lesson.video_url, lesson.sort_order, lesson.duration_minutes]);
      }
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed().then(() => process.exit(0));
}
