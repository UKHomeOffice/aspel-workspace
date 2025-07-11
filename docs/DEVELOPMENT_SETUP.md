
# Development Setup Guide

This guide will help you set up a complete development environment for the ASPeL workspace.

## Quick Start

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/UKHomeOffice/aspel-workspace
cd aspel-workspace

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure Authentication
Edit your `.env` file with required tokens:
```env
GITHUB_AUTH_TOKEN=your_github_token_here
ART_AUTH_TOKEN=your_artefactory_token_here
```

### 3. Start Development Services
```bash
# Start main development services
npm run dev

# Or start specific services
npm run dev -- --services="asl asl-internal-ui"
```

## Detailed Setup

### Prerequisites
- Node.js v14+ (recommended: v18+)
- npm v7+
- Git
- Text editor (VS Code recommended)

### Package-Specific Setup

#### Frontend Development
For UI work on `asl-components` or `asl-pages`:
```bash
# Install frontend dependencies
npm install -w packages/asl-components
npm install -w packages/asl-pages

# Start development server
npm run dev -w packages/asl-components
```

#### Backend Development
For API work on `asl-internal-api` or `asl-public-api`:
```bash
# Install backend dependencies
npm install -w packages/asl-internal-api

# Start with hot reload
npm run dev -w packages/asl-internal-api
```

### Database Setup
For packages requiring database access:
```bash
# Set up database (if needed)
npm run db:setup

# Run migrations
npm run db:migrate
```

### Testing Setup
```bash
# Run all tests
npm test

# Run tests for specific package
npm test -w packages/asl-components

# Run tests with coverage
npm run test:coverage
```

## Development Workflow

### 1. Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Making Changes
- Follow existing code style
- Add tests for new features
- Update documentation

### 3. Running Quality Checks
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test
```

### 4. Committing Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

## Troubleshooting

### Common Issues

#### Authentication Errors
- Ensure tokens are correctly set in `.env`
- Check token permissions
- Verify token hasn't expired

#### Build Failures
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

#### Port Conflicts
- Change ports in configuration files
- Kill processes using required ports
- Use different port ranges

### Getting Help
- Check [HELPME.md](../HELPME.md) for common issues
- Open an issue on GitHub
- Review existing documentation

## IDE Configuration

### VS Code Setup
Recommended extensions:
- ESLint
- Prettier
- GitLens
- Auto Rename Tag

### Workspace Settings
```json
{
  "eslint.workingDirectories": ["packages/*"],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Next Steps

1. Read the [Contributing Guide](../CONTRIBUTING.md)
2. Check [open issues](https://github.com/UKHomeOffice/aspel-workspace/issues)
3. Join the development community
4. Start with small contributions
