// ============================================================================
// API REQUEST EXAMPLES FOR NEW FEATURES
// ============================================================================
// These are JavaScript/Axios examples for using the new API endpoints
// Can be tested in browser console or frontend code
// ============================================================================

// ============================================================================
// 1. SETTINGS API ENDPOINTS
// ============================================================================

// Get all settings
async function getAllSettings() {
  const response = await fetch('http://localhost:5000/api/settings');
  const data = await response.json();
  console.log('All Settings:', data);
  return data;
}

// Get specific setting
async function getSetting(key) {
  const response = await fetch(`http://localhost:5000/api/settings/${key}`);
  const data = await response.json();
  console.log(`Setting ${key}:`, data);
  return data;
}

// Update a setting
async function updateSetting(key, value) {
  const response = await fetch(`http://localhost:5000/api/settings/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  });
  const data = await response.json();
  console.log('Setting updated:', data);
  return data;
}

// Create new setting
async function createSetting(key, value, description) {
  const response = await fetch('http://localhost:5000/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value, description })
  });
  const data = await response.json();
  console.log('Setting created:', data);
  return data;
}

// Delete setting
async function deleteSetting(key) {
  const response = await fetch(`http://localhost:5000/api/settings/${key}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log('Setting deleted:', data);
  return data;
}

// ============================================================================
// 2. CONTENT CARDS API ENDPOINTS
// ============================================================================

// Get all content cards
async function getAllContentCards() {
  const response = await fetch('http://localhost:5000/api/content-cards');
  const data = await response.json();
  console.log('All Content Cards:', data);
  return data;
}

// Get content cards by position
async function getContentCardsByPosition(position) {
  // position: 'before_categories' or 'after_categories'
  const allCards = await getAllContentCards();
  const filtered = allCards.filter(card => card.position_type === position);
  return filtered.sort((a, b) => a.display_position - b.display_position);
}

// Create content card (BEFORE category)
async function createContentCard_Before() {
  const response = await fetch('http://localhost:5000/api/content-cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Special Collection',
      description: 'Discover our exclusive premium collection',
      image_url: 'https://images.unsplash.com/photo-1441984904556-0ac8a3c64228?w=800',
      display_position: 0,
      position_type: 'before_categories'
    })
  });
  const data = await response.json();
  console.log('Content Card Created (Before):', data);
  return data;
}

// Create content card (AFTER category)
async function createContentCard_After() {
  const response = await fetch('http://localhost:5000/api/content-cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'New Arrivals',
      description: 'Check out our latest additions to the collection',
      image_url: 'https://images.unsplash.com/photo-1469022563149-aa64fffe498e?w=800',
      display_position: 0,
      position_type: 'after_categories'
    })
  });
  const data = await response.json();
  console.log('Content Card Created (After):', data);
  return data;
}

// Update content card
async function updateContentCard(id, updates) {
  const response = await fetch(`http://localhost:5000/api/content-cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await response.json();
  console.log('Content Card Updated:', data);
  return data;
}

// Example: Update position and order
async function updateCardPosition(id, newPosition, newPositionType) {
  return updateContentCard(id, {
    display_position: newPosition,
    position_type: newPositionType
  });
}

// Delete content card
async function deleteContentCard(id) {
  const response = await fetch(`http://localhost:5000/api/content-cards/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log('Content Card Deleted:', data);
  return data;
}

// ============================================================================
// 3. POPULAR PRODUCTS API ENDPOINTS
// ============================================================================

// Get all popular products (with product details)
async function getAllPopularProducts() {
  const response = await fetch('http://localhost:5000/api/popular-products');
  const data = await response.json();
  console.log('All Popular Products:', data);
  return data;
}

// Add product to popular list
async function addToPopularProducts(productId, displayOrder = 0) {
  const response = await fetch('http://localhost:5000/api/popular-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      display_order: displayOrder
    })
  });
  const data = await response.json();
  console.log('Product Added to Popular:', data);
  return data;
}

