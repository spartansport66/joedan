# Database Migration Instructions

Your **pic2_url** field is not in the database yet. Follow these steps to add it and all required fields:

## Step 1: Update Products Table in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Create a new query
5. Copy and paste the SQL from `supabase/migration_update_products_table.sql`
6. Click **Run** (or press Ctrl+Enter)

## Step 2: Verify the Changes

After running the migration, verify the products table has these new columns:
- `level1_id` ✓
- `level2_id` ✓
- `level3_id` ✓
- `level4_id` ✓
- `pic2_url` ✓

You can verify by:
1. Going to the **Table Editor** in Supabase
2. Clicking on the `products` table
3. Checking the column list on the right side

## Step 3: Restart Your Backend

After the migration runs successfully:

```bash
# In the server directory
cd server
npm start
```

## Step 4: Test in the Admin Panel

1. Navigate to the Admin Panel → Products tab
2. Try adding or updating a product with Pic 2 (second image)
3. The Pic 2 field should now save correctly to the database

## Migration Files (in order of execution)

If you need to run other migrations as well:

1. **migration_add_multi_level_subcategories.sql** - Creates the 4-level category hierarchy
2. **migration_update_products_table.sql** - Adds pic2_url and links to levels (NEW - run this now!)
3. **migration_add_product_images.sql** - Creates the product_images table for gallery support
4. **migration_add_product_characteristics.sql** - Creates product specifications table
5. **migration_add_settings_table.sql** - Creates dynamic site configuration table

## Troubleshooting

If you get an error like "table subcategories_level1 does not exist":
- Run **migration_add_multi_level_subcategories.sql** first, then retry migration_update_products_table.sql

If pic2 still doesn't save after the migration:
- Clear your browser cache (Ctrl+Shift+Delete)
- Restart both frontend and backend servers
