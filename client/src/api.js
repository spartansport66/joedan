import { supabase } from './supabase';

const isValidUuidFilter = (value) => {
  return (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    value !== 'null' &&
    value !== 'undefined'
  );
};

export const getHierarchyFromLevel4 = async (level4Id) => {
  try {
    // Get Level4 record to find level3_id
    const level4Res = await supabase
      .from('subcategories_level4')
      .select('level3_id')
      .eq('id', level4Id)
      .single();
    if (level4Res.error) throw level4Res.error;

    const level3Id = level4Res.data?.level3_id;
    if (!level3Id) return null;

    // Get Level3 record to find level2_id
    const level3Res = await supabase
      .from('subcategories_level3')
      .select('level2_id')
      .eq('id', level3Id)
      .single();
    if (level3Res.error) throw level3Res.error;

    const level2Id = level3Res.data?.level2_id;
    if (!level2Id) return null;

    // Get Level2 record to find level1_id
    const level2Res = await supabase
      .from('subcategories_level2')
      .select('level1_id')
      .eq('id', level2Id)
      .single();
    if (level2Res.error) throw level2Res.error;

    const level1Id = level2Res.data?.level1_id;
    if (!level1Id) return null;

    // Get Level1 record to find category_id
    const level1Res = await supabase
      .from('subcategories_level1')
      .select('category_id')
      .eq('id', level1Id)
      .single();
    if (level1Res.error) throw level1Res.error;

    const categoryId = level1Res.data?.category_id;
    if (!categoryId) return null;

    // Return all hierarchy IDs
    return {
      level1_id: level1Id,
      level2_id: level2Id,
      level3_id: level3Id,
      level4_id: level4Id,
      category_id: categoryId,
      subcategory_id: level4Id, // level4 is the final subcategory
    };
  } catch (err) {
    console.error('Failed to get hierarchy from level4_id:', err);
    return null;
  }
};

export const getCategoryIdFromLevel4 = async (level4Id) => {
  const hierarchy = await getHierarchyFromLevel4(level4Id);
  return hierarchy?.category_id || null;
};

