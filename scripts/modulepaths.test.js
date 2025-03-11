import { mkdtempSync, rmSync, copyFileSync, mkdirSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path, { dirname } from "node:path";
import { execSync } from "node:child_process";
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("changeset", () => {
    const originalCwd = process.cwd();
    const targetBranch = "main";
    const packageADir = "packages/a";
    const packageBDir = "packages/b";
    const packageCDir = "other/nested/c";
    const docsDir = "docs";
    let testCwd;
    
    beforeEach(() => {
        testCwd = mkdtempSync(path.join(tmpdir(), "changeset-test-"))
        copyFileSync(path.join(__dirname, "modulepaths.js"), path.join(testCwd, "modulepaths.js"))
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
        appendFileSync(`${packageADir}/package.json`, JSON.stringify({ name: "a", version: "1.0.0", dependencies: { b: "file:../b" } }))
        appendFileSync(`${packageBDir}/package.json`, JSON.stringify({ name: "b", version: "1.0.0" }))
        appendFileSync(`${packageCDir}/package.json`, JSON.stringify({ name: "c", version: "1.0.0", dependencies: { a: "file:../../../packages/a", b: "file:../../../packages/b" } }))
        appendFileSync(`${docsDir}/docs.md`, "test docs")
        execSync("git add .")
        execSync("git commit -m 'Initial commit'")
    })

    afterEach(() => {
        process.chdir(originalCwd)
        rmSync(testCwd, { recursive: true, force: true })
    })

    describe("when using valid parameters", () => {
        it("should return only the module path when it has no local dependencies", () => {
            let result;
            try {
                result = execSync("node modulepaths.js packages/b", { stdio: "pipe" })
            } catch (error) {
                assert.strictEqual(error.status, 0, error.stderr.toString())
                return
            }
            assert.strictEqual(result.toString().trim(), "packages/b")
        })

        it("should return the module path and a single dependency path", () => {
            let result;
            try {
                result = execSync("node modulepaths.js packages/a", { stdio: "pipe" })
            } catch (error) {
                assert.strictEqual(error.status, 0, error.stderr.toString())
                return
            }
            assert.strictEqual(result.toString().trim(), "packages/a packages/b")
        })

        it("should return the module path and multiple dependency paths", () => {
            let result;
            try {
                result = execSync("node modulepaths.js other/nested/c", { stdio: "pipe" })
            } catch (error) {
                assert.strictEqual(error.status, 0, error.stderr.toString())
                return
            }
            assert.strictEqual(result.toString().trim(), "other/nested/c packages/a packages/b")
        })
    })

    describe("when using invalid parameters", () => {
        describe("when using invalid arguments", () => {
            const tests = [
                {name: "no module path is provided", args: ""},
                {name: "the module path does not exist", args: "packages/d"},
                {name: "the module path does not contain a package.json file", args: "docs"},
            ]

            for (const test of tests) {
                it(`should exit with code 1 when ${test.name}`, () => {
                    try {
                        execSync(`node modulepaths.js ${test.args}`, { stdio: "pipe" })
                    } catch (err) {
                        assert.strictEqual(err.status, 1, err.stderr.toString())
                        return
                    }
                    assert.fail("Expected an error to be thrown")
                })
            }
        })
    })
})