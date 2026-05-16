# Joedan - Product Management System

A full-stack application for managing products, categories, and subcategories with React frontend and Supabase backend.

## 🚀 Quick Start (NO Backend Server Needed!)

**New Option:** Run React client directly connected to Supabase (no Express server required):

```bash
cd client
npm install
npm start
```

✅ Opens at `http://localhost:3001`
✅ Connects directly to Supabase
✅ All data loads automatically
✅ NO backend server needed!

**For details, see:** [DIRECT_SUPABASE_README.md](DIRECT_SUPABASE_README.md)

---

## Architecture Options

### Option 1: Direct Client-to-Supabase (Recommended for Development)
```
React App (Port 3001) → Supabase → Database
```
- Pros: Simple, one process, faster setup
- Best for: Development, prototyping, simple applications
- See: [DIRECT_SUPABASE_README.md](DIRECT_SUPABASE_README.md)

### Option 2: Full Stack with Express Backend
```
React App (Port 3001) → Express (Port 5000) → Supabase → Database
```
- Pros: Can add backend business logic, authentication, integrations
- Best for: Complex applications, external APIs, custom logic
- See: Setup Instructions below

---

## Project Structure

```
joedan/
├── client/          # React frontend (port 3001)
├── server/          # Express API (port 5000) - Optional
├── supabase/        # Database schema
├── data/            # Local data directories
├── DIRECT_SUPABASE_README.md    # ← READ THIS for new setup!
├── CODE_CHANGES_SUPABASE.md      # Details of code changes
└── README.md        # This file
```

## Tech Stack

- **Frontend**: React 19, Axios, Supabase Client
- **Backend**: Express.js, Node.js (Optional)
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

## Frontend Features

- **Categories Tab**: Create, edit, delete categories
- **Subcategories Tab**: Manage subcategories with category references
- **Products Tab**: Full CRUD for products with nested category/subcategory selection
- **Image Gallery**: Product image loading from Supabase storage/URLs
- **Settings**: Dynamic hero content and section text from Supabase
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

### Direct Client-to-Supabase Setup
This project now supports running the React client without the backend server. The frontend connects directly to Supabase using `@supabase/supabase-js`.

**Steps:**
```bash
cd client
npm install
npm start
```

Open the app in your browser and verify data loads from Supabase.

### Optional Backend Server
The backend server in `server/` is still available for advanced use, but it is not required for the app to display data.

To run the backend optionally:
```bash
cd server
npm install
npm start
```

### Scripts

**Client:**
- `npm install` - Install frontend dependencies
- `npm start` - Run React development server
- `npm run build` - Create production build
- `npm test` - Run tests

**Server (optional):**
- `npm install` - Install backend dependencies
- `npm start` - Run development server
- `npm run dev` - Run with nodemon (auto-restart)

## Troubleshooting

### "Cannot connect to Supabase"
- Verify `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY` in `client/.env`
- Check if the Supabase project is active
- Ensure the required tables exist in Supabase

### "Module '@supabase/supabase-js' not found"
- Run `npm install` inside `client/`
- Close VS Code if file locks prevent npm install
- Re-run `npm install` in a fresh terminal

### "No data appears"
- Open browser DevTools Console for errors
- Confirm network requests go to `supabase.co`
- Inspect the Supabase query result in the browser console

### Optional server-related issues
- If you use the backend, ensure `server` is running on port 5000
- If you do not use the backend, ignore any `localhost:5000` references
- The direct client setup bypasses the backend entirely


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

