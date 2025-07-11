# ASPeL Workspace

Animal Science Procedures e-Licensing (ASPeL) - A comprehensive monorepo for managing animal research licenses and procedures.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue)](https://www.postgresql.org/)

## Overview

This is an open source version of the UK Home Office's ASPeL system, designed for managing animal research licensing and procedures in compliance with scientific research regulations. The system provides a complete digital workflow for the application, review, and management of licenses under the Animals (Scientific Procedures) Act 1986.

### Key Benefits

- **Streamlined Workflows**: Automated approval processes and notifications
- **Compliance Management**: Built-in regulatory compliance checks
- **Audit Trail**: Complete history of all license activities
- **Role-based Access**: Granular permissions for different user types
- **Integration Ready**: API-first architecture for third-party integrations

## Features

### Core Functionality
- **Project Management**: Complete project lifecycle management for animal research
  - Project applications and amendments
  - Version control and change tracking
  - Collaborative editing and review
  - Automated validation and compliance checks

- **Licensing System**: Comprehensive license management
  - PIL (Personal Individual License) applications and renewals
  - PPL (Project Personal License) processing
  - Training course management and certification
  - License transfers and amendments

- **Establishment Management**: Research facility oversight
  - PEL (Project Establishment License) management
  - Named person role assignments (PELH, NACWO, NVS, NPRC)
  - Location and area management
  - Compliance monitoring

### Advanced Features
- **Workflow Engine**: Intelligent process automation
  - Multi-stage approval workflows
  - Deadline management and notifications
  - Task assignment and tracking
  - Status-based routing

- **Reporting & Analytics**: Data-driven insights
  - Returns of Procedures (ROP) management
  - Regulatory reporting
  - Performance metrics and KPIs
  - Export capabilities

- **User Management**: Secure access control
  - Role-based permissions (ASRU, Establishment Admin, Applicant)
  - Single sign-on integration
  - Profile management
  - Activity logging

## Architecture

This is a monorepo containing multiple packages organized into distinct layers:

### Frontend Applications
- `asl` - Main public-facing frontend application
- `asl-internal-ui` - Internal administration interface for ASRU staff
- `asl-projects` - Project management and editing interface

### API Services
- `asl-public-api` - REST API for external integrations
- `asl-internal-api` - Internal API for administrative functions
- `asl-attachments` - File upload and document management service

### Core Services
- `asl-workflow` - Task and workflow management engine
- `asl-resolver` - Business logic and data resolution service
- `asl-notifications` - Email and notification delivery system
- `asl-metrics` - Performance monitoring and analytics
- `asl-search` - Elasticsearch integration for search functionality

### Data Layer
- `asl-schema` - Database schema definitions and models
- `asl-taskflow` - Task persistence and activity logging

### Shared Libraries
- `asl-components` - Reusable React components and UI elements
- `asl-constants` - Shared constants and enumerations
- `asl-pages` - Common page templates and middleware
- `asl-permissions` - Authorization and access control logic
- `asl-service` - Base service framework and utilities

### Support Services
- `asl-emailer` - Email template rendering and delivery
- `asl-data-exports` - Data export and reporting tools
- `asl-dictionary` - Translation and localization support

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Redis (for caching and sessions)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd aspel-workspace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development environment:
```bash
npm run dev
```

## Development

### Available Scripts

- `npm run dev` - Start development servers for all services
- `npm run build` - Build all packages for production
- `npm run test` - Run tests across all packages
- `npm run lint` - Run ESLint across all packages
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build artifacts
- `npm run security:audit` - Run security audit

### Package Structure

Each package in the `packages/` directory is a separate service with its own:
- `package.json` - Package dependencies and scripts
- `README.md` - Package-specific documentation
- `lib/` or `src/` - Source code directory
- `test/` - Test files and fixtures
- `config.js` - Service-specific configuration

### Development Workflow

1. **Branch Strategy**: Use feature branches for development
2. **Code Standards**: Follow ESLint and Prettier configurations
3. **Testing**: Write unit and integration tests for new features
4. **Documentation**: Update relevant README files
5. **Security**: Run security audits before committing

### Debugging

Enable debug logging by setting environment variables:
```bash
DEBUG=asl:* npm run dev
```

### Database Migrations

Run database migrations:
```bash
# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback
```

## Troubleshooting

### Common Issues

**Port conflicts**: Ensure ports 3000, 5000, 8080 are available
```bash
lsof -ti:3000 | xargs kill -9
```

**Database connection issues**: Verify PostgreSQL is running and accessible
```bash
pg_isready -h localhost -p 5432
```

**Memory issues**: Increase Node.js heap size for large datasets
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
```

**Module resolution errors**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

## Configuration

The system requires several environment variables to be configured. See `.env.example` for the complete list.

Key configuration areas:
- Database connections
- Email service configuration
- Authentication settings
- File storage settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Testing

### Test Types

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test service interactions
- **End-to-End Tests**: Test complete user workflows

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=asl-schema

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "test pattern"
```

## API Documentation

### Public API

The ASPeL Public API provides REST endpoints for external integrations:

- **Base URL**: `https://api.aspel.homeoffice.gov.uk`
- **Authentication**: Bearer token required
- **Rate Limiting**: 1000 requests per hour per API key

### Key Endpoints

```
GET /api/establishments - List establishments
GET /api/projects - List projects
POST /api/tasks - Create workflow tasks
GET /api/reports - Generate reports
```

For detailed API documentation, visit: `/api/docs`

## Deployment

### Environment Requirements

- **Node.js**: 18.x LTS or higher
- **PostgreSQL**: 13.x or higher
- **Redis**: 6.x or higher (for caching)
- **Elasticsearch**: 7.x (for search functionality)

### Production Deployment

1. **Environment Setup**:
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:port/db
   REDIS_URL=redis://host:port
   ELASTICSEARCH_URL=http://host:port
   ```

2. **Build and Deploy**:
   ```bash
   npm ci --production
   npm run build
   npm run migrate
   npm start
   ```

3. **Health Checks**:
   - `/health` - Application health status
   - `/ready` - Readiness probe for container orchestration

### Docker Support

Build and run with Docker:
```bash
docker build -t aspel-workspace .
docker run -p 3000:3000 aspel-workspace
```

## Performance

### Monitoring

- **Metrics**: Prometheus metrics available at `/metrics`
- **Logging**: Structured JSON logs with configurable levels
- **Tracing**: OpenTelemetry integration for distributed tracing

### Optimization Tips

- Enable Redis caching for frequently accessed data
- Use database connection pooling
- Implement proper indexing for large datasets
- Monitor memory usage and tune garbage collection

## Security

### Security Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Comprehensive data validation and sanitization
- **CSRF Protection**: Cross-Site Request Forgery protection
- **Rate Limiting**: API rate limiting and abuse prevention

### Security Audits

Regular security audits are performed:
```bash
npm audit
npm run security:scan
```

## Support

### Getting Help

- **Documentation**: Check package-specific README files
- **Issues**: Open an issue in the GitHub repository
- **Discussions**: Use GitHub Discussions for questions
- **Security**: Report security issues to security@homeoffice.gov.uk

### Community

- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- **Code of Conduct**: See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Roadmap**: See [docs/ROADMAP.md](docs/ROADMAP.md) for future plans

## Acknowledgments

This project was originally developed by the UK Home Office for managing animal research licensing procedures under the Animals (Scientific Procedures) Act 1986.

### Contributors

We thank all contributors who have helped improve this project. Special recognition to:
- UK Home Office Digital, Data and Technology team
- Animals in Science Regulation Unit (ASRU)
- The open source community

### Legal Notice

This software is provided under the MIT License. See [LICENSE](LICENSE) for full terms.