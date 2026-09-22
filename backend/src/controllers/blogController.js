import { Blog } from '../models/blogModel.js';

export const getBlogs = async (req, res) => {
  try {
    const { published, category, search, limit, offset } = req.query;
    const publishedOnly = published === 'true';
    
    const blogs = await Blog.findAll({
      publishedOnly,
      category,
      search,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findBySlug(slug);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment view count asynchronously
    Blog.incrementViews(blog.id).catch(err => console.error('Increment views error:', err));

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({ message: 'Error fetching blog post' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      authorName,
      authorTitle,
      coverImage,
      readTimeMinutes,
      isFeatured,
      isPublished,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check unique slug
    const existing = await Blog.findBySlug(generatedSlug);
    const finalSlug = existing ? `${generatedSlug}-${Date.now()}` : generatedSlug;

    // Calculate approximate read time if not provided
    const words = content.trim().split(/\s+/).length;
    const calculatedReadTime = readTimeMinutes || Math.max(1, Math.ceil(words / 200));

    const newBlog = await Blog.create({
      title,
      slug: finalSlug,
      excerpt: excerpt || content.substring(0, 160) + '...',
      content,
      category: category || 'DevOps',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      authorId: req.user?.id || null,
      authorName: authorName || req.user?.username || 'Jatin Sharma',
      authorTitle: authorTitle || 'Senior DevOps Engineer',
      coverImage: coverImage || null,
      readTimeMinutes: calculatedReadTime,
      isFeatured: !!isFeatured,
      isPublished: isPublished !== undefined ? !!isPublished : true,
    });

    res.status(201).json({
      success: true,
      data: newBlog,
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Error creating blog post', error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Blog.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      authorName,
      authorTitle,
      coverImage,
      readTimeMinutes,
      isFeatured,
      isPublished,
    } = req.body;

    let calculatedReadTime = readTimeMinutes;
    if (!calculatedReadTime && content) {
      const words = content.trim().split(/\s+/).length;
      calculatedReadTime = Math.max(1, Math.ceil(words / 200));
    }

    const updated = await Blog.update(id, {
      title,
      slug,
      excerpt,
      content,
      category,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      authorName,
      authorTitle,
      coverImage,
      readTimeMinutes: calculatedReadTime,
      isFeatured,
      isPublished,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Error updating blog post', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Blog.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Error deleting blog post' });
  }
};

export const togglePublishBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    
    if (isPublished === undefined) {
      return res.status(400).json({ message: 'isPublished boolean is required' });
    }

    const updated = await Blog.togglePublish(id, !!isPublished);
    if (!updated) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({ message: 'Error updating blog publish status' });
  }
};

export const toggleFeaturedBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    
    if (isFeatured === undefined) {
      return res.status(400).json({ message: 'isFeatured boolean is required' });
    }

    const updated = await Blog.toggleFeatured(id, !!isFeatured);
    if (!updated) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Error updating blog featured status' });
  }
};
