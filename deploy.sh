#!/bin/bash

# Pluggist Deployment Script
# Deploy to Cloudflare Workers with GitHub integration

set -e

echo "🚀 Starting Pluggist deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install MCP server dependencies
echo "🤖 Setting up MCP server..."
if [ -d "mcp-server" ]; then
    cd mcp-server
    npm install
    cd ..
fi

# Build the Next.js app
echo "🔨 Building Next.js application..."
npm run build

# Build for Cloudflare Workers
echo "☁️ Building for Cloudflare Workers..."
npm run build:worker

# Deploy to Cloudflare
echo "🚢 Deploying to Cloudflare..."
if [ "$1" == "preview" ]; then
    echo "Deploying to preview environment..."
    wrangler deploy --env preview
else
    echo "Deploying to production..."
    wrangler deploy
fi

echo "✅ Deployment complete!"

# Show deployment URL
echo ""
echo "🌐 Your app is now live!"
echo "Production: https://pluggist.com"
echo "Workers: https://pluggist.workers.dev"
echo ""
echo "📊 View analytics: https://dash.cloudflare.com"
echo "🔧 Manage workers: wrangler tail"
