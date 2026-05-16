-- Migration: Add pic2_url field to products for quick second image
-- This allows products to have a main featured image and a second image (Pic 2)

ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS pic2_url TEXT;

-- No new indexes needed since this is a simple column
-- RLS policies already exist for products table
