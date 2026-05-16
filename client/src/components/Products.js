import React, { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getSubcategoriesLevel1,
  getAllSubcategoriesLevel1,
  getSubcategoriesLevel2,
  getSubcategoriesLevel3,
  getSubcategoriesLevel4,
  getSubcategoryLevel1ById,
  getSubcategoryLevel2ById,
  getSubcategoryLevel3ById,
  getProductImages,
  createProductImage,
  deleteProductImage,
  getHierarchyFromLevel4,
} from '../api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [level4Subcats, setLevel4Subcats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [level1Options, setLevel1Options] = useState([]);
  const [level2Options, setLevel2Options] = useState([]);
  const [level3Options, setLevel3Options] = useState([]);
  const [level4Options, setLevel4Options] = useState([]);
  const [productImages, setProductImages] = useState({}); // { productId: [images] }
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    featured_image: '',
    pic2_url: '',
    details: '',
    level4_id: '',
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState('');
  const [, setSuccess] = useState('');
  const [selectedProductForImages, setSelectedProductForImages] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const prodRes = await getProducts();
      setProducts(prodRes.data);
      
      // Load all Level4 subcategories
      const level1Res = await getAllSubcategoriesLevel1();
      const allLevel4 = [];
      for (const level1 of level1Res.data || []) {
        const level2Res = await getSubcategoriesLevel2(level1.id);
        for (const level2 of level2Res.data || []) {
          const level3Res = await getSubcategoriesLevel3(level2.id);
          for (const level3 of level3Res.data || []) {
            const level4Res = await getSubcategoriesLevel4(level3.id);
            allLevel4.push(...(level4Res.data || []));
          }
        }
      }
      setLevel4Subcats(allLevel4);

      // Load categories and top-level lists for selectors
      const cats = await getCategories();
      setCategories(cats.data || []);
      setLevel1Options(level1Res.data || []);
      setLevel4Options(allLevel4);
      setError('');

      // Load images for all products
      const imagesMap = {};
      for (const product of prodRes.data) {
        try {
          const imgRes = await getProductImages(product.id);
          imagesMap[product.id] = imgRes.data;
        } catch (err) {
          imagesMap[product.id] = [];
        }
      }
      setProductImages(imagesMap);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      setError('Product name is required');
      return;
    }

    try {
      // Determine deepest selected level and build hierarchy
      let productData = {
        name: form.name,
        featured_image: form.featured_image || '',
        pic2_url: form.pic2_url || '',
        details: form.details || '',
        level1_id: null,
        level2_id: null,
        level3_id: null,
        level4_id: null,
        category_id: null,
      };

      if (form.level4_id) {
        const hierarchy = await getHierarchyFromLevel4(form.level4_id);
        if (hierarchy) {
          productData = { ...productData, ...hierarchy };
        }
      } else if (form.level3_id) {
        // build hierarchy from level3
        const l3 = await getSubcategoryLevel3ById(form.level3_id);
        if (l3 && l3.data) {
          const level2Id = l3.data.level2_id;
          const l2 = await getSubcategoryLevel2ById(level2Id);
          const level1Id = l2?.data?.level1_id || null;
          const l1 = level1Id ? await getSubcategoryLevel1ById(level1Id) : null;
          const categoryId = l1?.data?.category_id || null;
          productData = {
            ...productData,
            level3_id: form.level3_id,
            level2_id: level2Id,
            level1_id: level1Id,
            category_id: categoryId,
          };
        }
      } else if (form.level2_id) {
        const l2 = await getSubcategoryLevel2ById(form.level2_id);
        if (l2 && l2.data) {
          const level1Id = l2.data.level1_id;
          const l1 = level1Id ? await getSubcategoryLevel1ById(level1Id) : null;
          const categoryId = l1?.data?.category_id || null;
          productData = {
            ...productData,
            level2_id: form.level2_id,
            level1_id: level1Id,
            category_id: categoryId,
          };
        }
      } else if (form.level1_id) {
        const l1 = await getSubcategoryLevel1ById(form.level1_id);
        const categoryId = l1?.data?.category_id || null;
        productData = {
          ...productData,
          level1_id: form.level1_id,
          category_id: categoryId,
        };
      } else if (form.category_id) {
        productData.category_id = form.category_id;
      }

      if (editingId) {
        await updateProduct(editingId, productData);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(productData);
        setSuccess('Product added successfully!');
      }

      setForm({
        name: '',
        featured_image: '',
        pic2_url: '',
        details: '',
        category_id: '',
        level1_id: '',
        level2_id: '',
        level3_id: '',
        level4_id: '',
      });
      setEditingId(null);
      loadData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      featured_image: product.featured_image || '',
      pic2_url: product.pic2_url || '',
      details: product.details || '',
      category_id: product.category_id || '',
      level1_id: product.level1_id || '',
      level2_id: product.level2_id || '',
      level3_id: product.level3_id || '',
      level4_id: product.level4_id || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await deleteProduct(id);
        setSuccess('Product deleted!');
        loadData();
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  const handleAddImage = async (productId) => {
    if (!newImageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    try {
      await createProductImage({
        product_id: productId,
        image_url: newImageUrl,
        display_order: (productImages[productId]?.length || 0),
      });
      setNewImageUrl('');

      // Reload images for this product
      const imgRes = await getProductImages(productId);
      setProductImages({ ...productImages, [productId]: imgRes.data });
      setSuccess('Image added!');
      setTimeout(() => setSuccess(''), 2000);
      setError('');
    } catch (err) {
      setError('Failed to add image');
      console.error(err);
    }
  };

  const handleDeleteImage = async (productId, imageId) => {
    if (window.confirm('Delete this image?')) {
      try {
        await deleteProductImage(imageId);

        // Reload images for this product
        const imgRes = await getProductImages(productId);
        setProductImages({ ...productImages, [productId]: imgRes.data });
        setSuccess('Image deleted!');
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to delete image');
        console.error(err);
      }
    }
  };

  const getLevel4Name = (level4Id) => {
    const level4 = level4Subcats.find((l4) => l4.id === level4Id);
    return level4 ? level4.name : 'Unknown Level 4';
  };

  return (
    <div className="products-container">
      <h2>Products</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Featured Image URL (Pic 1)"
          value={form.featured_image}
          onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pic 2 URL"
          value={form.pic2_url}
          onChange={(e) => setForm({ ...form, pic2_url: e.target.value })}
        />
        <div className="description-input-wrapper">
          <textarea
            placeholder="Product details - Use line breaks or • for bullet points&#10;Example:&#10;Feature 1&#10;Feature 2&#10;Or use • or - before each point"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            rows="4"
            className="description-textarea"
          ></textarea>
          <small className="helper-text">Tip: Press Enter to create new bullet points in the popup</small>
        </div>
        <div className="hierarchy-selects">
          <select
            value={form.category_id || ''}
            onChange={async (e) => {
              const catId = e.target.value || '';
              setForm({ ...form, category_id: catId, level1_id: '', level2_id: '', level3_id: '', level4_id: '' });
              const l1 = catId ? await getSubcategoriesLevel1(catId) : { data: [] };
              setLevel1Options(l1.data || []);
              setLevel2Options([]);
              setLevel3Options([]);
              setLevel4Options([]);
            }}
          >
            <option value="">Select Category (or choose deeper level)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={form.level1_id || ''}
            onChange={async (e) => {
              const id = e.target.value || '';
              setForm({ ...form, level1_id: id, level2_id: '', level3_id: '', level4_id: '' });
              const l2 = id ? await getSubcategoriesLevel2(id) : { data: [] };
              setLevel2Options(l2.data || []);
              setLevel3Options([]);
              setLevel4Options([]);
            }}
          >
            <option value="">Select Level 1</option>
            {level1Options.map((l1) => <option key={l1.id} value={l1.id}>{l1.name}</option>)}
          </select>

          <select
            value={form.level2_id || ''}
            onChange={async (e) => {
              const id = e.target.value || '';
              setForm({ ...form, level2_id: id, level3_id: '', level4_id: '' });
              const l3 = id ? await getSubcategoriesLevel3(id) : { data: [] };
              setLevel3Options(l3.data || []);
              setLevel4Options([]);
            }}
          >
            <option value="">Select Level 2</option>
            {level2Options.map((l2) => <option key={l2.id} value={l2.id}>{l2.name}</option>)}
          </select>

          <select
            value={form.level3_id || ''}
            onChange={async (e) => {
              const id = e.target.value || '';
              setForm({ ...form, level3_id: id, level4_id: '' });
              const l4 = id ? await getSubcategoriesLevel4(id) : { data: [] };
              setLevel4Options(l4.data || []);
            }}
          >
            <option value="">Select Level 3</option>
            {level3Options.map((l3) => <option key={l3.id} value={l3.id}>{l3.name}</option>)}
          </select>

          <select
            value={form.level4_id || ''}
            onChange={(e) => setForm({ ...form, level4_id: e.target.value || '' })}
          >
            <option value="">Select Level 4 (optional)</option>
            {level4Options.map((l4) => <option key={l4.id} value={l4.id}>{l4.name}</option>)}
          </select>
        </div>
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', featured_image: '', details: '', level4_id: '' }); }}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list">
          {products.map((product) => (
            <div key={product.id} className="item">
              {/* Images Section */}
              <div className="item-images">
                {/* Featured Image (Pic 1) */}
                <div className="image-slot">
                  {product.featured_image ? (
                    <>
                      <img src={product.featured_image} alt={product.name} className="item-image" />
                      <span className="image-label">Pic 1</span>
                    </>
                  ) : (
                    <div className="placeholder-image">No Pic 1</div>
                  )}
                </div>
                
                {/* Pic 2 */}
                <div className="image-slot">
                  {product.pic2_url ? (
                    <>
                      <img src={product.pic2_url} alt={`${product.name} Pic 2`} className="item-image" />
                      <span className="image-label">Pic 2</span>
                    </>
                  ) : (
                    <div className="placeholder-image">No Pic 2</div>
                  )}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="item-info">
                <h3>{product.name}</h3>
                <p className="category">
                  Level 4: {getLevel4Name(product.level4_id)}
                </p>
                {product.details && <p className="details">{product.details}</p>}
                
                {/* Gallery Thumbnails */}
                {productImages[product.id]?.length > 0 && (
                  <div className="image-gallery">
                    <p className="gallery-title">Images ({productImages[product.id].length})</p>
                    <div className="gallery-thumbnails">
                      {productImages[product.id].map((img) => (
                        <div key={img.id} className="thumbnail">
                          <img src={img.image_url} alt="Product" />
                          <button 
                            type="button" 
                            className="delete-thumb"
                            onClick={() => handleDeleteImage(product.id, img.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="item-actions">
                <button 
                  className="images-btn"
                  onClick={() => setSelectedProductForImages(selectedProductForImages === product.id ? null : product.id)}
                >
                  {productImages[product.id]?.length > 0 ? `Pic 2+ (${productImages[product.id].length})` : 'Add Images'}
                </button>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)} className="delete">Delete</button>
              </div>

              {/* Add Images Section */}
              {selectedProductForImages === product.id && (
                <div className="add-images-section">
                  <div className="image-input-group">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImage(product.id)}
                      className="add-image-btn"
                    >
                      Add Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
