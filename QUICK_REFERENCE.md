# Quick Reference - New Features Queries & APIs

## 🎯 Super Quick Commands

### Update Hero Image
```sql
UPDATE settings SET value = 'https://example.com/image.jpg' WHERE key = 'hero_image';
```

### Update Category Title
```sql
UPDATE settings SET value = 'My Categories' WHERE key = 'category_section_title';
```

### Add Content Card (After Browse by Category)
```sql
INSERT INTO content_cards (title, description, image_url, display_position, position_type)
VALUES ('Card Title', 'Description here', 'https://example.com/img.jpg', 0, 'after_categories');
```

### Add Popular Product
```sql
INSERT INTO popular_products (product_id, display_order)
VALUES ('product-uuid', 0);
```

---

## 📊 API Endpoints Summary

### Settings
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/settings` | Get all settings |
| GET | `/api/settings/:key` | Get specific setting |
| PUT | `/api/settings/:key` | Update setting |
| POST | `/api/settings` | Create new setting |
| DELETE | `/api/settings/:key` | Delete setting |

### Content Cards
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/content-cards` | Get all cards |
| POST | `/api/content-cards` | Create card |
| PUT | `/api/content-cards/:id` | Update card |
| DELETE | `/api/content-cards/:id` | Delete card |

### Popular Products
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/popular-products` | Get all popular products |
| POST | `/api/popular-products` | Add product to popular |
| PUT | `/api/popular-products/:id` | Update display order |
| DELETE | `/api/popular-products/:id` | Remove from popular |

---

## 🔧 Most Common Operations

### 1. Set Up Hero Section
```sql
-- Set hero image
UPDATE settings SET value = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200' 
WHERE key = 'hero_image';

-- Set hero title
UPDATE settings SET value = 'Welcome to Our Store' 
WHERE key = 'hero_title';

-- Set hero subtitle
UPDATE settings SET value = 'Premium products for your lifestyle' 
WHERE key = 'hero_subtitle';
```

### 2. Add Content Cards
```sql
-- Before Browse by Category
INSERT INTO content_cards (title, description, image_url, display_position, position_type)
VALUES (
  'Featured Collection',
  'Browse our latest and greatest collection of premium items',
  'https://example.com/featured.jpg',
  0,
  'before_categories'
);

-- After Browse by Category
INSERT INTO content_cards (title, description, image_url, display_position, position_type)
VALUES (
  'Special Offer',
  'Get up to 50% off on selected items this week only',
  'https://example.com/sale.jpg',
  0,
  'after_categories'
);
```

### 3. Add Multiple Popular Products
```sql
INSERT INTO popular_products (product_id, display_order) VALUES
('product-id-1', 0),
('product-id-2', 1),
('product-id-3', 2),
('product-id-4', 3);
```

### 4. Get All Data for Frontend
```sql
-- Get all settings
SELECT * FROM settings;

-- Get all content cards
SELECT * FROM content_cards ORDER BY position_type, display_position;

