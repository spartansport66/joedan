import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Subcategories
export const getSubcategories = () => api.get('/subcategories');
export const createSubcategory = (data) => api.post('/subcategories', data);
export const updateSubcategory = (id, data) => api.put(`/subcategories/${id}`, data);
export const deleteSubcategory = (id) => api.delete(`/subcategories/${id}`);

// Level 1 Subcategories (sub of category)
export const getSubcategoriesLevel1 = (categoryId) => 
  api.get('/subcategories-level1', { params: { category_id: categoryId } });
export const createSubcategoryLevel1 = (data) => api.post('/subcategories-level1', data);
export const updateSubcategoryLevel1 = (id, data) => api.put(`/subcategories-level1/${id}`, data);
export const deleteSubcategoryLevel1 = (id) => api.delete(`/subcategories-level1/${id}`);

// Level 2 Subcategories (sub of sub category)
export const getSubcategoriesLevel2 = (level1Id) => 
  api.get('/subcategories-level2', { params: { level1_id: level1Id } });
export const createSubcategoryLevel2 = (data) => api.post('/subcategories-level2', data);
export const updateSubcategoryLevel2 = (id, data) => api.put(`/subcategories-level2/${id}`, data);
export const deleteSubcategoryLevel2 = (id) => api.delete(`/subcategories-level2/${id}`);

// Level 3 Subcategories (sub of sub of sub category)
export const getSubcategoriesLevel3 = (level2Id) => 
  api.get('/subcategories-level3', { params: { level2_id: level2Id } });
export const createSubcategoryLevel3 = (data) => api.post('/subcategories-level3', data);
export const updateSubcategoryLevel3 = (id, data) => api.put(`/subcategories-level3/${id}`, data);
export const deleteSubcategoryLevel3 = (id) => api.delete(`/subcategories-level3/${id}`);

// Level 4 Subcategories (sub of sub of sub of sub category)
export const getSubcategoriesLevel4 = (level3Id) => 
  api.get('/subcategories-level4', { params: { level3_id: level3Id } });
export const createSubcategoryLevel4 = (data) => api.post('/subcategories-level4', data);
export const updateSubcategoryLevel4 = (id, data) => api.put(`/subcategories-level4/${id}`, data);
export const deleteSubcategoryLevel4 = (id) => api.delete(`/subcategories-level4/${id}`);

// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Product Images (NEW)
export const getProductImages = (productId) => api.get(`/product-images/${productId}`);
export const createProductImage = (data) => api.post('/product-images', data);
export const updateProductImage = (id, data) => api.put(`/product-images/${id}`, data);
export const deleteProductImage = (id) => api.delete(`/product-images/${id}`);

// Settings (for configurable titles and hero image)
export const getSettings = () => api.get('/settings');
export const getSetting = (key) => api.get(`/settings/${key}`);
export const updateSetting = (key, data) => api.put(`/settings/${key}`, data);
export const createSetting = (data) => api.post('/settings', data);
export const deleteSetting = (key) => api.delete(`/settings/${key}`);

// Product Characteristics (NEW - for specs like Thermal transmittance, etc.)
export const getProductCharacteristics = (productId) => api.get(`/product-characteristics/${productId}`);
export const createProductCharacteristic = (data) => api.post('/product-characteristics', data);
export const updateProductCharacteristic = (id, data) => api.put(`/product-characteristics/${id}`, data);
export const deleteProductCharacteristic = (id) => api.delete(`/product-characteristics/${id}`);

// Content Cards (pic + description sections)
export const getContentCards = () => api.get('/content-cards');
export const createContentCard = (data) => api.post('/content-cards', data);
export const updateContentCard = (id, data) => api.put(`/content-cards/${id}`, data);
export const deleteContentCard = (id) => api.delete(`/content-cards/${id}`);

// Popular Products
export const getPopularProducts = () => api.get('/popular-products');
export const createPopularProduct = (data) => api.post('/popular-products', data);
export const updatePopularProduct = (id, data) => api.put(`/popular-products/${id}`, data);
export const deletePopularProduct = (id) => api.delete(`/popular-products/${id}`);

export default api;
