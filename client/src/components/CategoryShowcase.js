import React, { useState, useEffect } from 'react';
import { getCategories, getSettings } from '../api';
import './CategoryShowcase.css';

function CategoryShowcase({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectionTitle, setSectionTitle] = useState('What Are You Looking For?');
  const [sectionSubtitle, setSectionSubtitle] = useState('Explore our premium collections');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load categories
      const catResponse = await getCategories();
      setCategories(catResponse.data || []);

      // Load section title from settings
      const settingsResponse = await getSettings();
      const settingsObj = {};
      settingsResponse.data?.forEach(setting => {
        settingsObj[setting.key] = setting.value || '';
      });
      setSectionTitle(settingsObj.category_section_title || 'What Are You Looking For?');
      setSectionSubtitle(settingsObj.category_section_subtitle || 'Explore our premium collections');
      
      setError('');
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <section className="category-showcase"><div className="loading">Loading categories...</div></section>;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="category-showcase">
      <div className="container">
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">{sectionSubtitle}</p>

        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card" onClick={() => onCategorySelect(category.id)}>
              <div className="category-image">
                {category.image ? (
                  <img src={category.image} alt={category.name} />
                ) : (
                  <div className="placeholder-image">
                    <span>📁</span>
                  </div>
                )}
                <div className="overlay"></div>
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryShowcase;
