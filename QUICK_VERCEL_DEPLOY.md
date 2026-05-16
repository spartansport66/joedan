# Quick Vercel Deployment Steps

## 🚀 Deploy to Vercel in 5 Minutes

### Prerequisites
- GitHub account with your repository
- Vercel account (free tier available)
- Supabase credentials (URL and JWT key)

---

## Frontend Deployment (React)

### Step 1: Deploy Frontend
```bash
# Push to GitHub if not already done
git add .
git commit -m "Add Vercel deployment config"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"New Project"**
3. Select your GitHub repository
4. Set **Root Directory** to `client/`
5. Set **Framework** to React
6. Click **"Deploy"**

---

## Backend Deployment (Express)

### Step 1: Deploy Backend
1. In Vercel Dashboard, click **"New Project"** again
2. Select **same GitHub repository**
3. Set **Root Directory** to `server/`
4. Select **"Other"** as framework
5. Add Environment Variables:
   ```
   SUPABASE_URL = your_supabase_url
   SUPABASE_KEY = your_supabase_jwt_key
   FRONTEND_URL = https://your-frontend-project.vercel.app
   ```
6. Click **"Deploy"**

### Step 2: Get Backend URL
After deployment:
- Go to backend project → **"Deployments"** → latest deployment
- Copy the URL: `https://your-backend.vercel.app`

---

## Update Frontend with Backend URL

### Step 1: Add Backend URL to Frontend
1. Go to frontend project in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add/Update:
   ```
   REACT_APP_API_URL = https://your-backend.vercel.app/api
   ```
4. Click **"Deployments"** → **three dots on latest** → **"Redeploy"**

---

## Verify Deployment

### Frontend
- Visit: `https://your-frontend.vercel.app`
- Should see your e-commerce site

### Backend
- Visit: `https://your-backend.vercel.app/health`
- Should return: `{"status":"ok","timestamp":"..."}`

### API Test
- Visit: `https://your-backend.vercel.app/api/categories`
- Should return JSON with categories from Supabase

---

## Environment Variables Needed

### Backend Environment Variables
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_jwt_key_here
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

---

## Troubleshooting

### Issue: Build fails on Vercel
**Solution:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are listed in package.json
- Try removing node_modules and package-lock.json locally, then push again

### Issue: CORS errors in browser console
**Solution:**
- Update FRONTEND_URL in backend environment variables
- Make sure it matches your actual frontend URL
- Redeploy backend

### Issue: API returns 404
**Solution:**
- Verify REACT_APP_API_URL is set correctly
- Check backend deployment health
- Ensure Supabase credentials are valid

### Issue: Supabase connection fails
**Solution:**
- Verify SUPABASE_URL and SUPABASE_KEY in backend env vars
- Check Supabase dashboard for active project
- Test connection locally first

---

## Custom Domain (Optional)

### Add Custom Domain to Frontend
1. Frontend project → **"Settings"** → **"Domains"**
2. Add your domain
3. Follow DNS instructions
4. Takes 5-15 minutes to propagate

### Add Custom Domain to Backend
1. Backend project → **"Settings"** → **"Domains"**
2. Same process as frontend

---

## Monitoring & Updates

### Enable Auto-Deployments
- Push to GitHub main branch
- Vercel automatically deploys both frontend and backend

### View Logs
- Vercel Dashboard → Project → **"Deployments"** → Latest → **"Logs"**

### Rollback
- Click three dots on previous deployment → **"Promote to Production"**

---

## Commands for Local Testing

```bash
# Build frontend
cd client && npm run build

# Start backend
cd server && npm start

# Verify build
cd client && npm run build && npm start
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev

---

**Status**: ✅ Ready for production deployment
**Last Updated**: May 16, 2026
