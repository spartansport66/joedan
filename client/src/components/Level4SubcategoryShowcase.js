import React, { useState, useEffect } from 'react';
import { getSubcategoriesLevel4, getSubcategoryLevel3ById } from '../api';
import './Level4SubcategoryShowcase.css';

function Level4SubcategoryShowcase({ level3Id, onSubcategorySelect, onBack }) {
  const [subcategories, setSubcategories] = useState([]);
  const [parentName, setParentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
  }, [level3Id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [subRes, parentRes] = await Promise.all([
        getSubcategoriesLevel4(level3Id),
        getSubcategoryLevel3ById(level3Id)
      ]);
      
      setSubcategories(subRes.data || []);
      
      const parent = parentRes.data;
      setParentName(parent ? parent.name : '');
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="level4-showcase">
        <div className="container">
          <div className="loading">Loading items...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="level4-showcase">
        <div className="container">
          <div className="error-banner">{error}</div>
        </div>
      </section>
    );
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <section className="level4-showcase">
        <div className="container">
          <div className="no-subcategories">
            <p>No items found in this category.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="level4-showcase">
      <div className="container">
        <div className="level4-header">
          <h2 className="section-title">
            {parentName}
          </h2>
          <p className="section-subtitle">
            {subcategories.length} item{subcategories.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="level4-grid">
          {subcategories.map((sub) => (
            <div key={sub.id} className="level4-card" onClick={() => onSubcategorySelect(sub.id)}>
              <div className="level4-image">
                {sub.image ? (
                  <img src={sub.image} alt={sub.name} />
                ) : (
                  <div className="placeholder-image">📂</div>
                )}
                <div className="overlay"></div>
              </div>
              <div className="level4-info">
                <h3>{sub.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Level4SubcategoryShowcase;
