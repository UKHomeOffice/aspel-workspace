
#!/bin/bash

set -e

echo "🚀 Setting up ASPeL Workspace for development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="14.0.0"

if ! npx semver "$NODE_VERSION" -r ">=$REQUIRED_VERSION" &> /dev/null; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js 14+ and try again."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration before continuing."
fi

# Install dependencies
echo "📦 Installing dependencies..."
if [ -f .env ]; then
    npm run install:env
else
    npm install
fi

# Setup git hooks
echo "🔧 Setting up git hooks..."
npm run prepare

# Start development services (optional)
read -p "🐳 Do you want to start Docker services for development? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v docker-compose &> /dev/null; then
        docker-compose -f docker-compose.dev.yml up -d
        echo "✅ Docker services started"
    else
        echo "❌ Docker Compose not found. Please install Docker and Docker Compose."
    fi
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Update your .env file with the correct configuration"
echo "2. Run 'npm run dev' to start the development servers"
echo "3. Visit http://localhost:5000 to access the application"
echo ""
echo "📚 For more information, see the documentation in docs/"
