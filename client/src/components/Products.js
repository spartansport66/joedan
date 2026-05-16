import React, { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSubcategoriesLevel1,
  getSubcategoriesLevel2,
  getSubcategoriesLevel3,
  getSubcategoriesLevel4,
  getProductImages,
  createProductImage,
  deleteProductImage,
} from '../api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [level4Subcats, setLevel4Subcats] = useState([]);
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
  const [success, setSuccess] = useState('');
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
      const level1Res = await getSubcategoriesLevel1();
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
    if (!form.level4_id || !form.name) {
      setError('Level 4 and Product name are required');
      return;
    }

    try {
      const productData = {
        name: form.name,
        featured_image: form.featured_image || '',
        pic2_url: form.pic2_url || '',
        details: form.details || '',
        level4_id: form.level4_id,
      };

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
        <select
          value={form.level4_id}
          onChange={(e) => setForm({ ...form, level4_id: e.target.value })}
          required
        >
          <option value="">Select Level 4</option>
          {level4Subcats.map((level4) => (
            <option key={level4.id} value={level4.id}>
              {level4.name}
            </option>
          ))}
        </select>
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
