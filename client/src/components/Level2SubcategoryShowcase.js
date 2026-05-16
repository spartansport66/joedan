import React, { useState, useEffect } from 'react';
import { getSubcategoriesLevel2, getSubcategoriesLevel1 } from '../api';
import './Level2SubcategoryShowcase.css';

function Level2SubcategoryShowcase({ level1Id, onSubcategorySelect, onBack }) {
  const [subcategories, setSubcategories] = useState([]);
  const [parentName, setParentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [level1Id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [subRes, parentRes] = await Promise.all([
        getSubcategoriesLevel2(level1Id),
        getSubcategoriesLevel1(null)
      ]);
      
      setSubcategories(subRes.data || []);
      
      // Find parent name
      const parent = parentRes.data?.find(s => s.id === level1Id);
      setParentName(parent ? parent.name : '');
    } catch (err) {
      setError('Failed to load subcategories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="level2-showcase">
        <div className="container">
          <div className="loading">Loading subcategories...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="level2-showcase">
        <div className="container">
          <div className="error-banner">{error}</div>
        </div>
      </section>
    );
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <section className="level2-showcase">
        <div className="container">
          <div className="no-subcategories">
            <p>No items found in this category.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="level2-showcase">
      <div className="container">
        <div className="level2-header">
          <h2 className="section-title">
            {parentName}
          </h2>
          <p className="section-subtitle">
            {subcategories.length} item{subcategories.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="level2-grid">
          {subcategories.map((sub) => (
            <div key={sub.id} className="level2-card" onClick={() => onSubcategorySelect(sub.id)}>
              <div className="level2-image">
                {sub.image ? (
                  <img src={sub.image} alt={sub.name} />
                ) : (
                  <div className="placeholder-image">📂</div>
                )}
                <div className="overlay"></div>
              </div>
              <div className="level2-info">
                <h3>{sub.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Level2SubcategoryShowcase;
