-- Migration: Add product_images table and update products schema
-- This adds support for multiple images per product

-- Create the product_images table
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  display_order integer default 0,
  created_at timestamptz not null default now()
);

-- Create indexes for better query performance
create index if not exists idx_product_images_product_id on product_images(product_id);

-- Rename the current 'image' column to 'featured_image' in products
alter table products rename column image to featured_image;

-- Enable RLS on product_images
alter table product_images enable row level security;

-- RLS Policies for product_images table
create policy "Allow all read access on product_images" on product_images
  for select using (true);

create policy "Allow all insert access on product_images" on product_images
  for insert with check (true);

create policy "Allow all update access on product_images" on product_images
  for update using (true);

create policy "Allow all delete access on product_images" on product_images
  for delete using (true);
