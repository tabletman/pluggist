# Suggested Commands for Pluggist Development

## Development Commands

### Install Dependencies
```bash
# Install pnpm globally if not already installed
npm install -g pnpm

# Install project dependencies
pnpm install

# If you encounter issues, try with no frozen lockfile
pnpm install --no-frozen-lockfile
```

### Running the Project
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint the code
pnpm lint
```

### Cloudflare Workers Integration
```bash
# Build for Cloudflare Workers
pnpm build:worker

# Preview with Cloudflare Workers locally
pnpm preview

# Generate Cloudflare types
pnpm cf-typegen
```

### Database Setup
```bash
# Initialize the local database (Cloudflare D1)
npx wrangler d1 execute pluggist-db --local --file=migrations/0001_initial.sql

# Run database migrations
npx wrangler d1 migrations apply pluggist-db --local
```

## Git Commands (Darwin/macOS)
```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to main branch
git push origin main

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/branch-name

# Switch branches
git checkout main
```

## Vercel Deployment
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to Vercel (preview)
vercel

# Deploy to production
vercel --prod

# Link to existing Vercel project
vercel link

# Pull environment variables from Vercel
vercel env pull
```

## System Commands (Darwin/macOS)
```bash
# List files
ls -la

# Change directory
cd [directory]

# Create directory
mkdir [directory-name]

# Find files
find . -name "*.tsx" -type f

# Search in files
grep -r "searchterm" ./src

# Check port usage
lsof -i :3000

# Kill process on port
kill -9 $(lsof -t -i:3000)
```

## Environment Variables Setup
Create a `.env.local` file with:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[generate-with: openssl rand -base64 32]
GOOGLE_CLIENT_ID=[from-google-console]
GOOGLE_CLIENT_SECRET=[from-google-console]
```

## Troubleshooting Commands
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear all caches
rm -rf .next node_modules .turbo
pnpm install

# Check pnpm version
pnpm --version

# Update pnpm
npm install -g pnpm@latest
```