# Pluggist Project Overview

## Purpose
PLUGGIST is a comprehensive directory website for electric vehicle charging stations, designed to help EV drivers find reliable charging locations, plan trips, and share experiences. It's a commercial project with multiple monetization strategies including premium business listings, advertising, affiliate marketing, and data analytics.

## Tech Stack
- **Framework**: Next.js 15.1.4 with React 19 and App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom UI components library (shadcn/ui)
- **Database**: Cloudflare D1 (SQLite-compatible edge database)
- **Authentication**: NextAuth.js with Google OAuth
- **Package Manager**: pnpm 10.0.0-rc.2
- **Deployment**: Vercel with Cloudflare Workers integration
- **Maps**: MapLibre GL for map visualization

## Project Structure
```
pluggist-unified/
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── api/         # API routes
│   │   ├── admin/       # Admin dashboard
│   │   ├── for-business/# Business listings
│   │   ├── resources/   # Resources page
│   │   ├── search/      # Search functionality
│   │   ├── station/     # Station details
│   │   └── trip-planner/# Trip planning feature
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components (extensive library)
│   │   ├── layout/      # Layout components
│   │   ├── search/      # Search-related components
│   │   ├── trip-planner/# Trip planner components
│   │   └── seo/         # SEO components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── migrations/          # Database migrations
├── public/              # Static assets
└── documentation/       # Project documentation and deployment guides
```

## Key Features
- Station search with advanced filtering (connector type, charging speed, amenities)
- Station details with comprehensive information
- Trip planner with optimal charging stop calculation
- User reviews and ratings
- Business listings for charging station operators
- SEO optimization with structured data
- Responsive design for all devices