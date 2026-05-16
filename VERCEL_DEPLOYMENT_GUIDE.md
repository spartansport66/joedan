# Vercel Deployment Guide

## Overview
This guide covers deploying your full-stack Joedan e-commerce platform to Vercel with separate frontend and backend deployments.

## Project Architecture for Vercel

```
Frontend: React (client/) → Deployed to Vercel
Backend: Express.js (server/) → Deployed to Vercel Serverless Functions
Database: Supabase PostgreSQL → Cloud hosted
```

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Push your project to GitHub
3. **Environment Variables**: Prepare your Supabase credentials

## Step 1: Prepare Backend for Serverless Deployment

### Update server/index.js for Serverless

Your Express server needs to export as a module for Vercel serverless functions:

```javascript
// At the top of index.js, keep your existing code but modify the export:

// ... existing imports and middleware ...

// Export for Vercel
module.exports = app;

// Start server only if running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
```

### Verify server/vercel.json Configuration

The `server/vercel.json` is already configured with:
- Node.js runtime
- API routing configuration
- Environment variable placeholders

## Step 2: Deploy Backend to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Create New Project**:
   - Click "New Project"
   - Select your GitHub repository
   - Choose "Other" as framework (not Next.js)
   
3. **Set Root Directory**:
   - In "Root Directory", set it to `server/`
   
4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add the following:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_KEY`: Your Supabase JWT key
     - `NODE_ENV`: `production`

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-backend.vercel.app`

## Step 3: Deploy Frontend to Vercel

1. **Create New Vercel Project for Frontend**:
   - Click "New Project" in Vercel Dashboard
   - Select same GitHub repository
   
2. **Set Configuration**:
   - **Framework**: React
   - **Root Directory**: `client/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

3. **Add Environment Variables**:
   - `REACT_APP_API_URL`: Your backend URL from Step 2
     - Example: `https://your-backend.vercel.app/api`

4. **Deploy**:
   - Click "Deploy"
   - Your frontend will be available at: `https://your-frontend.vercel.app`

## Step 4: Update Backend URL in Frontend

After backend deployment:

1. Go to frontend project settings in Vercel
2. Update `REACT_APP_API_URL` environment variable with actual backend URL
3. Redeploy frontend

## Step 5: Configure CORS in Backend

Your `server/index.js` already has CORS configured, but verify:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

Update with your actual frontend URL after deployment.

## Environment Variables Reference

### Frontend (.env in client/)
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

### Backend (.env in server/)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_jwt_key_here
NODE_ENV=production
PORT=3001
```

## Deployment Files Explained

### Root Level: vercel.json
- Configures root project settings
- Specifies build command
- Sets output directory to client/build
- Rewrites API requests to backend

### Server Level: server/vercel.json
- Configures Express app as serverless function
- Routes all requests to index.js
- Sets up Node.js runtime

### .vercelignore
- Excludes unnecessary files from deployment
- Reduces deployment bundle size

## Common Issues & Solutions

### Issue: API calls fail with CORS error
**Solution**: 
- Update `CORS_ORIGIN` in backend to match frontend URL
- Redeploy backend after updating environment variables

### Issue: Frontend can't reach backend
**Solution**:
- Verify `REACT_APP_API_URL` in frontend environment variables
- Check that backend deployment is successful
- Verify Supabase connection in backend logs

### Issue: Environment variables not loading
**Solution**:
- Restart deployments after adding environment variables
- For frontend: Variables must start with `REACT_APP_` to be exposed
- Check Vercel dashboard for variable confirmation

### Issue: Build fails on Vercel
**Solution**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Ensure Node.js version compatibility (18+)

## Monitoring & Logs

### View Backend Logs
1. Go to backend project in Vercel Dashboard
2. Click "Deployments"
3. Select latest deployment
4. Click "Functions" tab to view logs

### View Frontend Logs
1. Go to frontend project in Vercel Dashboard
2. Click "Deployments"
3. Select latest deployment
4. Scroll to "Build Logs"

## Deployment Workflow

### Automatic Deployments
- Push to main branch → Vercel automatically deploys
- Frontend updates immediately
- Backend updates within 30-60 seconds

### Manual Redeploy
1. Go to Vercel Dashboard
2. Select project
3. Click "Deployments"
4. Click three dots on latest deployment
5. Select "Redeploy"

## Production Checklist

- [ ] Backend deployed with Supabase credentials
- [ ] Frontend deployed with correct API URL
- [ ] Environment variables verified in Vercel dashboard
- [ ] CORS configured for frontend domain
- [ ] Database backups enabled in Supabase
- [ ] Error monitoring set up (optional: Sentry)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics enabled in Vercel
- [ ] API rate limiting configured

## Next Steps

### Set Custom Domain
1. Go to project Settings in Vercel
2. Scroll to "Domains"
3. Add your custom domain
4. Follow DNS configuration steps

### Enable Automatic Preview Deployments
1. Go to project Settings
2. Click "Git"
3. Enable "Preview Deployments"

### Set Up Monitoring
- Vercel provides built-in analytics
- Consider adding Sentry for error tracking
- Set up Supabase logs monitoring

## Rollback Procedure

If deployment breaks:

1. Go to Vercel Dashboard
2. Select project
3. Click "Deployments"
4. Find previous stable deployment
5. Click three dots
6. Select "Promote to Production"

## Useful Vercel Commands (CLI)

```bash
# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Check environment variables
vercel env list
```

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Node.js Guide**: https://vercel.com/docs/runtimes/nodejs
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Supabase Connection**: https://supabase.com/docs

## Project URLs After Deployment

- **Frontend**: https://your-frontend.vercel.app
- **Backend API**: https://your-backend.vercel.app/api
- **Admin Panel**: https://your-frontend.vercel.app?admin=true
- **Database**: Supabase (no changes needed)

---

**Last Updated**: May 16, 2026
**Version**: 1.0
