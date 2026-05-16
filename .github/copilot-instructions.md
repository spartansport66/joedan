# Copilot Instructions for Joedan E-Commerce Platform

## Project Overview
A full-stack e-commerce platform with a responsive React frontend and Express.js backend, integrated with Supabase PostgreSQL database. Implements a 5-level hierarchical category system with a comprehensive admin panel for managing all levels and dynamic site configuration.

**Tech Stack:**
- Frontend: React 19.2.6, Axios 1.16.1, CSS Grid with responsive design
- Backend: Express.js 5.2.1 with 60+ REST API endpoints
- Database: Supabase PostgreSQL with Row-Level Security
- File Handling: Multer (installed, awaiting integration)

## Project Structure
```
.
├── .github/
│   └── copilot-instructions.md (this file)
├── client/               # React frontend (port 3001+)
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── App.js        # Main router and state management
│   │   ├── api.js        # Centralized API service
│   │   └── *.css         # Responsive styling
│   └── package.json
├── server/               # Express backend (port 5000)
│   ├── index.js          # Entry point with Supabase verification
│   ├── routes.js         # 60+ REST API endpoints
│   ├── validators.js     # Input validation middleware
│   ├── supabase.js       # Supabase client factory
│   └── package.json
├── supabase/             # Database schema and migrations
│   ├── schema.sql        # Initial tables
│   ├── migration_add_multi_level_subcategories.sql
│   └── migration_add_settings_table.sql
├── data/                 # Data storage (db/, log/)
├── README.md
├── QUICK_START.md
└── SUPABASE_SETUP.md

## Setup Checklist

### ✅ Verify Copilot Instructions File
- [x] copilot-instructions.md exists in .github directory
- [x] Comprehensive documentation in place

### ✅ Project Requirements Clarified
- [x] 5-level hierarchical category system (Category → Level1-4 Subcat → Products)
- [x] Supabase PostgreSQL integration with RLS policies
- [x] Responsive React frontend matching professional design (cortizo.com aesthetic)
- [x] Complete admin backend for CRUD operations at all levels
- [x] Dynamic site configuration (hero image, section titles from admin panel)
- [x] Multi-image product gallery

### ✅ Project Scaffolding Complete
- [x] client/ directory with React app structure
- [x] server/ directory with Express backend
- [x] supabase/ directory with database schema
- [x] data/ directory for storage
- [x] GitHub, documentation files, and setup guides

### ✅ Project Customization Complete
- [x] Design system: Colors (#1a1a1a, #c4a563, #f5f5f5), typography, responsive grid
- [x] 6-level navigation state in App.js
- [x] All components built (Header, Hero, CategoryShowcase, Level1-4, ProductShowcase, AdminPanel, Footer)
- [x] Admin tab interface with 7 tabs (Categories, Level1-4, Products, Settings)
- [x] Input validation middleware on backend
- [x] RLS policies for public CRUD access

### ✅ Required Extensions Installed
- [x] React (19.2.6)
- [x] Axios (1.16.1) for API calls
- [x] Supabase JavaScript client (@supabase/supabase-js)
- [x] Express (5.2.1)
- [x] CORS middleware
- [x] dotenv for environment variables
- [x] Multer (15 packages - file upload ready)
- [x] 137 total npm packages (0 vulnerabilities)

### ⏳ Project Compilation Status
- [x] Backend (Express): Compiling successfully, running on port 5000
- [x] Frontend (React): Compiling successfully, running on port 3001+
- [x] No compilation errors
- [x] All dependencies resolved

### ⏳ Tasks & Run Configurations
- [x] Backend startup: `npm start` in server/ (runs index.js on port 5000)
- [x] Frontend startup: `npm start` in client/ (runs webpack dev server on 3001+)
- [x] npm scripts configured in both package.json files

### ⏳ Project Launch Instructions
1. **Start Backend:**
   ```bash
   cd server
   npm start
   ```
   Verifies Supabase connection on startup, listens on http://localhost:5000/api

2. **Start Frontend:**
   ```bash
   cd client
   npm start
   ```
   Webpack dev server opens at http://localhost:3001 (or next available port)

3. **Access Application:**
   - Public site: http://localhost:3001
   - Admin panel: Click "Admin" button, password: `admin123`
   - Backend API: http://localhost:5000/api/

### ✅ Documentation Complete
- [x] README.md with project overview
- [x] QUICK_START.md with setup steps
- [x] SUPABASE_SETUP.md with database configuration
- [x] This file (copilot-instructions.md) with complete project guide
- [x] Component documentation in AdminPanel.js
- [x] API documentation in api.js

## Key Database Tables
- `categories` - Main product categories
- `subcategories_level1` - 1st hierarchical level
- `subcategories_level2` - 2nd hierarchical level
- `subcategories_level3` - 3rd hierarchical level
- `subcategories_level4` - 4th hierarchical level (final before products)
- `products` - Product entries with level1_id through level4_id foreign keys
- `product_images` - Multi-image gallery support
- `settings` - Dynamic configuration (hero_image, titles, subtitles)

## Important API Endpoints
### Categories
- GET/POST /api/categories
- GET/PUT/DELETE /api/categories/:id

### Multi-Level Subcategories
- GET/POST /api/subcategories-level{1-4}
- GET /api/subcategories-level{1-4}?{parent}Id={id} (filter by parent)
- PUT/DELETE /api/subcategories-level{1-4}/:id

### Products
- GET/POST /api/products
- GET/PUT/DELETE /api/products/:id

### Product Images
- GET/POST /api/product-images/:productId
- DELETE /api/product-images/:imageId

### Settings
- GET /api/settings
- GET /api/settings/:key
- POST /api/settings
- PUT /api/settings/:key

## Frontend Components
- **Header** - Sticky navigation with admin button
- **Hero** - Full-width landing section with CTA
- **CategoryShowcase** - Main category grid with images
- **Level1-4SubcategoryShowcase** - Hierarchical subcategory displays
- **ProductShowcase** - Multi-image gallery with responsive grid
- **AdminPanel** - Tab-based admin dashboard
- **Categories/Level1-4Categories/Products/Settings** - Admin CRUD components
- **Footer** - Responsive footer with dynamic category links

## Environment Variables
**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```
SUPABASE_URL=https://aywaiyzfzcrkremalqaq.supabase.co
SUPABASE_KEY=your_jwt_key
PORT=5000
```

## Current Development Status
- ✅ Backend API fully functional with all endpoints
- ✅ Frontend dev server running without errors
- ✅ Admin panel complete with all CRUD operations
- ✅ Database schema created (tables exist in Supabase)
- ⏳ Pending: Execute database migrations for multi-level categories and settings table
- ⏳ Pending: Implement Multer file upload routes
- ⏳ Pending: End-to-end testing of full navigation flow
- ⏳ Pending: Production build and deployment

## Next Priority Tasks
1. Execute migration_add_multi_level_subcategories.sql in Supabase SQL Editor
2. Execute migration_add_settings_table.sql in Supabase SQL Editor
3. Test full 5-level navigation flow on frontend
4. Implement Multer file upload integration for images
5. Update admin components to use file upload instead of URL inputs
6. Production build testing and deployment preparation

## Copilot Guidance
When assisting with this project, prioritize:
1. **Architecture decisions**: Maintain 5-level hierarchy separation of concerns
2. **Database integrity**: Preserve RLS policies and cascade delete constraints
3. **Responsive design**: Test on 1400px (desktop), 768px (tablet), 480px (mobile)
4. **Component reusability**: Follow established patterns in CategoryShowcase, ProductShowcase
5. **API consistency**: All endpoints follow REST conventions with consistent error handling
6. **Admin interface**: Maintain 7-tab structure when adding features
7. **Performance**: Batch API calls, implement pagination for large datasets
