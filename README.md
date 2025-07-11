# ASPeL Workspace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Animal Science Procedures e-Licensing (ASPeL) - A comprehensive monorepo for managing animal research licenses and procedures in compliance with UK regulations.

This repository uses NPM Workspaces to manage multiple packages efficiently and provides a complete solution for animal research licensing workflow management.

## 🌟 Features

- **Comprehensive License Management**: Handle all types of animal research licenses
- **Workflow Automation**: Streamlined approval and review processes
- **Real-time Notifications**: Keep stakeholders informed of license status changes
- **Document Management**: Secure storage and versioning of license documents
- **Reporting & Analytics**: Detailed insights into licensing metrics
- **Multi-tenant Architecture**: Support for multiple research establishments

## Table of Contents

1. [Useful Commands](#useful-commands)
2. [Requirements](#requirements)
3. [Install](#install)
4. [Run](#run)
5. [NPM Workspaces](#npm-workspaces)
6. [Troubleshooting](#troubleshooting)
7. [Tips and Tricks](#tips-and-tricks)

## Useful Commands

- **Install dependencies:** `npm install` or `npm install:env`
- **Uninstall dependencies:** `npm run reset`
- **Build all service containers:** `npm run build`
- **Run a script in a specific package:** `npm run <script> -w <package_name>`
- **Run a script in the monorepo root:** `npm run <script>`
- **Add a dependency to a specific package:** `npm install <dependency_name> -w <package_name>`
- **Add a dependency to the monorepo root:** `npm install <dependency_name>`

## Requirements

- Node.js (v14 or later)

## Install

You will need to have some authentication tokens set to install modules from home office repositories. Ensure the following variables are set in your shell environment, or otherwise create an `.env` file which looks like this:

```
GITHUB_AUTH_TOKEN=ghp_oam...
ART_AUTH_TOKEN=eyJ2ZX...
```

The GitHub auth token should be a personal access token with read access on private repositories.

The Artefactory auth token should be sourced from a member of the developer team.

1. **Clone the repository**:

```sh
git clone https://github.com/UKHomeOffice/aspel-workspace
```

2. **Install dependencies**:

If you are using an `.env` file:

```sh
npm run install:env
```

Otherwise a standard install is fine if the required credentials are already set in your environment:

```sh
npm install
```

## Run

### Development Services

**asl** and **asl-internal-ui** are the services you will typically be running in an IDE environment. You can start these automatically with:

```sh
npm run dev
```

To customise the services which will be run when executing this command, add a space separated environment variable to your `.env` file:

```sh
DEV_SERVICES="asl asl-internal-ui asl-internal-api"
```

Once services have been started, the ideal way so far we discovered is to run the [**asl-conductor**](https://github.com/UKHomeOffice/asl-conductor) with this script:

```sh
npm start -- --local asl --local asl-internal-ui
```

### Containerized Services

Sometimes you may want to run a containerized version of a service to ensure that the compiled code is executing as expected in a more realistic production environment.

To build the container for a service, such as `asl`, run:

```sh
npm run build -- packages/asl
```

Or otherwise to build containers for all services, run:

```sh
npm run build
```

See the script file for more configuration options.

These local containers can be run in `asl-conductor` by modifying the `conductor.json` file to point to the latest local version for each service you want to test:

```js
{
  "name": "asl",
  "image": "asl:latest",
  "network": "asl",
  "env": {
    ...
  }
}
```

## NPM Workspaces

### Adding Dependencies

To add a dependency to a specific package:

```sh
npm install <dependency_name> -w <package_name>
```

To add a dependency to the monorepo:

```sh
npm install <dependency_name>
```

This second command should not be used to install dependencies required by our sub packages. Only dependencies used by the monorepo root (for CI/test/scripting e.t.c).

### Removing Dependencies

To remove a dependency from a specific package:

```sh
npm uninstall <dependency_name> -w <package_name>
```

To remove a dependency from the monorepo:

```sh
npm uninstall <dependency_name>
```

This second command will not remove depdencies from sub packages if they are also declared there. Only dependencies in the monorepo root `package.json`.

### Running Scripts

To run a script in a specific package:

```sh
npm run <script> -w <package_name>
```

To run a script for the monorepo:

```sh
npm run <script>
```

This second command will only run scripts declared in the root `package.json`, not in sub packages.

## Troubleshooting

See the [HELPME.md](HELPME.md) file.

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

### Quick Start for Contributors

1. **Setup Development Environment**
   ```bash
   git clone https://github.com/UKHomeOffice/aspel-workspace.git
   cd aspel-workspace
   ./scripts/setup-dev.sh
   ```

2. **Make Your Changes**
   - Create a feature branch: `git checkout -b feature/your-feature-name`
   - Make your changes following our coding standards
   - Add tests for new functionality

3. **Submit Your Contribution**
   - Run tests: `npm test`
   - Run linting: `npm run lint`
   - Commit your changes: `git commit -m "feat: add your feature description"`
   - Push to your fork and submit a pull request

### Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Tips and Tricks

### ESLint Configuration

ESLint relative extends don't work in both the workspace and CI/CD at the same time, as the installation path changes
between the two. The rules have been moved to `@ukhomeoffice/eslint-config-asl`, so if a module hasn't been updated yet
update the package.json to use `"@ukhomeoffice/eslint-config-asl": "^3.0.0"` and update .eslintrc to

```yaml
extends:
  - "@ukhomeoffice/asl"
```

### IDE Setup

For VS Code, install the recommended extensions:
- ESLint
- Prettier
- GitLens

For IntelliJ, go to settings > Languages & Frameworks > JavaScript > ESLint. Change to "Automatic ESLint configuration" and check "Run eslint --fix on save".

## 🆘 Support

- 📖 Check the [Documentation](docs/)
- 🐛 Report bugs via [GitHub Issues](https://github.com/UKHomeOffice/aspel-workspace/issues)
- 💬 Join our [Discussions](https://github.com/UKHomeOffice/aspel-workspace/discussions)
- 📧 Email us at support@aspel-project.org
