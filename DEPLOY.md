# Deployment Configuration

This project can be deployed to multiple platforms automatically.

## Platforms

### 1. GitHub Pages ✅
**Status**: Configured
- Build: `npm run build`
- Output: `docs/.vitepress/dist`
- Branch: `gh-pages`

### 2. Vercel ✅ (Recommended)
**Status**: Auto-deploy on push
1. Go to https://vercel.com
2. Import your GitHub repository
3. Settings:
   - Build Command: `npm run build`
   - Output Directory: `docs/.vitepress/dist`
   - Root Directory: `/`

### 3. Netlify ✅
**Status**: Auto-deploy on push
1. Go to https://netlify.com
2. Import your GitHub repository
3. Settings:
   - Build Command: `npm run build`
   - Publish directory: `docs/.vitepress/dist`

## Quick Deploy

```bash
# Install dependencies
npm install

# Build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## CI/CD Setup

### GitHub Actions (Automatic)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

### Vercel (Automatic)
1. Connect repository at https://vercel.com
2. Auto-deploy enabled by default

### Read the Docs (Alternative)
1. Go to https://readthedocs.org
2. Import repository
3. Auto-build on push
