-- ============================================================================
-- SQL QUERIES FOR NEW FEATURES
-- ============================================================================
-- These queries can be run in Supabase SQL Editor to manage new features
-- ============================================================================

-- ============================================================================
-- 1. SETTINGS TABLE QUERIES
-- ============================================================================

-- Get all settings
SELECT * FROM settings;

-- Get specific setting by key
SELECT * FROM settings WHERE key = 'hero_image';
SELECT * FROM settings WHERE key = 'hero_title';
SELECT * FROM settings WHERE key = 'category_section_title';

-- Insert a new setting
INSERT INTO settings (key, value, description) 
VALUES ('custom_setting', 'value', 'Description of setting');

-- Update a setting value
UPDATE settings 
SET value = 'https://example.com/image.jpg', updated_at = now()
WHERE key = 'hero_image';

-- Update multiple settings at once
UPDATE settings 
SET value = 'New Title', updated_at = now()
WHERE key = 'category_section_title';

-- Delete a setting
DELETE FROM settings WHERE key = 'custom_setting';

-- ============================================================================
-- 2. CONTENT CARDS TABLE QUERIES
-- ============================================================================

-- Get all content cards
SELECT * FROM content_cards ORDER BY position_type, display_position;

-- Get content cards before Browse by Category
SELECT * FROM content_cards 
WHERE position_type = 'before_categories'
ORDER BY display_position;

-- Get content cards after Browse by Category
SELECT * FROM content_cards 
WHERE position_type = 'after_categories'
ORDER BY display_position;

-- Get a specific content card by ID
SELECT * FROM content_cards WHERE id = 'card-uuid-here';

-- Insert a new content card
INSERT INTO content_cards (title, description, image_url, display_position, position_type)
VALUES (
  'Special Offer Section',
  'Discover our exclusive premium collection with up to 50% off on selected items',
  'https://example.com/image.jpg',
  0,
  'after_categories'
);

-- Insert content card BEFORE Browse by Category
INSERT INTO content_cards (title, description, image_url, display_position, position_type)
VALUES (
  'Featured Collection',
  'New arrivals handpicked for quality and style',
  'https://example.com/image2.jpg',
  0,
  'before_categories'
);

-- Update a content card
UPDATE content_cards
SET 
  title = 'Updated Title',
  description = 'Updated description text',
  image_url = 'https://example.com/new-image.jpg',
  display_position = 1,
  updated_at = now()
WHERE id = 'card-uuid-here';

-- Update display position (for reordering)
UPDATE content_cards
SET display_position = 2, updated_at = now()
WHERE id = 'card-uuid-here';

-- Delete a content card
DELETE FROM content_cards WHERE id = 'card-uuid-here';

-- Count total content cards
SELECT COUNT(*) as total_cards FROM content_cards;

-- Count content cards by position
SELECT position_type, COUNT(*) as count 
FROM content_cards 
GROUP BY position_type;

-- Get max display position for a position type (to add next card)
SELECT MAX(display_position) as max_position 
FROM content_cards 
WHERE position_type = 'after_categories';

-- ============================================================================
-- 3. POPULAR PRODUCTS TABLE QUERIES
-- ============================================================================

-- Get all popular products with product details
SELECT 
  pp.id,
  pp.product_id,
  pp.display_order,
  p.name,
  p.featured_image,
  p.details,
  pp.created_at
FROM popular_products pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.display_order;

-- Get specific popular product
SELECT * FROM popular_products WHERE id = 'pop-uuid-here';

-- Get all popular product IDs (for checking if product is popular)
SELECT product_id FROM popular_products ORDER BY display_order;

-- Check if a product is popular
SELECT * FROM popular_products WHERE product_id = 'product-uuid-here';

-- Add a product to popular list
INSERT INTO popular_products (product_id, display_order)
VALUES ('product-uuid-here', 0);

