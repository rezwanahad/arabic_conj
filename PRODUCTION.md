# Production Setup & Deployment Guide

## Current Status

### ✅ What's Ready for Production

1. **Build Process**
   - ✅ `npm run build` successfully produces `/dist` folder
   - ✅ Output: 244KB total (11.2KB CSS, 208KB JS, gzipped to 64KB JS)
   - ✅ Vite production optimizations enabled by default
   - ✅ No build errors or warnings

2. **Assets & Static Files**
   - ✅ favicon.svg
   - ✅ icons.svg
   - ✅ index.html (entry point)
   - ✅ Minified CSS & JavaScript in `/dist/assets`

3. **Code Quality**
   - ✅ oxlint configured and passing
   - ✅ No external dependencies (React, React-DOM only)
   - ✅ localStorage-only (no backend needed)

4. **Git Configuration**
   - ✅ .gitignore properly excludes dist, node_modules, .local files

### ⚠️ What Needs Setup for Deployment

| Item | Status | Priority |
|------|--------|----------|
| Vercel deployment config | ❌ Missing | HIGH — required for Vercel |
| GitHub Actions CI/CD | ❌ Missing | MEDIUM — nice to have |
| Environment variables | ⚠️ None needed currently | LOW — future features |
| CNAME/domain | ❌ Not configured | MEDIUM — before launch |
| SEO/meta tags | ⚠️ Minimal | MEDIUM — improve discoverability |
| Analytics | ❌ Not set up | LOW — optional |
| Error tracking | ❌ Not set up | LOW — optional |

### ❌ Completely Missing

- Deployment automation
- Pre-deployment testing
- Performance monitoring
- Error logging
- User analytics

---

## Quick Deployment Paths

### Option 1: Deploy to Vercel (Recommended)

**Fastest path (~5 minutes):**

1. **Install Vercel CLI** (if not already)
   ```bash
   npm install -g vercel
   ```

2. **Create vercel.json** (auto-detects Vite)
   ```bash
   # Vercel auto-detects Vite, but explicit config helps:
   cat > vercel.json << 'EOF'
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install",
     "env": {}
   }
   EOF
   ```

3. **Deploy**
   ```bash
   cd arabic-verb-trainer
   vercel --prod
   ```
   - Link to GitHub repo (one-time)
   - Future pushes auto-deploy
   - Automatic preview deployments on PRs

4. **Result**
   - Live at: `https://<project>.vercel.app`
   - Custom domain available in Vercel dashboard
   - Auto HTTPS, CDN, auto-scaling

**Pros**:
- ✅ Zero-config (Vite auto-detected)
- ✅ Automatic git integration
- ✅ Free tier sufficient for this app
- ✅ Built-in analytics & monitoring
- ✅ One-click rollbacks

**Cons**:
- Requires Vercel account

### Option 2: Deploy to Netlify

1. **Connect repo to Netlify**
   - Go to netlify.com
   - Select repo
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Result**
   - Auto-deploys on git push
   - Free SSL/HTTPS
   - CDN included

### Option 3: Self-Hosted (Docker/VPS)

If you control the server:

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
```

Then deploy to your server / Docker registry.

---

## Vercel Configuration Details

### vercel.json (Recommended)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "env": {
    "VITE_APP_NAME": "Arabic Verb Trainer"
  },
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "max-age=31536000" }
      ]
    },
    {
      "source": "/",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" }
      ]
    }
  ]
}
```

**What This Does**:
- Tells Vercel to run `npm run build`
- Sets output folder as `dist`
- Caches assets (CSS/JS) for 1 year (content hash changes if content changes)
- No-cache on index.html (users always get latest)

### Environment Variables (If Needed)

Currently **not needed** since app uses localStorage only.

If you add a future backend/API:
```
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=...
```

Set in Vercel dashboard → Settings → Environment Variables.

---

## Pre-Deployment Checklist

### Code Quality
- [ ] `npm run lint` passes
- [ ] No console errors in dev (`npm run dev`)
- [ ] Dark mode works
- [ ] Mobile layout tested (landscape + portrait)

### Functionality
- [ ] Complete one full drill end-to-end
- [ ] Scores persist after page refresh
- [ ] All 10 forms accessible
- [ ] Both past/present tenses work
- [ ] Results screen breakdown is correct

### Build
- [ ] `npm run build` succeeds
- [ ] `npm run preview` works (test build locally)
- [ ] Build size reasonable (~244KB)
- [ ] No missing assets in `/dist`

### SEO/Metadata (Optional)
- [ ] Update `index.html` title: "Arabic Verb Conjugation Trainer"
- [ ] Add meta description
- [ ] Add theme-color for mobile UI

### Security
- [ ] No hardcoded secrets in code
- [ ] No API keys in environment
- [ ] No sensitive data in localStorage comments
- [ ] HTTPS enforced (Vercel does this automatically)

---

## Performance Metrics (Current)

