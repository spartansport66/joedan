import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getProducts, getCategories, getSubcategories, getProductImages } from '../api';
import ProductDetail from './ProductDetail';
import './ProductShowcase.css';

const ProductShowcase = forwardRef((props, ref) => {
  const { level4Id } = props;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedLevel4, setSelectedLevel4] = useState(level4Id || 'all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productImages, setProductImages] = useState({}); // { productId: [images] }
  const [selectedImageIndex, setSelectedImageIndex] = useState({}); // { productId: index }
  const [selectedProduct, setSelectedProduct] = useState(null); // For ProductDetail modal
  const [showProductDetail, setShowProductDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (level4Id) {
      setSelectedLevel4(level4Id);
    }
  }, [level4Id]);

  // Expose selectLevel4 method to parent component
  useImperativeHandle(ref, () => ({
    selectLevel4: (l4Id) => {
      setSelectedLevel4(l4Id);
    }
  }));

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, subRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getSubcategories(),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setSubcategories(subRes.data || []);
      setError('');

      // Load images for all products
      const imagesMap = {};
      const imageIndexMap = {};
      for (const product of prodRes.data || []) {
        try {
          const imgRes = await getProductImages(product.id);
          imagesMap[product.id] = imgRes.data;
          imageIndexMap[product.id] = 0;
        } catch (err) {
          imagesMap[product.id] = [];
          imageIndexMap[product.id] = 0;
        }
      }
      setProductImages(imagesMap);
      setSelectedImageIndex(imageIndexMap);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedLevel4 === 'all'
    ? products
    : products.filter((p) => p.level4_id === selectedLevel4);

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  };

  const getSubcategoryName = (subcategoryId) => {
    const sub = subcategories.find((s) => s.id === subcategoryId);
    return sub ? sub.name : '';
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const getProductMainImage = (product) => {
    // For grid display: Show featured image (Pic 1)
    return product.featured_image;
  };

  const nextImage = (e, productId) => {
    e.stopPropagation();
    const images = productImages[productId];
    if (images && images.length > 0) {
      setSelectedImageIndex({
        ...selectedImageIndex,
        [productId]: (selectedImageIndex[productId] + 1) % images.length,
      });
    }
  };

  const prevImage = (e, productId) => {
    e.stopPropagation();
    const images = productImages[productId];
    if (images && images.length > 0) {
      const newIndex = selectedImageIndex[productId] - 1;
      setSelectedImageIndex({
        ...selectedImageIndex,
        [productId]: newIndex < 0 ? images.length - 1 : newIndex,
      });
    }
  };

  return (
    <section id="products" className="product-showcase">
      <div className="container">
        <h2 className="section-title">Products</h2>
        <p className="section-subtitle">Browse our collection of premium items in this category</p>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">No products found in this category</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const images = productImages[product.id] || [];
              const hasMultipleImages = images.length > 1;
              const mainImage = getProductMainImage(product);

              return (
                <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                  <div className="product-image">
                    {mainImage ? (
                      <div className="image-container">
                        <img src={mainImage} alt={product.name} />
                        
                        {/* Image Counter */}
                        {hasMultipleImages && (
                          <div className="image-counter">
                            {selectedImageIndex[product.id] + 1} / {images.length}
                          </div>
                        )}

                        {/* Navigation Arrows */}
                        {hasMultipleImages && (
                          <>
                            <button
                              className="nav-btn prev-btn"
                              onClick={(e) => prevImage(e, product.id)}
                              aria-label="Previous image"
                            >
                              ‹
                            </button>
                            <button
                              className="nav-btn next-btn"
                              onClick={(e) => nextImage(e, product.id)}
                              aria-label="Next image"
                            >
                              ›
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="placeholder-image">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {hasMultipleImages && (
                    <div className="thumbnail-gallery">
                      {images.map((img, idx) => (
                        <button
                          key={img.id}
                          className={`thumbnail ${
                            selectedImageIndex[product.id] === idx ? 'active' : ''
                          }`}
                          onClick={() =>
                            setSelectedImageIndex({
                              ...selectedImageIndex,
                              [product.id]: idx,
                            })
                          }
                          title={`Image ${idx + 1}`}
                        >
                          <img src={img.image_url} alt={`${product.name} ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-category">
                      <span className="cat-badge">{getCategoryName(product.category_id)}</span>
                      <span className="subcat-badge">{getSubcategoryName(product.subcategory_id)}</span>
                    </div>
                    {product.details && (
                      <p className="product-details">{product.details}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onBack={handleCloseProductDetail}
          onClose={handleCloseProductDetail}
        />
      )}
    </section>
  );
});

ProductShowcase.displayName = 'ProductShowcase';

export default ProductShowcase;
