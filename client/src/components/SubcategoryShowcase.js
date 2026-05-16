import React, { useState, useEffect } from 'react';
import { getSubcategories, getCategories } from '../api';
import './SubcategoryShowcase.css';

function SubcategoryShowcase({ categoryId, onSubcategorySelect, onBack }) {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subRes, catRes] = await Promise.all([
        getSubcategories(),
        getCategories(),
      ]);
      
      // Filter subcategories by selected category
      const filtered = (subRes.data || []).filter(
        (sub) => sub.category_id === categoryId
      );
      setSubcategories(filtered);
      setCategories(catRes.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load subcategories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (cId) => {
    const cat = categories.find((c) => c.id === cId);
    return cat ? cat.name : 'Category';
  };

  if (loading) {
    return (
      <section className="subcategory-showcase">
        <div className="loading">Loading subcategories...</div>
      </section>
    );
  }

  return (
    <section className="subcategory-showcase">
      <div className="container">
        <div className="subcategory-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Categories
          </button>
          <h2 className="section-title">
            {getCategoryName(categoryId)} - Subcategories
          </h2>
          <p className="section-subtitle">Choose a subcategory to explore products</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {subcategories.length === 0 ? (
          <div className="no-subcategories">
            <p>No subcategories found for this category</p>
            <button className="back-btn secondary" onClick={onBack}>
              Back to Categories
            </button>
          </div>
        ) : (
          <div className="subcategories-grid">
            {subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="subcategory-card"
                onClick={() => onSubcategorySelect(subcategory.id)}
              >
                <div className="subcategory-image">
                  {subcategory.image ? (
                    <img src={subcategory.image} alt={subcategory.name} />
                  ) : (
                    <div className="placeholder-image">
                      <span>📂</span>
                    </div>
                  )}
                  <div className="overlay">
                    <button className="view-btn">View Products</button>
                  </div>
                </div>
                <div className="subcategory-info">
                  <h3>{subcategory.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SubcategoryShowcase;
