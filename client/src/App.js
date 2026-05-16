import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryShowcase from './components/CategoryShowcase';
import ContentCards from './components/ContentCards';
import Level1SubcategoryShowcase from './components/Level1SubcategoryShowcase';
import Level2SubcategoryShowcase from './components/Level2SubcategoryShowcase';
import Level3SubcategoryShowcase from './components/Level3SubcategoryShowcase';
import Level4SubcategoryShowcase from './components/Level4SubcategoryShowcase';
import ProductShowcase from './components/ProductShowcase';
import PopularProducts from './components/PopularProducts';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Navigation state
  const [currentLevel, setCurrentLevel] = useState('categories'); // 'categories' | 'level1' | 'level2' | 'level3' | 'level4' | 'products'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel1, setSelectedLevel1] = useState(null);
  const [selectedLevel2, setSelectedLevel2] = useState(null);
  const [selectedLevel3, setSelectedLevel3] = useState(null);
  const [selectedLevel4, setSelectedLevel4] = useState(null);
  
  const productShowcaseRef = useRef(null);

  const handleAdminToggle = () => {
    if (!isAuthenticated) {
      setShowPasswordModal(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      setShowAdmin(!showAdmin);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setShowAdmin(true);
      setShowPasswordModal(false);
      setPasswordInput('');
    } else {
      setPasswordError('Invalid password');
      setPasswordInput('');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
    setPasswordError('');
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setCurrentLevel('level1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel1Select = (level1Id) => {
    setSelectedLevel1(level1Id);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setCurrentLevel('level2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel2Select = (level2Id) => {
    setSelectedLevel2(level2Id);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setCurrentLevel('level3');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel3Select = (level3Id) => {
    setSelectedLevel3(level3Id);
    setSelectedLevel4(null);
    setCurrentLevel('level4');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel4Select = (level4Id) => {
    setSelectedLevel4(level4Id);
    setCurrentLevel('products');
    
    // Trigger product filtering
    if (productShowcaseRef.current) {
      productShowcaseRef.current.selectLevel4(level4Id);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setCurrentLevel('categories');
    setSelectedCategory(null);
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLevel1 = () => {
    setCurrentLevel('level1');
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLevel2 = () => {
    setCurrentLevel('level2');
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLevel3 = () => {
    setCurrentLevel('level3');
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLevel4 = () => {
    setCurrentLevel('level4');
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <Header onAdminClick={handleAdminToggle} isAdmin={showAdmin} />
      
      {showAdmin && isAuthenticated ? (
        <AdminPanel />
      ) : (
        <>
          <Hero />
          
          {/* Level 0: Categories */}
          {currentLevel === 'categories' && (
            <>
              <CategoryShowcase onCategorySelect={handleCategorySelect} />
              
              {/* Inspiration - Before Popular Products */}
              <ContentCards position="before_categories" title="Inspiration" />
              
              {/* Popular Products */}
              <PopularProducts />
              
              {/* JOEDAN Windows Store Network - After Popular Products */}
              <ContentCards position="after_categories" title="JOEDAN Windows Store Network" />
            </>
          )}
          
          {/* Level 1: Sub of Category */}
          {currentLevel === 'level1' && selectedCategory && (
            <Level1SubcategoryShowcase
              categoryId={selectedCategory}
              onSubcategorySelect={handleLevel1Select}
              onBack={handleBackToCategories}
            />
          )}
          
          {/* Level 2: Sub of Sub Category */}
          {currentLevel === 'level2' && selectedLevel1 && (
            <Level2SubcategoryShowcase
              level1Id={selectedLevel1}
              onSubcategorySelect={handleLevel2Select}
              onBack={handleBackToLevel1}
            />
          )}
          
          {/* Level 3: Sub of Sub of Sub Category */}
          {currentLevel === 'level3' && selectedLevel2 && (
            <Level3SubcategoryShowcase
              level2Id={selectedLevel2}
              onSubcategorySelect={handleLevel3Select}
              onBack={handleBackToLevel2}
            />
          )}
          
          {/* Level 4: Sub of Sub of Sub of Sub Category */}
          {currentLevel === 'level4' && selectedLevel3 && (
            <Level4SubcategoryShowcase
              level3Id={selectedLevel3}
              onSubcategorySelect={handleLevel4Select}
              onBack={handleBackToLevel3}
            />
          )}
          
          {/* Final: Products */}
          {currentLevel === 'products' && selectedLevel4 && (
            <>
              <div className="breadcrumb-nav">
                <div className="container">
                  <button onClick={handleBackToCategories} className="breadcrumb-btn">
                    ← All Categories
                  </button>
                  <button onClick={handleBackToLevel4} className="breadcrumb-btn">
                    ← Back
                  </button>
                </div>
              </div>
              <ProductShowcase
                ref={productShowcaseRef}
                level4Id={selectedLevel4}
              />
            </>
          )}
        </>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="password-modal-overlay" onClick={handlePasswordCancel}>
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Admin Password</h3>
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <div className="modal-buttons">
              <button className="modal-btn submit-btn" onClick={handlePasswordSubmit}>
                Login
              </button>
              <button className="modal-btn cancel-btn" onClick={handlePasswordCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default App;
