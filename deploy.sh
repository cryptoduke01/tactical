#!/bin/bash

echo "🚀 Deploying Skill Arena to Vercel..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "🎉 Deployment complete!"
echo "📱 Your game is now live!"
echo "🔗 Add the URL to your README.md"
echo "📹 Record your 3-minute video walkthrough"
echo "📝 Submit your bounty!" 