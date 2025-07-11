
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Fixing workspace dependencies...');

// Read root package.json
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const workspaces = rootPackageJson.workspaces || [];

// Common dependencies that should be hoisted
const hoistDependencies = [
  'lodash',
  'express',
  'react',
  'react-dom',
  'moment',
  'uuid',
  'debug'
];

workspaces.forEach(workspace => {
  const workspacePath = path.join(process.cwd(), workspace);
  
  if (fs.existsSync(workspacePath)) {
    console.log(`Checking workspace: ${workspace}`);
    
    // Check each package directory
    const packages = fs.readdirSync(workspacePath).filter(dir => {
      const packageJsonPath = path.join(workspacePath, dir, 'package.json');
      return fs.existsSync(packageJsonPath);
    });
    
    packages.forEach(pkg => {
      const packageJsonPath = path.join(workspacePath, pkg, 'package.json');
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        let modified = false;
        
        // Remove problematic dependencies
        if (packageJson.dependencies && packageJson.dependencies['@ukhomeoffice/eslint-config-asl']) {
          delete packageJson.dependencies['@ukhomeoffice/eslint-config-asl'];
          modified = true;
          console.log(`Removed problematic dependency from ${pkg}`);
        }
        
        if (packageJson.devDependencies && packageJson.devDependencies['@ukhomeoffice/eslint-config-asl']) {
          delete packageJson.devDependencies['@ukhomeoffice/eslint-config-asl'];
          modified = true;
          console.log(`Removed problematic dev dependency from ${pkg}`);
        }
        
        if (modified) {
          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        }
      } catch (e) {
        console.warn(`Could not process ${packageJsonPath}: ${e.message}`);
      }
    });
  }
});

console.log('Dependency fixing complete!');
