-- Migration: Add multi-level subcategories (4 levels deep)
-- This enables a 5-level product hierarchy: Category → SubCat1 → SubCat2 → SubCat3 → SubCat4 → Products
-- NOTE: This migration safely handles existing tables and policies

-- ============================================================================
-- LEVEL 1 SUBCATEGORIES (sub of category)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subcategories_level1 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subcategories_level1_category_id 
  ON subcategories_level1(category_id);

ALTER TABLE subcategories_level1 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read access on subcategories_level1" ON subcategories_level1;
DROP POLICY IF EXISTS "Allow all insert access on subcategories_level1" ON subcategories_level1;
DROP POLICY IF EXISTS "Allow all update access on subcategories_level1" ON subcategories_level1;
DROP POLICY IF EXISTS "Allow all delete access on subcategories_level1" ON subcategories_level1;

CREATE POLICY "Allow all read access on subcategories_level1" 
  ON subcategories_level1 FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on subcategories_level1" 
  ON subcategories_level1 FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on subcategories_level1" 
  ON subcategories_level1 FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on subcategories_level1" 
  ON subcategories_level1 FOR DELETE USING (true);

-- ============================================================================
-- LEVEL 2 SUBCATEGORIES (sub of sub category)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subcategories_level2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level1_id UUID NOT NULL REFERENCES subcategories_level1(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subcategories_level2_level1_id 
  ON subcategories_level2(level1_id);

ALTER TABLE subcategories_level2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read access on subcategories_level2" ON subcategories_level2;
DROP POLICY IF EXISTS "Allow all insert access on subcategories_level2" ON subcategories_level2;
DROP POLICY IF EXISTS "Allow all update access on subcategories_level2" ON subcategories_level2;
DROP POLICY IF EXISTS "Allow all delete access on subcategories_level2" ON subcategories_level2;

CREATE POLICY "Allow all read access on subcategories_level2" 
  ON subcategories_level2 FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on subcategories_level2" 
  ON subcategories_level2 FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on subcategories_level2" 
  ON subcategories_level2 FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on subcategories_level2" 
  ON subcategories_level2 FOR DELETE USING (true);

-- ============================================================================
-- LEVEL 3 SUBCATEGORIES (sub of sub of sub category)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subcategories_level3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level2_id UUID NOT NULL REFERENCES subcategories_level2(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subcategories_level3_level2_id 
  ON subcategories_level3(level2_id);

ALTER TABLE subcategories_level3 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read access on subcategories_level3" ON subcategories_level3;
DROP POLICY IF EXISTS "Allow all insert access on subcategories_level3" ON subcategories_level3;
DROP POLICY IF EXISTS "Allow all update access on subcategories_level3" ON subcategories_level3;
DROP POLICY IF EXISTS "Allow all delete access on subcategories_level3" ON subcategories_level3;

CREATE POLICY "Allow all read access on subcategories_level3" 
  ON subcategories_level3 FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on subcategories_level3" 
  ON subcategories_level3 FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on subcategories_level3" 
  ON subcategories_level3 FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on subcategories_level3" 
  ON subcategories_level3 FOR DELETE USING (true);

-- ============================================================================
-- LEVEL 4 SUBCATEGORIES (sub of sub of sub of sub category)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subcategories_level4 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level3_id UUID NOT NULL REFERENCES subcategories_level3(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subcategories_level4_level3_id 
  ON subcategories_level4(level3_id);

ALTER TABLE subcategories_level4 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read access on subcategories_level4" ON subcategories_level4;
DROP POLICY IF EXISTS "Allow all insert access on subcategories_level4" ON subcategories_level4;
DROP POLICY IF EXISTS "Allow all update access on subcategories_level4" ON subcategories_level4;
DROP POLICY IF EXISTS "Allow all delete access on subcategories_level4" ON subcategories_level4;

CREATE POLICY "Allow all read access on subcategories_level4" 
  ON subcategories_level4 FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on subcategories_level4" 
  ON subcategories_level4 FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on subcategories_level4" 
  ON subcategories_level4 FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on subcategories_level4" 
  ON subcategories_level4 FOR DELETE USING (true);

-- ============================================================================
-- UPDATE PRODUCTS TABLE
-- ============================================================================
-- Add foreign keys to new subcategory levels (make existing ones nullable)
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS level1_id UUID REFERENCES subcategories_level1(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS level2_id UUID REFERENCES subcategories_level2(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS level3_id UUID REFERENCES subcategories_level3(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS level4_id UUID REFERENCES subcategories_level4(id) ON DELETE SET NULL;

-- Create indexes on product foreign keys
CREATE INDEX IF NOT EXISTS idx_products_level1_id ON products(level1_id);
CREATE INDEX IF NOT EXISTS idx_products_level2_id ON products(level2_id);
CREATE INDEX IF NOT EXISTS idx_products_level3_id ON products(level3_id);
CREATE INDEX IF NOT EXISTS idx_products_level4_id ON products(level4_id);

-- Note: Existing subcategory_id and category_id columns in products are kept for backward compatibility
-- You can migrate data to the new structure as needed
