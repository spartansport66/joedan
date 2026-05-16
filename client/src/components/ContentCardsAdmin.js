import React, { useState, useEffect } from 'react';
import {
  getContentCards,
  createContentCard,
  updateContentCard,
  deleteContentCard,
  getProducts,
  getPopularProducts,
  createPopularProduct,
  updatePopularProduct,
  deletePopularProduct,
} from '../api';
import './ContentCards.css';

function ContentCardsAdmin() {
  const [cards, setCards] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    display_position: 0,
    position_type: 'after_categories',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [beforeCards, setBeforeCards] = useState([]);
  const [afterCards, setAfterCards] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [cardRes, prodRes, popRes] = await Promise.all([
        getContentCards(),
        getProducts(),
        getPopularProducts(),
      ]);
      
      const allCards = cardRes.data || [];
      setCards(allCards);
      setAllProducts(prodRes.data || []);
      setPopularProducts(popRes.data || []);
      
      // Separate by position type
      const before = allCards.filter(c => c.position_type === 'before_categories').sort((a, b) => a.display_position - b.display_position);
      const after = allCards.filter(c => c.position_type === 'after_categories').sort((a, b) => a.display_position - b.display_position);
      setBeforeCards(before);
      setAfterCards(after);
      
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      setError('Title is required');
      return;
    }

    try {
      if (editingId) {
        await updateContentCard(editingId, form);
        setSuccess('Content card updated successfully!');
      } else {
        await createContentCard(form);
        setSuccess('Content card added successfully!');
      }

      setForm({
        title: '',
        description: '',
        image_url: '',
        display_position: 0,
        position_type: 'after_categories',
      });
      setEditingId(null);
      loadAllData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to save content card');
      console.error(err);
    }
  };

  const handleEdit = (card) => {
    setEditingId(card.id);
    setForm({
      title: card.title,
      description: card.description || '',
      image_url: card.image_url || '',
      display_position: card.display_position,
      position_type: card.position_type,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this content card?')) {
      try {
        await deleteContentCard(id);
        setSuccess('Content card deleted!');
        loadAllData();
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to delete content card');
        console.error(err);
      }
    }
  };

  const handleMoveCard = async (id, newPosition, newType) => {
    try {
      await updateContentCard(id, {
        display_position: newPosition,
        position_type: newType
      });
      setSuccess('Card repositioned successfully!');
      loadAllData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to move card');
      console.error(err);
    }
  };

  const handleChangePosition = async (id, newPosition) => {
    try {
      await updateContentCard(id, { display_position: newPosition });
      setSuccess('Card position updated!');
      loadAllData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update position');
      console.error(err);
    }
  };

  // DRAG AND DROP HANDLERS
  const handleDragStart = (e, item, type) => {
    setDraggedItem({ id: item.id, itemType: type });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ id: item.id, itemType: type }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnContentCard = async (e, targetSection) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const dragData = e.dataTransfer.getData('application/json');
      const data = JSON.parse(dragData);
      
      if (data.itemType === 'content_card') {
        // Get the card being dragged
        const card = cards.find(c => c.id === data.id);
        if (!card) {
          setError('Card not found');
          return;
        }
        
        // Determine target section type
        const newPositionType = targetSection === 'before' ? 'before_categories' : 'after_categories';
        const targetArray = targetSection === 'before' ? beforeCards : afterCards;
        
        // Calculate new position (append to end of target section)
        const newPosition = targetArray.length;
        
        // Update card
        await updateContentCard(data.id, {
          position_type: newPositionType,
          display_position: newPosition
        });
        
        setSuccess(`Card moved to ${targetSection === 'before' ? 'Before' : 'After'} section!`);
        loadAllData();
      }
    } catch (err) {
      console.error('Drop error:', err);
      setError('Failed to move card: ' + err.message);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleDropOnPopularProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const dragData = e.dataTransfer.getData('application/json');
      const data = JSON.parse(dragData);
      
      if (data.itemType === 'popular_product') {
        // Reorder popular products - just update the one being dragged
        // New position will be at the end
        const newOrder = popularProducts.length;
        
        await updatePopularProduct(data.id, {
          display_order: newOrder
        });
        
        setSuccess('Product reordered!');
        loadAllData();
      }
    } catch (err) {
      console.error('Drop error:', err);
      setError('Failed to reorder product: ' + err.message);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleAddPopularProduct = async () => {
    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    try {
      const maxOrder = popularProducts.length > 0
        ? Math.max(...popularProducts.map(p => p.display_order || 0))
        : 0;

      await createPopularProduct({
        product_id: selectedProductId,
        display_order: maxOrder + 1,
      });

      setSuccess('Product added to popular products!');
      setSelectedProductId('');
      loadAllData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
    }
  };

  const handleRemovePopularProduct = async (id) => {
    if (window.confirm('Remove this product from popular products?')) {
      try {
        await deletePopularProduct(id);
        setSuccess('Product removed!');
        loadAllData();
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to remove product');
        console.error(err);
      }
    }
  };

  const getProductName = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <div className="admin-section">
      <h3>📸 Content Cards (Pic + Description)</h3>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Card title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Card description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows="3"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <input
          type="number"
          placeholder="Display position"
          value={form.display_position}
          onChange={(e) => setForm({ ...form, display_position: parseInt(e.target.value) })}
        />
        <select
          value={form.position_type}
          onChange={(e) => setForm({ ...form, position_type: e.target.value })}
        >
          <option value="before_categories">Before Browse by Category</option>
          <option value="after_categories">After Browse by Category</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} Content Card</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                title: '',
                description: '',
                image_url: '',
                display_position: 0,
                position_type: 'after_categories',
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* BEFORE POPULAR PRODUCTS SECTION - DRAGGABLE */}
          <div 
            className="cards-section draggable-zone"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnContentCard(e, 'before')}
            style={{ 
              border: draggedItem?.id ? '2px dashed var(--accent-color)' : '1px solid var(--border-color)',
              background: draggedItem?.id ? 'rgba(196, 165, 99, 0.05)' : '#fafafa'
            }}
          >
            <h4>📍 Before Popular Products - Inspiration Cards ({beforeCards.length}) 🔄</h4>
            {beforeCards.length === 0 ? (
              <p style={{ color: '#999' }}>No cards in this position - drag cards here</p>
            ) : (
              <div className="drag-drop-list">
                {beforeCards.map((card, idx) => (
                  <div 
                    key={card.id} 
                    className="draggable-item item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, card, 'content_card')}
                    style={{
                      opacity: draggedItem?.id === card.id ? 0.5 : 1,
                      cursor: 'move'
                    }}
                  >
                    <span className="drag-handle">☰</span>
                    <div className="item-info">
                      <h5>#{idx + 1} - {card.title}</h5>
                      <p>{card.description}</p>
                      {card.image_url && (
                        <small><a href={card.image_url} target="_blank" rel="noopener noreferrer">View Image</a></small>
                      )}
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(card)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(card.id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AFTER POPULAR PRODUCTS SECTION - DRAGGABLE */}
          <div 
            className="cards-section draggable-zone"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnContentCard(e, 'after')}
            style={{ 
              border: draggedItem?.id ? '2px dashed var(--accent-color)' : '1px solid var(--border-color)',
              background: draggedItem?.id ? 'rgba(196, 165, 99, 0.05)' : '#fafafa'
            }}
          >
            <h4>📍 After Popular Products - Inspiration Cards ({afterCards.length}) 🔄</h4>
            {afterCards.length === 0 ? (
              <p style={{ color: '#999' }}>No cards in this position - drag cards here</p>
            ) : (
              <div className="drag-drop-list">
                {afterCards.map((card, idx) => (
                  <div 
                    key={card.id} 
                    className="draggable-item item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, card, 'content_card')}
                    style={{
                      opacity: draggedItem?.id === card.id ? 0.5 : 1,
                      cursor: 'move'
                    }}
                  >
                    <span className="drag-handle">☰</span>
                    <div className="item-info">
                      <h5>#{idx + 1} - {card.title}</h5>
                      <p>{card.description}</p>
                      {card.image_url && (
                        <small><a href={card.image_url} target="_blank" rel="noopener noreferrer">View Image</a></small>
                      )}
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEdit(card)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(card.id)} className="btn-delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* POPULAR PRODUCTS SECTION - DRAGGABLE */}
          <div className="cards-section">
            <h4>⭐ Popular Products ({popularProducts.length}) 🔄</h4>
            
            <div className="form" style={{ marginBottom: '20px' }}>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">Select a product to add</option>
                {allProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddPopularProduct}>Add Product</button>
            </div>

            {popularProducts.length === 0 ? (
              <p style={{ color: '#999' }}>No popular products added yet - add products to showcase</p>
            ) : (
              <div 
                className="drag-drop-list draggable-zone"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnPopularProduct(e)}
                style={{
                  border: draggedItem?.id ? '2px dashed var(--accent-color)' : '1px solid var(--border-color)',
                  background: draggedItem?.id ? 'rgba(196, 165, 99, 0.05)' : 'white',
                  padding: '15px',
                  borderRadius: '6px'
                }}
              >
                {popularProducts.map((entry, idx) => {
                  const product = allProducts.find(p => p.id === entry.product_id);
                  return (
                    <div 
                      key={entry.id} 
                      className="draggable-item item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, entry, 'popular_product')}
                      style={{
                        opacity: draggedItem?.id === entry.id ? 0.5 : 1,
                        cursor: 'move'
                      }}
                    >
                      <span className="drag-handle">☰</span>
                      <div className="item-info">
                        <h5>#{idx + 1} - {getProductName(entry.product_id)}</h5>
                        {product && product.featured_image && (
                          <small><a href={product.featured_image} target="_blank" rel="noopener noreferrer">View Image</a></small>
                        )}
                      </div>
                      <div className="item-actions">
                        <button
                          onClick={() => handleRemovePopularProduct(entry.id)}
                          className="btn-delete"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentCardsAdmin;
