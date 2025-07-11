#!/bin/bash

echo "Setting up ASPeL development environment..."

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting." >&2; exit 1; }

# Install dependencies
echo "Installing dependencies..."
npm install

# Setup environment
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
fi

# Setup git hooks
echo "Setting up git hooks..."
npm run prepare

echo "Development environment setup complete!"
echo "Run 'npm run dev' to start the development servers"