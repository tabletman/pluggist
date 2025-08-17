# Deployment Status and Known Issues

## Current Deployment Configuration
- **Platform**: Vercel
- **Project ID**: prj_mamaMPV1x4wv3fCu1o7O7s62eYed
- **Team**: tabletman
- **Repository**: github.com/tabletman/pluggist (private)
- **Current URL**: pluggist.vercel.app
- **Target Domain**: pluggist.com (purchased through Vercel, needs configuration)

## Deployment History
- 14 total deployment attempts
- 13 failed (ERROR status)
- 1 successful (READY status) - January 18, 2025

## Known Issues to Fix

### 1. Build Configuration
- Package manager conflicts between npm and pnpm
- Solution implemented in vercel.json:
  ```json
  "installCommand": "npm install -g pnpm && pnpm install --no-frozen-lockfile"
  "buildCommand": "npm install -g pnpm && pnpm build"
  ```

### 2. TypeScript/ESLint Errors
- Currently ignored in next.config.ts (temporary fix)
- TODO: Remove ignore flags and fix all errors
- Multiple type errors in components need resolution

### 3. Cloudflare D1 Integration
- Hybrid architecture (Vercel + Cloudflare) adds complexity
- Consider migrating to Vercel-native solutions:
  - Vercel Postgres
  - Vercel KV
  - Vercel Blob Storage

### 4. Missing Dependencies
- Ensure all required packages are in package.json
- Critical ones: next-auth, @auth/cloudflare-d1-adapter, maplibre-gl

### 5. Environment Variables Required
- NEXTAUTH_URL (update to https://www.pluggist.com after domain setup)
- NEXTAUTH_SECRET (generate secure random string)
- GOOGLE_CLIENT_ID (from Google Console)
- GOOGLE_CLIENT_SECRET (from Google Console)

## Domain Migration Steps Needed
1. Access Vercel Dashboard → Project Settings → Domains
2. Add pluggist.com as custom domain
3. Accept suggestion to add www.pluggist.com
4. DNS should auto-configure (Vercel-purchased domain)
5. Wait for SSL certificate provisioning (5-15 minutes)
6. Update NEXTAUTH_URL environment variable
7. Redeploy application

## Recommended Immediate Actions
1. Fix build errors locally first
2. Test with `pnpm build` before pushing
3. Ensure all dependencies are properly listed
4. Configure environment variables in Vercel
5. Then proceed with domain configuration