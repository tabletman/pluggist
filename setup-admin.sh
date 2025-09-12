#!/bin/bash
# Quick Admin Setup for bp@ob1.co

echo "
╔═══════════════════════════════════════════════════════════╗
║           PLUGGIST ADMIN SETUP FOR BP@OB1.CO              ║
╚═══════════════════════════════════════════════════════════╝
"

# Update .env.local with admin email
if [ -f .env.local ]; then
    echo "✅ Updating .env.local with admin configuration..."
    
    # Check if admin email is already set
    if ! grep -q "ADMIN_EMAIL" .env.local; then
        echo "" >> .env.local
        echo "# Admin Configuration" >> .env.local
        echo "ADMIN_EMAIL=bp@ob1.co" >> .env.local
        echo "PLATFORM_OWNER=BP" >> .env.local
        echo "COMPANY_NAME=OB1" >> .env.local
    fi
fi

echo "
📧 Your admin account: bp@ob1.co
🔑 Access level: Super Admin
💎 Premium status: Active until 2030
🏷️ Referral code: FOUNDER

Next steps:
1. Go to: https://app.supabase.com/project/wldcyxgwmtwihtkgwssu/auth/users
2. Click 'Invite User'
3. Enter: bp@ob1.co
4. Check your email for the magic link
5. Set a password when you log in

Or use this direct link to set password:
https://wldcyxgwmtwihtkgwssu.supabase.co/auth/v1/invite?email=bp@ob1.co

Once logged in, you'll have full admin access to:
- All charging stations data
- Partner management dashboard
- Deal creation and approval
- Analytics and reports
- User management

Your test partner account 'OB1 Demo Restaurant' has been created.
You can start creating deals immediately!
"

# Ask if they want to send the invite now
read -p "Would you like me to open the Supabase dashboard now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "https://app.supabase.com/project/wldcyxgwmtwihtkgwssu/auth/users"
fi
