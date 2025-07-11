
# Contributing to ASPeL Workspace

Thank you for your interest in contributing to the ASPeL project! This guide will help you get started.

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm
- Access to required authentication tokens (see README.md)

### Setup Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/UKHomeOffice/aspel-workspace
   cd aspel-workspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development services**
   ```bash
   npm run dev
   ```

## Project Structure

This is a monorepo with multiple packages:

- `packages/asl-*` - Core application services
- `packages/asl-components` - Reusable UI components
- `packages/asl-pages` - Page-specific components
- `packages/asl-projects` - Project management functionality

## Ways to Contribute

### 1. Bug Reports
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Provide environment details

### 2. Feature Requests
- Discuss new features in issues first
- Consider backward compatibility
- Provide use cases and examples

### 3. Code Contributions
- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request

### 4. Documentation
- Improve README files
- Add code comments
- Create user guides
- Update API documentation

## Development Guidelines

### Code Style
- Follow existing ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Testing
- Write unit tests for new features
- Ensure existing tests pass
- Add integration tests when needed
- Test accessibility improvements

### Commit Messages
- Use descriptive commit messages
- Follow conventional commits format
- Reference issue numbers when applicable

## Pull Request Process

1. **Before submitting:**
   - Ensure code follows style guidelines
   - Run tests locally
   - Update documentation if needed

2. **PR Requirements:**
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Test coverage for new features

3. **Review process:**
   - Code review by maintainers
   - Address feedback promptly
   - Ensure CI checks pass

## Areas Needing Help

### High Priority
- [ ] Improve test coverage
- [ ] Accessibility enhancements
- [ ] Performance optimizations
- [ ] Security improvements

### Medium Priority
- [ ] UI/UX improvements
- [ ] Documentation updates
- [ ] Code refactoring
- [ ] Dependency updates

### Low Priority
- [ ] New features
- [ ] Developer tools
- [ ] Automation improvements

## Resources

- [Project Documentation](./README.md)
- [API Documentation](./docs/api.md)
- [Troubleshooting Guide](./HELPME.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

## Getting Help

- Open an issue for questions
- Join discussions in pull requests
- Check existing documentation
- Review similar issues

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
