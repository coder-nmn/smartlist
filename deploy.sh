#!/bin/bash

echo "🚀 SmartList Deployment Helper"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: SmartList Grocery Assistant"
    git branch -M main
    echo "✅ Git repository initialized"
else
    echo "📁 Git repository already exists"
fi

echo ""
echo "🌐 To get a shareable link for your SmartList app:"
echo ""
echo "Option 1 - Quick Deploy to Vercel:"
echo "1. Go to https://vercel.com"
echo "2. Sign up/login with GitHub"
echo "3. Click 'New Project'"
echo "4. Import this repository"
echo "5. Add environment variable: OPENROUTER_API_KEY"
echo "6. Click 'Deploy'"
echo "7. Get your live URL: https://your-app-name.vercel.app"
echo ""
echo "Option 2 - Push to GitHub first:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/smartlist-grocery-assistant.git"
echo "3. Run: git push -u origin main"
echo "4. Then deploy to Vercel from GitHub"
echo ""
echo "Option 3 - Use ngrok for temporary sharing:"
echo "1. Install ngrok: https://ngrok.com/"
echo "2. Run: ngrok http 8000"
echo "3. Share the ngrok URL (temporary)"
echo ""
echo "🔑 Don't forget to add your OpenRouter API key for voice features!"
echo "💡 Current local URL: http://localhost:8000"
