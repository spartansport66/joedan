import React, { useState, useRef, useEffect } from 'react';
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
import { getSettings } from './api';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [pageSettings, setPageSettings] = useState({
    about_section_title: 'About Us',
    about_section_content: 'Share your story, brand vision, and why customers choose Joedan.',
    contact_section_title: 'Contact',
    contact_section_content: 'Reach out to Joedan for support, inquiries, and custom requests.',
    contact_email: 'info@joedan.com',
    contact_phone: '+1 (555) 123-4567',
    contact_address: '123 Main Street, City, State',
  });
  
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

  const pushHistoryState = (state) => {
    const nextState = {
      currentLevel,
      selectedCategory,
      selectedLevel1,
      selectedLevel2,
      selectedLevel3,
      selectedLevel4,
      ...state,
    };
    window.history.pushState(nextState, '');
  };

  const restoreHistoryState = (state) => {
    setCurrentLevel(state.currentLevel || 'categories');
    setSelectedCategory(state.selectedCategory ?? null);
    setSelectedLevel1(state.selectedLevel1 ?? null);
    setSelectedLevel2(state.selectedLevel2 ?? null);
    setSelectedLevel3(state.selectedLevel3 ?? null);
    setSelectedLevel4(state.selectedLevel4 ?? null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const initialState = {
      currentLevel: 'categories',
      selectedCategory: null,
      selectedLevel1: null,
      selectedLevel2: null,
      selectedLevel3: null,
      selectedLevel4: null,
    };
    window.history.replaceState(initialState, '');

    const handlePopState = (event) => {
      const state = event.state;
      if (state) {
        restoreHistoryState(state);
      } else {
        restoreHistoryState(initialState);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getSettings();
        const settingsObj = {};
        res.data?.forEach((setting) => {
          settingsObj[setting.key] = setting.value || '';
        });
        setPageSettings((prev) => ({ ...prev, ...settingsObj }));
      } catch (err) {
        console.error('Failed to load page settings', err);
      }
    };

    loadSettings();
  }, []);

  const handleNavClick = (target) => {
    if (target === 'home') {
      handleBackToCategories();
      return;
    }

    if (target === 'products') {
      if (currentLevel !== 'products') {
        pushHistoryState({
          currentLevel: 'products',
          selectedCategory: null,
          selectedLevel1: null,
          selectedLevel2: null,
          selectedLevel3: null,
          selectedLevel4: null,
        });
        setCurrentLevel('products');
        setSelectedCategory(null);
        setSelectedLevel1(null);
        setSelectedLevel2(null);
        setSelectedLevel3(null);
        setSelectedLevel4(null);
      }
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryId) => {
    pushHistoryState({
      currentLevel: 'level1',
      selectedCategory: categoryId,
      selectedLevel1: null,
      selectedLevel2: null,
      selectedLevel3: null,
      selectedLevel4: null,
    });
    setSelectedCategory(categoryId);
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setCurrentLevel('level1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel1Select = (level1Id) => {
    pushHistoryState({
      currentLevel: 'level2',
      selectedLevel1: level1Id,
      selectedLevel2: null,
      selectedLevel3: null,
      selectedLevel4: null,
    });
    setSelectedLevel1(level1Id);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setCurrentLevel('level2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel2Select = (level2Id) => {
    pushHistoryState({
      currentLevel: 'level3',
      selectedLevel2: level2Id,
      selectedLevel3: null,
      selectedLevel4: null,
    });
    setSelectedLevel2(level2Id);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setCurrentLevel('level3');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel3Select = (level3Id) => {
    pushHistoryState({
      currentLevel: 'level4',
      selectedLevel3: level3Id,
      selectedLevel4: null,
    });
    setSelectedLevel3(level3Id);
    setSelectedLevel4(null);
    setCurrentLevel('level4');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLevel4Select = (level4Id) => {
    pushHistoryState({
      currentLevel: 'products',
      selectedLevel4: level4Id,
    });
    setSelectedLevel4(level4Id);
    setCurrentLevel('products');

    // Trigger product filtering
    if (productShowcaseRef.current) {
      productShowcaseRef.current.selectLevel4(level4Id);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    pushHistoryState({
      currentLevel: 'categories',
      selectedCategory: null,
      selectedLevel1: null,
      selectedLevel2: null,
      selectedLevel3: null,
      selectedLevel4: null,
    });
    setCurrentLevel('categories');
    setSelectedCategory(null);
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLevel1 = () => {
    pushHistoryState({
      currentLevel: 'level1',
      selectedLevel1: null,
      selectedLevel2: null,
      selectedLevel3: null,
      selectedLevel4: null,
    });
    setCurrentLevel('level1');
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLevel2 = () => {
    pushHistoryState({
      currentLevel: 'level2',
      selectedLevel2: null,
      selectedLevel3: null,
      selectedLevel4: null,
    });
    setCurrentLevel('level2');
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLevel3 = () => {
    pushHistoryState({
      currentLevel: 'level3',
      selectedLevel3: null,
      selectedLevel4: null,
    });
    setCurrentLevel('level3');
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLevel4 = () => {
    pushHistoryState({
      currentLevel: 'level4',
      selectedLevel4: null,
    });
    setCurrentLevel('level4');
    setSelectedLevel4(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <Header onAdminClick={handleAdminToggle} isAdmin={showAdmin} onNavClick={handleNavClick} />
      
      {showAdmin && isAuthenticated ? (
        <AdminPanel />
      ) : (
        <>
          <div id="home" />
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
          {currentLevel === 'products' && (
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

          <section id="about" className="about-section">
            <div className="container">
              <h2 className="section-title">{pageSettings.about_section_title || 'About Us'}</h2>
              <div className="section-content">
                {pageSettings.about_section_content
                  .split('\n')
                  .map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
              </div>
            </div>
          </section>

          <section id="contact" className="contact-section">
            <div className="container">
              <h2 className="section-title">{pageSettings.contact_section_title || 'Contact'}</h2>
              <div className="section-content">
                {pageSettings.contact_section_content
                  .split('\n')
                  .map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}

                <ul className="contact-details-list">
                  <li><strong>Email:</strong> {pageSettings.contact_email || 'info@joedan.com'}</li>
                  <li><strong>Phone:</strong> {pageSettings.contact_phone || '+1 (555) 123-4567'}</li>
                  <li><strong>Address:</strong> {pageSettings.contact_address || '123 Main Street, City, State'}</li>
                </ul>
              </div>
            </div>
          </section>
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
      
      <Footer
        contactEmail={pageSettings.contact_email}
        contactPhone={pageSettings.contact_phone}
        contactAddress={pageSettings.contact_address}
      />
    </div>
  );
}

export default App;
