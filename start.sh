#!/bin/bash
set -e

echo "🚀 Starting WWE Championship Store..."
export NODE_ENV=production

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing production dependencies..."
  npm install --production
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
  echo "❌ Error: dist/ folder not found!"
  echo "Please run 'npm run build' locally first, then upload the dist/ folder"
  exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "⚠️  Warning: .env file not found!"
  echo "Please create a .env file with your credentials"
fi

# Start the server
echo "🎯 Server starting on port ${PORT:-3000}..."
exec node dist/server/node-build.mjs