// Update popular product order
async function updatePopularProductOrder(id, newOrder) {
  const response = await fetch(`http://localhost:5000/api/popular-products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ display_order: newOrder })
  });
  const data = await response.json();
  console.log('Popular Product Order Updated:', data);
  return data;
}

// Remove from popular products
async function removeFromPopularProducts(id) {
  const response = await fetch(`http://localhost:5000/api/popular-products/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log('Product Removed from Popular:', data);
  return data;
}

// ============================================================================
// 4. BULK OPERATIONS
// ============================================================================

// Update hero image
async function updateHeroImage(imageUrl) {
  return updateSetting('hero_image', imageUrl);
}

// Update hero title and subtitle
async function updateHeroContent(title, subtitle) {
  await updateSetting('hero_title', title);
  await updateSetting('hero_subtitle', subtitle);
  console.log('Hero content updated');
}

// Update Browse by Category section
async function updateCategorySection(title, subtitle) {
  await updateSetting('category_section_title', title);
  await updateSetting('category_section_subtitle', subtitle);
  console.log('Category section updated');
}

// Add multiple content cards at once
async function addMultipleContentCards(cardsArray) {
  // cardsArray format:
  // [
  //   { title, description, image_url, display_position, position_type },
  //   { title, description, image_url, display_position, position_type },
  //   ...
  // ]
  
  const results = [];
  for (const card of cardsArray) {
    const result = await fetch('http://localhost:5000/api/content-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    }).then(r => r.json());
    results.push(result);
  }
  console.log('Multiple content cards added:', results);
  return results;
}

// Example usage
async function exampleAddMultipleCards() {
  const cards = [
    {
      title: 'Summer Collection',
      description: 'Fresh summer styles now available',
      image_url: 'https://example.com/summer.jpg',
      display_position: 0,
      position_type: 'before_categories'
    },
    {
      title: 'Sale Event',
      description: 'Up to 70% off on selected items',
      image_url: 'https://example.com/sale.jpg',
      display_position: 1,
      position_type: 'after_categories'
    }
  ];
  
  await addMultipleContentCards(cards);
}

// Add multiple popular products at once
async function addMultiplePopularProducts(productIds) {
  // productIds: ['product-id-1', 'product-id-2', 'product-id-3']
  
  const results = [];
  for (let i = 0; i < productIds.length; i++) {
    const result = await fetch('http://localhost:5000/api/popular-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productIds[i],
        display_order: i
      })
    }).then(r => r.json());
    results.push(result);
  }
  console.log('Multiple products added to popular:', results);
  return results;
}

// ============================================================================
// 5. COMBINED OPERATIONS (Real-world examples)
// ============================================================================

// Setup entire homepage
async function setupHomepage(config) {
  console.log('Setting up homepage...');
  
  // 1. Update hero settings
  await updateHeroImage(config.heroImage);
  await updateHeroContent(config.heroTitle, config.heroSubtitle);
  
  // 2. Update category section
  await updateCategorySection(config.categoryTitle, config.categorySubtitle);
  
  // 3. Add content cards
  if (config.contentCards && config.contentCards.length > 0) {
    await addMultipleContentCards(config.contentCards);
  }
  
  // 4. Add popular products
  if (config.popularProductIds && config.popularProductIds.length > 0) {
    await addMultiplePopularProducts(config.popularProductIds);
  }
  
  console.log('Homepage setup complete!');
}

// Example configuration
const homepageConfig = {
  heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  heroTitle: 'Exclusive Premium Collection',
  heroSubtitle: 'Discover quality and style combined',
  categoryTitle: 'Shop by Category',
  categorySubtitle: 'Find exactly what you need',
  contentCards: [
    {
      title: 'New Arrivals',
      description: 'Latest additions to our collection',
      image_url: 'https://images.unsplash.com/photo-1441984904556-0ac8a3c64228?w=800',
      display_position: 0,
      position_type: 'before_categories'
    },
    {
      title: 'Featured Promotion',
      description: 'Special offer on selected items',
      image_url: 'https://images.unsplash.com/photo-1469022563149-aa64fffe498e?w=800',
      display_position: 0,
      position_type: 'after_categories'
    }
  ],
  popularProductIds: ['product-id-1', 'product-id-2', 'product-id-3']
};

