
# Development Setup Guide

## 🛠 Prerequisites

- Node.js 18.x or higher
- PostgreSQL 13.x or higher
- Redis 6.x or higher (for caching)
- Git

## 🚀 Quick Start (Replit)

1. **Fork this Repl** and it will automatically set up the development environment
2. **Run the setup script**:
   ```bash
   bash scripts/setup-dev.sh
   ```
3. **Start development**:
   ```bash
   npm run dev
   ```

## 🔧 Local Development Setup

### 1. Clone and Install Dependencies
```bash
git clone <your-fork-url>
cd aspel-workspace
npm install --registry=https://registry.npmjs.org/
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
# Start PostgreSQL service
# Create database
createdb aspel_development

# Run migrations
npm run migrate
```

### 4. Start Development Servers
```bash
# Start all services
npm run dev

# Or start individual services
npm run start:api
npm run start:ui
npm run start:workflow
```

## 📦 Package Structure

This is a monorepo with the following architecture:

### Frontend Applications
- `packages/asl/` - Main public interface
- `packages/asl-internal-ui/` - Admin interface
- `packages/asl-projects/` - Project management

### Backend Services  
- `packages/asl-public-api/` - Public REST API
- `packages/asl-internal-api/` - Internal admin API
- `packages/asl-workflow/` - Task workflow engine
- `packages/asl-resolver/` - Business logic layer

### Data Layer
- `packages/asl-schema/` - Database models
- `packages/asl-search/` - Elasticsearch integration

### Shared Libraries
- `packages/asl-components/` - React components
- `packages/asl-constants/` - Shared constants
- `packages/asl-permissions/` - Authorization logic

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=asl-schema

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 🔍 Debugging

```bash
# Enable debug logging
DEBUG=asl:* npm run dev

# Debug specific service
DEBUG=asl:workflow npm run start:workflow
```

## 📊 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking (if using TypeScript)
npm run typecheck
```

## 🗃️ Database Operations

```bash
# Create new migration
npx knex migrate:make migration_name

# Run migrations
npm run migrate

# Rollback migration
npm run migrate:rollback

# Seed database
npm run seed
```

## 🚢 Building for Production

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=asl-public-api
```

## 🛠 Common Issues

### Port Conflicts
```bash
# Kill processes on default ports
lsof -ti:3000,5000,8080 | xargs kill -9
```

### Database Connection Issues
```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432

# Reset database
npm run db:reset
```

### Dependency Issues
```bash
# Clean install
npm run install:clean

# Fix dependency conflicts
npm run fix-deps
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost/aspel_dev` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |

## 📚 Additional Resources

- [API Documentation](./API.md)
- [Database Schema](./SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture Overview](./ARCHITECTURE.md)
