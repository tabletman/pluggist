#!/bin/bash
# Simple deployment check script for PLUGGIST

echo "PLUGGIST Deployment Check"
echo "========================="

# Check if the current directory is a git repository
if [ ! -d ".git" ]; then
  echo "❌ Not a git repository. Make sure you're in the right directory."
  exit 1
fi

# Check if environment files exist
if [ ! -f ".env.local" ]; then
  echo "⚠️ .env.local file is missing. Create it before deployment."
else
  echo "✅ .env.local file exists."
fi

# Check if package.json has the right scripts
if grep -q "\"build\": \"next build\"" package.json; then
  echo "✅ Build script is properly configured."
else
  echo "❌ Build script is missing or incorrect in package.json."
fi

# Check Next.js configuration
if [ -f "next.config.ts" ]; then
  echo "✅ next.config.ts exists."
else
  echo "❌ next.config.ts is missing."
fi

# Check Vercel configuration
if [ -f "vercel.json" ]; then
  echo "✅ vercel.json exists."
else
  echo "⚠️ vercel.json is missing. This is optional but recommended."
fi

# Check git status
echo ""
echo "Git Status:"
git status

echo ""
echo "Deployment Prerequisites:"
echo "1. Push changes to GitHub"
echo "2. Connect repository to Vercel"
echo "3. Configure environment variables in Vercel dashboard"
echo "4. Set up domain in Vercel"
echo ""
echo "For detailed deployment instructions, see the README.md"