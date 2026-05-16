import React, { useState, useEffect } from 'react';
import {
  getProducts,
  getPopularProducts,
  createPopularProduct,
  updatePopularProduct,
  deletePopularProduct,
} from '../api';
import './PopularProducts.css';

function PopularProductsAdmin() {
  const [allProducts, setAllProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, popRes] = await Promise.all([
        getProducts(),
        getPopularProducts(),
      ]);
      setAllProducts(prodRes.data || []);
      setPopularProducts(popRes.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPopularProduct = async () => {
    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    try {
      const maxOrder = popularProducts.length > 0
        ? Math.max(...popularProducts.map(p => p.display_order || 0))
        : 0;

      await createPopularProduct({
        product_id: selectedProductId,
        display_order: maxOrder + 1,
      });

      setSuccess('Product added to popular products!');
      setSelectedProductId('');
      loadData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
    }
  };

  const handleRemovePopularProduct = async (id) => {
    if (window.confirm('Remove this product from popular products?')) {
      try {
        await deletePopularProduct(id);
        setSuccess('Product removed from popular products!');
        loadData();
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to remove product');
        console.error(err);
      }
    }
  };

  const handleUpdateOrder = async (id, newOrder) => {
    try {
      await updatePopularProduct(id, { display_order: newOrder });
      setSuccess('Product order updated!');
      loadData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update order');
      console.error(err);
    }
  };

  const getProductName = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <div className="admin-section">
      <h3>⭐ Popular Products</h3>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="form">
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">Select a product to add</option>
          {allProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddPopularProduct}>Add to Popular Products</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list">
          <h4>⭐ Popular Products List: ({popularProducts.length} items)</h4>
          {popularProducts.length === 0 ? (
            <p style={{ color: '#999' }}>No popular products added yet</p>
          ) : (
            <div>
              {popularProducts.map((entry, idx) => {
                const product = allProducts.find(p => p.id === entry.product_id);
                return (
                  <div key={entry.id} className="item">
                    <div className="item-info">
                      <h5>#{idx + 1} - {getProductName(entry.product_id)}</h5>
                      {product && product.featured_image && (
                        <small><a href={product.featured_image} target="_blank" rel="noopener noreferrer">View Image</a></small>
                      )}
                      <small style={{ display: 'block', marginTop: '5px' }}>ID: {entry.product_id}</small>
                    </div>
                    <div className="item-actions">
                      <select
                        value={entry.display_order}
                        onChange={(e) => handleUpdateOrder(entry.id, parseInt(e.target.value))}
                        title="Change display order"
                      >
                        {Array.from({ length: popularProducts.length }, (_, i) => (
                          <option key={i} value={i}>{i + 1}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemovePopularProduct(entry.id)}
                        className="btn-delete"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PopularProductsAdmin;
