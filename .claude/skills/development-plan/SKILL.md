---
name: development-plan
description: 'Plan and analyze JIRA tickets using workspace-aware knowledge maps. Identify impacts, affected code, required tests, and implementation approach. Use .ai/ maps for traceability.'
---

# Development Plan Skill

## Quick Output Format

### ✅ What You'll Get

```
IMPACT ANALYSIS
├─ Service: [service name]
├─ Functions: [list of affected functions]
├─ APIs: [endpoints affected]
├─ Tests: [test files to update/add]
└─ Journeys: [E2E tests affected]

IMPLEMENTATION PLAN
├─ Step 1: [change what]
├─ Step 2: [then do this]
├─ Step 3: [verify with test]
└─ Risk Level: [LOW/MEDIUM/HIGH]

DEPENDENCIES TO CHECK
├─ Upstream: [what depends on this]
├─ Downstream: [what this depends on]
├─ Breaking Changes: [yes/no]
└─ Database: [schema changes needed?]

TESTING STRATEGY
├─ Unit Tests: [what to add]
├─ Integration Tests: [what to add]
├─ E2E Tests: [which journeys need updates]
└─ Coverage Gaps: [identified gaps]
```

## How to Use

1. **Read JIRA ticket** - Extract acceptance criteria
2. **Check knowledge maps** - See `.ai/functions.md` for similar code
3. **Map the impact** - Use sections above
4. **Verify approach** - Read actual source code
5. **Implement** - Follow documented patterns
6. **Test** - Use test locations from knowledge maps

## Key References

- **Architecture**: `.ai/architecture.md`
- **Functions**: `.ai/functions.md` (who calls what)
- **APIs**: `.ai/api-contracts.md` (endpoint contracts)
- **Journeys**: `.ai/e2e-map.md` (user flows)
- **Tests**: `.ai/test-map.md` (test locations)
- **Workflows**: `.ai/workflows.md` (business logic)
- **Dependencies**: `.ai/dependencies.md` (service impacts)
   └─ Verify: Check E2E test files

8. What other services could be affected?
   └─ See: .ai/dependencies.md (service dependencies)
   └─ Check: message/event contracts
   └─ Verify: Follow event flows

9. Are there known fragile areas nearby?
   └─ See: .ai/fragile-areas.md (if exists)
   └─ Check: legacy patterns
   └─ Verify: Inspect similar code
```

## JIRA Ticket Analysis Workflow

### Step 1: Extract Acceptance Criteria
- Parse the JIRA ticket for each AC
- List them clearly
- Note related tickets and dependencies

### Step 2: Map the Code Impact
For each AC, **use the knowledge maps** to:
- **Find the code**: Search `.ai/functions.md` for related functions
- **Trace entry points**: Find where AC starts (API endpoint, page, event)
- **Follow the chain**: What does it call → what calls it → what tests cover it
- **Document the path**: Create a traceability tree

```
AC: "Submit application"
    │
    ├─ Entry point: POST /api/applications/:id/submit
    ├─ Handler: submitApplication() in asl-workflow
    ├─ Calls:
    │   ├─ validateApplication()
    │   ├─ createTask()
    │   └─ sendNotification()
    ├─ Tests:
    │   ├─ unit: application.test.js
    │   ├─ integration: workflow.integration.test.js
    │   └─ e2e: submit-application.spec.js
    └─ Services affected:
        ├─ asl-workflow (main)
        ├─ asl-taskflow (task creation)
        └─ asl-notifications (email)
