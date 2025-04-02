const { describe, it, before, after, afterEach } = require("node:test");
const assert = require("node:assert").strict;
const proxyquire = require("proxyquire").noPreserveCache()

describe("deployset", () => {
    let env = process.env
    let stderr = process.stderr.write

    const validEnv = () => ({
        DRONE_SERVER: "test-drone-server", 
        DRONE_TOKEN: "test-drone-token", 
        DRONE_REPO_NAME: "test-repo-name", 
        DRONE_REPO_OWNER: "test-repo-owner", 
        DRONE_BUILD_NUMBER: "test-build-number",
        SKIP_STATUS: "test-skip-status"
    })

    before(() => {
        process.stderr.write = () => {}
    })

    after(() => {
        process.stderr.write = stderr
    })

    afterEach(() => {
        process.env = env
    })

    describe("when using valid parameters", () => {
        describe("when all steps for a stage exit with code 0", () => {
            it("should output the stage", async () => {
                process.env = {...process.env, ...validEnv()}
                const deployset = proxyquire("./deployset", {
                    "./common": {
                        getBuildInfo: async () => ({
                            stages: [
                                {
                                    name: "test-stage",
                                    status: "success",
                                    steps: [
                                        {
                                            name: "test-step",
                                            exit_code: 0,
                                        },
                                    ]
                                }
                            ],
                        })
                    } 
                })
                const stages = await deployset({ values: { backoff: 0 }, positionals: ["test-stage"] })
                assert.deepEqual(stages, ["test-stage"], "Expected stages to be output")
            })
        })

        describe("when a step for a stage exits with non-zero code", () => {
            it("should not output the stage", async () => {
                process.env = {...process.env, ...validEnv()}
                const deployset = proxyquire("./deployset", {
                    "./common": {
                        getBuildInfo: async () => ({
                            stages: [
                                {
                                    name: "test-stage",
                                    status: "success",
                                    steps: [
                                        {
                                            name: "test-step",
                                            exit_code: 78,
                                        },
                                    ]
                                }
                            ],
                        })
                    } 
                })
                const stages = await deployset({ values: { backoff: 0 }, positionals: ["test-stage"] })
                assert.deepEqual(stages, [], "Expected no stages to be output")
            })
        })

        describe("when multiple stages complete across several polling intervals", () => {
            it("should output the stages", async () => {
                process.env = {...process.env, ...validEnv()}
                const deployset = proxyquire("./deployset", {
                    "./common": {
                        getBuildInfo: (() => {
                            let count = 0
                            return async () => {
                                switch (count++) {
                                    case 0: {
                                        return {
                                            stages: [
                                                {
                                                    name: "test-stage-1",
                                                    status: "success",
                                                    steps: [
                                                        {
                                                            name: "test-step-1",
                                                            exit_code: 0,
                                                        },
                                                    ]
                                                },
                                                {
                                                    name: "test-stage-2",
                                                    steps: [
                                                        {
                                                            name: "test-step-2",
                                                        },
                                                    ]
                                                },
                                                {
                                                    name: "test-stage-3",
                                                    steps: [
                                                        {
                                                            name: "test-step-3",
                                                        },
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                    case 1: {
                                        return {
                                            stages: [
                                                {
                                                    name: "test-stage-1",
                                                    status: "success",
                                                    steps: [
                                                        {
                                                            name: "test-step-1",
                                                            exit_code: 0,
                                                        },
                                                    ]
                                                },
                                                {
                                                    name: "test-stage-2",
                                                    status: "success",
                                                    steps: [
                                                        {
                                                            name: "test-step-2",
                                                            exit_code: 0,
                                                        },
                                                    ]
                                                },
                                                {
                                                    name: "test-stage-3",
                                                    steps: [
                                                        {
                                                            name: "test-step-3",
                                                        },
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                    case 2: {
                                        return {
                                            stages: [
                                                {
                                                    name: "test-stage-1",
                                                    status: "success",
                                                    steps: [
                                                        {
                                                            name: "test-step-1",
                                                            exit_code: 0,
                                                        },
                                                    ]
                                                },
                                                {
                                                    name: "test-stage-2",
                                                    status: "success",
                                                    steps: [
                                                        {
                                                            name: "test-step-2",
                                                            exit_code: 0,
                                                        },
                                                    ]
                                                },
                                                {
                                                    name: "test-stage-3",
                                                    status: "success",
                                                    steps: [
                                                        {
                                                            name: "test-step-3",
                                                            exit_code: 78
                                                        },
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                    default:
                                        throw new Error("Unexpected call to getBuildInfo")
                                }
                            }
                        })()
                    },
                })
                const stages = await deployset({ values: { backoff: 0 }, positionals: ["test-stage-1", "test-stage-2", "test-stage-3"] })
                assert.deepEqual(stages, ["test-stage-1", "test-stage-2"], "Expected stages to be output")
            })
        })

        describe("when the build fails", () => {
            it("should throw an error", async () => {
                process.env = {...process.env, ...validEnv()}
                try {
                    const deployset = proxyquire("./deployset", {
                        "./common": {
                            getBuildInfo: async () => ({
                                status: "failure",
                            })
                        } 
                    })
                    await deployset({ values: { backoff: 0 }, positionals: ["test-stage"] })
                } catch (err) {
                    assert.ok(err instanceof Error, "Expected an error to be thrown")
                    return
                }
                assert.fail("Expected an error to be thrown")
            })
        })

        describe("when a build stage fails", () => {
            it("should throw an error", async () => {
                process.env = {...process.env, ...validEnv()}
                try {
                    const deployset = proxyquire("./deployset", {
                        "./common": {
                            getBuildInfo: async () => ({
                                stages: [
                                    {
                                        name: "test-stage",
                                        status: "failure",
                                    }
                                ]
                            })
                        } 
                    })
                    await deployset({ values: { backoff: 0 }, positionals: ["test-stage"] })
                } catch (err) {
                    assert.ok(err instanceof Error, "Expected an error to be thrown")
                    return
                }
                assert.fail("Expected an error to be thrown")
            })
        })
    })

    describe("when using invalid parameters", () => {
        describe("when using invalid environment variables", () => {
            const tests = [
                { name: "missing DRONE_SERVER", env: () => ({...validEnv(), DRONE_SERVER: undefined}) },
                { name: "missing DRONE_TOKEN", env: () => ({...validEnv(), DRONE_TOKEN: undefined}) },
                { name: "missing DRONE_REPO_NAME", env: () => ({...validEnv(), DRONE_REPO_NAME: undefined}) },
                { name: "missing DRONE_REPO_OWNER", env: () => ({...validEnv(), DRONE_REPO_OWNER: undefined}) },
                { name: "missing DRONE_BUILD_NUMBER", env: () => ({...validEnv(), DRONE_BUILD_NUMBER: undefined}) },
                { name: "missing SKIP_STATUS", env: () => ({...validEnv(), SKIP_STATUS: undefined}) },
            ]

            for (const test of tests) {
                it(`should throw an error when ${test.name}`, async () => {
                    try {
                        process.env = test.env()
                        const deployset = proxyquire("./deployset", {
                            "./common": {
                                getBuildInfo: async () => ({
                                    stages: [
                                        {
                                            name: "test-stage",
                                            status: "success",
                                            steps: [
                                                {
                                                    name: "test-step",
                                                    exit_code: 0,
                                                },
                                            ]
                                        }
                                    ],
                                })
                            } 
                        })
                        await deployset({ values: { backoff: 0 }, positionals: ["test-stage"] })
                    } catch (err) {
                        assert.ok(err instanceof Error, "Expected an error to be thrown")
                        return
                    }
                    assert.fail("Expected an error to be thrown")
                })
            }
        })

        describe("when using invalid arguments", () => {
            const tests = [
                {name: "no stages are provided", args: [], build: []},
                {name: "a specified deploy stage is not a build stage", args: ["test-stage"], build: [{
                    name: "other-stage",
                    status: "success",
                    steps: [
                        {
                            name: "test-step",
                            exit_code: 0,
                        },
                    ]
                }]},
            ]

            for (const test of tests) {
                it(`should throw an error when ${test.name}`, async () => {
                    process.env = {...process.env, ...validEnv()}
                    const deployset = proxyquire("./deployset", {
                        "./common": {
                            getBuildInfo: async () => ({
                                stages: test.build,
                            })
                        } 
                    })
                    try {
                        await deployset({ values: { backoff: 0 }, positionals: test.args })
                    } catch (err) {
                        assert.ok(err instanceof Error, "Expected an error to be thrown")
                        return
                    }
                    assert.fail("Expected an error to be thrown")
                })
            }
        })
    })
})