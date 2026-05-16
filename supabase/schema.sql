-- Supabase table schema for Joedan

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image text,
  created_at timestamptz not null default now()
);

create table subcategories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image text,
  category_id uuid not null references categories(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  featured_image text,
  details text,
  category_id uuid not null references categories(id) on delete cascade,
  subcategory_id uuid not null references subcategories(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- NEW: Table for multiple product images
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  display_order integer default 0,
  created_at timestamptz not null default now()
);

-- Create indexes for better query performance
create index idx_product_images_product_id on product_images(product_id);
create index idx_subcategories_category_id on subcategories(category_id);
create index idx_products_category_id on products(category_id);
create index idx_products_subcategory_id on products(subcategory_id);

alter table categories enable row level security;
alter table subcategories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;

-- RLS Policies for categories table
create policy "Allow all read access on categories" on categories
  for select using (true);

create policy "Allow all insert access on categories" on categories
  for insert with check (true);

create policy "Allow all update access on categories" on categories
  for update using (true);

create policy "Allow all delete access on categories" on categories
  for delete using (true);

-- RLS Policies for subcategories table
create policy "Allow all read access on subcategories" on subcategories
  for select using (true);

create policy "Allow all insert access on subcategories" on subcategories
  for insert with check (true);

create policy "Allow all update access on subcategories" on subcategories
  for update using (true);

create policy "Allow all delete access on subcategories" on subcategories
  for delete using (true);

-- RLS Policies for products table
create policy "Allow all read access on products" on products
  for select using (true);

create policy "Allow all insert access on products" on products
  for insert with check (true);

create policy "Allow all update access on products" on products
  for update using (true);

create policy "Allow all delete access on products" on products
  for delete using (true);

-- RLS Policies for product_images table
create policy "Allow all read access on product_images" on product_images
  for select using (true);

create policy "Allow all insert access on product_images" on product_images
  for insert with check (true);

create policy "Allow all update access on product_images" on product_images
  for update using (true);

create policy "Allow all delete access on product_images" on product_images
  for delete using (true);
