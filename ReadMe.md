# ASPeL Workspace

This repository uses Yarn Workspaces to manage multiple packages efficiently and `concurrently` to run scripts across these packages simultaneously.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Yarn Workspaces](#yarn-workspaces)
5. [Running Scripts Concurrently](#running-scripts-concurrently)
6. [Useful Commands](#useful-commands)
7. [Tips and Tricks](#tips-and-tricks)

## Introduction

This repository is a monorepo that houses multiple packages. It uses Yarn Workspaces to streamline dependency management and the `concurrently` package to run multiple scripts in parallel.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn (v1.22 or later)
- How workspaces works? [Link Here](https://collaboration.homeoffice.gov.uk/display/ASPEL/Setup+local+Environment+ASPeL)
### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/UKHomeOffice/aspel-workspace
   ```

2. Install dependencies:

   ```sh
   yarn install
   ```

## Project Structure

```
aspel-workspace/
│
├── packages/
│   ├── asl/
│   ├── asl-internal-ui/
│   ├── asl-resolver/
│   └── ....
│
├── package.json
└── yarn.lock
```

## Yarn Workspaces

### Configuration

The workspace configuration is defined in the root `package.json`:

```json
{
  "name": "aspel-workspace",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

### Adding Dependencies

To add a dependency to a specific package:

```sh
cd packages/asl
yarn add package-name
```

To add a dependency to all workspaces:

```sh
yarn add -W package-name
```

### Removing Dependencies

To remove a dependency to a specific package: When it is version conflict or only required in one module.

```sh
cd packages/asl
yarn remove package-name
```

To remove a dependency to all workspaces: When a dependencies are used in multiple modules. 

```sh
yarn remove -W package-name
```

### Running Scripts

To run a script in a specific package:

```sh
yarn workspace asl run script-name
```

To run a script in all workspaces:

```sh
yarn workspaces run script-name
```

## Running Scripts Concurrently

To run scripts concurrently across multiple packages, use the `concurrently` package. Add it as a dev dependency if not already installed:

```sh
yarn add concurrently --dev
```

### Example Script

In the root `package.json`, add a script to run multiple dev servers:

```json
{
  "scripts": {
    "dev": "concurrently --kill-others-on-fail \"yarn workspace asl run dev\" \"yarn workspace asl-com run dev\" \"yarn workspace asl-serv run dev\""
  }
}
```

Run the script:

```sh
yarn run dev
```

## Useful Commands

- Install dependencies: `yarn install`
- Run a script in a specific package: `yarn workspace <package-name> run <script-name>`
- Run a script in all workspaces: `yarn workspaces run <script-name>`
- Add a dependency to a specific package: `yarn workspace <package-name> add <dependency-name>`
```

Feel free to adjust the repository URL and package names as needed!
