-- Migration: Add product characteristics table for detailed product specs
-- This enables products to have multiple specifications like Thermal transmittance, Acoustic insulation, etc.

-- ============================================================================
-- CREATE PRODUCT CHARACTERISTICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_characteristics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_characteristics_product_id 
  ON product_characteristics(product_id);

ALTER TABLE product_characteristics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read access on product_characteristics" ON product_characteristics;
DROP POLICY IF EXISTS "Allow all insert access on product_characteristics" ON product_characteristics;
DROP POLICY IF EXISTS "Allow all update access on product_characteristics" ON product_characteristics;
DROP POLICY IF EXISTS "Allow all delete access on product_characteristics" ON product_characteristics;

CREATE POLICY "Allow all read access on product_characteristics" 
  ON product_characteristics FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on product_characteristics" 
  ON product_characteristics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on product_characteristics" 
  ON product_characteristics FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on product_characteristics" 
  ON product_characteristics FOR DELETE USING (true);

-- ============================================================================
-- UPDATE PRODUCTS TABLE (if needed)
-- ============================================================================
-- Products table already has the necessary fields
-- Make sure level4_id is available from the multi-level migration
-- If running this separately, uncomment below:

-- ALTER TABLE products 
--   ADD COLUMN IF NOT EXISTS level4_id UUID REFERENCES subcategories_level4(id) ON DELETE SET NULL,
--   ADD COLUMN IF NOT EXISTS level1_id UUID REFERENCES subcategories_level1(id) ON DELETE SET NULL,
--   ADD COLUMN IF NOT EXISTS level2_id UUID REFERENCES subcategories_level2(id) ON DELETE SET NULL,
--   ADD COLUMN IF NOT EXISTS level3_id UUID REFERENCES subcategories_level3(id) ON DELETE SET NULL;

-- CREATE INDEX IF NOT EXISTS idx_products_level4_id ON products(level4_id);
