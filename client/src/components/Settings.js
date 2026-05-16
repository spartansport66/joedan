import React, { useState, useEffect } from 'react';
import { getSettings, updateSetting } from '../api';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    hero_image: '',
    hero_title: '',
    hero_subtitle: '',
    category_section_title: '',
    category_section_subtitle: '',
    product_section_title: '',
    product_section_subtitle: ''
  });
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await getSettings();
      const settingsObj = {};
      res.data?.forEach(setting => {
        settingsObj[setting.key] = setting.value || '';
      });
      setSettings(prev => ({ ...prev, ...settingsObj }));
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (key) => {
    try {
      await updateSetting(key, { value: settings[key] });
      setSavedMessage(`✓ ${key} saved successfully!`);
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      alert('Failed to save');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <div className="settings-container">
      <h3>🎨 Settings & Configuration</h3>

      {savedMessage && <div className="success-message">{savedMessage}</div>}

      <div className="settings-grid">
        {/* Hero Section */}
        <div className="settings-section">
          <h4>Hero Section</h4>

          <div className="setting-item">
            <label>Hero Image URL</label>
            <input
              type="text"
              value={settings.hero_image}
              onChange={(e) => handleChange('hero_image', e.target.value)}
              placeholder="Enter hero background image URL"
            />
            <button
              onClick={() => handleSave('hero_image')}
              className="btn-save"
            >
              Save
            </button>
          </div>

          <div className="setting-item">
            <label>Hero Title</label>
            <input
              type="text"
              value={settings.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              placeholder="Hero main title"
            />
            <button
              onClick={() => handleSave('hero_title')}
              className="btn-save"
            >
              Save
            </button>
          </div>

          <div className="setting-item">
            <label>Hero Subtitle</label>
            <textarea
              value={settings.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              placeholder="Hero subtitle text"
              rows="2"
            />
            <button
              onClick={() => handleSave('hero_subtitle')}
              className="btn-save"
            >
              Save
            </button>
          </div>
        </div>

        {/* Category Section */}
        <div className="settings-section">
          <h4>Category Section</h4>

          <div className="setting-item">
            <label>Section Title</label>
            <input
              type="text"
              value={settings.category_section_title}
              onChange={(e) => handleChange('category_section_title', e.target.value)}
              placeholder="e.g., Browse by Category"
            />
            <button
              onClick={() => handleSave('category_section_title')}
              className="btn-save"
            >
              Save
            </button>
          </div>

          <div className="setting-item">
            <label>Section Subtitle</label>
            <textarea
              value={settings.category_section_subtitle}
              onChange={(e) => handleChange('category_section_subtitle', e.target.value)}
              placeholder="Subtitle for category section"
              rows="2"
            />
            <button
              onClick={() => handleSave('category_section_subtitle')}
              className="btn-save"
            >
              Save
            </button>
          </div>
        </div>

        {/* Product Section */}
        <div className="settings-section">
          <h4>Product Section</h4>

          <div className="setting-item">
            <label>Section Title</label>
            <input
              type="text"
              value={settings.product_section_title}
              onChange={(e) => handleChange('product_section_title', e.target.value)}
              placeholder="e.g., Our Products"
            />
            <button
              onClick={() => handleSave('product_section_title')}
              className="btn-save"
            >
              Save
            </button>
          </div>

          <div className="setting-item">
            <label>Section Subtitle</label>
            <textarea
              value={settings.product_section_subtitle}
              onChange={(e) => handleChange('product_section_subtitle', e.target.value)}
              placeholder="Subtitle for product section"
              rows="2"
            />
            <button
              onClick={() => handleSave('product_section_subtitle')}
              className="btn-save"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
