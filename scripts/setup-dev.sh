
#!/bin/bash

echo "🚀 Setting up ASPeL Workspace development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18.x or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is not supported. Please upgrade to 18.x or higher."
    exit 1
fi

print_status "Node.js version $NODE_VERSION detected ✓"

# Install dependencies
print_status "Installing dependencies..."
npm install --registry=https://registry.npmjs.org/ --ignore-scripts

if [ $? -ne 0 ]; then
    print_warning "Standard install failed, trying clean install..."
    npm run install:clean
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating environment file..."
    cp .env.example .env
    print_warning "Please update .env with your configuration before starting services"
fi

# Run security audit
print_status "Running security audit..."
npm run security:scan

# Check for potential issues
print_status "Checking for common issues..."

# Check if ports are available
for port in 3000 5000 8080; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        print_warning "Port $port is already in use"
    fi
done

print_status "Development environment setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Set up your database (see docs/DEVELOPMENT_SETUP.md)"
echo "3. Run 'npm run dev' to start development servers"
echo ""
echo "For help, see:"
echo "- docs/DEVELOPMENT_SETUP.md"
echo "- CONTRIBUTING.md"
echo "- README.md"
