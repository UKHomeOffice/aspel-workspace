const { readFileSync, existsSync } = require("node:fs")
const { resolve, join } = require("node:path")

const log = (message) => {
  process.stderr.write(`${message}\n`);
}

/** 
 * For a module directory path, confirm a package.json file
 * exists and return its parsed JSON content.
 */
const collectModuleJson = (module) => {
  log(`\nParsing module '${module}'`);
  const packagePath = `./${module}/package.json`;
  if (!existsSync(packagePath)) {
    log(`Package file '${packagePath}' not found`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(packagePath, 'utf8'));
}

/** 
 * For a module package.json object, return its merged
 * dependencies and devDependencies objects.
 */
const collectModuleDependencies = (moduleJson) => {
  const result = {};
  for (const field of ["dependencies", "devDependencies"]) {
    const dependencies = moduleJson[field]
    if (typeof dependencies !== 'object') {
      continue
    }
    Object.assign(result, dependencies);
  }
  return result;
}

/** 
 * For an object of collected dependencies, return an array
 * of paths to those which are local file dependencies,
 * resolved from the module directory.
 */
const collectModulePaths = (module, dependencies) => {
  const fileExp = /^file:(.*)$/gm;
  const paths = [];
  for (const [name, source] of Object.entries(dependencies)) {
    const match = fileExp.exec(source);
    if (!match) {
      continue
    }
    const value = match[1];
    log(`Module '${module}' depends on '${name}' with local source '${value}'`);
    const dependencyDir = `${module}/${value}`;
    const depdendencyPath = resolve(`${dependencyDir}/package.json`);
    if (!existsSync(depdendencyPath)) {
      log(`Dependency path '${depdendencyPath}' not found`);
      process.exit(1);
    }
    paths.push(join(dependencyDir))
  }
  return paths;
}

/** 
 * For a list of modules, return the full list of dependent paths 
 * including the local file dependencies of each module.
 */
const collectModulesPaths = (modules) => {
  const paths = []
  for (const module of modules) {
    const moduleJson = collectModuleJson(module);
    const dependencies = collectModuleDependencies(moduleJson);
    const dependencyPaths = collectModulePaths(module, dependencies);
    paths.unshift(module, ...dependencyPaths);
  }
  return Array.from(new Set(paths));
}

module.exports = { collectModuleJson, collectModuleDependencies, collectModulePaths, collectModulesPaths, log }