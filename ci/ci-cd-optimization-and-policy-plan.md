# ASPeL Workspace CI/CD Optimisation and Policy Plan

## Status

Proposed architecture and delivery plan for improving CI/CD performance, security governance, and operational clarity in the ASPeL monorepo.

## Goals

1. Preserve the current monorepo-aware deployment model.
2. Reduce unnecessary CI runtime, queue pressure, and repeated work.
3. Keep pre-merge security controls, especially for containerised services.
4. Separate shared base-image CVE ownership from service-image CVE ownership.
5. Provide a production-ready rollout path with low-risk phases and explicit rollback points.

## Current Architecture Summary

The current CI/CD design is centered on a single root [`.drone.yml`](../.drone.yml) file with one Drone pipeline per module that needs CI support.

### Existing design decisions that should be preserved

1. **Root multi-pipeline design**
   - A single repository-level CI definition avoids missing changes made in shared local workspace dependencies.
   - This is documented in [`ci/README.md`](./README.md).

2. **Custom clone logic**
   - Drone's default PR clone behavior performs an implicit merge that makes diff-based change detection harder.
   - The current custom clone approach exists for a valid reason and should be retained unless a better Drone-native equivalent is proven.

3. **Affected-module gating via [`ci/changeset.js`](./changeset.js)**
   - Services correctly rebuild when their own files change or when a local transitive dependency changes.
   - This is a critical correctness feature for the monorepo.

4. **Workspace-aware container builds via [`ci/modulepaths.js`](./modulepaths.js)**
   - The repository tries to pass only the required workspace slice into Docker builds instead of copying the full monorepo into each runtime image.

5. **Central deployment coordination via `deployset` and `manifest`**
   - Deployment updates are intentionally centralised so only successful, eligible service pipelines update the deployment manifest.

## Current Constraints and Friction Points

The existing architecture is correct in intent, but expensive in practice.

### CI/runtime constraints observed in the current setup

1. **Every pipeline starts on every repo change**
   - This is called out in [`ci/README.md`](./README.md).
   - Each pipeline still pays startup, clone, and `changeset` overhead before deciding whether to skip.

2. **Manual clone is repeated in each pipeline**
   - Nearly every container pipeline repeats `git clone $DRONE_REMOTE_URL .`.

3. **The dependency graph is computed twice**
   - [`ci/changeset.js`](./changeset.js) computes the local module closure to decide whether to build.
   - [`ci/modulepaths.js`](./modulepaths.js) computes very similar information again for Docker build slicing.

4. **Some modules build more than once**
   - Some packages trigger a build during `postinstall`, then CI also runs an explicit build or compile step.

5. **PR pipelines include expensive image work**
   - Container build and image scanning currently run on `pull_request` for many services.
   - This is defensible as a security control, but expensive if applied indiscriminately.

6. **Trivy concurrency and cache pressure are already a known issue**
   - [`HELPME.md`](../HELPME.md) documents layer caching failures when too many pipelines run concurrently.

7. **`package-lock.json` is globally included in change detection**
   - This improves safety, but can widen the build fan-out significantly.

## Recommended End-State Principles

The future CI/CD policy should be guided by these principles.

1. **Preserve correctness first**
   - The monorepo must continue to rebuild affected services when local dependencies change.

2. **Run heavy work only when it is relevant**
   - PRs should validate what the change can realistically affect.

3. **Treat security as layered, not duplicated**
   - Shared base-image risk and service-specific image risk should be managed separately.

4. **Key reusable security data by immutable digest**
   - Never rely on mutable tags alone for image reuse or vulnerability reuse.

5. **Prefer central policy and local ownership**
   - Shared base-image policy should be centrally owned.
   - Service-specific risk exceptions should remain local to the service.

6. **Optimise in phases, not as a big-bang rewrite**
   - CI/CD and deployment changes should be introduced incrementally with rollback points.

## Recommendations

## 1. Keep the current monorepo-aware Drone architecture

### Recommendation
Retain the root [`.drone.yml`](../.drone.yml) plus per-module pipeline structure for now.