### Build Output
```
dist/index.html                 0.46 kB  (gzipped: 0.30 kB)
dist/assets/index.css          11.21 kB  (gzipped: 2.54 kB)
dist/assets/index.js          208.91 kB  (gzipped: 64.35 kB)
Total                         244.00 kB  (gzipped: 67.19 kB)
```

### Build Time
- ~203ms (very fast)

### Runtime Performance (Estimated)
- First paint: < 500ms (mostly JS parsing)
- Interactive: < 1s
- No third-party scripts
- No external fonts (uses system fonts)

### Optimization Opportunities
1. **Lazy load components** (if adding more features)
2. **Remove unused CSS** (currently minimal)
3. **Code-split by route** (when adding Nahw/Masdar modules)
4. **Preload fonts** (if adding web fonts later)

Currently: No optimizations needed — app is already lean.

---

## Domain Setup (Optional but Recommended)

### Add Custom Domain to Vercel

1. **In Vercel Dashboard**
   - Project Settings → Domains
   - Add domain
   - Update DNS records (Vercel provides)

2. **Example**
   - Domain: `arabi.vercel.app` or custom domain
   - Vercel auto-issues SSL cert
   - Auto-renews

### DNS Records (If Custom Domain)
```
CNAME  example.com  cname.vercel.sh
```
(Vercel provides exact records)

---

## Continuous Deployment (GitHub Actions)

### Optional: Add CI/CD Pipeline

**Create `.github/workflows/deploy.yml`:**

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run preview  # Test the build
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: npx vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
```

**Setup**:
1. Generate Vercel token: vercel.com → Account → Tokens → Create
2. Add to GitHub: Repo → Settings → Secrets → `VERCEL_TOKEN`
3. Push code → auto-deploys

---

## Environment Variables Schema (Future Use)

If you add backend/analytics later:

```env
# .env.production (Vercel fills this)
VITE_API_URL=https://api.example.com
VITE_ENV=production
VITE_ANALYTICS_ID=UA-xxxxx

# .env.development (local)
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

Usage in code:
```js
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Deployment Troubleshooting

### Build fails: "Module not found"
- Delete `/node_modules` and `package-lock.json`
- Run `npm install`
- Run `npm run build`

### App loads but shows blank page
- Check browser console for JS errors
- Verify `index.html` includes `<div id="root"></div>`
- Check vite.config.js plugins are correct

### Styles missing in production
- Verify `src/App.css` is imported in `App.jsx`
- Check CSS variables are used (not hardcoded values)
- Run `npm run preview` to test production build locally

### localStorage not working
- Check browser privacy settings (not blocking storage)
- Verify `STORAGE_KEY = 'drill_scores'` in useScorePersistence.js
- Check localStorage quota (unlikely, only ~1KB used)

### Performance degradation
- Check network tab for large assets
- Verify gzip compression enabled (Vercel does this)
- Look for console warnings about missing fonts

---

## Monitoring & Analytics (Optional)

### Option 1: Vercel Analytics (Built-in)
- Vercel dashboard shows Core Web Vitals automatically
- No code needed
- Free tier included

### Option 2: Google Analytics
1. Create property at google.com/analytics
2. Install package:
   ```bash
   npm install web-vitals
   ```
3. Add to App.jsx:
   ```js
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   getCLS(console.log);  // Or send to Google Analytics
   // etc.
   ```

### Option 3: Sentry (Error Tracking)
1. Create account at sentry.io
2. Install SDK:
   ```bash
   npm install @sentry/react
   ```
3. Initialize in main.jsx:
   ```js
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "https://...",
     environment: process.env.NODE_ENV,
   });
   ```

---

## Post-Launch Checklist

- [ ] Domain is live and HTTPS works
- [ ] Verify localStorage persists across visits
- [ ] Test on mobile (iOS + Android)
- [ ] Share link with test users
- [ ] Monitor Vercel dashboard for errors
- [ ] Set up analytics (if desired)
- [ ] Create feedback form (GitHub issues or email)

---

## Rollback Strategy

If something breaks in production:

### Vercel
- Vercel dashboard → Deployments → Select previous version → Promote

### GitHub
- Revert commit: `git revert <commit-hash>`
- Push to main → auto-deploys

### Manual
- Keep tagged releases: `git tag v1.0.0`
- Redeploy from tag if needed

---

## Cost Estimate

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | Includes 100GB/month bandwidth |
| Custom Domain | ~$10/yr | Optional |
| Analytics | Free (Vercel) | Built-in monitoring |
| **Total** | **~$10/yr** | If using custom domain |

---

## Next Steps (Recommended Order)

1. **Create vercel.json** (5 min)
2. **Test locally with preview** (2 min)
   ```bash
   npm run build
   npm run preview
   ```
3. **Push to GitHub** (if not already)
4. **Deploy to Vercel** (5 min)
5. **Test production URL** (5 min)
6. **Add custom domain** (10 min, optional)
7. **Set up GitHub Actions** (15 min, optional)

**Total time to production: ~15–30 minutes**

---

## Reference

- [Vercel Docs](https://vercel.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- INSTRUCTIONS.md (project spec)
- CLAUDE.md (dev guidelines)
- TECHNICAL.md (architecture)