```

### Step 3: Identify All Affected Code
Using the traceability map:
- **Direct changes**: Which files to modify
- **Test updates**: Which tests to update/add
- **API contracts**: Any request/response changes
- **Events/Messages**: Any event schema changes
- **Dependencies**: Any new service dependencies
- **UI changes**: Which components/pages
- **State management**: Any store changes

### Step 4: Check Test Coverage
- **Unit tests**: What coverage exists? What gaps?
- **Integration tests**: Do they cover the workflow?
- **E2E tests**: Do journeys test this?
- **Recommendations**: What new tests to add

### Step 5: Impact Analysis
Using `.ai/dependencies.md`:
- **Upstream services**: What might break?
- **Downstream services**: What needs the new behavior?
- **Event flows**: Any event schema changes?
- **Backwards compatibility**: Will this break existing clients?

### Step 6: Risk Assessment
- **Risk level**: Low, Medium, High
- **Fragile areas**: Known problem zones
- **Backwards compatibility**: Breaking changes?
- **Rollback plan**: How to revert if needed

### Step 7: Implementation Path
Create a detailed step-by-step plan:
1. **Order of changes** (dependencies first)
2. **Patterns to follow** (see similar code in workspace)
3. **Tests to add** (before implementation)
4. **Verification steps** (manual testing checklist)

## The Knowledge Maps

| File | Purpose | Contains |
|------|---------|----------|
| `.ai/architecture.md` | System overview | Services, how they connect, data flows |
| `.ai/services.md` | Service details | What each service does, who owns it, tech stack |
| `.ai/functions.md` | Function registry | Function name, location, what it does, who calls it, tests |
| `.ai/api-contracts.md` | API specifications | Endpoints, request/response payloads, error codes |
| `.ai/test-map.md` | Test registry | Test files, what they test, coverage areas |
| `.ai/e2e-map.md` | User journeys | E2E flows, which services involved, which tests |
| `.ai/workflows.md` | Key workflows | Multi-step processes, state transitions, error paths |
| `.ai/dependencies.md` | Service dependencies | Which services depend on each other, event contracts |

## IMPORTANT: Source of Truth

Always verify against actual code:

```
              ACTUAL SOURCE CODE
                      ↑
              (single source of truth)
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
      Tests        Config         Docs
        │             │             │
        └─────────────┴─────────────┘
                     ↓
            AI Knowledge Maps
                     │
                 skills.md ← this file
                     │
                     ↓
                   Copilot
```

**Rules:**
- The .ai/ files are a GUIDE, not gospel
- Always read the actual source code for important details
- Always run tests to verify understanding
- Update .ai/ docs if you find them out of sync with reality
- When in doubt, trust the source code and tests

## Example: Complete Impact Analysis

**Scenario**: "Add new status type to applications"

```yaml
1. Find the code
   └─ Search functions.md for "application status"
      └─ Find: getApplicationStatus() in asl-service

2. Trace the chain
   └─ Who calls getApplicationStatus()?
      ├─ listApplications() in asl-service
      ├─ getApplication() in asl-public-api
      └─ application-workflow in asl-workflow

   └─ What does getApplicationStatus() depend on?
      ├─ Application schema (asl-schema)
      ├─ Database query (application table)
      └─ Status constants (asl-constants)

3. Map affected files
   ├─ asl-schema: Add status to schema
   ├─ asl-constants: Add status constant
   ├─ asl-service: Update getApplicationStatus() logic
   ├─ database: Migration for new status

4. Find tests
   └─ grep "getApplicationStatus" in test files
      ├─ application.test.js (unit)
      ├─ application.integration.test.js
      └─ applications-list.spec.js (E2E)

5. Identify new tests needed
   ├─ Unit test for new status case
   ├─ E2E test showing new status in workflow
   ├─ Test error case if new status invalid

6. Check impacts
   └─ services.md shows what depends on asl-service
      ├─ asl-workflow (application state machine)
      ├─ asl-notifications (status change triggers)
      ├─ asl-public-api (API consumers)

7. Create implementation plan
   ├─ Step 1: Update schema (asl-schema)
   ├─ Step 2: Add constant (asl-constants)
   ├─ Step 3: Add unit tests
   ├─ Step 4: Implement in asl-service
   ├─ Step 5: Add integration tests
   ├─ Step 6: Update workflows/notifications if needed
   ├─ Step 7: Update E2E tests
   └─ Step 8: Test full flow locally
```

## Getting Started

1. **For new JIRA tickets**: Start with Step 1-2 above
2. **For bug fixes**: Start with finding the broken code, then trace backwards
3. **For refactoring**: Map all callers using functions.md
4. **For feature flags**: Check e2e-map for affected journeys