-- Get all popular products with product info
SELECT pp.*, p.name, p.featured_image 
FROM popular_products pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.display_order;
```

---

## 🧪 Browser Console Commands

Paste these directly into your browser console:

### Get All Settings
```javascript
fetch('http://localhost:5000/api/settings').then(r => r.json()).then(d => console.log(d))
```

### Get All Content Cards
```javascript
fetch('http://localhost:5000/api/content-cards').then(r => r.json()).then(d => console.log(d))
```

### Get All Popular Products
```javascript
fetch('http://localhost:5000/api/popular-products').then(r => r.json()).then(d => console.log(d))
```

### Create Content Card
```javascript
fetch('http://localhost:5000/api/content-cards', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    title: 'My Card',
    description: 'Card description',
    image_url: 'https://example.com/img.jpg',
    display_position: 0,
    position_type: 'after_categories'
  })
}).then(r => r.json()).then(d => console.log(d))
```

### Update Setting
```javascript
fetch('http://localhost:5000/api/settings/hero_image', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({value: 'https://example.com/hero.jpg'})
}).then(r => r.json()).then(d => console.log(d))
```

---

## 📋 Data Structures

### Settings Object
```json
{
  "id": "uuid",
  "key": "hero_image",
  "value": "https://example.com/image.jpg",
  "description": "Hero section background image",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Content Card Object
```json
{
  "id": "uuid",
  "title": "Card Title",
  "description": "Card description text",
  "image_url": "https://example.com/image.jpg",
  "display_position": 0,
  "position_type": "after_categories",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Popular Product Object
```json
{
  "id": "uuid",
  "product_id": "product-uuid",
  "display_order": 0,
  "products": {
    "id": "product-uuid",
    "name": "Product Name",
    "featured_image": "https://example.com/product.jpg",
    "details": "Product details"
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## ✅ Common Tasks Cheat Sheet

### Task: Update Hero Image
**SQL:**
```sql
UPDATE settings SET value = 'YOUR_URL_HERE' WHERE key = 'hero_image';
```

**API:** `PUT /api/settings/hero_image` with `{ "value": "URL" }`

---

### Task: Add Content Card
**SQL:**
```sql
INSERT INTO content_cards (title, description, image_url, display_position, position_type)
VALUES ('Title', 'Description', 'https://url.jpg', 0, 'after_categories');
```

**API:** `POST /api/content-cards` with full card object

---

### Task: Reorder Popular Products
**SQL:**
```sql
UPDATE popular_products SET display_order = 1 WHERE id = 'card-uuid';
```

**API:** `PUT /api/popular-products/id` with `{ "display_order": 1 }`

---

### Task: Remove Content Card
**SQL:**
```sql
DELETE FROM content_cards WHERE id = 'card-uuid';
```

**API:** `DELETE /api/content-cards/id`

---

### Task: Check What's Displayed
**SQL:**
```sql
-- Content cards before category
SELECT * FROM content_cards WHERE position_type = 'before_categories' ORDER BY display_position;

-- Content cards after category
SELECT * FROM content_cards WHERE position_type = 'after_categories' ORDER BY display_position;

-- Popular products
SELECT * FROM popular_products ORDER BY display_order;
```

**API:** `GET /api/content-cards` and `GET /api/popular-products`

---

## 🚀 Frontend Testing

### Test Hero Updates
1. Go to Admin → Settings
2. Update `hero_image` with URL
3. Refresh homepage
4. Hero should display image

### Test Content Cards
1. Go to Admin → Content Cards
2. Add card with position `after_categories`
3. Refresh homepage
4. Card appears after Browse by Category

### Test Popular Products
1. Go to Admin → Popular Products
2. Select products to feature
3. Refresh homepage
4. Section appears at bottom

---

## 📞 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad request | Check your data format |
| 404 | Not found | Check the ID/key exists |
| 500 | Server error | Check backend logs |

---

## 💡 Pro Tips

1. **Display positions**: Use 0, 1, 2... for ordering multiple items
2. **Position types**: `before_categories` or `after_categories` only
3. **Image URLs**: Must be publicly accessible (use full URLs, not relative paths)
4. **Bulk operations**: SQL is faster for multiple inserts
5. **Testing**: Use browser console to test API without code

---

## 📝 SQL Patterns

### Pattern: Get Cards Sorted by Position
```sql
SELECT * FROM content_cards 
WHERE position_type = 'after_categories'
ORDER BY display_position;
```

### Pattern: Get Popular Products with Full Info
```sql
SELECT pp.id, pp.display_order, p.* 
FROM popular_products pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.display_order;
```

### Pattern: Count Items by Type
```sql
SELECT position_type, COUNT(*) as count 
FROM content_cards 
GROUP BY position_type;
```

### Pattern: Find Max Display Order
```sql
SELECT MAX(display_position) FROM content_cards 
WHERE position_type = 'after_categories';
```

---

## 🔗 Files to Reference

- **SQL Queries**: `supabase/QUERIES_FOR_NEW_FEATURES.sql`
- **JS API Examples**: `API_EXAMPLES.js`
- **Architecture**: `ARCHITECTURE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **Testing Guide**: `TESTING_GUIDE.md`

---

## ⚡ Speed Commands

```bash
# Test hero image update (SQL)
UPDATE settings SET value = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200' WHERE key = 'hero_image';

# Add card after category (SQL)
INSERT INTO content_cards (title, description, image_url, display_position, position_type) VALUES ('Special', 'Exclusive offer', 'https://example.com/img.jpg', 0, 'after_categories');

# Add popular product (SQL)
INSERT INTO popular_products (product_id, display_order) VALUES ('PRODUCT_UUID_HERE', 0);

# Check all content (SQL)
SELECT * FROM content_cards UNION SELECT 'POPULAR', COUNT(*), NULL, NULL, NULL, NULL FROM popular_products;
```

---

**Last Updated**: May 15, 2026
**Status**: Complete & Ready to Use
