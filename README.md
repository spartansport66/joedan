# Joedan - Product Management System

A full-stack application for managing products, categories, and subcategories with React frontend and Express/Supabase backend.

## Project Structure

```
joedan/
├── client/          # React frontend (port 3000)
├── server/          # Express API (port 5000)
├── supabase/        # Database schema
├── data/            # Local data directories
└── README.md        # This file
```

## Tech Stack

- **Frontend**: React 19, Axios
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Anon Key

## Setup Instructions

### 1. Backend Setup

#### Prerequisites
- Node.js 16+ installed
- Supabase project created: https://supabase.com/dashboard/project/aywaiyzfzcrkremalqaq

#### Steps

1. **Clone environment config**
   ```bash
   cd server
   ```

2. **Update `.env` file** with your Supabase credentials:
   ```env
   PORT=5000
   SUPABASE_URL=https://aywaiyzfzcrkremalqaq.supabase.co
   SUPABASE_KEY=<your-anon-key>
   ```
   
   Get your Anon Key from: Supabase Dashboard → Settings → API

3. **Create database tables**
   - Go to Supabase SQL Editor
   - Create new query
   - Run the SQL from `supabase/schema.sql`

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   You should see: `Server running on port 5000 with Supabase`

### 2. Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ../client
   ```

2. **Update `.env` file** (already configured):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   Opens automatically at `http://localhost:3000`

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Subcategories
- `GET /api/subcategories` - List all subcategories
- `POST /api/subcategories` - Create new subcategory
- `PUT /api/subcategories/:id` - Update subcategory
- `DELETE /api/subcategories/:id` - Delete subcategory

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Request/Response Examples

### Create Category
```bash
POST http://localhost:5000/api/categories
Content-Type: application/json

{
  "name": "Electronics",
  "image": "https://example.com/electronics.jpg"
}
```

### Create Subcategory
```bash
POST http://localhost:5000/api/subcategories
Content-Type: application/json

{
  "name": "Smartphones",
  "image": "https://example.com/phones.jpg",
  "category_id": "<category-uuid>"
}
```

### Create Product
```bash
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "iPhone 15",
  "image": "https://example.com/iphone15.jpg",
  "details": "Latest Apple smartphone with A17 Pro chip",
  "category_id": "<category-uuid>",
  "subcategory_id": "<subcategory-uuid>"
}
```

## Frontend Features

- **Categories Tab**: Create, edit, delete categories
- **Subcategories Tab**: Manage subcategories with category references
- **Products Tab**: Full CRUD for products with nested category/subcategory selection
- **Real-time UI**: Automatic refresh after operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Grid layout that adapts to screen size

## Database Schema

### categories
- `id` (uuid, primary key)
- `name` (text, required)
- `image` (text, optional)
- `created_at` (timestamp)

### subcategories
- `id` (uuid, primary key)
- `name` (text, required)
- `image` (text, optional)
- `category_id` (uuid, foreign key)
- `created_at` (timestamp)

### products
- `id` (uuid, primary key)
- `name` (text, required)
- `image` (text, optional)
- `details` (text, optional)
- `category_id` (uuid, foreign key)
- `subcategory_id` (uuid, foreign key)
- `created_at` (timestamp)

## Development

### Running Both Services
Open two terminals:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### Scripts

**Server:**
- `npm start` - Run development server
- `npm run dev` - Run with nodemon (auto-restart)

**Client:**
- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests

## Troubleshooting

### "Cannot connect to Supabase"
- Verify `SUPABASE_KEY` in `server/.env`
- Check if Supabase project is active
- Ensure tables are created in Supabase

### "API endpoint not responding"
- Ensure server is running on port 5000
- Check if `REACT_APP_API_URL` is correct in `client/.env`
- Browser console may have CORS errors (frontend/backend mismatch)

### "Tables not found"
- Run `supabase/schema.sql` in Supabase SQL Editor
- Verify table names match the schema

## Deployment to Vercel

### Quick Deploy (5 minutes)

For detailed deployment instructions, see [QUICK_VERCEL_DEPLOY.md](./QUICK_VERCEL_DEPLOY.md)

#### Overview
- **Frontend**: Deployed to Vercel (React)
- **Backend**: Deployed to Vercel Serverless Functions (Express)
- **Database**: Supabase PostgreSQL (no changes needed)

#### Prerequisites
1. GitHub account with repository pushed
2. Vercel account (free tier available)
3. Supabase credentials (URL and JWT key)

#### Deployment Steps

**1. Deploy Backend**
- Go to https://vercel.com/dashboard
- Click "New Project" → Select your repository
- Set Root Directory to `server/`
- Add Environment Variables:
  - `SUPABASE_URL`: Your Supabase URL
  - `SUPABASE_KEY`: Your Supabase JWT key
- Click "Deploy"
- Copy backend URL after deployment

**2. Deploy Frontend**
- Click "New Project" → Select same repository
- Set Root Directory to `client/`
- Set Framework to "React"
- Add Environment Variables:
  - `REACT_APP_API_URL`: `https://your-backend.vercel.app/api`
- Click "Deploy"

**3. Update Backend with Frontend URL**
- Go to backend project settings
- Add Environment Variable: `FRONTEND_URL` = your frontend URL
- Click "Deployments" → Redeploy

#### Verify Deployment
```bash
# Test frontend
curl https://your-frontend.vercel.app

# Test backend
curl https://your-backend.vercel.app/health

# Test API
curl https://your-backend.vercel.app/api/categories
```

### Environment Variables

**Backend (.env)**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_jwt_key_here
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3001
```

**Frontend (.env)**
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

### Additional Resources
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Comprehensive guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [.env.example](./.env.example) - Environment variables template

### Custom Domain (Optional)
1. Purchase domain
2. In Vercel project → Settings → Domains
3. Add domain and follow DNS configuration
4. Update backend URL if using custom domain

### Troubleshooting
- **API 404 errors**: Verify `REACT_APP_API_URL` matches backend URL
- **CORS errors**: Update `FRONTEND_URL` in backend environment variables
- **Build fails**: Check build logs in Vercel dashboard
- **Supabase connection fails**: Verify credentials in environment variables

## License

MIT

## Contact

For support, check the project dashboard at: https://supabase.com/dashboard/project/aywaiyzfzcrkremalqaq

---

**Deployment Status**: ✅ Ready for Vercel
**Last Updated**: May 16, 2026

