#!/bin/bash

# Deploy Script for Svelte Book
# Deploys to GitHub Pages, Vercel, and Netlify

set -e

echo "🚀 Starting deployment..."

# Build
echo "📦 Building..."
npm run build

# Deploy to GitHub Pages
echo "🔗 Deploying to GitHub Pages..."
npx gh-pages -d docs/.vitepress/dist

# Deploy to Vercel (if configured)
if command -v vercel &> /dev/null; then
  echo "⚡ Deploying to Vercel..."
  vercel --prod
fi

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your book is now available at:"
echo "   - GitHub Pages: https://yourusername.github.io/svelte-book/"
echo "   - Vercel: https://svelte-book.vercel.app"
