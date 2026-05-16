import React, { useState, useEffect } from 'react';
import { getPopularProducts, getProducts, getProductImages } from '../api';
import ProductDetail from './ProductDetail';
import './PopularProducts.css';

function PopularProducts() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [, setProductImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  useEffect(() => {
    loadPopularProducts();
  }, []);

  const loadPopularProducts = async () => {
    try {
      setLoading(true);
      
      // Get popular product entries with display order
      const popRes = await getPopularProducts();
      const popEntries = popRes.data || [];
      
      // Get all products
      const prodRes = await getProducts();
      const allProducts = prodRes.data || [];
      
      // Map and sort popular products by display_order
      const products = popEntries
        .map(entry => {
          const product = allProducts.find(p => p.id === entry.product_id);
          return product ? { ...product, display_order: entry.display_order } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.display_order - b.display_order);
      
      setPopularProducts(products);

      // Load images for all popular products
      const imagesMap = {};
      for (const product of products) {
        try {
          const imgRes = await getProductImages(product.id);
          imagesMap[product.id] = imgRes.data || [];
        } catch (err) {
          imagesMap[product.id] = [];
        }
      }
      setProductImages(imagesMap);
      setError('');
    } catch (err) {
      console.error('Failed to load popular products', err);
      setError('Failed to load popular products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <section className="popular-products-section"><div className="loading">Loading popular products...</div></section>;
  }

  if (popularProducts.length === 0) {
    return null;
  }

  return (
    <section className="popular-products-section">
      <div className="container">
        <h2 className="section-title">Popular Products</h2>
        <p className="section-subtitle">Bestsellers and customer favorites</p>

        {error && <div className="error-banner">{error}</div>}

        <div className="popular-products-grid">
          {popularProducts.map((product) => (
            <div
              key={product.id}
              className="popular-product-card"
              onClick={() => handleProductClick(product)}
            >
              <div className="popular-product-image">
                {product.featured_image ? (
                  <>
                    <img
                      src={product.featured_image}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="overlay">
                      <span className="view-details">View Details</span>
                    </div>
                  </>
                ) : (
                  <div className="placeholder-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="popular-product-info">
                <h3>{product.name}</h3>
                {product.details && (
                  <p className="details">{product.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showProductDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={handleCloseProductDetail}
          onBack={handleCloseProductDetail}
        />
      )}
    </section>
  );
}

export default PopularProducts;
