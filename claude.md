# Pluggist - Claude Code Instructions

## Project Overview

Pluggist is a comprehensive EV charging station directory and trip planner built with Next.js 15, TypeScript, and Supabase. The project includes an MCP server component that provides AI assistants with tools for interacting with charging station data.

## Architecture

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL) with real-time subscriptions  
- **Authentication**: NextAuth.js with Google OAuth
- **Maps**: MapLibre GL for interactive maps
- **MCP Server**: Node.js server for AI tool integration
- **Package Manager**: pnpm (v10.0.0-rc.2)

## Key Features

1. **Station Discovery**: Find EV charging stations with advanced filtering
2. **Real-time Availability**: Check live connector status and wait times
3. **Trip Planning**: Calculate optimal charging stops for long trips
4. **Business Integration**: Exclusive deals from nearby restaurants/shops
5. **User Reviews**: Community-driven station ratings and comments
6. **Admin Dashboard**: Station management and analytics
7. **MCP Integration**: AI assistant tools for enhanced user experience

## Development Commands

### Setup
```bash
# Install dependencies
pnpm install

# Install MCP server dependencies  
cd mcp-server && npm install

# Set up environment variables
cp .env.example .env.local
```

### Development
```bash
# Start Next.js dev server
pnpm dev

# Start MCP server (separate terminal)
pnpm mcp:start

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### Database
```bash
# Apply Supabase migrations
npx supabase db push

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/supabase.ts

# Reset database (development only)
npx supabase db reset
```

### Deployment
```bash
# Deploy to Vercel
pnpm deploy

# Preview deployment
pnpm deploy:preview
```

## Important File Locations

### Core Application
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (extensive UI library)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and configurations
- `supabase/` - Database migrations and configuration

### MCP Server
- `mcp-server/index.js` - Main MCP server implementation
- `mcp-server/package.json` - MCP server dependencies

### Configuration
- `manifest.json` - MCPB manifest for AI assistant integration
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration

## Environment Variables Required

```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication  
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional
NEXT_PUBLIC_APP_URL=https://pluggist.com
NODE_ENV=development
```

## Database Schema

Key tables:
- `charging_stations` - Station data (location, connectors, amenities)
- `connectors` - Individual charging connectors per station
- `availability` - Real-time connector availability status
- `reviews` - User reviews and ratings
- `businesses` - Partner businesses offering deals
- `trips` - User trip plans and routes

## Common Tasks

### Adding New Station Data
1. Use admin dashboard at `/admin`
2. Or import via API at `/api/admin/stations`
3. Ensure proper validation and geocoding

### Updating MCP Server Tools
1. Edit `mcp-server/index.js`
2. Add new tools to `ListToolsRequestSchema` handler
3. Implement tool logic in `CallToolRequestSchema` handler
4. Update `manifest.json` tools array if needed

### Styling Guidelines  
- Use Tailwind CSS utility classes
- Leverage shadcn/ui components when possible
- Follow existing design system patterns
- Ensure responsive design (mobile-first)
- Use CSS variables for theme consistency

### Performance Optimization
- Use Next.js Image component for all images
- Implement proper loading states
- Use React.memo for expensive components
- Leverage Supabase edge functions for heavy operations
- Monitor bundle size with `pnpm build`

## Troubleshooting

### Build Errors
```bash
# Clear caches
rm -rf .next node_modules
pnpm install

# Check TypeScript errors
pnpm build
```

### Database Issues
```bash
# Reset local Supabase
npx supabase stop
npx supabase start
npx supabase db reset
```

### MCP Server Issues
```bash
# Test MCP server directly
cd mcp-server
node index.js

# Check dependencies
npm install
```

### Deployment Issues
- Ensure all environment variables are set in Vercel
- Check build logs for specific errors
- Verify Supabase connection from deployment environment

## AI Assistant Prompts

Use these prompts when working with AI assistants:

### For Development
"I'm working on Pluggist, an EV charging station directory built with Next.js 15 and Supabase. Please help me [specific task] while following the project's TypeScript conventions and using the existing component library."

### For MCP Integration
"This project includes an MCP server component that provides AI assistants with EV charging station tools. Please help me enhance the MCP server functionality while maintaining compatibility with the MCPB manifest."

### For Database Work
"I need help with Supabase database operations for Pluggist. The schema includes charging_stations, connectors, availability, and reviews tables. Please suggest SQL migrations and TypeScript types."

## Project Status

- ✅ Core Next.js application structure
- ✅ Supabase integration and authentication
- ✅ Basic MCP server implementation
- ✅ Component library (shadcn/ui)
- ⚠️ Deployment pipeline (needs fixing)
- 🔄 Real-time availability system (in progress)
- 📋 Admin dashboard (needs enhancement)
- 📋 Trip planner optimization (needs work)

## Next Priority Tasks

1. Fix Vercel deployment configuration
2. Implement real-time availability updates
3. Enhance trip planning algorithms
4. Add comprehensive testing suite
5. Improve MCP server with database integration
6. Implement business partnership system
7. Add mobile app support

For any questions or issues, refer to the existing memories in `.serena/memories/` or check the GitHub repository issues.