-- Add multiple products to popular list
INSERT INTO popular_products (product_id, display_order) VALUES
('product-id-1', 0),
('product-id-2', 1),
('product-id-3', 2);

-- Update display order (reorder popular products)
UPDATE popular_products
SET display_order = 2
WHERE product_id = 'product-uuid-here';

-- Remove a product from popular list
DELETE FROM popular_products WHERE id = 'pop-uuid-here';

-- Remove a product by product_id
DELETE FROM popular_products WHERE product_id = 'product-uuid-here';

-- Count total popular products
SELECT COUNT(*) as total_popular FROM popular_products;

-- Get max display order (for adding next product)
SELECT MAX(display_order) as max_order FROM popular_products;

-- Get popular products sorted by order
SELECT 
  pp.id,
  pp.product_id,
  pp.display_order,
  p.name
FROM popular_products pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.display_order ASC;

-- ============================================================================
-- 4. COMBINED QUERIES (Frontend use cases)
-- ============================================================================

-- Get all settings for frontend initialization
SELECT key, value FROM settings ORDER BY key;

-- Get all content cards grouped by position for frontend
SELECT 
  position_type,
  array_agg(
    json_build_object(
      'id', id,
      'title', title,
      'description', description,
      'image_url', image_url,
      'display_position', display_position
    ) ORDER BY display_position
  ) as cards
FROM content_cards
GROUP BY position_type;

-- Get hero settings specifically
SELECT 
  'hero_image' as hero_image,
  'hero_title' as hero_title,
  'hero_subtitle' as hero_subtitle
FROM settings
WHERE key IN ('hero_image', 'hero_title', 'hero_subtitle');

-- Get category section settings
SELECT * FROM settings 
WHERE key LIKE 'category_section%'
ORDER BY key;

-- Get all popular products with full product info for frontend
SELECT 
  pp.id as popular_id,
  pp.display_order,
  p.*
FROM popular_products pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.display_order;

-- ============================================================================
-- 5. CLEANUP & MAINTENANCE QUERIES
-- ============================================================================

-- Delete all content cards
DELETE FROM content_cards;

-- Delete all popular products
DELETE FROM popular_products;

-- Reset display positions to 0
UPDATE content_cards SET display_position = 0;
UPDATE popular_products SET display_order = 0;

-- Delete orphaned popular products (products that don't exist)
DELETE FROM popular_products 
WHERE product_id NOT IN (SELECT id FROM products);

-- Check for invalid foreign keys
SELECT pp.id, pp.product_id 
FROM popular_products pp
LEFT JOIN products p ON pp.product_id = p.id
WHERE p.id IS NULL;

-- Export all content cards as JSON
SELECT json_agg(row_to_json(t)) 
FROM (SELECT * FROM content_cards ORDER BY position_type, display_position) t;

-- Export all popular products as JSON
SELECT json_agg(row_to_json(t)) 
FROM (
  SELECT pp.*, p.name, p.featured_image 
  FROM popular_products pp
  JOIN products p ON pp.product_id = p.id
  ORDER BY pp.display_order
) t;

-- ============================================================================
-- 6. ANALYTICAL QUERIES
-- ============================================================================

-- Get content cards statistics
SELECT 
  position_type,
  COUNT(*) as total_cards,
  MAX(display_position) as highest_position,
  MIN(display_position) as lowest_position
FROM content_cards
GROUP BY position_type;

-- Get popular products statistics
SELECT 
  COUNT(*) as total_popular,
  MAX(display_order) as max_order,
  MIN(display_order) as min_order,
  COUNT(DISTINCT product_id) as unique_products
FROM popular_products;

-- Check for duplicate product entries in popular
SELECT product_id, COUNT(*) as count
FROM popular_products
GROUP BY product_id
HAVING COUNT(*) > 1;

-- Get display order gaps (to find missing positions)
SELECT display_order
FROM content_cards
WHERE position_type = 'after_categories'
ORDER BY display_order;

-- ============================================================================
-- 7. BULK OPERATIONS
-- ============================================================================

-- Reorder all content cards after deletion
WITH numbered_cards AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY position_type ORDER BY display_position) - 1 as new_position
  FROM content_cards
)
UPDATE content_cards
SET display_position = numbered_cards.new_position
FROM numbered_cards
WHERE content_cards.id = numbered_cards.id;