// Usage: await setupHomepage(homepageConfig);

// ============================================================================
// 6. TESTING FUNCTIONS (Copy-paste into browser console)
// ============================================================================

// Test all endpoints
async function testAllEndpoints() {
  console.log('=== Testing Settings ===');
  await getAllSettings();
  await getSetting('hero_image');
  
  console.log('=== Testing Content Cards ===');
  await getAllContentCards();
  await createContentCard_Before();
  await createContentCard_After();
  
  console.log('=== Testing Popular Products ===');
  await getAllPopularProducts();
  
  console.log('All tests completed!');
}

// Simple CRUD test
async function testCRUD() {
  // Create
  const card = await createContentCard_After();
  console.log('Created:', card.id);
  
  // Read
  const allCards = await getAllContentCards();
  console.log('Total cards:', allCards.length);
  
  // Update
  if (card.id) {
    await updateContentCard(card.id, {
      title: 'Updated Title',
      description: 'Updated description'
    });
    console.log('Updated card:', card.id);
    
    // Delete
    await deleteContentCard(card.id);
    console.log('Deleted card:', card.id);
  }
}

// ============================================================================
// 7. ERROR HANDLING EXAMPLES
// ============================================================================

// Improved version with error handling
async function createContentCardSafe(cardData) {
  try {
    const response = await fetch('http://localhost:5000/api/content-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating card:', error.error);
      return null;
    }
    
    const data = await response.json();
    console.log('Card created successfully:', data);
    return data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// Update with validation
async function updateSettingSafe(key, value) {
  if (!key || !value) {
    console.error('Key and value are required');
    return null;
  }
  
  try {
    const response = await fetch(`http://localhost:5000/api/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Setting ${key} updated successfully`);
    return data;
  } catch (error) {
    console.error('Error updating setting:', error);
    return null;
  }
}

// ============================================================================
// 8. QUICK REFERENCE - Copy and paste commands
// ============================================================================

/*

# QUICK TEST COMMANDS (paste into browser console)

// 1. Test Settings
getAllSettings();
getSetting('hero_image');
updateSetting('hero_image', 'https://example.com/image.jpg');

// 2. Test Content Cards
getAllContentCards();
createContentCard_Before();
createContentCard_After();

// 3. Test Popular Products
getAllPopularProducts();
addToPopularProducts('product-id', 0);

// 4. Update Hero
updateHeroImage('https://example.com/hero.jpg');
updateHeroContent('New Title', 'New Subtitle');

// 5. Run complete test
testAllEndpoints();
testCRUD();

// 6. Setup entire homepage
setupHomepage(homepageConfig);

*/

// ============================================================================
// AXIOS VERSIONS (if using Axios in your project)
// ============================================================================

const axios = require('axios');

// Get all settings (Axios)
async function getSettingsAxios() {
  try {
    const response = await axios.get('http://localhost:5000/api/settings');
    console.log('Settings:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Create content card (Axios)
async function createContentCardAxios(cardData) {
  try {
    const response = await axios.post('http://localhost:5000/api/content-cards', cardData);
    console.log('Card created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Add to popular products (Axios)
async function addPopularProductAxios(productId, displayOrder) {
  try {
    const response = await axios.post('http://localhost:5000/api/popular-products', {
      product_id: productId,
      display_order: displayOrder
    });
    console.log('Product added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

module.exports = {
  // Settings
  getAllSettings,
  getSetting,
  updateSetting,
  createSetting,
  deleteSetting,
  
  // Content Cards
  getAllContentCards,
  getContentCardsByPosition,
  createContentCard_Before,
  createContentCard_After,
  updateContentCard,
  updateCardPosition,
  deleteContentCard,
  
  // Popular Products
  getAllPopularProducts,
  addToPopularProducts,
  updatePopularProductOrder,
  removeFromPopularProducts,
  
  // Bulk Operations
  updateHeroImage,
  updateHeroContent,
  updateCategorySection,
  addMultipleContentCards,
  addMultiplePopularProducts,
  setupHomepage,
  
  // Testing
  testAllEndpoints,
  testCRUD
};
