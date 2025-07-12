
#!/bin/bash

echo "Cleaning up node_modules and package-lock files..."
rm -rf node_modules
rm -rf package-lock.json
find packages -name "node_modules" -type d -exec rm -rf {} +
find packages -name "package-lock.json" -type f -delete

echo "Installing dependencies with correct registry..."
npm install --registry=https://registry.npmjs.org/

echo "Clean install completed!"
