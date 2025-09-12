#!/bin/bash

# Set Supabase environment variables in Vercel
echo "Setting Vercel environment variables..."

# Set NEXT_PUBLIC_SUPABASE_URL
echo "https://wldcyxgwmtwihtxgwssu.supabase.co" | \
  npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Set NEXT_PUBLIC_SUPABASE_ANON_KEY  
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZGN5eGd3bXR3aWh0eGd3c3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjczMjUsImV4cCI6MjA3MTA0MzMyNX0.Nfgm4bXW2U4mVBr2g8piTCvv59rH8iOXEWijgxmahuk" | \
  npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "Done!"