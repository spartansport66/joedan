# Vercel Deployment Checklist

## Pre-Deployment Checklist

### Local Setup
- [ ] Clone project from GitHub
- [ ] Install dependencies: `npm install` in both client/ and server/
- [ ] Copy `.env.example` to `.env` in server/
- [ ] Add Supabase credentials to server/.env
- [ ] Test locally: `npm start` in both directories
- [ ] Verify all API endpoints working
- [ ] Check frontend connects to backend
- [ ] Test admin panel functionality

### GitHub Setup
- [ ] Push all changes to GitHub
- [ ] Main branch is clean and working
- [ ] .gitignore includes node_modules, .env, .vercelignore
- [ ] No large files or secrets in Git history

### Supabase Setup
- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] RLS policies configured
- [ ] API keys generated
- [ ] Connection verified locally

---

## Deployment Checklist

### Step 1: Backend Deployment
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "New Project"
- [ ] Select GitHub repository
- [ ] Set Root Directory to `server/`
- [ ] Add environment variables:
  - [ ] `SUPABASE_URL` = your_supabase_url
  - [ ] `SUPABASE_KEY` = your_jwt_key
  - [ ] `FRONTEND_URL` = (leave blank for now)
  - [ ] `NODE_ENV` = `production`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Note backend URL: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### Step 2: Frontend Deployment
- [ ] Go back to Vercel Dashboard
- [ ] Click "New Project"
- [ ] Select same GitHub repository
- [ ] Set Root Directory to `client/`
- [ ] Set Framework to "React"
- [ ] Set Build Command to `npm run build`
- [ ] Set Output Directory to `build`
- [ ] Add environment variables:
  - [ ] `REACT_APP_API_URL` = (leave blank for now)
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Note frontend URL: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

### Step 3: Update URLs
- [ ] Go to backend project in Vercel
- [ ] Click "Settings" → "Environment Variables"
- [ ] Update `FRONTEND_URL` = your_frontend_url
- [ ] Click "Deployments" → three dots on latest → "Redeploy"
- [ ] Go to frontend project in Vercel
- [ ] Click "Settings" → "Environment Variables"
- [ ] Add `REACT_APP_API_URL` = your_backend_url/api
- [ ] Click "Deployments" → three dots on latest → "Redeploy"

---

## Post-Deployment Verification

### Frontend Tests
- [ ] Visit frontend URL in browser
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Can view categories
- [ ] Can view products
- [ ] Admin panel accessible (password: admin123)
- [ ] No console errors in browser DevTools

### Backend Tests
- [ ] Visit `backend_url/health` → returns {"status":"ok"}
- [ ] Visit `backend_url/api/categories` → returns JSON
- [ ] Visit `backend_url/api/products` → returns JSON
- [ ] API calls include CORS headers
- [ ] No 500 errors in response

### Integration Tests
- [ ] Frontend successfully calls backend API
- [ ] Product images load from Supabase
- [ ] Admin panel can create/edit categories
- [ ] Admin panel can create/edit products
- [ ] Filters work correctly
- [ ] Search functionality works
- [ ] No CORS errors in console

### Database Tests
- [ ] Supabase connection stable
- [ ] Categories visible in database
- [ ] Products visible in database
- [ ] Product images stored correctly
- [ ] Settings table populated

---

## Production Configuration

### Security Checklist
- [ ] Environment variables not exposed in code
- [ ] .env file in .gitignore
- [ ] Supabase RLS policies enabled
- [ ] API rate limiting enabled (optional)
- [ ] HTTPS enabled on all domains
- [ ] CORS properly configured
- [ ] Admin password should be changed from default

### Performance Checklist
- [ ] Frontend build size < 500KB
- [ ] API response times < 1s
- [ ] Images optimized
- [ ] Database indexes created
- [ ] No console warnings or errors

### Monitoring Checklist
- [ ] Vercel Analytics enabled
- [ ] Error logging configured (optional: Sentry)
- [ ] Uptime monitoring enabled (optional)
- [ ] Backup strategy in place
- [ ] Log retention configured

---

## Custom Domain Setup (Optional)

### Frontend Custom Domain
- [ ] Domain purchased or transferred
- [ ] Frontend project → Settings → Domains
- [ ] Add custom domain
- [ ] Follow DNS configuration steps
- [ ] Wait for SSL certificate (5-15 mins)
- [ ] Verify domain resolves

### Backend Custom Domain
- [ ] Backend project → Settings → Domains
- [ ] Add custom domain (e.g., api.yourdomain.com)
- [ ] Follow DNS configuration steps
- [ ] Update frontend `REACT_APP_API_URL` to new domain
- [ ] Verify API accessible at new URL

---

## Post-Launch Tasks

### First Week
- [ ] Monitor for any errors
- [ ] Check Vercel logs daily
- [ ] Verify database performance
- [ ] Test on multiple devices/browsers
- [ ] Check mobile responsiveness
- [ ] Verify analytics data

### First Month
- [ ] Optimize slow API endpoints
- [ ] Configure backups
- [ ] Set up automated monitoring
- [ ] Create incident response plan
- [ ] Document deployment process
- [ ] Set up CI/CD pipelines

### Ongoing Maintenance
- [ ] Monthly security audits
- [ ] Quarterly performance review
- [ ] Regular database backups
- [ ] Update dependencies monthly
- [ ] Monitor error rates
- [ ] Review analytics

---

## Rollback Procedure (If Needed)

### Quick Rollback
1. Go to Vercel Dashboard
2. Select project
3. Click "Deployments"
4. Find previous stable deployment
5. Click three dots menu
6. Select "Promote to Production"

### Full Rollback (Both Frontend & Backend)
1. Rollback frontend (steps above)
2. Rollback backend (steps above)
3. Verify both working
4. Check database for any issues
5. Document what went wrong

---

## Common Issues & Resolutions

### Build Fails
```
Solution: 
- Check build logs in Vercel dashboard
- Clear build cache: Settings → "Clear Cache"
- Retry deployment
```

### API Returns 404
```
Solution:
- Verify backend deployed successfully
- Check REACT_APP_API_URL in frontend
- Verify routes exist in server/routes.js
- Test API directly in browser
```

### CORS Errors
```
Solution:
- Update FRONTEND_URL in backend env vars
- Redeploy backend
- Clear browser cache (Ctrl+Shift+Del)
- Check Origin header in request
```

### Supabase Connection Failed
```
Solution:
- Verify credentials in .env
- Check Supabase project is active
- Verify JWT key is correct (not same as anon key)
- Test connection in Supabase dashboard
```

### Products Don't Display
```
Solution:
- Check products exist in Supabase
- Verify API returns data at /api/products
- Check RLS policies allow SELECT
- Check product images URLs are valid
```

---

## Performance Benchmarks

After deployment, these should be your targets:

- **Frontend Build Time**: < 2 minutes
- **Frontend Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Largest Image**: < 500KB
- **Lighthouse Score**: > 80
- **Core Web Vitals**: Green
- **Uptime**: 99.9%+

---

## Support Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)

### Community Help
- [Vercel Community](https://vercel.com/discussions)
- [Supabase Community](https://discord.supabase.com)
- [Stack Overflow Tags](https://stackoverflow.com/questions/tagged/vercel)

---

## Sign-Off

- [ ] All tests passed
- [ ] Team reviewed deployment
- [ ] Go live approved
- [ ] Launch date: \_\_\_\_\_\_\_\_\_\_\_\_\_

**Deployed by**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Date**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Version**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

**Keep this checklist for future deployments and reference!**
