const { describe, it } = require("node:test");
const assert = require("node:assert").strict;
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("yaml");

const workspaceRoot = path.resolve(__dirname, "..");
const droneFile = path.join(workspaceRoot, ".drone.yml");

const pipelines = yaml.parseAllDocuments(fs.readFileSync(droneFile, "utf8"))
  .map(document => document.toJSON())
  .filter(Boolean);

const getPipeline = (name) => {
  const pipeline = pipelines.find(candidate => candidate.name === name);
  assert.ok(pipeline, `Expected pipeline '${name}' to exist in .drone.yml`);
  return pipeline;
};

const getStep = (pipeline, name) => {
  const steps = Array.isArray(pipeline.steps) ? pipeline.steps : [];
  const step = steps.find(candidate => candidate && candidate.name === name);
  assert.ok(step, `Expected step '${name}' to exist in pipeline '${pipeline.name}'`);
  return step;
};

const getPackageScript = (packageName, scriptName) => {
  const packageJsonPath = path.join(workspaceRoot, "packages", packageName, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  return pkg.scripts && pkg.scripts[scriptName];
};

describe("pipeline hygiene", () => {
  it("should not export modulepaths in non-container pipelines", () => {
    for (const pipelineName of ["asl-pages", "asl-projects", "asl-service", "asl-taskflow", "asl-components"]) {
      const changesetStep = getStep(getPipeline(pipelineName), "changeset");
      const commands = Array.isArray(changesetStep.commands) ? changesetStep.commands : [];

      assert.ok(
        !commands.some(command => command.includes("node ./ci/modulepaths.js")),
        `Expected pipeline '${pipelineName}' to avoid computing module paths when it does not build a container`
      );
    }
  });

  it("should keep the asl-data-exports install step scoped to its workspace", () => {
    const installStep = getStep(getPipeline("asl-data-exports"), "install");
    assert.deepEqual(
      installStep.commands,
      ["npm ci --workspace asl-data-exports"],
      "Expected asl-data-exports to install only its workspace dependencies in CI"
    );
  });

  it("should avoid an extra CI build step when install already runs a postinstall build", () => {
    const cases = [
      ["asl", "asl", ["compile", "build"]],
      ["asl-internal-ui", "asl-internal-ui", ["compile", "build"]],
      ["asl-pages", "asl-pages", ["compile", "build"]],
    ];

    for (const [pipelineName, packageName, redundantStepNames] of cases) {
      assert.equal(
        getPackageScript(packageName, "postinstall"),
        "npm run build",
        `Expected package '${packageName}' to keep its current postinstall build so this test remains meaningful`
      );

      const steps = Array.isArray(getPipeline(pipelineName).steps) ? getPipeline(pipelineName).steps : [];
      const redundantSteps = steps.filter(step => redundantStepNames.includes(step.name));

      assert.deepEqual(
        redundantSteps,
        [],
        `Expected pipeline '${pipelineName}' to avoid an extra dedicated build step after install already triggers the build`
      );
    }
  });
});

