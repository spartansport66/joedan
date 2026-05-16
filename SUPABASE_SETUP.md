# Supabase Setup Instructions

## 1. Get your Supabase credentials

Visit your Supabase project: https://supabase.com/dashboard/project/aywaiyzfzcrkremalqaq

1. Click on **Settings** (gear icon at bottom left)
2. Go to **API** tab
3. Copy:
   - **Project URL** → This is your `SUPABASE_URL`
   - **Anon Key** → This is your `SUPABASE_KEY`

## 2. Update server/.env

Add your Supabase credentials to `server/.env`:

```
PORT=5000
SUPABASE_URL=https://aywaiyzfzcrkremalqaq.supabase.co
SUPABASE_KEY=your_anon_key_here
```

Replace `your_anon_key_here` with the actual Anon Key from step 1.

## 3. Create database tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste the entire contents of `supabase/schema.sql`
4. Click **Run**

This creates the three tables:
- `categories`
- `subcategories`
- `products`

## 4. Start the server

```bash
cd server
npm start
```

The server should now connect to Supabase. You'll see:
```
Server running on port 5000 with Supabase
```

## 5. Test endpoints

- `GET /api/categories` → List all categories
- `POST /api/categories` → Create new category
- `PUT /api/categories/:id` → Update category
- `DELETE /api/categories/:id` → Delete category

Same pattern for `/subcategories` and `/products`.
