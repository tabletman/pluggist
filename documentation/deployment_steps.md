# Pluggist Deployment Steps

This document provides step-by-step instructions for deploying the Pluggist EV Charging Stations Directory website to Vercel.

## 1. Prepare for Deployment

```bash
# Navigate to the project directory
cd /home/ubuntu/directory_project/development/chargelocator/chargelocator

# Create a .env.local file for environment variables
cat > .env.local << EOL
NEXTAUTH_URL=https://chargelocator.vercel.app
NEXTAUTH_SECRET=your-secure-secret-key-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EOL

# Create a .gitignore file
cat > .gitignore << EOL
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOL

# Initialize git repository
git init
git add .
git commit -m "Initial commit for Pluggist EV Charging Stations Directory"
```

## 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel (follow the prompts)
vercel login

# Deploy to Vercel
vercel

# When prompted:
# - Set up and deploy: Yes
# - Link to existing project: No
# - Project name: chargelocator
# - Directory: ./
# - Override settings: No
```

## 3. Configure Custom Domain (After Deployment)

1. Go to the Vercel dashboard: https://vercel.com/dashboard
2. Select your project "chargelocator"
3. Go to "Settings" → "Domains"
4. Add your custom domain (e.g., chargelocator.com)
5. Follow the instructions to configure DNS settings

## 4. Set Up Environment Variables in Vercel Dashboard

1. Go to the Vercel dashboard: https://vercel.com/dashboard
2. Select your project "chargelocator"
3. Go to "Settings" → "Environment Variables"
4. Add the following environment variables:
   - `NEXTAUTH_URL`: Your production URL (e.g., https://chargelocator.com)
   - `NEXTAUTH_SECRET`: A secure random string
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

## 5. Set Up Cloudflare D1 Database for Production

```bash
# Create production D1 database
wrangler d1 create chargelocator-production-db

# Update wrangler.toml with the production database ID
# Replace "database_id = "local"" with the ID provided from the create command

# Apply migrations to production database
wrangler d1 migrations apply chargelocator-production-db --production
```

## 6. Post-Deployment Verification

1. **Verify Website Accessibility**
   - Open your deployed URL (e.g., https://chargelocator.vercel.app)
   - Confirm the website loads correctly
   - Test navigation between pages

2. **Verify Functionality**
   - Test search functionality
   - Test user authentication (if configured)
   - Test admin dashboard access (if configured)

3. **Verify SEO Elements**
   - Check robots.txt: https://chargelocator.vercel.app/robots.txt
   - Check sitemap: https://chargelocator.vercel.app/sitemap.xml

## 7. Set Up Monitoring

1. **Add Google Analytics**
   - Create a Google Analytics property
   - Add the tracking code to your Next.js application
   - Deploy the updated code

2. **Set Up Google Search Console**
   - Add your site to Google Search Console
   - Verify ownership
   - Submit your sitemap

## 8. Ongoing Maintenance

1. **Regular Updates**
   - Pull the latest code from your repository
   - Update dependencies: `npm update`
   - Test locally: `npm run dev`
   - Deploy updates: `vercel --prod`

2. **Database Backups**
   - Set up regular database backups
   - Store backups securely

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Code committed to Git repository
- [ ] Deployed to Vercel
- [ ] Custom domain configured (if applicable)
- [ ] Database migrations applied
- [ ] Website functionality verified
- [ ] SEO elements verified
- [ ] Monitoring set up
- [ ] Maintenance plan established

## Troubleshooting

If you encounter issues during deployment:

1. Check Vercel deployment logs for errors
2. Verify environment variables are correctly set
3. Ensure database migrations have been applied
4. Test locally before deploying to production

For additional assistance, refer to the comprehensive deployment guide or contact the development team.
