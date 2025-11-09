#!/bin/bash

# PEAK Dashboard - Vercel Deployment Script
# This script helps you deploy to Vercel with environment variables

echo "🔱 PEAK Dashboard - Vercel Deployment"
echo "===================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "📝 IMPORTANT: Add these environment variables in Vercel Dashboard:"
echo "   Project Settings → Environment Variables"
echo ""
echo "   NEXT_PUBLIC_SUPABASE_URL=https://ppfzxbznymxawaifbnwp.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZnp4YnpueW14YXdhaWZibndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODk1OTQsImV4cCI6MjA3Nzg2NTU5NH0.NenmS8SE0pzYq6dy1MDbPsOw3tUW7_UKxTtSWB5CFfY"
echo ""
echo "✨ After adding env vars, redeploy from Vercel dashboard or run:"
echo "   vercel --prod"
echo ""

