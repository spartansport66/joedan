-- Migration: Add content cards and popular products tables

-- ============================================================================
-- CREATE CONTENT CARDS TABLE (for pic + description sections)
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_position INTEGER DEFAULT 0,
  position_type TEXT DEFAULT 'after_categories', -- 'before_categories' or 'after_categories'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_cards_position 
  ON content_cards(position_type, display_position);

ALTER TABLE content_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read access on content_cards" ON content_cards;
DROP POLICY IF EXISTS "Allow all insert access on content_cards" ON content_cards;
DROP POLICY IF EXISTS "Allow all update access on content_cards" ON content_cards;
DROP POLICY IF EXISTS "Allow all delete access on content_cards" ON content_cards;

CREATE POLICY "Allow all read access on content_cards" 
  ON content_cards FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on content_cards" 
  ON content_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on content_cards" 
  ON content_cards FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on content_cards" 
  ON content_cards FOR DELETE USING (true);

-- ============================================================================
-- CREATE POPULAR PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS popular_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_popular_products_product_id 
  ON popular_products(product_id);
CREATE INDEX IF NOT EXISTS idx_popular_products_order 
  ON popular_products(display_order);

ALTER TABLE popular_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read access on popular_products" ON popular_products;
DROP POLICY IF EXISTS "Allow all insert access on popular_products" ON popular_products;
DROP POLICY IF EXISTS "Allow all update access on popular_products" ON popular_products;
DROP POLICY IF EXISTS "Allow all delete access on popular_products" ON popular_products;

CREATE POLICY "Allow all read access on popular_products" 
  ON popular_products FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on popular_products" 
  ON popular_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on popular_products" 
  ON popular_products FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on popular_products" 
  ON popular_products FOR DELETE USING (true);