// ============================================================================
// CATEGORIES
// ============================================================================
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const createCategory = async (data) => {
  const { data: result, error } = await supabase
    .from('categories')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateCategory = async (id, data) => {
  const { data: result, error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// SUBCATEGORIES
// ============================================================================
export const getSubcategories = async () => {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const createSubcategory = async (data) => {
  const { data: result, error } = await supabase
    .from('subcategories')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateSubcategory = async (id, data) => {
  const { data: result, error } = await supabase
    .from('subcategories')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteSubcategory = async (id) => {
  const { error } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// LEVEL 1 SUBCATEGORIES
// ============================================================================
export const getAllSubcategoriesLevel1 = async () => {
  const { data, error } = await supabase
    .from('subcategories_level1')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const getSubcategoriesLevel1 = async (categoryId) => {
  let query = supabase
    .from('subcategories_level1')
    .select('*');

  if (isValidUuidFilter(categoryId)) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const getSubcategoryLevel1ById = async (id) => {
  const { data, error } = await supabase
    .from('subcategories_level1')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
};

export const createSubcategoryLevel1 = async (data) => {
  const { data: result, error } = await supabase
    .from('subcategories_level1')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateSubcategoryLevel1 = async (id, data) => {
  const { data: result, error } = await supabase
    .from('subcategories_level1')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteSubcategoryLevel1 = async (id) => {
  const { error } = await supabase
    .from('subcategories_level1')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// LEVEL 2 SUBCATEGORIES
// ============================================================================
export const getAllSubcategoriesLevel2 = async () => {
  const { data, error } = await supabase
    .from('subcategories_level2')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const getSubcategoriesLevel2 = async (level1Id) => {
  let query = supabase
    .from('subcategories_level2')
    .select('*');

  if (isValidUuidFilter(level1Id)) {
    query = query.eq('level1_id', level1Id);
  }

  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const getSubcategoryLevel2ById = async (id) => {
  const { data, error } = await supabase
    .from('subcategories_level2')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
};

export const createSubcategoryLevel2 = async (data) => {
  const { data: result, error } = await supabase
    .from('subcategories_level2')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateSubcategoryLevel2 = async (id, data) => {
  const { data: result, error } = await supabase
    .from('subcategories_level2')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteSubcategoryLevel2 = async (id) => {
  const { error } = await supabase
    .from('subcategories_level2')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// LEVEL 3 SUBCATEGORIES
// ============================================================================
export const getAllSubcategoriesLevel3 = async () => {
  const { data, error } = await supabase
    .from('subcategories_level3')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const getSubcategoriesLevel3 = async (level2Id) => {
  let query = supabase
    .from('subcategories_level3')
    .select('*');

  if (isValidUuidFilter(level2Id)) {
    query = query.eq('level2_id', level2Id);
  }

  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const getSubcategoryLevel3ById = async (id) => {
  const { data, error } = await supabase
    .from('subcategories_level3')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
};

export const createSubcategoryLevel3 = async (data) => {
  const { data: result, error } = await supabase
    .from('subcategories_level3')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateSubcategoryLevel3 = async (id, data) => {
  const { data: result, error } = await supabase
    .from('subcategories_level3')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteSubcategoryLevel3 = async (id) => {
  const { error } = await supabase
    .from('subcategories_level3')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// LEVEL 4 SUBCATEGORIES
// ============================================================================
export const getAllSubcategoriesLevel4 = async () => {
  const { data, error } = await supabase
    .from('subcategories_level4')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const getSubcategoriesLevel4 = async (level3Id) => {
  let query = supabase
    .from('subcategories_level4')
    .select('*');

  if (isValidUuidFilter(level3Id)) {
    query = query.eq('level3_id', level3Id);
  }

  const { data, error } = await query.order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const createSubcategoryLevel4 = async (data) => {
  const { data: result, error } = await supabase
    .from('subcategories_level4')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateSubcategoryLevel4 = async (id, data) => {
  const { data: result, error } = await supabase
    .from('subcategories_level4')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteSubcategoryLevel4 = async (id) => {
  const { error } = await supabase
    .from('subcategories_level4')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// PRODUCTS
// ============================================================================
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const getProduct = async (id) => {
  if (!isValidUuidFilter(id)) {
    return { data: null };
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return { data };
};

export const createProduct = async (data) => {
  const { data: result, error } = await supabase
    .from('products')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateProduct = async (id, data) => {
  const { data: result, error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// PRODUCT IMAGES
// ============================================================================
export const getProductImages = async (productId) => {
  if (!isValidUuidFilter(productId)) {
    return { data: [] };
  }
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return { data };
};

export const createProductImage = async (data) => {
  const { data: result, error } = await supabase
    .from('product_images')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateProductImage = async (id, data) => {
  const { data: result, error } = await supabase
    .from('product_images')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteProductImage = async (id) => {
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// PRODUCT CHARACTERISTICS
// ============================================================================
export const getProductCharacteristics = async (productId) => {
  const { data, error } = await supabase
    .from('product_characteristics')
    .select('*')
    .eq('product_id', productId)
    .order('name');
  if (error) throw error;
  return { data };
};

export const createProductCharacteristic = async (data) => {
  const { data: result, error } = await supabase
    .from('product_characteristics')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateProductCharacteristic = async (id, data) => {
  const { data: result, error } = await supabase
    .from('product_characteristics')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteProductCharacteristic = async (id) => {
  const { error } = await supabase
    .from('product_characteristics')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// SETTINGS
// ============================================================================
export const getSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('key');
  if (error) throw error;
  return { data };
};

export const getSetting = async (key) => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .single();
  if (error) throw error;
  return { data };
};

export const createSetting = async (data) => {
  const { data: result, error } = await supabase
    .from('settings')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateSetting = async (key, data) => {
  const { data: result, error } = await supabase
    .from('settings')
    .update({ value: data.value, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteSetting = async (key) => {
  const { error } = await supabase
    .from('settings')
    .delete()
    .eq('key', key);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// CONTENT CARDS
// ============================================================================
export const getContentCards = async () => {
  const { data, error } = await supabase
    .from('content_cards')
    .select('*')
    .order('position_type, display_position');
  if (error) throw error;
  return { data };
};

export const createContentCard = async (data) => {
  const { data: result, error } = await supabase
    .from('content_cards')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updateContentCard = async (id, data) => {
  const { data: result, error } = await supabase
    .from('content_cards')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deleteContentCard = async (id) => {
  const { error } = await supabase
    .from('content_cards')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

// ============================================================================
// POPULAR PRODUCTS
// ============================================================================
export const getPopularProducts = async () => {
  const { data, error } = await supabase
    .from('popular_products')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return { data };
};

export const createPopularProduct = async (data) => {
  const { data: result, error } = await supabase
    .from('popular_products')
    .insert([data])
    .select();
  if (error) throw error;
  return { data: result };
};

export const updatePopularProduct = async (id, data) => {
  const { data: result, error } = await supabase
    .from('popular_products')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return { data: result };
};

export const deletePopularProduct = async (id) => {
  const { error } = await supabase
    .from('popular_products')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { data: null };
};

export default supabase;
