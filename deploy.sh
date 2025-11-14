#!/bin/bash

# SimHire Deployment Script
# Usage: bash deploy.sh

echo "🚀 Starting SimHire Deployment..."
echo "=================================="

# Navigate to project directory
cd /var/www/simhire || { echo "❌ Directory not found"; exit 1; }

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main || { echo "❌ Git pull failed"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install || { echo "❌ npm install failed"; exit 1; }

# Build production bundle
echo "🔨 Building production bundle..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx || { echo "❌ Nginx restart failed"; exit 1; }

# Verify Nginx status
echo "✅ Checking Nginx status..."
sudo systemctl status nginx --no-pager | head -n 5

echo ""
echo "=================================="
echo "✅ Deployment completed successfully!"
echo "🌐 Site: https://simhire.flx.web.id"
echo "=================================="

# Test the site
echo ""
echo "📊 Testing site response..."
curl -I https://simhire.flx.web.id 2>/dev/null | head -n 1
