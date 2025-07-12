
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkNodeVersion() {
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      log(`✓ Node.js version: ${version}`, colors.green);
      return true;
    } else {
      log(`✗ Node.js version ${version} is too old. Require 18.x or higher`, colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Could not check Node.js version: ${error.message}`, colors.red);
    return false;
  }
}

function checkPackageJson() {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      log(`✓ Package.json found: ${pkg.name}@${pkg.version}`, colors.green);
      return true;
    } else {
      log('✗ package.json not found', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Error reading package.json: ${error.message}`, colors.red);
    return false;
  }
}

function checkDependencies() {
  try {
    if (fs.existsSync('node_modules')) {
      log('✓ Dependencies installed', colors.green);
      return true;
    } else {
      log('✗ Dependencies not installed. Run: npm install', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Error checking dependencies: ${error.message}`, colors.red);
    return false;
  }
}

function checkEnvironment() {
  try {
    if (fs.existsSync('.env')) {
      log('✓ Environment file (.env) exists', colors.green);
    } else if (fs.existsSync('.env.example')) {
      log('⚠ .env file missing, but .env.example found', colors.yellow);
      log('  Run: cp .env.example .env', colors.blue);
    } else {
      log('✗ No environment configuration found', colors.red);
      return false;
    }
    return true;
  } catch (error) {
    log(`✗ Error checking environment: ${error.message}`, colors.red);
    return false;
  }
}

function checkPorts() {
  const ports = [3000, 5000, 8080];
  let available = true;
  
  ports.forEach(port => {
    try {
      execSync(`lsof -Pi :${port} -sTCP:LISTEN -t`, { stdio: 'ignore' });
      log(`⚠ Port ${port} is in use`, colors.yellow);
      available = false;
    } catch (error) {
      log(`✓ Port ${port} is available`, colors.green);
    }
  });
  
  return available;
}

function checkGit() {
  try {
    if (fs.existsSync('.git')) {
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      log(`✓ Git repository (branch: ${branch})`, colors.green);
      return true;
    } else {
      log('⚠ Not a git repository', colors.yellow);
      return true; // Not critical
    }
  } catch (error) {
    log(`⚠ Git check failed: ${error.message}`, colors.yellow);
    return true; // Not critical
  }
}

function runSecurityAudit() {
  try {
    log('Running security audit...', colors.blue);
    execSync('npm audit --audit-level moderate', { stdio: 'pipe' });
    log('✓ No security vulnerabilities found', colors.green);
    return true;
  } catch (error) {
    log('⚠ Security vulnerabilities detected. Run: npm audit fix', colors.yellow);
    return false; // Not critical for development
  }
}

function main() {
  log('🔍 ASPeL Workspace Health Check', colors.bright);
  log('================================', colors.bright);
  
  const checks = [
    { name: 'Node.js Version', fn: checkNodeVersion, critical: true },
    { name: 'Package.json', fn: checkPackageJson, critical: true },
    { name: 'Dependencies', fn: checkDependencies, critical: true },
    { name: 'Environment', fn: checkEnvironment, critical: false },
    { name: 'Port Availability', fn: checkPorts, critical: false },
    { name: 'Git Repository', fn: checkGit, critical: false },
    { name: 'Security Audit', fn: runSecurityAudit, critical: false }
  ];
  
  let criticalFailures = 0;
  let warnings = 0;
  
  checks.forEach(check => {
    try {
      const result = check.fn();
      if (!result) {
        if (check.critical) {
          criticalFailures++;
        } else {
          warnings++;
        }
      }
    } catch (error) {
      log(`✗ ${check.name} check failed: ${error.message}`, colors.red);
      if (check.critical) {
        criticalFailures++;
      }
    }
  });
  
  log('\n================================', colors.bright);
  
  if (criticalFailures > 0) {
    log(`❌ Health check failed with ${criticalFailures} critical issue(s)`, colors.red);
    process.exit(1);
  } else if (warnings > 0) {
    log(`⚠️  Health check passed with ${warnings} warning(s)`, colors.yellow);
    process.exit(0);
  } else {
    log('✅ All health checks passed!', colors.green);
    log('\nYou can now run: npm run dev', colors.blue);
    process.exit(0);
  }
}

main();
