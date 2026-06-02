import React, { useState, useEffect } from 'react';
import { getSettings, updateSetting } from '../api';
import './Settings.css';

function Settings({ mode = 'general' }) {
  const [settings, setSettings] = useState({
    hero_image: '',
    hero_video: '',
    hero_video_rotation: '0',
    category_section_title: '',
    category_section_subtitle: '',
    product_section_title: '',
    product_section_subtitle: '',
    about_section_title: 'About Us',
    about_section_content: '',
    contact_section_title: 'Contact',
    contact_section_content: '',
    contact_email: 'info@joedan.com',
    contact_phone: '+1 (555) 123-4567',
    contact_address: '123 Main Street, City, State'
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
      <h3>
        {mode === 'about' && '📝 About Us Settings'}
        {mode === 'contact' && '✉️ Contact Settings'}
        {mode === 'general' && '🎨 Settings & Configuration'}
      </h3>

      {savedMessage && <div className="success-message">{savedMessage}</div>}

      <div className="settings-grid">
        {mode === 'general' && (
          <>
            {/* Hero Section */}
            <div className="settings-section">
              <h4>Hero Section</h4>

              <div className="setting-item">
                <label>Hero Video URL</label>
                <input
                  type="text"
                  value={settings.hero_video}
                  onChange={(e) => handleChange('hero_video', e.target.value)}
                  placeholder="Enter hero video URL (MP4) or relative path"
                />
                <button
                  onClick={() => handleSave('hero_video')}
                  className="btn-save"
                >
                  Save
                </button>
              </div>

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
                <label>Hero Video Rotation</label>
                <select
                  value={settings.hero_video_rotation}
                  onChange={(e) => handleChange('hero_video_rotation', e.target.value)}
                >
                  <option value="0">0°</option>
                  <option value="90">90°</option>
                  <option value="180">180°</option>
                  <option value="270">270°</option>
                </select>
                <button
                  onClick={() => handleSave('hero_video_rotation')}
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
          </>
        )}

        {mode === 'about' && (
          <div className="settings-section">
            <h4>About Us Section</h4>

            <div className="setting-item">
              <label>Section Title</label>
              <input
                type="text"
                value={settings.about_section_title}
                onChange={(e) => handleChange('about_section_title', e.target.value)}
                placeholder="Enter About Us title"
              />
              <button onClick={() => handleSave('about_section_title')} className="btn-save">
                Save
              </button>
            </div>

            <div className="setting-item">
              <label>About Us Content</label>
              <textarea
                value={settings.about_section_content}
                onChange={(e) => handleChange('about_section_content', e.target.value)}
                placeholder="Enter the About Us content"
                rows="5"
              />
              <button onClick={() => handleSave('about_section_content')} className="btn-save">
                Save
              </button>
            </div>
          </div>
        )}

        {mode === 'contact' && (
          <div className="settings-section">
            <h4>Contact Section</h4>

            <div className="setting-item">
              <label>Section Title</label>
              <input
                type="text"
                value={settings.contact_section_title}
                onChange={(e) => handleChange('contact_section_title', e.target.value)}
                placeholder="Enter Contact title"
              />
              <button onClick={() => handleSave('contact_section_title')} className="btn-save">
                Save
              </button>
            </div>

            <div className="setting-item">
              <label>Contact Info</label>
              <textarea
                value={settings.contact_section_content}
                onChange={(e) => handleChange('contact_section_content', e.target.value)}
                placeholder="Enter contact page text"
                rows="5"
              />
              <button onClick={() => handleSave('contact_section_content')} className="btn-save">
                Save
              </button>
            </div>

            <div className="setting-item">
              <label>Email</label>
              <input
                type="text"
                value={settings.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="info@joedan.com"
              />
              <button onClick={() => handleSave('contact_email')} className="btn-save">
                Save
              </button>
            </div>

            <div className="setting-item">
              <label>Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <button onClick={() => handleSave('contact_phone')} className="btn-save">
                Save
              </button>
            </div>

            <div className="setting-item">
              <label>Address</label>
              <input
                type="text"
                value={settings.contact_address}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                placeholder="123 Main Street, City, State"
              />
              <button onClick={() => handleSave('contact_address')} className="btn-save">
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
