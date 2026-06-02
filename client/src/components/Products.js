import React, { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getSubcategoriesLevel1,
  getAllSubcategoriesLevel1,
  getAllSubcategoriesLevel2,
  getAllSubcategoriesLevel3,
  getAllSubcategoriesLevel4,
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
  const [allLevel1, setAllLevel1] = useState([]);
  const [allLevel2, setAllLevel2] = useState([]);
  const [allLevel3, setAllLevel3] = useState([]);
  const [allLevel4, setAllLevel4] = useState([]);
  const [productImages, setProductImages] = useState({}); // { productId: [images] }
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
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
  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState('');
  const [, setSuccess] = useState('');
  const [selectedProductForImages, setSelectedProductForImages] = useState(null);

  const resolveSubmissionError = (err) => {
    if (!err) return 'Failed to save product';
    const message = err?.message || err?.details || err?.error || JSON.stringify(err);
    if (err.status === 409 || /duplicate|already exists|conflict/i.test(message)) {
      return 'Product save failed: duplicate product or route conflict detected.';
    }
    return message;
  };

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
      setAllLevel1(level1Res.data || []);
      const allLevel2Res = await getAllSubcategoriesLevel2();
      setAllLevel2(allLevel2Res.data || []);
      const allLevel3Res = await getAllSubcategoriesLevel3();
      setAllLevel3(allLevel3Res.data || []);
      const allLevel4Res = await getAllSubcategoriesLevel4();
      setAllLevel4(allLevel4Res.data || []);
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

  const getFallbackLevel2Options = (categoryId) => {
    if (!categoryId) return [];
    return allLevel2.filter((level2) => {
      const parentLevel1 = allLevel1.find((l1) => l1.id === level2.level1_id);
      return parentLevel1?.category_id === categoryId;
    });
  };

  const getFallbackLevel3Options = ({ categoryId, level1Id, level2Id }) => {
    if (level2Id) return allLevel3.filter((level3) => level3.level2_id === level2Id);
    if (level1Id) {
      const level2Ids = allLevel2.filter((level2) => level2.level1_id === level1Id).map((level2) => level2.id);
      return allLevel3.filter((level3) => level2Ids.includes(level3.level2_id));
    }
    if (categoryId) {
      const level2Ids = allLevel2
        .filter((level2) => {
          const parentLevel1 = allLevel1.find((l1) => l1.id === level2.level1_id);
          return parentLevel1?.category_id === categoryId;
        })
        .map((level2) => level2.id);
      return allLevel3.filter((level3) => level2Ids.includes(level3.level2_id));
    }
    return [];
  };

  const getFallbackLevel4Options = ({ categoryId, level1Id, level2Id, level3Id }) => {
    if (level3Id) return allLevel4.filter((level4) => level4.level3_id === level3Id);
    if (level2Id) {
      const level3Ids = allLevel3.filter((level3) => level3.level2_id === level2Id).map((level3) => level3.id);
      return allLevel4.filter((level4) => level3Ids.includes(level4.level3_id));
    }
    if (level1Id) {
      const level2Ids = allLevel2.filter((level2) => level2.level1_id === level1Id).map((level2) => level2.id);
      const level3Ids = allLevel3.filter((level3) => level2Ids.includes(level3.level2_id)).map((level3) => level3.id);
      return allLevel4.filter((level4) => level3Ids.includes(level4.level3_id));
    }
    if (categoryId) {
      const level2Ids = allLevel2
        .filter((level2) => {
          const parentLevel1 = allLevel1.find((l1) => l1.id === level2.level1_id);
          return parentLevel1?.category_id === categoryId;
        })
        .map((level2) => level2.id);
      const level3Ids = allLevel3.filter((level3) => level2Ids.includes(level3.level2_id)).map((level3) => level3.id);
      return allLevel4.filter((level4) => level3Ids.includes(level4.level3_id));
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      setError('Product name is required');
      return;
    }

    if (!form.category_id && !form.level1_id && !form.level2_id && !form.level3_id && !form.level4_id) {
      setError('Please select at least one category or subcategory level before saving.');
      return;
    }

    const duplicateProduct = products.find(
      (p) => p.id !== editingId && p.name?.trim().toLowerCase() === form.name.trim().toLowerCase()
    );
    if (duplicateProduct) {
      setError('A product with this name already exists. Please choose a different name.');
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
      const message = resolveSubmissionError(err);
      setError(message);
      console.error('Product save error:', err);
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

  const getRouteName = (product) => {
    const findName = (list, id) => (list && list.find((item) => item.id === id)?.name) || null;
    let categoryId = product.category_id;
    let level1Id = product.level1_id;
    let level2Id = product.level2_id;
    let level3Id = product.level3_id;
    const level4Id = product.level4_id;

    if (!level3Id && level4Id) {
      const level4 = allLevel4.find((item) => item.id === level4Id);
      level3Id = level4?.level3_id || level3Id;
    }
    if (!level2Id && level3Id) {
      const level3 = allLevel3.find((item) => item.id === level3Id);
      level2Id = level3?.level2_id || level2Id;
    }
    if (!level1Id && level2Id) {
      const level2 = allLevel2.find((item) => item.id === level2Id);
      level1Id = level2?.level1_id || level1Id;
    }
    if (!categoryId && level1Id) {
      const level1 = allLevel1.find((item) => item.id === level1Id);
      categoryId = level1?.category_id || categoryId;
    }

    const parts = [];
    if (categoryId) parts.push(findName(categories, categoryId) || 'Category');
    if (level1Id) parts.push(findName(allLevel1, level1Id) || 'Level 1');
    if (level2Id) parts.push(findName(allLevel2, level2Id) || 'Level 2');
    if (level3Id) parts.push(findName(allLevel3, level3Id) || 'Level 3');
    if (level4Id) parts.push(findName(allLevel4, level4Id) || 'Level 4');
    return parts.length ? parts.join(' › ') : 'Unspecified route';
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
        {/* Breadcrumb showing selected route */}
        <div className="selected-route">
          {(() => {
            const parts = [];
            const findName = (list, id) => (list && list.find((i) => i.id === id)?.name) || null;
            if (form.category_id) parts.push(findName(categories, form.category_id) || 'Category');
            if (form.level1_id) parts.push(findName(level1Options, form.level1_id) || 'Level1');
            if (form.level2_id) parts.push(findName(level2Options, form.level2_id) || 'Level2');
            if (form.level3_id) parts.push(findName(level3Options, form.level3_id) || 'Level3');
            if (form.level4_id) parts.push(findName(level4Options, form.level4_id) || (level4Subcats.find(l=>l.id===form.level4_id)?.name) || 'Level4');
            return parts.length ? <p className="route">Selected route: {parts.join(' › ')}</p> : null;
          })()}
        </div>
        <p className="hint-text">Tip: You can select a deeper level even when an upper level is missing. The form will assign the nearest valid parent route automatically.</p>
        <div className="hierarchy-selects">
          <select
            value={form.category_id || ''}
            onChange={async (e) => {
              const catId = e.target.value || '';
              setForm({ ...form, category_id: catId, level1_id: '', level2_id: '', level3_id: '', level4_id: '' });
              if (!catId) {
                setLevel1Options([]);
                setLevel2Options([]);
                setLevel3Options([]);
                setLevel4Options([]);
                return;
              }

              const l1 = await getSubcategoriesLevel1(catId);
              const l1Data = l1.data || [];
              setLevel1Options(l1Data);

              if (l1Data.length > 0) {
                setLevel2Options([]);
                setLevel3Options([]);
                setLevel4Options([]);
              } else {
                setLevel2Options(getFallbackLevel2Options(catId));
                setLevel3Options(getFallbackLevel3Options({ categoryId: catId }));
                setLevel4Options(getFallbackLevel4Options({ categoryId: catId }));
              }
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
              if (!id) {
                setLevel2Options(getFallbackLevel2Options(form.category_id));
                setLevel3Options(getFallbackLevel3Options({ categoryId: form.category_id }));
                setLevel4Options(getFallbackLevel4Options({ categoryId: form.category_id }));
                return;
              }
              const l2 = await getSubcategoriesLevel2(id);
              const l2Data = l2.data || [];
              setLevel2Options(l2Data);
              if (l2Data.length > 0) {
                setLevel3Options([]);
                setLevel4Options([]);
              } else {
                setLevel3Options(getFallbackLevel3Options({ level1Id: id, categoryId: form.category_id }));
                setLevel4Options(getFallbackLevel4Options({ level1Id: id, categoryId: form.category_id }));
              }
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
              if (!id) {
                setLevel3Options(getFallbackLevel3Options({ level1Id: form.level1_id, categoryId: form.category_id }));
                setLevel4Options(getFallbackLevel4Options({ level1Id: form.level1_id, categoryId: form.category_id }));
                return;
              }
              const l3 = await getSubcategoriesLevel3(id);
              const l3Data = l3.data || [];
              setLevel3Options(l3Data);
              if (l3Data.length > 0) {
                setLevel4Options([]);
              } else {
                setLevel4Options(getFallbackLevel4Options({ level2Id: id, level1Id: form.level1_id, categoryId: form.category_id }));
              }
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
              if (!id) {
                setLevel4Options(getFallbackLevel4Options({ level2Id: form.level2_id, level1Id: form.level1_id, categoryId: form.category_id }));
                return;
              }
              const l4 = await getSubcategoriesLevel4(id);
              const l4Data = l4.data || [];
              setLevel4Options(l4Data.length > 0 ? l4Data : getFallbackLevel4Options({ level3Id: id, level2Id: form.level2_id, level1Id: form.level1_id, categoryId: form.category_id }));
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
                  Route: {getRouteName(product)}
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
