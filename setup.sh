#!/bin/bash
# Pluggist Quick Setup Script
# Run this to get Pluggist running locally or deploy to production

set -e

echo "
╔═══════════════════════════════════════════════════════════╗
║                     PLUGGIST SETUP ⚡                      ║
║         AI-Powered EV Charging Marketplace                 ║
╚═══════════════════════════════════════════════════════════╝
"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_success() {
    echo -e "\033[0;32m✓ $1\033[0m"
}

print_error() {
    echo -e "\033[0;31m✗ $1\033[0m"
}

print_info() {
    echo -e "\033[0;34mℹ $1\033[0m"
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
else
    print_success "Node.js found: $(node --version)"
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
else
    print_success "npm found: $(npm --version)"
fi

# Check for Cloudflare CLI (optional)
if command_exists wrangler; then
    print_success "Wrangler CLI found: $(wrangler --version)"
else
    print_info "Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Setup selection
echo ""
echo "🚀 What would you like to do?"
echo "1) Local Development Setup"
echo "2) Deploy to Cloudflare (Production)"
echo "3) Deploy to Cloudflare (Preview)"
echo "4) Setup Partner Demo"
echo "5) Run Tests"
echo "6) Update Dependencies"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Setting up local development environment..."
        
        # Install dependencies
        print_info "Installing dependencies..."
        npm install
        
        # Setup environment variables
        if [ ! -f .env.local ]; then
            print_info "Creating .env.local from template..."
            cp .env.example .env.local
            print_success "Created .env.local - Please update with your API keys"
        else
            print_success ".env.local already exists"
        fi
        
        # Setup MCP server
        if [ -d "mcp-server" ]; then
            print_info "Setting up MCP server..."
            cd mcp-server
            npm install
            cd ..
            print_success "MCP server ready"
        fi
        
        # Initialize database
        print_info "Would you like to initialize the local database? (y/n)"
        read -p "> " init_db
        if [ "$init_db" = "y" ]; then
            if command_exists wrangler; then
                wrangler d1 create pluggist-db --local || true
                wrangler d1 execute pluggist-db --local --file=migrations/0001_initial.sql
                wrangler d1 execute pluggist-db --local --file=migrations/0002_complete_schema.sql
                print_success "Database initialized"
            else
                print_error "Wrangler not found. Please install it first."
            fi
        fi
        
        # Start development server
        print_info "Starting development server..."
        echo ""
        echo "════════════════════════════════════════════════════════════"
        echo "  🎉 Setup complete! Starting Pluggist..."
        echo "  📱 Local: http://localhost:3000"
        echo "  🤖 ChargePal Demo: http://localhost:3000/charging"
        echo "  💼 Partner Portal: http://localhost:3000/for-business"
        echo "════════════════════════════════════════════════════════════"
        echo ""
        npm run dev
        ;;
        
    2)
        echo ""
        echo "🚀 Deploying to Cloudflare (Production)..."
        
        # Check for required environment variables
        if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
            print_error "CLOUDFLARE_API_TOKEN not set"
            echo "Please set your Cloudflare API token:"
            echo "export CLOUDFLARE_API_TOKEN=your-token-here"
            exit 1
        fi
        
        # Build and deploy
        print_info "Building application..."
        npm run build
        
        print_info "Building for Cloudflare Workers..."
        npm run build:worker
        
        print_info "Deploying to production..."
        wrangler deploy --env production
        
        print_success "Deployment complete!"
        echo ""
        echo "🌐 Your app is live at:"
        echo "   https://pluggist.com"
        echo "   https://pluggist.workers.dev"
        ;;
        
    3)
        echo ""
        echo "👁️ Deploying to Cloudflare (Preview)..."
        
        # Build and deploy to preview
        print_info "Building application..."
        npm run build
        
        print_info "Deploying to preview environment..."
        wrangler deploy --env preview
        
        print_success "Preview deployment complete!"
        echo "Preview URL: https://preview.pluggist.workers.dev"
        ;;
        
    4)
        echo ""
        echo "🏪 Setting up Partner Demo..."
        
        # Create demo partner account
        print_info "Creating demo partner account..."
        
        # Start server with demo mode
        export MOCK_CHARGING_SESSIONS=true
        export FEATURE_AI_CHAT=true
        export FEATURE_DEALS=true
        
        print_success "Demo mode enabled"
        echo ""
        echo "📝 Demo Credentials:"
        echo "   Partner Email: demo@subway.com"
        echo "   Password: demo123"
        echo ""
        echo "🔗 Demo Links:"
        echo "   Partner Dashboard: http://localhost:3000/partner/dashboard"
        echo "   Charging Demo: http://localhost:3000/charging?demo=true"
        echo ""
        npm run dev
        ;;
        
    5)
        echo ""
        echo "🧪 Running tests..."
        
        # Run tests
        print_info "Running unit tests..."
        npm test
        
        print_info "Running linting..."
        npm run lint
        
        print_success "All tests passed!"
        ;;
        
    6)
        echo ""
        echo "📦 Updating dependencies..."
        
        print_info "Updating npm packages..."
        npm update
        
        print_info "Checking for vulnerabilities..."
        npm audit fix
        
        print_success "Dependencies updated!"
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac
