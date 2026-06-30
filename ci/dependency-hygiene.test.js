const { describe, it } = require("node:test");
const assert = require("node:assert").strict;
const fs = require("node:fs");
const path = require("node:path");

const workspaceRoot = path.resolve(__dirname, "..");

const readPackageJson = packageName => {
    const filePath = path.join(workspaceRoot, "packages", packageName, "package.json")
    return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

const readJson = relativePath => {
    return JSON.parse(fs.readFileSync(path.join(workspaceRoot, relativePath), "utf8"))
}

const readText = relativePath => {
    return fs.readFileSync(path.join(workspaceRoot, relativePath), "utf8")
}

const hasDependency = (pkg, section, name) => {
    return Boolean(pkg[section] && Object.prototype.hasOwnProperty.call(pkg[section], name))
}

describe("dependency hygiene for vulnerability remediation", () => {
    it("should keep unused runtime dependencies out of asl-search and asl-emailer", () => {
        const aslSearch = readPackageJson("asl-search")
        const aslEmailer = readPackageJson("asl-emailer")

        assert.equal(hasDependency(aslSearch, "dependencies", "@acuris/aws-es-connection"), false)
        assert.equal(hasDependency(aslSearch, "dependencies", "uuid"), false)
        assert.equal(hasDependency(aslEmailer, "dependencies", "uuid"), false)
    })

    it("should keep test-only dependencies out of runtime dependency sections", () => {
        const aslPermissions = readPackageJson("asl-permissions")
        const aslNotifications = readPackageJson("asl-notifications")
        const aslSchema = readPackageJson("asl-schema")
        const aslDataExports = readPackageJson("asl-data-exports")

        assert.equal(hasDependency(aslPermissions, "dependencies", "uuid"), false)
        assert.equal(hasDependency(aslPermissions, "devDependencies", "uuid"), true)

        assert.equal(hasDependency(aslNotifications, "dependencies", "sinon"), false)
        assert.equal(hasDependency(aslNotifications, "devDependencies", "sinon"), true)

        assert.equal(hasDependency(aslSchema, "dependencies", "sinon"), false)
        assert.equal(hasDependency(aslSchema, "devDependencies", "sinon"), true)

        assert.equal(hasDependency(aslDataExports, "dependencies", "nodemon"), false)
        assert.equal(hasDependency(aslDataExports, "devDependencies", "nodemon"), true)
    })

    it("should align the asl-metrics sinon version with the newer workspace standard", () => {
        const aslMetrics = readPackageJson("asl-metrics")
        assert.equal(aslMetrics.devDependencies.sinon, "^21.1.2")
    })

    it("should keep the audit-ci allowlists empty once the GHSA findings are cleared", () => {
        const asl = readPackageJson("asl")
        const aslInternalUi = readPackageJson("asl-internal-ui")
        const auditConfigs = [
            readJson("packages/asl/.auditrc.json"),
            readJson("packages/asl-internal-ui/.auditrc.json"),
        ]

        assert.match(asl.scripts["test:audit"], /--package-manager npm/)
        assert.match(asl.scripts["test:audit"], /--directory \..\/\.\./)
        assert.match(asl.scripts["test:audit"], /--extra-args=--workspace=asl/)

        assert.match(aslInternalUi.scripts["test:audit"], /--package-manager npm/)
        assert.match(aslInternalUi.scripts["test:audit"], /--directory \..\/\.\./)
        assert.match(aslInternalUi.scripts["test:audit"], /--extra-args=--workspace=asl-internal-ui/)

        for (const config of auditConfigs) {
            assert.deepEqual(config.comments, [])
            assert.deepEqual(config.allowlist, [])
        }
    })

    it("should not keep resolved npm advisory identifiers in image scan allowlists", () => {
        const resolvedIds = [
            "GHSA-j965-2qgj-vjmq",
            "GHSA-73rr-hh4g-fpgx",
            "GHSA-w5hq-g745-h8pq",
        ]

        const cveExceptionFiles = fs.readdirSync(path.join(workspaceRoot, "packages"), { withFileTypes: true })
            .filter(entry => entry.isDirectory())
            .map(entry => path.join("packages", entry.name, "cve-exceptions.txt"))
            .filter(filePath => fs.existsSync(path.join(workspaceRoot, filePath)))

        for (const filePath of cveExceptionFiles) {
            const contents = readText(filePath)
            for (const id of resolvedIds) {
                assert.equal(contents.includes(id), false, `${filePath} should not still allowlist ${id}`)
            }
        }
    })
})

