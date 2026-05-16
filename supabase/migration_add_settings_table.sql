-- Migration: Add settings table for configurable titles and hero image
-- This allows the admin to change section headings and manage the hero section

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings
CREATE POLICY "Allow all read access on settings" 
  ON settings FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on settings" 
  ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on settings" 
  ON settings FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on settings" 
  ON settings FOR DELETE USING (true);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('hero_image', '', 'URL of the hero section background image'),
  ('hero_title', 'Premium Products For Your Lifestyle', 'Hero section main title'),
  ('hero_subtitle', 'Discover the finest collection of curated products', 'Hero section subtitle'),
  ('category_section_title', 'Browse by Category', 'Title for the categories section'),
  ('category_section_subtitle', 'Explore our collection of premium categories', 'Subtitle for the categories section'),
  ('product_section_title', 'Our Products', 'Title for the products section'),
  ('product_section_subtitle', 'Carefully curated selection of premium quality items', 'Subtitle for the products section')
ON CONFLICT (key) DO NOTHING;
