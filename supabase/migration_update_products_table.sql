-- Comprehensive migration: Update products table with all required fields
-- This migration combines all necessary schema changes in one go

-- Step 1: Add multi-level category fields if they don't exist
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS level1_id UUID REFERENCES subcategories_level1(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS level2_id UUID REFERENCES subcategories_level2(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS level3_id UUID REFERENCES subcategories_level3(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS level4_id UUID REFERENCES subcategories_level4(id) ON DELETE SET NULL;

-- Step 2: Add pic2_url field if it doesn't exist
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS pic2_url TEXT;

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_level1_id ON products(level1_id);
CREATE INDEX IF NOT EXISTS idx_products_level2_id ON products(level2_id);
CREATE INDEX IF NOT EXISTS idx_products_level3_id ON products(level3_id);
CREATE INDEX IF NOT EXISTS idx_products_level4_id ON products(level4_id);

-- Step 4: Ensure RLS policies are in place (if they're not already)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read access on products" ON products;
DROP POLICY IF EXISTS "Allow all insert access on products" ON products;
DROP POLICY IF EXISTS "Allow all update access on products" ON products;
DROP POLICY IF EXISTS "Allow all delete access on products" ON products;

CREATE POLICY "Allow all read access on products" 
  ON products FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on products" 
  ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on products" 
  ON products FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on products" 
  ON products FOR DELETE USING (true);
