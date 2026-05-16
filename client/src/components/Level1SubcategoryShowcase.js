import React, { useState, useEffect } from 'react';
import { getSubcategoriesLevel1, getCategories } from '../api';
import './Level1SubcategoryShowcase.css';

function Level1SubcategoryShowcase({ categoryId, onSubcategorySelect, onBack }) {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [subRes, catRes] = await Promise.all([
        getSubcategoriesLevel1(categoryId),
        getCategories()
      ]);
      
      setSubcategories(subRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      setError('Failed to load subcategories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : '';
  };

  if (loading) {
    return (
      <section className="level1-showcase">
        <div className="container">
          <div className="loading">Loading subcategories...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="level1-showcase">
        <div className="container">
          <div className="error-banner">{error}</div>
        </div>
      </section>
    );
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <section className="level1-showcase">
        <div className="container">
          <div className="no-subcategories">
            <p>No subcategories found in this category.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="level1-showcase">
      <div className="container">
        <div className="level1-header">
          <h2 className="section-title">
            {getCategoryName(categoryId)}
          </h2>
          <p className="section-subtitle">
            Explore our collection of {subcategories.length} subcategories
          </p>
        </div>

        <div className="level1-grid">
          {subcategories.map((sub) => (
            <div key={sub.id} className="level1-card" onClick={() => onSubcategorySelect(sub.id)}>
              <div className="level1-image">
                {sub.image ? (
                  <img src={sub.image} alt={sub.name} />
                ) : (
                  <div className="placeholder-image">📂</div>
                )}
                <div className="overlay"></div>
              </div>
              <div className="level1-info">
                <h3>{sub.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Level1SubcategoryShowcase;