### Why
- It solves a real Drone limitation around path-aware triggering in a monorepo.
- It preserves existing deployment behavior and shared dependency awareness.
- Replacing it is a larger architectural migration, not a quick optimisation.

### Follow-up
Optimise the work performed inside each pipeline instead of rewriting the whole model first.

## 2. Keep PR image scanning, but make it targeted

### Recommendation
Do not remove PR image scanning entirely. Instead, restrict it to changed containerised services and runtime-impacting changes.

### Why
- Pre-merge image scanning catches issues before they land on `main`.
- This is a legitimate security control and should be preserved.
- The current problem is not the existence of PR scanning, but the breadth and cost of when it runs.

### Recommended PR gating criteria for image build and scan
Run container build and scan when one or more of the following are true:

1. The service module changed.
2. A local workspace dependency used by the service changed.
3. The service `Dockerfile` changed.
4. The shared base image digest changed.
5. The service runtime dependency manifest changed.
6. A shared build/runtime file used by the service changed.

### Avoid running container build and scan when only these changed
- documentation
- unrelated services
- CI-only files with no effect on runtime artifact content
- test-only changes that do not affect container packaging policy

## 3. Introduce layered CVE governance: `baseImage` and `serviceImage`

### Recommendation
Create a two-layer vulnerability management model.

### Layer A: `baseImage`
A shared record for each immutable base image digest containing:
- image reference
- image digest
- SBOM location
- scanner name and scanner DB version
- scan timestamp
- vulnerability summary
- approved exceptions
- review/expiry metadata for exceptions

### Layer B: `serviceImage`
A service-specific record for each final image digest containing:
- service image reference
- service image digest
- parent base image digest
- SBOM location
- scanner name and DB version
- scan timestamp
- vulnerability summary
- service-specific exceptions
- policy result

### Why this is needed
The final image is baked as one runtime artifact, but its risk sources are not the same:
- base OS and shared packages come from the base image
- service-level npm packages and Dockerfile layers come from the service image build

### Key policy rule
Reuse security findings by immutable digest, not by image tag.

## 4. Use digest-based CVE reuse, not tag-based reuse

### Recommendation
Any security registry, cache, or policy decision must be keyed by digest.

### Why
Tags such as `latest` or even version tags can drift or be too coarse.

### Correct reuse unit
- `baseImage` findings are reusable when the base image digest, scanner family, and vulnerability database snapshot are the same.
- `serviceImage` findings are reusable when the final service image digest, scanner family, and vulnerability database snapshot are the same.

## 5. Add a scheduled re-scan lane

### Recommendation
Introduce a scheduled or nightly security lane that re-evaluates previously approved image digests against the latest vulnerability database.

### Why
A previously clean digest can become vulnerable without the image changing if new advisories are published.

### Scheduled re-scan scope
1. approved shared base image digests
2. recent production service image digests
3. optionally, the current `main` branch service images

### Result
This allows PR pipelines to stay targeted without abandoning ongoing security visibility.

## 6. Separate policy lanes for PR, `main`, and scheduled builds

### Recommendation
Define explicit policy by build lane.

### PR lane
Run:
- clone and `changeset`
- workspace-scoped install
- lint/test as appropriate
- container build and image scan only when the change affects a containerised service or its runtime inputs

Fail on:
- test/lint failures
- broken container build for changed service
- new critical/high vulnerabilities that violate policy
- use of an unapproved base image digest

### `main` lane
Run:
- everything in the PR lane for affected services
- final image scan before publication
- image push
- deployment manifest update through `deployset` and `manifest`

Fail on:
- any production policy violation
- image build/push failure
- deployment manifest update failure

### scheduled/nightly lane
Run:
- re-scan approved base image digests
- re-scan recent service image digests
- broader dependency and CVE refresh checks
- reporting or ticket generation where applicable

## 7. Remove duplicate build work caused by `postinstall`

### Recommendation
Review packages that build during `postinstall` and also run an explicit CI build. Prefer one build path.

