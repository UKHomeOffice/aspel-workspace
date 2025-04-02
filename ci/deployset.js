#!/usr/bin/env node
"use strict";

const { parseArgs } = require("node:util")
const common = require("./common")
const { log, getBuildInfo } = common

// Constants

const BUILD_STATUS_FAILURE = "failure"
const BUILD_STATUS_SUCCESS = "success"

// Functions

const collectEnvironment = () => {
    return {
        DRONE_SERVER: process.env.DRONE_SERVER,
        DRONE_TOKEN: process.env.DRONE_TOKEN,
        DRONE_REPO_OWNER: process.env.DRONE_REPO_OWNER,
        DRONE_REPO_NAME: process.env.DRONE_REPO_NAME,
        DRONE_BUILD_NUMBER: process.env.DRONE_BUILD_NUMBER,
        SKIP_STATUS: process.env.SKIP_STATUS,
    }
}

const collectArguments = () => {
    return parseArgs({
        options: {
            backoff: { type: "string", default: "10", short: "b" },
            help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
    })
}

const collectDeployStages = async (backoff, positionals, environment) => {
    const pendingDeployStages = positionals.reduce((acc, stage) => (acc[stage] = true, acc), {})
    const completedDeployStages = {}
    
    while (Object.keys(pendingDeployStages).length > 0) {
        log(`\nPending build stages: ${Object.keys(pendingDeployStages).join(", ")}`)
        log(`Collected deploy stages: ${Object.keys(completedDeployStages).join(", ")}`)
        log(`Polling build info endpoint in ${backoff} seconds...`)
        await new Promise(resolve => setTimeout(resolve, backoff * 1000))

        const build = await getBuildInfo(
            environment.DRONE_SERVER, 
            environment.DRONE_REPO_OWNER, 
            environment.DRONE_REPO_NAME, 
            environment.DRONE_BUILD_NUMBER, 
            environment.DRONE_TOKEN,
        )

        if (build.status === BUILD_STATUS_FAILURE) {
            throw new Error(`Build failed: ${build.status}`)
        }

        for (const buildStage of build.stages) {
            if (buildStage.status === BUILD_STATUS_FAILURE) {
                throw new Error(`Build stage '${buildStage.name}' failed: ${buildStage.status}`)
            }
        }

        for (const deployStageName of Object.keys(pendingDeployStages)) {
            const deployStage = build.stages.find(stage => stage.name === deployStageName)
            if (!deployStage) {
                throw new Error(`Build stage '${deployStageName}' not found`)
            }
            if (deployStage.status !== BUILD_STATUS_SUCCESS) {
                continue
            }
            if (pendingDeployStages[deployStageName]) {
                log(`Build stage '${deployStageName}' completed`)
                delete pendingDeployStages[deployStageName]
            }
            if (deployStage.steps.every(step => step.exit_code === 0)) {
                log(`Build stage '${deployStageName}' will be deployed`)
                completedDeployStages[deployStageName] = true
            }
        }
    }

    return Object.keys(completedDeployStages)
}

// Commands

const help = () => {
    log("Usage: deployset <stage-1> [stage-2] [...]")
    log("\nDescription: poll the drone build info endpoint until all parameterized stages are complete then return deployable stages")
    log(`\nOptions:`);
    log("  -h, --help  Display this help message")
}

const main = async ({ values, positionals }) => {
    const ENVIRONMENT = collectEnvironment()

    if (values.help) {
        help();
        process.exit(0);
    }

    for (const [key, value] of Object.entries(ENVIRONMENT)) {
        if (!value) {
            throw new Error(`Environment variable '${key}' not set`)
        }
    }

    if (positionals.length === 0) {
        throw new Error("Must provide at least one stage")
    }

    log("Collecting deploy stages...")

    const deployStages = await collectDeployStages(parseInt(values.backoff), positionals, ENVIRONMENT)

    if (deployStages.length === 0) {
        log("\nNo stages to deploy")
    } else {
        log(`\nFound stages to deploy: ${deployStages.join(", ")}`)
    }
    
    return deployStages;
}

// Run

if (require.main === module) {
    (async () => {
        let stages;
        try {
            stages = await main(collectArguments())
        } catch (err) {
            log(err.message)
            process.exit(1)
        }
        if (stages.length === 0) {
            log("\nNo stages to deploy")
            process.exit(process.env.SKIP_STATUS)
        }
        log(`\nFound stages to deploy: ${stages.join(", ")}`)
        console.log(stages.join(" "))
        process.exit(0)
    })()
}

module.exports = main