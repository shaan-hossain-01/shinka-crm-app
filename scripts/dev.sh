#!/bin/bash

# Development script for running all services

echo "🚀 Starting Shinka development environment..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run all workspaces in development mode
echo "🔧 Starting all services..."
npm run dev
