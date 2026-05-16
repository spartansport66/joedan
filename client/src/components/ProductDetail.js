import React, { useState, useEffect } from 'react';
import './ProductDetail.css';
import { getProductCharacteristics, getProductImages } from '../api';

function ProductDetail({ product, onBack, onClose }) {
  const [characteristics, setCharacteristics] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(product?.pic2_url || product?.featured_image || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch characteristics
        if (product?.id) {
          const charResponse = await getProductCharacteristics(product.id);
          setCharacteristics(charResponse.data || []);
          
          // Fetch product images (gallery images)
          const imagesResponse = await getProductImages(product.id);
          const imagesList = imagesResponse.data || [];
          setImages(imagesList);
          
          // Set main image to pic2_url for popup display
          if (product.pic2_url) {
            setMainImage(product.pic2_url);
          } else {
            setMainImage(product.featured_image || '');
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [product]);

  const formatDescription = (text) => {
    if (!text) return null;
    // Split by line breaks or bullet points
    const lines = text.split(/[\n•-]/);
    return (
      <div className="description-content">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          return (
            <p key={idx} className="description-point">
              <span className="bullet">•</span>
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="product-detail-overlay" onClick={onClose}>
        <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="product-detail-container">
          {/* Left: Images Section */}
          <div className="product-images-section">
            <div className="main-image-container">
              <img src={mainImage} alt={product?.name} className="main-product-image" />
            </div>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="product-thumbnails">
                {images.map((img, idx) => (
                  <img
                    key={img.id || idx}
                    src={img.image_url}
                    alt={`Product ${idx + 1}`}
                    className={`thumbnail ${mainImage === img.image_url ? 'active' : ''}`}
                    onClick={() => setMainImage(img.image_url)}
                  />
                ))}
              </div>
            )}

            {/* Image counter */}
            {images.length > 0 && (
              <div className="image-counter">
                {images.findIndex(img => img.image_url === mainImage) + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Right: Product Info Section */}
          <div className="product-info-section">
            <h1 className="product-detail-title">{product?.name}</h1>

            {product?.details && (
              <div className="description-section">
                {formatDescription(product.details)}
              </div>
            )}

            {/* Characteristics Section */}
            {characteristics.length > 0 && (
              <div className="characteristics-section">
                <h3 className="characteristics-title">CHARACTERISTICS</h3>
                <div className="characteristics-grid">
                  {characteristics.map((char) => (
                    <div key={char.id} className="characteristic-item">
                      {char.icon && <span className="char-icon">{char.icon}</span>}
                      <div className="char-content">
                        <p className="char-name">{char.name}</p>
                        <p className="char-value">
                          {char.value} {char.unit ? `${char.unit}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