### Why
This is one of the clearest repeated-effort costs in the current setup.

### Likely candidates
- `packages/asl/package.json`
- `packages/asl-internal-ui/package.json`
- `packages/asl-pages/package.json`
- any package where test or install already invokes a build

### Preferred rule
- Local development may keep convenience hooks if necessary.
- CI should use an explicit, predictable build path and avoid building the same artifact twice.

## 8. Normalize workspace-scoped installs

### Recommendation
Ensure CI commands use the narrowest safe workspace scope.

### Why
[`ci/README.md`](./README.md) already documents this as the intended practice.

### Example target
Replace broad `npm ci` in service pipelines with `npm ci --workspace <workspace>` where the service does not need the entire repo install.

## 9. Reduce repeated clone and setup cost

### Recommendation
Keep the custom git logic if required, but reduce the cost of repeating full clone behavior in every pipeline.

### Options
1. Shallow fetch only what `changeset` requires.
2. Minimise the number of git operations performed after clone.
3. Reassess whether some merge/checkouts can be replaced with more direct diff references.

### Why
This is repeated across almost every pipeline and scales poorly as pipelines increase.

## 10. Refactor duplicate dependency graph work

### Recommendation
Refactor shared graph calculation so `changeset` and `modulepaths` can reuse a single computed module closure.

### Why
The current split exists for valid reasons, but the overlap is high and a single shared result would reduce repeated logic and repeated file reads.

## 11. Tighten Docker build context consistency

### Recommendation
Ensure all service Dockerfiles follow the intended workspace-sliced pattern consistently.

### Why
The current architecture intentionally exports `MODULE_PATHS` to avoid bloated build contexts.
Some services appear closer to that pattern than others.

### Desired outcome
- copy only the module slice required for the build
- keep runtime images free from unrelated workspace source
- avoid paying for slice-computation complexity without actually using it

## 12. Pin CI helper and scanner images

### Recommendation
Reduce reliance on floating tags such as `latest` for scanner and helper images.

### Why
This improves reproducibility and reduces surprise changes in CI behavior.

### Good practice
- pin by digest where practical
- update on a controlled cadence
- document ownership for refreshing pinned tool versions

## 13. Keep CVE exception ownership layered

### Recommendation
Split exception policy by ownership.

### Base-image exceptions
- centrally managed
- tied to base digest or base-image lineage
- time-bounded and reviewed

### Service-image exceptions
- owned by the specific service team or module owner
- tied to service image/package context
- time-bounded and reviewed

### Why
A flat repo-wide exception list is convenient but hard to govern safely.

## 14. Preserve deployment coordination but document its policy clearly

### Recommendation
Keep `deployset` and `manifest`, but document their production policy as part of CI/CD governance.

### Policy statement
Only successful, eligible service pipelines on `main` should update deployment state.
A skip is not a failure, but it is also not deployable output.

## Proposed Production Policy Matrix

| Build lane | Scope | Build image? | Scan image? | Push image? | Update manifest? | Intended outcome |
|---|---|---:|---:|---:|---:|---|
| Pull request | Changed affected modules only | Yes, when runtime-impacting | Yes, when runtime-impacting | No | No | Catch code, packaging, and new actionable image issues before merge |
| Push to `main` | Changed affected modules only | Yes | Yes | Yes | Yes | Produce and publish deployable artifacts |
| Nightly / scheduled | Approved base and recent service digests | Optional rebuild or re-scan only | Yes | No | No | Detect newly disclosed vulnerabilities and policy drift |
| Base image maintenance | Shared base image only | Yes | Yes | Yes, when approved | No | Govern shared platform risk once and reuse across services |

## Proposed CVE Governance Model

## Base image workflow

1. Build or retrieve the shared base image.
2. Resolve and store its immutable digest.
3. Generate an SBOM.
4. Scan the base image.
5. Store findings keyed by digest.
6. Record approved exceptions separately from service exceptions.
7. Mark the digest as approved, rejected, or requiring remediation.

