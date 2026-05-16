const express = require('express');
const router = express.Router();
const supabase = require('./supabase');
const { validateCategory, validateSubcategory, validateProduct } = require('./validators');

// CATEGORY ROUTES
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/categories', validateCategory, async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').insert([req.body]).select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/categories/:id', validateCategory, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SUBCATEGORY ROUTES
router.get('/subcategories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*, categories(*)');
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/subcategories', validateSubcategory, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .insert([req.body])
      .select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/subcategories/:id', validateSubcategory, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subcategories')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/subcategories/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('subcategories').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// LEVEL 1 SUBCATEGORY ROUTES (sub of category)
// ============================================================================
router.get('/subcategories-level1', async (req, res) => {
  try {
    const categoryId = req.query.category_id;
    let query = supabase.from('subcategories_level1').select('*');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query;
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/subcategories-level1', async (req, res) => {
  try {
    const { category_id, name, image } = req.body;
    
    if (!category_id || !name) {
      return res.status(400).json({ error: 'Category ID and name are required' });
    }
    
    const { data, error } = await supabase
      .from('subcategories_level1')
      .insert([{ category_id, name, image }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/subcategories-level1/:id', async (req, res) => {
  try {
    const { name, image } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const { data, error } = await supabase
      .from('subcategories_level1')
      .update({ name, image })
      .eq('id', req.params.id)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/subcategories-level1/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('subcategories_level1').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// LEVEL 2 SUBCATEGORY ROUTES (sub of sub category)
// ============================================================================
router.get('/subcategories-level2', async (req, res) => {
  try {
    const level1Id = req.query.level1_id;
    let query = supabase.from('subcategories_level2').select('*');
    
    if (level1Id) {
      query = query.eq('level1_id', level1Id);
    }
    
    const { data, error } = await query;
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/subcategories-level2', async (req, res) => {
  try {
    const { level1_id, name, image } = req.body;
    
    if (!level1_id || !name) {
      return res.status(400).json({ error: 'Level 1 ID and name are required' });
    }
    
    const { data, error } = await supabase
      .from('subcategories_level2')
      .insert([{ level1_id, name, image }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/subcategories-level2/:id', async (req, res) => {
  try {
    const { name, image } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const { data, error } = await supabase
      .from('subcategories_level2')
      .update({ name, image })
      .eq('id', req.params.id)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/subcategories-level2/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('subcategories_level2').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// LEVEL 3 SUBCATEGORY ROUTES (sub of sub of sub category)
// ============================================================================
router.get('/subcategories-level3', async (req, res) => {
  try {
    const level2Id = req.query.level2_id;
    let query = supabase.from('subcategories_level3').select('*');
    
    if (level2Id) {
      query = query.eq('level2_id', level2Id);
    }
    
    const { data, error } = await query;
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/subcategories-level3', async (req, res) => {
  try {
    const { level2_id, name, image } = req.body;
    
    if (!level2_id || !name) {
      return res.status(400).json({ error: 'Level 2 ID and name are required' });
    }
    
    const { data, error } = await supabase
      .from('subcategories_level3')
      .insert([{ level2_id, name, image }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/subcategories-level3/:id', async (req, res) => {
  try {
    const { name, image } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const { data, error } = await supabase
      .from('subcategories_level3')
      .update({ name, image })
      .eq('id', req.params.id)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/subcategories-level3/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('subcategories_level3').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// LEVEL 4 SUBCATEGORY ROUTES (sub of sub of sub of sub category)
// ============================================================================
router.get('/subcategories-level4', async (req, res) => {
  try {
    const level3Id = req.query.level3_id;
    let query = supabase.from('subcategories_level4').select('*');
    
    if (level3Id) {
      query = query.eq('level3_id', level3Id);
    }
    
    const { data, error } = await query;
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/subcategories-level4', async (req, res) => {
  try {
    const { level3_id, name, image } = req.body;
    
    if (!level3_id || !name) {
      return res.status(400).json({ error: 'Level 3 ID and name are required' });
    }
    
    const { data, error } = await supabase
      .from('subcategories_level4')
      .insert([{ level3_id, name, image }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/subcategories-level4/:id', async (req, res) => {
  try {
    const { name, image } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const { data, error } = await supabase
      .from('subcategories_level4')
      .update({ name, image })
      .eq('id', req.params.id)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/subcategories-level4/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('subcategories_level4').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PRODUCT ROUTES
router.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/products', validateProduct, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([req.body])
      .select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/products/:id', validateProduct, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PRODUCT IMAGES ROUTES
router.get('/product-images/:productId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', req.params.productId)
      .order('display_order', { ascending: true });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/product-images', async (req, res) => {
  try {
    const { product_id, image_url, display_order } = req.body;

    if (!product_id || !image_url) {
      return res.status(400).json({ error: 'Product ID and image URL are required' });
    }

    const { data, error } = await supabase
      .from('product_images')
      .insert([{
        product_id,
        image_url,
        display_order: display_order || 0
      }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/product-images/:id', async (req, res) => {
  try {
    const { display_order, image_url } = req.body;
    const updateData = {};

    if (image_url !== undefined) updateData.image_url = image_url;
    if (display_order !== undefined) updateData.display_order = display_order;

    const { data, error } = await supabase
      .from('product_images')
      .update(updateData)
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/product-images/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// SETTINGS ROUTES (for configurable titles and hero image)
// ============================================================================
router.get('/settings', async (req, res) => {
  try {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/settings/:key', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', req.params.key)
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (!data) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const { key, value, description } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }
    
    const { data, error } = await supabase
      .from('settings')
      .insert([{ key, value, description }])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/settings/:key', async (req, res) => {
  try {
    const { value, description } = req.body;
    const updateData = {};
    
    if (value !== undefined) updateData.value = value;
    if (description !== undefined) updateData.description = description;
    
    const { data, error } = await supabase
      .from('settings')
      .update(updateData)
      .eq('key', req.params.key)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/settings/:key', async (req, res) => {
  try {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', req.params.key);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// PRODUCT CHARACTERISTICS ROUTES (specs like Thermal transmittance, etc.)
// ============================================================================
router.get('/product-characteristics/:productId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product_characteristics')
      .select('*')
      .eq('product_id', req.params.productId)
      .order('display_order', { ascending: true });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/product-characteristics', async (req, res) => {
  try {
    const { product_id, name, value, unit, icon, display_order } = req.body;

    if (!product_id || !name || !value) {
      return res.status(400).json({ error: 'Product ID, name, and value are required' });
    }

    const { data, error } = await supabase
      .from('product_characteristics')
      .insert([{
        product_id,
        name,
        value,
        unit: unit || null,
        icon: icon || null,
        display_order: display_order || 0
      }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/product-characteristics/:id', async (req, res) => {
  try {
    const { name, value, unit, icon, display_order } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (value !== undefined) updateData.value = value;
    if (unit !== undefined) updateData.unit = unit;
    if (icon !== undefined) updateData.icon = icon;
    if (display_order !== undefined) updateData.display_order = display_order;

    const { data, error } = await supabase
      .from('product_characteristics')
      .update(updateData)
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Characteristic not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/product-characteristics/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('product_characteristics')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// CONTENT CARDS ROUTES (pic + description sections)
// ============================================================================
router.get('/content-cards', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content_cards')
      .select('*')
      .order('position_type', { ascending: true })
      .order('display_position', { ascending: true });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/content-cards', async (req, res) => {
  try {
    const { title, description, image_url, display_position, position_type } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('content_cards')
      .insert([{
        title,
        description: description || null,
        image_url: image_url || null,
        display_position: display_position || 0,
        position_type: position_type || 'after_categories'
      }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/content-cards/:id', async (req, res) => {
  try {
    const { title, description, image_url, display_position, position_type } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (display_position !== undefined) updateData.display_position = display_position;
    if (position_type !== undefined) updateData.position_type = position_type;

    const { data, error } = await supabase
      .from('content_cards')
      .update(updateData)
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Content card not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/content-cards/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('content_cards')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// POPULAR PRODUCTS ROUTES
// ============================================================================
router.get('/popular-products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('popular_products')
      .select('*, products(*)')
      .order('display_order', { ascending: true });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/popular-products', async (req, res) => {
  try {
    const { product_id, display_order } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const { data, error } = await supabase
      .from('popular_products')
      .insert([{
        product_id,
        display_order: display_order || 0
      }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/popular-products/:id', async (req, res) => {
  try {
    const { display_order } = req.body;
    const updateData = {};

    if (display_order !== undefined) updateData.display_order = display_order;

    const { data, error } = await supabase
      .from('popular_products')
      .update(updateData)
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'Popular product entry not found' });
    }
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/popular-products/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('popular_products')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
