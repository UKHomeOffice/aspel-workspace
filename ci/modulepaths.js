#!/usr/bin/env node
"use strict";

const { parseArgs } = require("node:util");
const { collectModulesPaths, log } = require("./common")

// Commands

const help = () => {
    log("Usage: localpaths <module-path>")
    log("\nDescription: for a node module, collect file paths to all local dependencies including itself, resolved to the current working directory")
    log(`\nOptions:`);
    log("  -h, --help  Display this help message")
}

const main = () => {
    const { values, positionals } = parseArgs({
        options: {
            help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
    })

    if (values.help) {
        help();
        process.exit(0);
    }

    if (positionals.length !== 1) {
        log("Must provide a single module directory path")
        process.exit(1)
    }

    const modulePath = positionals[0]
    const modulePaths = collectModulesPaths([modulePath])
    log("")
    console.log(modulePaths.join(" "))
}

// Run

main()