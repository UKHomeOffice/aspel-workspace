const { describe, it, before, after, afterEach } = require("node:test");
const assert = require("node:assert").strict;
const proxyquire = require("proxyquire").noPreserveCache()
const yaml = require("yaml")

describe("manifest", () => {
    let env = process.env
    let stderr = process.stderr.write

    const validEnv = () => ({
        GITHUB_TOKEN: "test-github-token",
        GITHUB_REPO_OWNER: "test-github-repo-owner",
        GITHUB_REPO_NAME: "test-github-repo-name",
        GITHUB_MANIFEST_PATH: "test-github-manifest-path.yml",
        SOURCE_COMMIT: "test-source-commit",
        SOURCE_COMMIT_MESSAGE: "test-source-commit-message",
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
        it("should write the updated manifest to github with one new source commit", async () => {
            process.env = validEnv()
            const manifest = proxyquire("./manifest", {
                "./common": {
                    getGithubFile: () => ({
                        manifest: yaml.stringify({
                            "test-stage": "original-source-commit",
                            "test-stage-2": "original-source-commit-2",
                        }),
                        sha: "test-sha",
                    }),
                    writeGithubFile: (_, sha, message, content, token) => {
                        assert.strictEqual(sha, "test-sha")
                        assert.strictEqual(message, `[test-stage] test-source-commit-message\n\n- test-stage`)
                        assert.strictEqual(content, yaml.stringify({
                            "test-stage": process.env.SOURCE_COMMIT,
                            "test-stage-2": "original-source-commit-2",
                        }))
                        assert.strictEqual(token, process.env.GITHUB_TOKEN)
                    },
                },
            })
            await manifest({ values: {}, positionals: ["test-stage"] })
        })

        it("should write the updated manifest to github with multiple new source commits", async () => {
            process.env = validEnv()
            const manifest = proxyquire("./manifest", {
                "./common": {
                    getGithubFile: () => ({
                        manifest: yaml.stringify({
                            "test-stage": "original-source-commit",
                            "test-stage-2": "original-source-commit-2",
                        }),
                        sha: "test-sha",
                    }),
                    writeGithubFile: (_, sha, message, content, token) => {
                        assert.strictEqual(sha, "test-sha")
                        assert.strictEqual(message, "[test-stage, +1] test-source-commit-message\n\n- test-stage\n- test-stage-2")
                        assert.strictEqual(content, yaml.stringify({
                            "test-stage": process.env.SOURCE_COMMIT,
                            "test-stage-2": process.env.SOURCE_COMMIT,
                        }))
                        assert.strictEqual(token, process.env.GITHUB_TOKEN)
                    },
                },
            })
            await manifest({ values: {}, positionals: ["test-stage", "test-stage-2"] })
        })

        describe("when getting the github file fails", () => {
            it("should throw an error", async () => {
                process.env = validEnv()
                const manifest = proxyquire("./manifest", {
                    "./common": {
                        getGithubFile: () => {
                            throw new Error("test-error")
                        },
                        writeGithubFile: () => ({}),
                    },
                })
                try {
                    await manifest({ values: {}, positionals: ["test-stage"] })
                } catch (err) {
                    assert.strictEqual(err.message, "test-error")
                    return
                }
                assert.fail("Expected an error to be thrown")
            })
        })

        describe("when writing the github file fails", () => {
            it("should throw an error", async () => {
                process.env = validEnv()
                const manifest = proxyquire("./manifest", {
                    "./common": {
                        getGithubFile: () => ({
                            manifest: yaml.stringify({
                                "test-stage": "original-source-commit",
                                "test-stage-2": "original-source-commit-2",
                            }),
                            sha: "test-sha",
                        }),
                        writeGithubFile: () => {
                            throw new Error("test-error")
                        },
                    },
                })
                try {
                    await manifest({ values: {}, positionals: ["test-stage"] })
                } catch (err) {
                    assert.strictEqual(err.message, "test-error")
                    return
                }
                assert.fail("Expected an error to be thrown")
            })
        })
    })

    describe("when using invalid parameters", () => {
        describe("when using inavlid environment variables", () => {
            const tests = [
                { name: "missing GITHUB_TOKEN", env: () => ({...validEnv(), GITHUB_TOKEN: undefined}) },
                { name: "missing GITHUB_REPO_OWNER", env: () => ({...validEnv(), GITHUB_REPO_OWNER: undefined}) },
                { name: "missing GITHUB_REPO_NAME", env: () => ({...validEnv(), GITHUB_REPO_NAME: undefined}) },
                { name: "missing GITHUB_MANIFEST_PATH", env: () => ({...validEnv(), GITHUB_MANIFEST_PATH: undefined}) },
                { name: "using invalid GITHUB_MANIFEST_PATH extension", env: () => ({...validEnv(), GITHUB_MANIFEST_PATH: "test-github-manifest-path.txt"}) },
                { name: "missing SOURCE_COMMIT", env: () => ({...validEnv(), SOURCE_COMMIT: undefined}) },
                { name: "missing SOURCE_COMMIT_MESSAGE", env: () => ({...validEnv(), SOURCE_COMMIT_MESSAGE: undefined}) },
            ]

            for (const test of tests) {
                it(`should throw an error when ${test.name}`, async () => {
                    process.env = test.env()
                    const manifest = proxyquire("./manifest", {
                        "./common": {
                            getGithubFile: () => ({
                                manifest: yaml.stringify({
                                    "test-stage": "original-source-commit",
                                    "test-stage-2": "original-source-commit-2",
                                }),
                                sha: "test-sha",
                            }),
                            writeGithubFile: () => ({}),
                        },
                    })
                    try {
                        await manifest({ values: {}, positionals: ["test-stage"] })
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
                {name: "no stages are provided", args: []},
            ]

            for (const test of tests) {
                it(`should throw an error when ${test.name}`, async () => {
                    process.env = validEnv()
                    const manifest = proxyquire("./manifest", {
                        "./common": {
                            getGithubFile: () => assert.fail("getGithubFile should not be called"),
                            writeGithubFile: () => assert.fail("writeGithubFile should not be called"),
                        },
                    })
                    try {
                        await manifest({ values: {}, positionals: test.args })
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