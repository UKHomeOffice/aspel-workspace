const { describe, it } = require("node:test");
const assert = require("node:assert").strict;
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("yaml");

const workspaceRoot = path.resolve(__dirname, "..");
const packagesRoot = path.join(workspaceRoot, "packages");

const isVulnerabilityId = id => {
    return /^CVE-\d{4}-\d{4,}$/.test(id) || /^GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/i.test(id)
}

const getPackageDirs = () => {
    return fs.readdirSync(packagesRoot, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(packagesRoot, entry.name))
}

const getCveExceptionFiles = () => {
    return getPackageDirs()
        .map(packageDir => path.join(packageDir, "cve-exceptions.txt"))
        .filter(filePath => fs.existsSync(filePath))
}

const getAuditConfigReferences = () => {
    return getPackageDirs().flatMap(packageDir => {
        const packageJsonPath = path.join(packageDir, "package.json")
        if (!fs.existsSync(packageJsonPath)) {
            return []
        }

        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
        const script = pkg.scripts && pkg.scripts["test:audit"]
        if (!script) {
            return []
        }

        const match = script.match(/--config\s+([^\s]+)/)
        assert.ok(match, `Expected test:audit script in ${path.relative(workspaceRoot, packageJsonPath)} to declare --config`)

        return [{
            packageJsonPath,
            packageDir,
            configPath: path.resolve(packageDir, match[1]),
        }]
    })
}

const getPipelineFiles = () => {
    const packagePipelineFiles = getPackageDirs().flatMap(packageDir => {
        return fs.readdirSync(packageDir)
            .filter(fileName => fileName.startsWith(".drone") && fileName.endsWith(".yml"))
            .map(fileName => path.join(packageDir, fileName))
    })

    return [
        path.join(workspaceRoot, ".drone.yml"),
        path.join(workspaceRoot, "ci", "template.service.yml"),
        ...packagePipelineFiles,
    ]
}

const getScanImageAllowlistReferences = () => {
    return getPipelineFiles().flatMap(filePath => {
        const contents = fs.readFileSync(filePath, "utf8")
        return yaml.parseAllDocuments(contents)
            .map(document => document.toJSON())
            .filter(Boolean)
            .flatMap(pipeline => {
                const steps = Array.isArray(pipeline.steps) ? pipeline.steps : []
                return steps
                    .filter(step => step && step.name === "scan-image")
                    .map(step => {
                        const allowListPath = step.environment && step.environment.ALLOW_CVE_LIST_FILE
                        assert.ok(allowListPath, `Expected scan-image step in ${path.relative(workspaceRoot, filePath)} to define ALLOW_CVE_LIST_FILE`)

                        return {
                            filePath,
                            allowListPath,
                            resolvedPath: path.resolve(path.dirname(filePath), allowListPath),
                        }
                    })
            })
    })
}

describe("audit and CVE exception files", () => {
    it("should only contain unique and valid vulnerability identifiers in cve-exceptions files", () => {
        for (const filePath of getCveExceptionFiles()) {
            const entries = fs.readFileSync(filePath, "utf8")
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean)

            const duplicates = entries.filter((entry, index) => entries.indexOf(entry) !== index)
            assert.deepEqual(duplicates, [], `Expected ${path.relative(workspaceRoot, filePath)} to avoid duplicate entries`)

            for (const entry of entries) {
                assert.ok(
                    isVulnerabilityId(entry),
                    `Expected ${entry} in ${path.relative(workspaceRoot, filePath)} to be a supported CVE or GHSA identifier`
                )
            }
        }
    })

    it("should keep audit-ci configs valid and referenced by package scripts", () => {
        const referencedConfigPaths = getAuditConfigReferences().map(reference => reference.configPath)
        const actualConfigPaths = getPackageDirs()
            .map(packageDir => path.join(packageDir, ".auditrc.json"))
            .filter(filePath => fs.existsSync(filePath))

        assert.deepEqual(
            referencedConfigPaths.slice().sort(),
            actualConfigPaths.slice().sort(),
            "Expected every .auditrc.json file to be referenced by a package test:audit script"
        )

        for (const filePath of actualConfigPaths) {
            const config = JSON.parse(fs.readFileSync(filePath, "utf8"))
            assert.ok(Array.isArray(config.allowlist), `Expected allowlist array in ${path.relative(workspaceRoot, filePath)}`)
            assert.ok(Array.isArray(config.comments), `Expected comments array in ${path.relative(workspaceRoot, filePath)}`)

            const commentIds = config.comments.map(comment => {
                assert.equal(typeof comment, "string", `Expected comments in ${path.relative(workspaceRoot, filePath)} to be strings`)
                return comment.split(":", 1)[0]
            })

            assert.deepEqual(
                commentIds,
                config.allowlist,
                `Expected comments in ${path.relative(workspaceRoot, filePath)} to stay aligned with the allowlist`
            )

            const duplicates = config.allowlist.filter((entry, index) => config.allowlist.indexOf(entry) !== index)
            assert.deepEqual(duplicates, [], `Expected ${path.relative(workspaceRoot, filePath)} to avoid duplicate allowlist entries`)

            for (const entry of config.allowlist) {
                assert.ok(
                    isVulnerabilityId(entry),
                    `Expected ${entry} in ${path.relative(workspaceRoot, filePath)} to be a supported CVE or GHSA identifier`
                )
            }
        }
    })

    it("should keep scan-image allowlist paths wired to existing files for containerised packages", () => {
        const allowlistReferences = getScanImageAllowlistReferences()
        const referencedPaths = new Set()

        for (const reference of allowlistReferences) {
            if (reference.allowListPath.includes("<MODULE_NAME>")) {
                assert.equal(
                    reference.allowListPath,
                    "packages/<MODULE_NAME>/cve-exceptions.txt",
                    "Expected the service CI template to point scan-image at the module CVE allowlist"
                )
                continue
            }

            assert.ok(
                fs.existsSync(reference.resolvedPath),
                `Expected ${reference.allowListPath} referenced by ${path.relative(workspaceRoot, reference.filePath)} to exist`
            )

            referencedPaths.add(reference.resolvedPath)
        }

        const expectedContainerAllowlists = getPackageDirs()
            .filter(packageDir => fs.existsSync(path.join(packageDir, "Dockerfile")))
            .map(packageDir => path.join(packageDir, "cve-exceptions.txt"))
            .filter(filePath => fs.existsSync(filePath))
            .sort()

        assert.deepEqual(
            [...referencedPaths].sort(),
            expectedContainerAllowlists,
            "Expected every containerised package CVE allowlist to be referenced by a scan-image pipeline"
        )
    })
})