## Service image workflow

1. Build the final service image against a pinned approved base digest.
2. Resolve and store the final image digest.
3. Generate a service SBOM.
4. Scan the final service image.
5. Link the service digest to the parent base digest.
6. Interpret findings as:
   - inherited base findings
   - service-added findings
   - policy violations
7. Gate the build using service policy and approved base policy.

## Re-scan workflow

1. Re-scan stored approved digests when the scanner database changes.
2. Surface newly disclosed vulnerabilities even when the image has not changed.
3. Route base issues to the platform/base-image owner.
4. Route service-specific issues to the module owner.

## Recommended Rollout Plan

## Phase 0: Baseline and measurement

Before making runtime-affecting changes, capture:
- average PR duration
- average `main` duration
- number of pipelines started per typical PR
- image build count per PR
- scan count per PR
- common failure causes, especially Trivy/cache issues

## Phase 1: Low-risk policy and documentation improvements

1. Publish this policy plan.
2. Document PR vs `main` vs nightly expectations.
3. Identify services where `postinstall` duplicates explicit CI builds.
4. Identify pipelines using broad installs where workspace-scoped installs are possible.

## Phase 2: Safe CI performance wins

1. Narrow PR image build and scan conditions.
2. Move broad `npm audit` checks off the PR hot path where appropriate.
3. Remove clearly duplicated build steps.
4. Normalize workspace-scoped `npm ci` usage.

## Phase 3: Security governance improvements

1. Introduce base-image inventory and digest tracking.
2. Separate base-image and service-image exception ownership.
3. Add scheduled re-scan policy.
4. Pin scanner/helper image versions or digests.

## Phase 4: Structural CI cleanup

1. Reuse or refactor dependency graph calculation between `changeset` and `modulepaths`.
2. Reduce repeated clone/setup cost.
3. Reassess the blast radius of `package-lock.json` changes.

## Phase 5: Docker/runtime optimisation

1. Tighten Docker build context consistency.
2. Reduce unnecessary runtime image layers.
3. Review whether service runtime images can be slimmed without changing behavior.

## Rollback Strategy

1. Keep policy/documentation changes separate from pipeline execution changes.
2. Land PR gating changes separately from Dockerfile/runtime changes.
3. Validate one representative container service before rolling out common patterns.
4. If a policy is too strict, relax the trigger conditions before changing the monorepo architecture.
5. Keep deployment behavior stable while performance/security policy evolves.

## Success Measures

The optimisation effort should be considered successful when:

1. PR duration decreases without losing pre-merge coverage for changed containerised services.
2. The number of image scans per PR better matches the set of actually affected services.
3. Repeated build work from `postinstall` or redundant CI steps is measurably reduced.
4. Base-image vulnerabilities are owned and tracked centrally.
5. New service-specific vulnerabilities remain catchable before merge.
6. The deployment flow on `main` remains correct and predictable.

## Immediate Next Changes Recommended

If implementation work starts after this planning phase, the first practical targets should be:

1. [`.drone.yml`](../.drone.yml)
   - narrow PR image build and scan behavior
   - separate PR, `main`, and scheduled expectations more clearly
   - reduce broad install patterns where possible

2. selected `package.json` files
   - remove CI duplicate build behavior caused by `postinstall`

3. selected service `Dockerfile`s
   - align actual Docker build context behavior with the intended `MODULE_PATHS` model

4. CI helper logic in [`ci/common.js`](./common.js), [`ci/changeset.js`](./changeset.js), and [`ci/modulepaths.js`](./modulepaths.js)
   - reduce repeated dependency graph computation
   - prepare for more targeted runtime-impact detection if needed

## Summary

The current ASPeL CI/CD design is rational and monorepo-aware, but it is paying a significant cost in duplicated setup, duplicated build work, and repeated security effort. The recommended path is not to remove safeguards, but to narrow them to the services and artifacts that a change actually affects. The most important design shift is to keep service image scanning while introducing a separate, reusable base-image CVE governance layer keyed by immutable digests.
