# Database Migration Guide - Execute in Order

This guide will help you set up your database to support the 5-level product hierarchy with images and characteristics.

## Prerequisites
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `aywaiyzfzcrkremalqaq`
3. Navigate to **SQL Editor**

## Migration Execution Order

Execute these migrations **ONE BY ONE** in the Supabase SQL Editor, in this exact order:

### Step 1: Multi-Level Subcategories Migration
**Location:** `supabase/migration_add_multi_level_subcategories.sql`

This creates the 4-level subcategory hierarchy:
- `subcategories_level1` - Sub of category
- `subcategories_level2` - Sub of sub category  
- `subcategories_level3` - Sub of sub of sub category
- `subcategories_level4` - Sub of sub of sub of sub category

And adds `level1_id`, `level2_id`, `level3_id`, `level4_id` to products table.

**How to execute:**
1. Copy the entire content of `migration_add_multi_level_subcategories.sql`
2. Paste into Supabase SQL Editor
3. Click **Run** button (or Ctrl+Enter)
4. Wait for success message

### Step 2: Product Images Migration  
**Location:** `supabase/migration_add_product_images.sql`

This creates the `product_images` table for multi-image product galleries and renames `image` to `featured_image` in products table.

**How to execute:**
1. Copy the entire content of `migration_add_product_images.sql`
2. Paste into Supabase SQL Editor
3. Click **Run** button
4. Wait for success message

### Step 3: Product Characteristics Migration
**Location:** `supabase/migration_add_product_characteristics.sql`

This creates the `product_characteristics` table for product specs (Thermal transmittance, Acoustic insulation, etc.)

**How to execute:**
1. Copy the entire content of `migration_add_product_characteristics.sql`
2. Paste into Supabase SQL Editor
3. Click **Run** button
4. Wait for success message

## Database Schema After Migrations

### Tables Created:
```
✓ categories
✓ subcategories (legacy)
✓ subcategories_level1
✓ subcategories_level2
✓ subcategories_level3
✓ subcategories_level4
✓ products (with level1_id, level2_id, level3_id, level4_id fields)
✓ product_images
✓ product_characteristics
✓ settings (if migration_add_settings_table.sql was run)
```

### Product Hierarchy Structure:
```
categories
  └─ subcategories_level1
      └─ subcategories_level2
          └─ subcategories_level3
              └─ subcategories_level4
                  └─ products
                      ├─ product_images (multiple per product)
                      └─ product_characteristics (specs)
```

## Verification Steps

After all migrations are complete, verify in Supabase SQL Editor:

```sql
-- Check all tables exist
SELECT tablename FROM pg_tables WHERE schemaname='public';

-- Check product has level4_id column
SELECT column_name FROM information_schema.columns 
WHERE table_name='products';

-- Check subcategories_level4 exists
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_name='subcategories_level4';
```

## Testing the Flow

Once migrations are complete:

1. **Start the backend:**
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend:**
   ```bash
   cd client
   npm start
   ```

3. **Add test data through the admin panel:**
   - Click "Admin" button
   - Use Categories tab to add test categories
   - Use Level1-4 tabs to create hierarchy
   - Use Products tab to add products linked to Level4
   - Upload product images and characteristics

4. **Navigate the frontend:**
   - Select a category → Level1 → Level2 → Level3 → Level4 → Products
   - Click a product to see images and characteristics

## Troubleshooting

### Migration fails with "table already exists"
This is normal! The migrations use `IF NOT EXISTS` clauses. Just run it again - it won't duplicate tables.

### Products don't show after Level4
1. Verify migrations ran successfully
2. Check Admin Panel > Products tab to ensure you have products with `level4_id` set
3. Check browser console for API errors

### Images not showing
1. Verify `migration_add_product_images.sql` was executed
2. Check Admin Panel > Products tab - upload images for your products
3. Click a product to open ProductDetail modal

### Characteristics not showing  
1. Verify `migration_add_product_characteristics.sql` was executed
2. Click a product in admin panel to add characteristics
3. The characteristics will show in the ProductDetail modal

## Next Steps After Migration

1. Execute all migrations above
2. Add sample data through Admin Panel
3. Test the complete navigation flow
4. Deploy to production

---

**Status Check:** All migrations ready. Execute them in order above! 🚀
