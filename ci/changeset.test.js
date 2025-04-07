import { mkdtempSync, rmSync, copyFileSync, mkdirSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path, { dirname } from "node:path";
import { execSync } from "node:child_process";
import { describe, it, beforeEach, afterEach, before, after } from "node:test";
import assert from "node:assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("changeset", () => {
    const originalCwd = process.cwd();
    const targetBranch = "main";
    const packageADir = "packages/a";
    const packageBDir = "packages/b";
    const packageCDir = "packages/c";
    const docsDir = "docs";
    let testCwd;
    let stderr = process.stderr.write

    const branchHead = () => execSync("git rev-parse HEAD").toString().trim()

    const validEnv = () => ({
        TARGET_BRANCH: targetBranch,
        BUILD_EVENT: "push",
        SOURCE_COMMIT: branchHead(),
        SKIP_STATUS: 78,
    })

    before(() => {
        process.stderr.write = () => {}
    })

    after(() => {
        process.stderr.write = stderr
    })

    beforeEach(() => {
        testCwd = mkdtempSync(path.join(tmpdir(), "changeset-test-"))
        copyFileSync(path.join(__dirname, "changeset.js"), path.join(testCwd, "changeset.js"))
        copyFileSync(path.join(__dirname, "common.js"), path.join(testCwd, "common.js"))
        process.chdir(testCwd)
        execSync("git init")
        execSync(`git branch -m ${targetBranch}`)
        execSync("git config user.name 'Test User'")
        execSync("git config user.email 'test@email.com'")
        execSync("git config --local commit.gpgsign false")
        mkdirSync(packageADir, { recursive: true })
        mkdirSync(packageBDir, { recursive: true })
        mkdirSync(packageCDir, { recursive: true })
        mkdirSync(docsDir, { recursive: true })
        appendFileSync(`${packageADir}/package.json`, JSON.stringify({ name: "a", version: "1.0.0", dependencies: { common: "file:../b" } }))
        appendFileSync(`${packageBDir}/package.json`, JSON.stringify({ name: "b", version: "1.0.0" }))
        appendFileSync(`${packageCDir}/package.json`, JSON.stringify({ name: "c", version: "1.0.0", dependencies: { common: "file:../a" } }))
        appendFileSync(`${docsDir}/docs.md`, "test docs")
        execSync("git add .")
        execSync("git commit -m 'Initial commit'")
    })

    afterEach(() => {
        process.chdir(originalCwd)
        rmSync(testCwd, { recursive: true, force: true })
    })

    describe("when using valid parameters", () => {
        describe("when push event", () => {
            it("should exit with 0 code when module file has changed in previous commit", () => {
                const env = {...validEnv(), BUILD_EVENT: "push"}
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageBDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with 0 code when module dependency file has changed in previous commit", () => {
                const env = {...validEnv(), BUILD_EVENT: "push"}
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageADir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with 0 code when transitive module dependency file has changed in previous commit", () => {
                const env = {...validEnv(), BUILD_EVENT: "push"}
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageCDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with skip code when module file has not changed", () => {
                const env = {...validEnv(), BUILD_EVENT: "push"}
                appendFileSync(`${packageADir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageBDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, env.SKIP_STATUS, error.stdout.toString())
                    return
                }
                assert.fail("Expected error to be thrown")
            })

            it("should exit with skip code when neither module or module dependency file has changed", () => {
                const env = {...validEnv(), BUILD_EVENT: "push"}
                appendFileSync(`test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageBDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, env.SKIP_STATUS, error.stdout.toString())
                    return
                }
                assert.fail("Expected error to be thrown")
            })

            it("should exit with skip code when module file has not changed in previous commit", () => {
                const env = {...validEnv(), BUILD_EVENT: "push"}
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                appendFileSync(`${packageADir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test 2'")
                try {
                    execSync(`node changeset.js -m ${packageBDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, env.SKIP_STATUS, error.stdout.toString())
                    return
                }
                assert.fail("Expected error to be thrown")
            })

            it("should exit with skip code when neither module or module dependency file has changed in previous commit", () => {
                const env = {...validEnv(), BUILD_EVENT: "push"}
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                appendFileSync(`test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test 2'")
                try {
                    execSync(`node changeset.js -m ${packageADir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, env.SKIP_STATUS, error.stdout.toString())
                    return
                }
                assert.fail("Expected error to be thrown")
            })
        })

        describe("when pull request event", () => {
            it("should exit with 0 code when module file has changed in previous commit", () => {
                const env = {...validEnv(), BUILD_EVENT: "pull_request"}
                execSync("git checkout -b test", { stdio: "ignore" })
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageBDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with 0 code when module dependency file has changed in previous commit", () => {
                const env = {...validEnv(), BUILD_EVENT: "pull_request"}
                execSync("git checkout -b test", { stdio: "ignore" })
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageADir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with 0 code when transitive module dependency file has changed in previous commit", () => {
                const env = {...validEnv(), BUILD_EVENT: "pull_request"}
                execSync("git checkout -b test", { stdio: "ignore" })
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageCDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with 0 code when module file has changed in prior commit on this branch", () => {
                const env = {...validEnv(), BUILD_EVENT: "pull_request"}
                execSync("git checkout -b test", { stdio: "ignore" })
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                appendFileSync(`test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test 2'")
                try {
                    execSync(`node changeset.js -m ${packageBDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with 0 code when module dependency file has changed in prior commit on this branch", () => {
                const env = {...validEnv(), BUILD_EVENT: "pull_request"}
                execSync("git checkout -b test", { stdio: "ignore" })
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                appendFileSync(`test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test 2'")
                try {
                    execSync(`node changeset.js -m ${packageADir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with 0 code when transitive module dependency file has changed in prior commit on this branch", () => {
                const env = {...validEnv(), BUILD_EVENT: "pull_request"}
                execSync("git checkout -b test", { stdio: "ignore" })
                appendFileSync(`${packageBDir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                appendFileSync(`test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test 2'")
                try {
                    execSync(`node changeset.js -m ${packageCDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, 0, error.stdout.toString())
                }
            })

            it("should exit with skip code when module file has not changed", () => {
                const env = {...validEnv(), BUILD_EVENT: "pull_request"}
                execSync("git checkout -b test", { stdio: "ignore" })
                appendFileSync(`${packageADir}/test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageBDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, env.SKIP_STATUS, error.stdout.toString())
                    return
                }
                assert.fail("Expected error to be thrown")
            })

            it("should exit with skip code when neither module or module dependency file has changed", () => {
                const env = {...validEnv(), BUILD_EVENT: "pull_request"}
                execSync("git checkout -b test", { stdio: "ignore" })
                appendFileSync(`test.txt`, "test")
                execSync("git add .")
                execSync("git commit -m 'test'")
                try {
                    execSync(`node changeset.js -m ${packageBDir}`, {env: {...env, SOURCE_COMMIT: branchHead()}})
                } catch (error) {
                    assert.strictEqual(error.status, env.SKIP_STATUS, error.stdout.toString())
                    return
                }
                assert.fail("Expected error to be thrown")
            })
        })
    })

    describe("when using invalid parameters", () => {
        describe("when using invalid environment variables", () => {
            const tests = [
                { name: "TARGET_BRANCH is missing", env: () => ({...validEnv(), TARGET_BRANCH: undefined }) },
                { name: "BUILD_EVENT is missing", env: () => ({...validEnv(), BUILD_EVENT: undefined }) },
                { name: "BUILD_EVENT is unknown", env: () => ({...validEnv(), BUILD_EVENT: "invalid"}) },
                { name: "SOURCE_COMMIT is missing", env: () => ({...validEnv(), SOURCE_COMMIT: undefined }) },
                { name: "SKIP_STATUS is missing", env: () => ({...validEnv(), SKIP_STATUS: undefined }) },
            ]

            for (const test of tests) {
                it(`should exit with code 1 when ${test.name}`, () => {
                    try {
                        execSync(`node changeset.js -m ${packageBDir}`, {env: test.env()})
                    } catch (error) {
                        assert.strictEqual(error.status, 1, error.stdout.toString())
                        return
                    }
                    assert.fail("Expected error to be thrown")
                })
            }
        })

        describe("when using invalid arguments", () => {
            const tests = [
                { name: "no arguments provided", args: "" },
                { name: "module argument is not a module", args: `-m ${docsDir}` },
                { name: "module argument is not a valid path", args: `-m invalid/location` },
                { name: "paths arguments is not a valid path", args: `-p invalid/location` },
            ]

            for (const test of tests) {
                it(`should exit with code 1 when ${test.name}`, () => {
                    try {
                        execSync(`node changeset.js ${test.args}`, {env: validEnv()})
                    } catch (error) {
                        assert.strictEqual(error.status, 1, error.stdout.toString())
                        return
                    }
                    assert.fail("Expected error to be thrown")
                })
            }
        })
    })
})
