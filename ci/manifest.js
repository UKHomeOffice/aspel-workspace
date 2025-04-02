#!/usr/bin/env node
"use strict";

const { parseArgs } = require("node:util")
const path = require("node:path")
const yaml = require("yaml")
const common = require("./common")
const { log, getGithubFile, writeGithubFile } = common

// Functions

const collectEnvironment = () => {
    return {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN,
        GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER,
        GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME,
        GITHUB_MANIFEST_PATH: process.env.GITHUB_MANIFEST_PATH,
        SOURCE_COMMIT: process.env.SOURCE_COMMIT,
        SOURCE_COMMIT_MESSAGE: process.env.SOURCE_COMMIT_MESSAGE,
    }
}

const collectArguments = () => parseArgs({
    options: {
        help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
})

const parseManifest = (manifest, ext) => {
    switch (ext) {
        case ".json":
            return JSON.parse(manifest)
        case ".yml":
        case ".yaml":
            return yaml.parse(manifest)
        default:
            throw new Error(`Unsupported manifest file extension: '${ext}'`)
    }
}

const stringifyManifest = (manifest, ext) => {
    switch (ext) {
        case ".json":
            return JSON.stringify(manifest, null, "  ")
        case ".yml":
        case ".yaml":
            return yaml.stringify(manifest)
        default:
            throw new Error(`Unsupported manifest file extension: '${ext}'`)
    }
}

const writeMessage = (msg, deployStages) => {
    if (msg.match(/^Merge pull request/)) {
        msg = msg.split('\n').slice(1).join('\n').trim();
    }
    msg = `${msg}\n\n`
    for (const deployStage of deployStages) {
        msg = `${msg}- ${deployStage}\n`
    }
    const head = deployStages.slice(0, 1)
    const tail = deployStages.slice(1)
    return `[${head}${tail.length > 0 ? `, +${tail.length}` : ""}] ${msg.trim()}`
}

// Commands

const help = () => {
    log("Usage: manifest [stage-1] [stage-2] [...]")
    log("\nDescription: update the remote manifest with new image tags for deployed stages")
    log(`\nOptions:`);
    log("  -h, --help  Display this help message")
}

const main = async ({ values, positionals: deployStages }) => {
    const ENVIRONMENT = collectEnvironment()

    const {
        GITHUB_TOKEN,
        GITHUB_REPO_OWNER,
        GITHUB_REPO_NAME,
        GITHUB_MANIFEST_PATH,
        SOURCE_COMMIT,
        SOURCE_COMMIT_MESSAGE
    } = ENVIRONMENT

    if (values.help) {
        help()
        process.exit(0)
    }

    for (const [key, value] of Object.entries(ENVIRONMENT)) {
        if (!value) {
            throw new Error(`Environment variable '${key}' not set`)
        }
    }

    if (deployStages.length === 0) {
        throw new Error("Must provide at least one stage")
    }

    const manifestFileUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_MANIFEST_PATH}`
    const manifestExt = path.extname(GITHUB_MANIFEST_PATH)

    log(`Updating manifest '${GITHUB_MANIFEST_PATH}' in repository '${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}'`)

    log(`Reading manifest from '${manifestFileUrl}'...`)
    const {manifest, sha} = await getGithubFile(manifestFileUrl, GITHUB_TOKEN)

    log(`Updating manifest...`)
    const jsonManifest = parseManifest(manifest, manifestExt)
    for (const deployStage of deployStages) {
        if (!jsonManifest[deployStage]) {
            log(`Deploy stage '${deployStage}' not found in manifest`)
        }
        log(`Updating deploy stage '${deployStage}' with source commit '${SOURCE_COMMIT}'`)
        jsonManifest[deployStage] = SOURCE_COMMIT
    }
    const updatedManifest = stringifyManifest(jsonManifest, manifestExt)

    log(`Manifest updated.\n`)
    for (const [key, value] of Object.entries(jsonManifest)) {
        log(`${key}: ${value}`)
    }

    log(`\nWriting updated manifest to '${manifestFileUrl}'...`)
    const message = writeMessage(SOURCE_COMMIT_MESSAGE, deployStages)
    await writeGithubFile(manifestFileUrl, sha, message, updatedManifest, GITHUB_TOKEN)
}

// Run

if (require.main === module) {
    (async () => {
        try {
            await main(collectArguments())
        } catch (err) {
            log(err.message)
            process.exit(1)
        }
    })()
}

module.exports = main