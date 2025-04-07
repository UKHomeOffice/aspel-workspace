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
  const fileExp = /^file:(.*)$/m;
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
    const dependencyJoined = join(dependencyDir);
    // Recursively collect paths for this dependency
    paths.push(dependencyJoined, ...collectModulesPaths([dependencyJoined]));
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

/**
 * Fetch the build info for a secific build from the Drone API.
 * https://docs.drone.io/api/builds/build_info/
 */
const getBuildInfo = async (server, owner, name, build, token) => {
  const buildInfoUrl = `${server}/api/repos/${owner}/${name}/builds/${build}`
  const result = await fetch(new Request(buildInfoUrl, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      }
  }))
  return await result.json()
}

/**
 * Fetch a file from the GitHub API.
 * https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
 */
const getGithubFile = async (url, token) => {
    const getFileRequest = () => new Request(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/vnd.github.raw+json",
            "Authorization": `Bearer ${token}`
        }
    })
    const result = await fetch(getFileRequest())
    const manifestFile = await result.json()
    return {
        manifest: Buffer.from(manifestFile.content, "base64").toString(),
        sha: manifestFile.sha
    }
}

/**
 * Write a file to the GitHub API.
 * https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
 */
const writeGithubFile = async (url, sha, message, file, token) => {
    const writeFileRequest = () => new Request(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/vnd.github+json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            message,
            sha,
            content: Buffer.from(file).toString("base64")
        })
    })
    const response = await fetch(writeFileRequest())
    if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Failed to update manifest: ${response.statusText}`)
    }
}

module.exports = {
  log,
  collectModuleJson,
  collectModuleDependencies,
  collectModulePaths,
  collectModulesPaths,
  getBuildInfo,
  getGithubFile,
  writeGithubFile
}
