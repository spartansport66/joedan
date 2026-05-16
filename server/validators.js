// Validation middleware and helper functions

function validateCategory(req, res, next) {
  const { name } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Category name is required and must be a string' });
  }
  
  if (req.body.image && typeof req.body.image !== 'string') {
    return res.status(400).json({ error: 'Image must be a string (URL)' });
  }

  next();
}

function validateSubcategory(req, res, next) {
  const { name, category_id } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Subcategory name is required' });
  }
  
  if (!category_id) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  next();
}

function validateProduct(req, res, next) {
  const { name, level4_id } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Product name is required' });
  }
  
  if (!level4_id) {
    return res.status(400).json({ error: 'Level 4 ID is required' });
  }

  next();
}

module.exports = {
  validateCategory,
  validateSubcategory,
  validateProduct,
};
