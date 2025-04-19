# PLUGGIST - EV Charging Stations Directory

PLUGGIST is a comprehensive directory website for electric vehicle charging stations, designed to help EV drivers find reliable charging locations, plan trips, and share experiences.

## Features

- **Station Search**: Find charging stations with advanced filtering by connector type, charging speed, and amenities
- **Station Details**: View comprehensive information about each charging station
- **Trip Planner**: Plan journeys with optimal charging stops
- **User Reviews**: Read and contribute reviews of charging stations
- **Business Listings**: Premium listings for charging station operators
- **Responsive Design**: Optimized for all devices from mobile to desktop

## Tech Stack

- **Framework**: Next.js with React
- **Styling**: Tailwind CSS
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or pnpm

### Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/pluggist.git
cd pluggist
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Initialize the database
```bash
npx wrangler d1 execute pluggist-db --local --file=migrations/0001_initial.sql
```

5. Run the development server
```bash
npm run dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. Import your project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Connect to your GitHub repository
   - Select "Next.js" as the framework preset
   - Keep the default build settings

3. Set up environment variables in Vercel dashboard:
   - NEXTAUTH_SECRET (generate a secure random string)
   - NEXTAUTH_URL (set to your domain, e.g., https://pluggist.com)
   - GOOGLE_CLIENT_ID (optional for OAuth)
   - GOOGLE_CLIENT_SECRET (optional for OAuth)

4. Connect your custom domain:
   - Go to "Settings" → "Domains"
   - Add your domain "pluggist.com"
   - Follow Vercel's instructions for DNS configuration
   - Verify domain ownership
   - Enable HTTPS

5. Check deployment status:
   - Vercel will automatically deploy when you push changes to your repository
   - View deployment logs in the Vercel dashboard
   - Use preview deployments for testing changes before merging to main

For local development, always use `.env.local` for environment variables and remember that these values won't be committed to the repository.

## Monetization Strategies

PLUGGIST implements multiple revenue streams:

1. **Premium Business Listings**: Tiered subscription model for charging station operators
2. **Display Advertising**: Google AdSense and Carbon Ads integration
3. **Affiliate Marketing**: Partnerships with EV charging equipment manufacturers
4. **Lead Generation**: Charging equipment installation quotes and more
5. **Data and Analytics**: Anonymized usage data licensing

## Project Structure

```
pluggist/
├── migrations/         # Database migration files
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
├── .env.local          # Environment variables (create this file)
├── package.json        # Project dependencies
└── wrangler.toml       # Cloudflare Workers configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under a Proprietary Commercial License - see the LICENSE file for details.
All rights reserved. Unauthorized reproduction, distribution, or modification is strictly prohibited.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [OpenChargeMap API](https://openchargemap.org/site/develop/api)

## Contact

For questions or support, please contact support@pluggist.com
