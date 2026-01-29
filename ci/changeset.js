#!/usr/bin/env node
"use strict";

const { execSync } = require('node:child_process')
const { parseArgs } = require("node:util")
const { existsSync } = require("node:fs")
const { collectModulesPaths, log } = require("./common")

// Environment

const ENVIRONMENT = {
  TARGET_BRANCH: process.env.TARGET_BRANCH,
  SOURCE_COMMIT: process.env.SOURCE_COMMIT,
  BUILD_EVENT: process.env.BUILD_EVENT,
  SKIP_STATUS: process.env.SKIP_STATUS,
}

const { TARGET_BRANCH, SOURCE_COMMIT, BUILD_EVENT, SKIP_STATUS } = ENVIRONMENT;

// Constants

const PUSH_EVENT="push"
const PULL_REQUEST_EVENT="pull_request"

// Functions

/**
 * Determine whether pull request changes have occured in a given path
 * by comparing the target branch to the source commit.
 */
const isPullRequestChanged = (path) => execSync(`git --no-pager diff --name-only --exit-code ${TARGET_BRANCH} ${SOURCE_COMMIT} -- ${path}`, { stdio: 'pipe' });

/**
 * Determine whether push changes have occured in a given path
 * by comparing the source commit to the previous commit.
 */
const isPushChanged = (path) => execSync(`git --no-pager diff --name-only --exit-code ${SOURCE_COMMIT}~1 ${SOURCE_COMMIT} -- ${path}`, { stdio: 'pipe' });

/**
 * Determine whether file changes have occured in a list of paths
 * by running each path against a diffing function.
 */
const isPathsChanged = (paths, diff) => {
  log(`\nPaths: ${paths.join(', ')}`);
  const changes = paths.reduce((count, path) => {
    log(`\nDiffing path '${path}'`);
    try {
      diff(path);
      log(`No changes in '${path}'`);
      return count;
    } catch (error) {
      log(`\x1b[33m${String(error.stdout).trim()}\x1b[0m`)
      if (error.status !== 1) {
        throw error;
      }
      log(`Change detected in '${path}'`);
      return count+1;
    }
  }, 0);
  if (changes === 0) {
    log('\nNo changes detected');
    return false
  }
  log(`\n${changes} changes detected`);
  return true;
}

// Commands

const help = () => {
  log(`\nUsage: changeset [options]`);
  log(`\nDescription: determine whether a build should run based on the CI event which triggered it`);
  log(`\nOptions:`);
  log(`  -m, --modules <module>  List of module paths which constitute the build`);
  log(`  -p, --paths <path>      List of explicit paths to add to the build`);
  log(`  -h, --help              Display this help message`);
}

const main = () => {
  const { values } = parseArgs({
    options: {
      modules: {
        type: "string",
        multiple: true,
        short: "m",
        default: [],
      },
      paths: {
        type: "string",
        multiple: true,
        short: "p",
        default: [],
      },
      help: {
        type: "boolean",
        short: "h",
      },
    }
  })

  if (values.help) {
    help();
    process.exit(0);
  }

  for (const [key, value] of Object.entries(ENVIRONMENT)) {
    if (!value) {
      log(`Environment variable '${key}' not set`);
      process.exit(1);
    }
  }

  if (values.modules.length === 0 && values.paths.length === 0) {
    log(`No modules or paths specified`);
    process.exit(1);
  }

  for (const path of values.paths) {
    if (!existsSync(path)) {
      log(`Path '${path}' not found`);
      process.exit(1)
    }
  }

  log(`\nTarget branch: ${TARGET_BRANCH}`);
  log(`Source commit: ${SOURCE_COMMIT}`);
  log(`Build event: ${BUILD_EVENT}`);

  const paths = [
    ...collectModulesPaths(values.modules),
    ...values.paths,
    './package-lock.json'
  ];

  const shouldBuildRun = (() => {
    switch (BUILD_EVENT) {
      case PULL_REQUEST_EVENT:
        return isPathsChanged(paths, isPullRequestChanged);
      case PUSH_EVENT:
        return isPathsChanged(paths, isPushChanged);
      default:
        log(`Build event '${BUILD_EVENT}' not yet implemented`);
        process.exit(1);
    }
  })()

  if (!shouldBuildRun) {
    process.exit(SKIP_STATUS);
  }
}

// Run

main()
