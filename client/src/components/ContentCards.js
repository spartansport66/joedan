import React, { useState, useEffect } from 'react';
import { getContentCards } from '../api';
import './ContentCards.css';

function ContentCards({ position = 'after_categories', title = null }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, [position]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const res = await getContentCards();
      const filtered = res.data?.filter(card => card.position_type === position) || [];
      // Sort by display position
      filtered.sort((a, b) => a.display_position - b.display_position);
      setCards(filtered);
    } catch (err) {
      console.error('Failed to load content cards', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || cards.length === 0) {
    return null;
  }

  return (
    <section className="content-cards-section">
      <div className="content-cards-container">
        {title && <h2 className="section-title">{title}</h2>}
        {cards.map((card, idx) => (
          <div key={card.id} className={`content-card ${idx % 2 === 0 ? 'left-image' : 'right-image'}`}>
            {/* Image Section */}
            <div className="card-image-wrapper">
              {card.image_url ? (
                <img src={card.image_url} alt={card.title} className="card-image" />
              ) : (
                <div className="placeholder-image">📷</div>
              )}
            </div>

            {/* Content Section */}
            <div className="card-content-wrapper">
              <h3 className="card-title">{card.title}</h3>
              {card.description && (
                <p className="card-description">{card.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ContentCards;
