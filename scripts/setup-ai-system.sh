#!/bin/bash

# ============================================
# MediaHand AI Content System Setup Script
# ============================================

echo "🚀 Setting up MediaHand AI Content Generation System..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (update with your values)
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOL
    echo "✅ .env file created! Please update it with your actual keys."
else
    echo "✅ .env file already exists"
fi

# Check if Node.js dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🗄️  Database Setup Instructions:"
echo "1. Go to your Supabase project dashboard"
echo "2. Open the SQL Editor"
echo "3. Run the script: scripts/setup-ai-content-db.sql"
echo ""

echo "🔑 API Key Setup:"
echo "1. Get OpenAI API key from: https://platform.openai.com/api-keys"
echo "2. Update OPENAI_API_KEY in .env file"
echo "3. Ensure you have billing setup in OpenAI account"
echo ""

echo "🧪 Testing Instructions:"
echo "1. Start the dev server: npm run dev"
echo "2. Visit: http://localhost:4321/ai-content"
echo "3. Try generating content!"
echo ""

echo "✨ AI Content System Setup Complete!"
echo "📖 See AI_CONTENT_SETUP_GUIDE.md for detailed instructions" 