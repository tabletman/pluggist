# Pluggist Deployment Guide

This guide provides instructions for deploying the Pluggist EV Charging Stations Directory website to production.

## Prerequisites

Before deployment, ensure you have:

1. A domain name (recommended: chargelocator.com or similar)
2. Access to a hosting platform that supports Next.js applications
3. Environment variables prepared for production
4. Database credentials for production
5. Google OAuth credentials (for authentication)

## Deployment Options

### Option 1: Vercel Deployment (Recommended)

Vercel is the platform built by the creators of Next.js and offers the simplest deployment experience.

#### Steps:

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub/GitLab/Bitbucket account

2. **Push Code to Repository**
   ```bash
   cd /home/ubuntu/directory_project/development/chargelocator/chargelocator
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

3. **Import Project in Vercel**
   - From the Vercel dashboard, click "Add New" → "Project"
   - Select your repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: `./`
     - Build Command: (leave as default)
     - Output Directory: (leave as default)

4. **Configure Environment Variables**
   - In project settings, add the following environment variables:
     - `NEXTAUTH_URL`: Your production URL (e.g., https://chargelocator.com)
     - `NEXTAUTH_SECRET`: Generate a secure random string
     - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
     - Any other API keys or credentials needed

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

6. **Set Up Custom Domain**
   - In the Vercel project dashboard, go to "Settings" → "Domains"
   - Add your custom domain
   - Follow the instructions to configure DNS settings

### Option 2: Self-Hosted Deployment

If you prefer to deploy on your own infrastructure, follow these steps:

#### Steps:

1. **Build the Application**
   ```bash
   cd /home/ubuntu/directory_project/development/chargelocator/chargelocator
   npm run build
   ```

2. **Set Up Environment Variables**
   Create a `.env.production` file with:
   ```
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-secure-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   # Add other required environment variables
   ```

3. **Deploy to Your Server**
   - Transfer the built application to your server
   - Install Node.js on your server
   - Set up a process manager like PM2:
     ```bash
     npm install -g pm2
     pm2 start npm --name "chargelocator" -- start
     pm2 save
     pm2 startup
     ```

4. **Set Up Nginx as Reverse Proxy**
   Create an Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set Up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

6. **Set Up Database**
   - If using Cloudflare D1 database, follow their deployment instructions
   - For other databases, ensure your production database is properly configured and secured

## Database Migration

### Cloudflare D1 Database

If using Cloudflare D1 with Wrangler:

1. **Create Production D1 Database**
   ```bash
   wrangler d1 create chargelocator-db
   ```

2. **Update wrangler.toml with Production Database ID**
   Replace the database_id with the one provided from the create command.

3. **Apply Migrations**
   ```bash
   wrangler d1 migrations apply chargelocator-db --production
   ```

### Other Databases

If using another database system:

1. Ensure your schema is properly set up in the production database
2. Run any necessary migration scripts
3. Update connection strings in your environment variables

## Post-Deployment Verification

After deployment, verify the following:

1. **Website Accessibility**
   - Confirm the website loads correctly at your domain
   - Test navigation between pages

2. **Functionality**
   - Test search functionality
   - Test user authentication
   - Test admin dashboard access

3. **Performance**
   - Run Lighthouse tests to verify performance
   - Check Core Web Vitals in Google Search Console (once indexed)

4. **SEO**
   - Verify robots.txt is accessible
   - Verify sitemap.xml is accessible
   - Submit sitemap to Google Search Console

## Monitoring and Maintenance

### Set Up Monitoring

1. **Analytics**
   - Set up Google Analytics or similar
   - Configure conversion tracking for key actions

2. **Error Tracking**
   - Implement Sentry, LogRocket, or similar service
   - Set up alerts for critical errors

3. **Uptime Monitoring**
   - Use UptimeRobot, Pingdom, or similar service
   - Configure alerts for downtime

### Maintenance Plan

1. **Regular Updates**
   - Schedule monthly dependency updates
   - Test updates in a staging environment before deploying to production

2. **Backups**
   - Set up automated database backups
   - Store backups in a secure, off-site location

3. **Security**
   - Regularly update dependencies to patch security vulnerabilities
   - Perform periodic security audits

## Scaling Considerations

As your directory grows, consider:

1. **Content Delivery Network (CDN)**
   - Implement a CDN like Cloudflare to improve global performance

2. **Database Scaling**
   - Monitor database performance
   - Implement caching for frequently accessed data

3. **Server Resources**
   - Increase server resources as traffic grows
   - Consider horizontal scaling for high-traffic scenarios

## Troubleshooting

### Common Issues and Solutions

1. **Deployment Fails**
   - Check build logs for errors
   - Verify all dependencies are correctly installed
   - Ensure environment variables are properly set

2. **Authentication Issues**
   - Verify OAuth credentials are correct
   - Check NEXTAUTH_URL is set to your production domain
   - Ensure NEXTAUTH_SECRET is properly set

3. **Database Connection Issues**
   - Verify database credentials
   - Check network access to database
   - Ensure database migrations have been applied

## Support and Resources

- Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Cloudflare Workers Documentation: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- NextAuth.js Documentation: [next-auth.js.org](https://next-auth.js.org)

For additional support, contact the development team at support@chargelocator.com.