-- Reorder all popular products after deletion
WITH numbered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY display_order) - 1 as new_order
  FROM popular_products
)
UPDATE popular_products
SET display_order = numbered_products.new_order
FROM numbered_products
WHERE popular_products.id = numbered_products.id;

-- Copy popular products order from one position to another
UPDATE content_cards c1
SET display_position = (
  SELECT display_position FROM content_cards c2 
  WHERE c2.position_type = 'after_categories' 
  ORDER BY display_position LIMIT 1
)
WHERE position_type = 'before_categories';

-- ============================================================================
-- 8. API TEST QUERIES (Simulate API responses)
-- ============================================================================

-- Simulate GET /api/content-cards
SELECT * FROM content_cards 
ORDER BY position_type, display_position;

-- Simulate GET /api/popular-products
SELECT pp.*, p.* FROM popular_products pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.display_order;

-- Simulate GET /api/settings
SELECT key, value, description FROM settings;

-- Simulate GET /api/settings/:key
SELECT * FROM settings WHERE key = 'hero_image' LIMIT 1;

-- ============================================================================
-- 9. DATA VALIDATION QUERIES
-- ============================================================================

-- Check for missing required fields
SELECT * FROM content_cards WHERE title IS NULL OR title = '';
SELECT * FROM popular_products WHERE product_id IS NULL;

-- Check image URL validity (basic check for null/empty)
SELECT id, image_url FROM content_cards WHERE image_url IS NULL OR image_url = '';

-- Check for products with no featured image
SELECT id, name FROM products 
WHERE featured_image IS NULL OR featured_image = '';

-- Verify all popular products have valid references
SELECT pp.id FROM popular_products pp
LEFT JOIN products p ON pp.product_id = p.id
WHERE p.id IS NULL;

-- Check settings table integrity
SELECT key, COUNT(*) as duplicates 
FROM settings 
GROUP BY key 
HAVING COUNT(*) > 1;

-- ============================================================================
-- NOTES FOR MANUAL TESTING
-- ============================================================================
/*

HOW TO TEST IN SUPABASE SQL EDITOR:

1. SETTINGS CONFIGURATION:
   - Add hero image: UPDATE settings SET value = 'https://...' WHERE key = 'hero_image'
   - Update hero title: UPDATE settings SET value = 'Your Title' WHERE key = 'hero_title'
   - Update category title: UPDATE settings SET value = 'Your Category Title' WHERE key = 'category_section_title'

2. CONTENT CARDS:
   - View all cards: SELECT * FROM content_cards ORDER BY position_type, display_position;
   - Add new card: INSERT INTO content_cards (title, description, image_url, display_position, position_type) VALUES (...)
   - Check positioning: SELECT position_type, COUNT(*) FROM content_cards GROUP BY position_type;

3. POPULAR PRODUCTS:
   - View all: SELECT pp.*, p.name FROM popular_products pp JOIN products p ON pp.product_id = p.id ORDER BY display_order;
   - Add products: INSERT INTO popular_products (product_id, display_order) VALUES ('product-id', 0);
   - Remove: DELETE FROM popular_products WHERE id = 'popular-id';

4. VERIFY DATA:
   - All tables have data: SELECT COUNT(*) FROM settings; SELECT COUNT(*) FROM content_cards; SELECT COUNT(*) FROM popular_products;
   - Check relationships: Products referenced in popular_products should exist
   - Settings should have required keys: hero_image, hero_title, category_section_title, etc.

*/
