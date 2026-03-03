#!/bin/bash

# Deployment preparation script for Render

echo "🚀 Preparing for deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Create a new Web Service on Render"
echo "3. Connect your GitHub repository"
echo "4. Set environment variables in Render dashboard"
echo "5. Deploy!"