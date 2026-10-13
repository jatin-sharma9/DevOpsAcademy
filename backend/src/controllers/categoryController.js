import { Category } from '../models/categoryModel.js';
import { auditService } from '../services/auditService.js';

/**
 * Get all categories
 * GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving categories' });
  }
};

/**
 * Get category by slug
 * GET /api/categories/:slug
 */
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findBySlug(slug);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving category' });
  }
};

/**
 * Create a new category (Admin / Instructor only)
 * POST /api/categories
 */
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, sort_order } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const newCategory = await Category.create({ name, slug, description, icon, sort_order });

    // Record audit log
    auditService.log({
      action: 'CREATE_CATEGORY',
      resource: 'category',
      resourceId: newCategory.id,
      details: { name: newCategory.name, slug: newCategory.slug },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'A category with this slug or name already exists' });
    }
    res.status(500).json({ success: false, message: 'Error creating category' });
  }
};

/**
 * Update an existing category (Admin only)
 * PUT /api/categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, sort_order } = req.body;

    const updated = await Category.update(id, { name, slug, description, icon, sort_order });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Record audit log
    auditService.log({
      action: 'UPDATE_CATEGORY',
      resource: 'category',
      resourceId: id,
      details: { name: updated.name, slug: updated.slug },
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update category error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'A category with this slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Error updating category' });
  }
};

/**
 * Delete a category (Admin only)
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Record audit log
    auditService.log({
      action: 'DELETE_CATEGORY',
      resource: 'category',
      resourceId: id,
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: deleted
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Error deleting category' });
  }
};
