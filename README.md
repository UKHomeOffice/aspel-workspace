# ASPeL Workspace

Animal Science Procedures e-Licensing (ASPeL) - A comprehensive monorepo for managing animal research licenses and procedures.

## Overview

This is an open source version of the UK Home Office's ASPeL system, designed for managing animal research licensing and procedures in compliance with scientific research regulations.

## Features

- **Project Management**: Complete project lifecycle management for animal research
- **Licensing System**: PIL (Personal Individual License) and PPL (Project Personal License) management
- **Establishment Management**: Research facility and location management
- **Workflow Engine**: Automated approval and review workflows
- **Reporting**: Comprehensive reporting and audit trails
- **User Management**: Role-based access control and permissions

## Architecture

This is a monorepo containing multiple packages:

- `asl` - Main frontend application
- `asl-internal-ui` - Internal administration interface
- `asl-public-api` - Public API service
- `asl-schema` - Database schema and models
- `asl-workflow` - Workflow engine
- `asl-notifications` - Email and notification service
- `asl-components` - Shared React components
- `asl-resolver` - Data resolution service
- And many more specialized packages

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

### Package Structure

Each package in the `packages/` directory is a separate service with its own:
- `package.json` - Package dependencies and scripts
- `README.md` - Package-specific documentation
- Source code in appropriate directories

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

## Support

For support and questions, please open an issue in the GitHub repository.

## Acknowledgments

This project was originally developed by the UK Home Office for managing animal research licensing procedures.