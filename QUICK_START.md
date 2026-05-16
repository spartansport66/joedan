# Quick Start Guide - Joedan

## Prerequisites
- Node.js 16+
- Supabase account with project: https://supabase.com/dashboard/project/aywaiyzfzcrkremalqaq

## 5-Minute Setup

### Step 1: Backend (5 minutes)

```bash
# Navigate to server
cd server

# Your .env is already configured with:
# PORT=5000
# SUPABASE_URL=https://aywaiyzfzcrkremalqaq.supabase.co
# SUPABASE_KEY=<your-anon-key>

# Install dependencies
npm install

# Start server (should already be running)
npm start
```

**Expected output:**
```
Server running on port 5000 with Supabase
```

### Step 2: Database Tables

1. Go to: https://supabase.com/dashboard/project/aywaiyzfzcrkremalqaq
2. Click **SQL Editor** → **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click **Run**

### Step 3: Frontend (2 minutes)

```bash
# Open new terminal, navigate to client
cd client

# Install dependencies (axios already added)
npm install

# Start frontend
npm start
```

**Opens automatically at:** `http://localhost:3000`

## What You Get

### Three Management Tabs:

1. **Categories**
   - Add categories with optional images
   - Edit/delete existing categories

2. **Subcategories**
   - Create subcategories under categories
   - Organize products by category → subcategory

3. **Products**
   - Full product management
   - Link to category and subcategory
   - Add product images and details

## Common Tasks

### Add a Category
1. Click **Categories** tab
2. Enter name and image URL
3. Click **Add Category**

### Add a Product
1. Click **Products** tab
2. Fill in all fields (name, image, details)
3. Select Category from dropdown
4. Select Subcategory (filtered by category)
5. Click **Add Product**

### Edit an Item
1. Click **Edit** button on any item
2. Modify the fields
3. Click **Update [Item]**

### Delete an Item
1. Click **Delete** button
2. Confirm deletion

## API Usage (Manual Testing)

### Test with cURL or Postman:

```bash
# Get all categories
curl http://localhost:5000/api/categories

# Create category
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics","image":"https://example.com/electronics.jpg"}'

# Get all products
curl http://localhost:5000/api/products
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/categories" | Backend not running. Run `npm start` in server folder |
| "Blank page in browser" | Frontend not running. Run `npm start` in client folder |
| Tables not found error | Run `supabase/schema.sql` in Supabase SQL Editor |
| CORS errors | Both services must be running (backend on 5000, frontend on 3000) |
| Invalid Supabase key | Get fresh Anon Key from Supabase Settings → API |

## File Structure

```
joedan/
├── client/
│   ├── src/
│   │   ├── api.js              # API service
│   │   ├── App.js              # Main app with tabs
│   │   ├── App.css             # App styling
│   │   ├── components/
│   │   │   ├── Categories.js   # Categories tab
│   │   │   ├── Subcategories.js
│   │   │   ├── Products.js
│   │   │   └── *.css           # Component styles
│   │   ├── .env                # Frontend config
│   │   └── index.js
│   └── package.json
│
├── server/
│   ├── index.js                # Express server
│   ├── routes.js               # API routes
│   ├── supabase.js             # Supabase client
│   ├── validators.js           # Input validation
│   ├── .env                    # Backend config
│   └── package.json
│
├── supabase/
│   └── schema.sql              # Database schema
│
└── README.md                   # Full documentation
```

## Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 3000
3. ✅ Database tables created in Supabase
4. 🎯 Start adding data through the web UI!

## Support

- Supabase Dashboard: https://supabase.com/dashboard/project/aywaiyzfzcrkremalqaq
- Full docs: See README.md
