import React, { useState } from 'react';
import Categories from './Categories';
import Level1Categories from './Level1Categories';
import Level2Categories from './Level2Categories';
import Level3Categories from './Level3Categories';
import Level4Categories from './Level4Categories';
import Products from './Products';
import ProductCharacteristics from './ProductCharacteristics';
import ContentCardsAdmin from './ContentCardsAdmin';
import PopularProductsAdmin from './PopularProductsAdmin';
import Settings from './Settings';
import './AdminPanel.css';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your products, categories, content, and all configuration settings</p>
      </div>

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <span className="tab-icon">📁</span> Categories
          </button>

          <button
            className={`admin-tab ${activeTab === 'level1' ? 'active' : ''}`}
            onClick={() => setActiveTab('level1')}
          >
            <span className="tab-icon">📂</span> Level 1 Subcats
          </button>

          <button
            className={`admin-tab ${activeTab === 'level2' ? 'active' : ''}`}
            onClick={() => setActiveTab('level2')}
          >
            <span className="tab-icon">📂</span> Level 2 Subcats
          </button>

          <button
            className={`admin-tab ${activeTab === 'level3' ? 'active' : ''}`}
            onClick={() => setActiveTab('level3')}
          >
            <span className="tab-icon">📂</span> Level 3 Subcats
          </button>

          <button
            className={`admin-tab ${activeTab === 'level4' ? 'active' : ''}`}
            onClick={() => setActiveTab('level4')}
          >
            <span className="tab-icon">📂</span> Level 4 Subcats
          </button>

          <button
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="tab-icon">📦</span> Products
          </button>

          <button
            className={`admin-tab ${activeTab === 'characteristics' ? 'active' : ''}`}
            onClick={() => setActiveTab('characteristics')}
          >
            <span className="tab-icon">⚙️</span> Characteristics
          </button>

          <button
            className={`admin-tab ${activeTab === 'content-cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('content-cards')}
          >
            <span className="tab-icon">📸</span> Content Cards
          </button>

          <button
            className={`admin-tab ${activeTab === 'popular-products' ? 'active' : ''}`}
            onClick={() => setActiveTab('popular-products')}
          >
            <span className="tab-icon">⭐</span> Popular Products
          </button>

          <button
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="tab-icon">⚙️</span> Settings
          </button>
        </div>

        <div className="admin-tab-content">
          {activeTab === 'categories' && <Categories />}
          {activeTab === 'level1' && <Level1Categories />}
          {activeTab === 'level2' && <Level2Categories />}
          {activeTab === 'level3' && <Level3Categories />}
          {activeTab === 'level4' && <Level4Categories />}
          {activeTab === 'products' && <Products />}
          {activeTab === 'characteristics' && <ProductCharacteristics />}
          {activeTab === 'content-cards' && <ContentCardsAdmin />}
          {activeTab === 'popular-products' && <PopularProductsAdmin />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
