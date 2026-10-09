# ASPeL AI Knowledge Map - Quick Reference Card

**Use this as a quick lookup when working with ASPeL**

---

## Question → Answer Location

| Question | File | Section |
|----------|------|---------|
| What does service X do? | `services.md` | Service name heading |
| How do services interact? | `architecture.md` | Dependency graph, data flow |
| What's the system architecture? | `architecture.md` | System overview, layers |
| Where is function X? | `functions.md` | Search function name |
| Who calls function X? | `functions.md` | "called_by" section |
| What does function X call? | `functions.md` | "calls" section |
| What are the API endpoints? | `api-contracts.md` | Each section |
| What's the request format for endpoint X? | `api-contracts.md` | Search endpoint |
| What's the response format? | `api-contracts.md` | "Response" section |
| What E2E tests exist? | `e2e-map.md` | Journey section headings |
| What happens in journey X? | `e2e-map.md` | Steps section |
| What state transitions are valid? | `workflows.md` | State machine diagrams |
| How does feature X work? | `workflows.md` | Feature section |
| Where are tests for service X? | `test-map.md` | Service name section |
| What test patterns are used? | `test-map.md` | "Test Structure" section |
| What services depend on X? | `dependencies.md` | "Used by" section |
| What does X depend on? | `dependencies.md` | "Depends on" section |
| What's the code impact of change X? | `functions.md` + `dependencies.md` | Trace calls and impacts |
| Where are gaps in testing? | `test-map.md` | "Test Gaps" section |
| How do I implement feature X? | `workflows.md` | Process flow section |
| Is X a critical path? | `dependencies.md` | "Critical Paths" section |
| What permission does X need? | `functions.md` or `api-contracts.md` | "permissions_required" |
| How is error X handled? | `workflows.md` or `test-map.md` | Error handling section |

---

## Navigation by Role

### I'm a Developer Implementing a Feature

1. Read JIRA ticket
2. **Check**: `functions.md` - similar function?
3. **Check**: `workflows.md` - business logic needed?
4. **Check**: `api-contracts.md` - API changes?
5. **Check**: `test-map.md` - what tests to add?
6. **Check**: `e2e-map.md` - journey impacts?
7. **Check**: `dependencies.md` - service impacts?
8. **Search**: actual source code for verification
9. Implement with patterns from knowledge map
10. Run tests (locations from test-map.md)

### I'm Reviewing a PR

1. Identify changed files
2. **Check**: `functions.md` - what functions changed?
3. **Check**: "called_by" - who's affected?
4. **Check**: "calls" - what's being used?
5. **Check**: `dependencies.md` - service impacts?
6. **Check**: `test-map.md` - tests updated?
7. **Check**: `api-contracts.md` - API changes breaking?
8. Verify code against documentation

### I'm Debugging a Bug

1. Identify the buggy function
2. **Check**: `functions.md` - find function entry
3. **Check**: `test-map.md` - which tests cover it?
4. **Check**: "called_by" - who might be affected?
5. **Check**: `workflows.md` - state machine issues?
6. **Check**: `dependencies.md` - external failure?
7. Run tests from test-map.md locations
8. Verify fix doesn't break other callers

### I'm New to the Project

1. Start: `INDEX.md` - overview and navigation
2. Read: `architecture.md` - system design
3. Read: `services.md` - each major service
4. Read: `dependencies.md` - how they connect
5. Explore: `functions.md` - important functions
6. Review: `e2e-map.md` - user journeys
7. Study: `workflows.md` - business logic
8. Check: `test-map.md` - testing patterns

### I'm Setting Up for Development

1. **Check**: Monorepo setup in README.md
2. **Check**: `services.md` - which services to run?
3. **Check**: `test-map.md` - how to run tests?
4. **Check**: `dependencies.md` - external services?
5. Setup: Follow monorepo instructions
6. Verify: Run tests
7. Reference: Keep knowledge map open

---

## File Sizes & Reading Time

| File | Lines | Read Time | Best For |
|------|-------|-----------|----------|
| INDEX.md | 350 | 10 min | Starting here |
| architecture.md | 900 | 15 min | System overview |
| services.md | 650 | 20 min | Service reference |
| functions.md | 400 | 10 min | Function lookup |
| api-contracts.md | 600 | 15 min | API reference |
| e2e-map.md | 700 | 15 min | Journey reference |
| workflows.md | 800 | 20 min | Logic understanding |
| test-map.md | 500 | 15 min | Test reference |
| dependencies.md | 750 | 15 min | Relationship mapping |

**Total**: ~5,700 lines, ~2 hours to read all

---

## Key Patterns

### Finding Who Calls a Function

```
1. Open functions.md
2. Search for function name
3. Look at "called_by" section
4. Trace each caller if needed
5. Check if they would be affected
```

### Understanding Code Impact

```
1. Find function in functions.md
2. Check "calls" section (direct impact)
3. Check functions.md for callers (ripple effect)
4. Check dependencies.md (service-level impact)
5. Check e2e-map.md (journey impact)
6. Check test-map.md (test impact)
```

### Finding Tests

```
1. Find code in functions.md or api-contracts.md
2. Look at "tests" section with file locations
3. Navigate to test file
4. Read test for pattern
5. Use as template for new tests
```

### Tracing a User Journey

```
1. Start in e2e-map.md with journey name
2. Read "Steps" section
3. For each step: check API endpoint in api-contracts.md
4. For each API: find handler function in functions.md
5. For each function: trace calls and impacts
6. Check test file location from e2e-map.md
```

### Adding a New Feature

```
1. Check similar feature in workflows.md
2. Check similar function in functions.md
3. Identify state transitions needed
4. Identify services affected via dependencies.md
5. Write tests using patterns from test-map.md
6. Implement following code patterns
7. Update knowledge map with new function
```

---

## Critical Services (Know These)

### asl-constants
- Used by: ALL services
- What: Shared constants (statuses, roles, permissions)
- Impact: Change affects everything
- See: services.md → asl-constants

### asl-schema
- Used by: APIs, workflow, permissions, notifications
- What: Database models via Objection.js
- Impact: Schema changes affect many services
- See: services.md → asl-schema

### asl-service
- Used by: All UI and API services
- What: Express app bootstrapping
- Impact: Changes affect all services
- See: services.md → asl-service

### asl-workflow
- Used by: Applications flow
- What: Application state machine
- Impact: Core business logic
- See: workflows.md → Application Lifecycle Workflow

### asl-permissions
- Used by: Every API endpoint
- What: Authorization checking
- Impact: Every request depends on this
- See: functions.md → can()

---

## Common Tasks - Quick Steps

### "I need to change an API endpoint"

1. Find endpoint in `api-contracts.md`
2. Find handler in `functions.md`
3. Check who calls handler in "called_by"
4. Check what handler calls in "calls"
5. Check tests in "tests" section
6. Implement change
7. Update `api-contracts.md` if contract changed
8. Update tests
9. Run E2E tests

### "I need to add a new field to Application"

1. Check `services.md` → asl-schema
2. Modify Application model in `packages/asl-schema/models/Application.js`
3. Create migration
4. Update functions that use Application (via functions.md)
5. Update tests
6. Update API responses (api-contracts.md)
7. Update UI if needed
8. Run tests

### "I need to understand a workflow"

1. Read `workflows.md` section for the workflow
2. Study state machine diagram
3. Find functions referenced in functions.md
4. Look at tests in test-map.md
5. Trace E2E journey in e2e-map.md

### "I need to add a new application status"

1. Add to asl-constants (status values)
2. Update state machine in workflows.md
3. Update Application model if needed
4. Add transitions to asl-workflow
5. Update tests
6. Update API responses
7. Update E2E tests
8. Update knowledge map

### "I need to run tests for my change"

1. Check test-map.md for test locations
2. Find relevant test file
3. Run specific test: `npm run test -- file.test.js`
4. Run all tests for service: `npm run test -w service-name`
5. Run E2E: `npm run test:e2e`

---

## Checklist: Before Committing Code

- [ ] Found existing tests for this function? (test-map.md)
- [ ] Ran those tests locally? (pass?)
- [ ] Added new tests for new behavior?
- [ ] Checked who calls this function? (functions.md)
- [ ] Verified their tests still pass? (potential ripple effects)
- [ ] Checked API contracts? (api-contracts.md - breaking change?)
- [ ] Checked permissions? (does it need permission check?)
- [ ] Checked state machine? (valid transitions?)
- [ ] Checked state impacts? (is this part of workflow in workflows.md?)
- [ ] Checked database schema? (does it need migration?)
- [ ] Updated related documentation? (e2e, workflows, functions)
- [ ] Ran full test suite? (should be green)

---

## Common File Locations

### Test Files by Service

```
asl:
  packages/asl/test/unit/
  packages/asl/test/integration/

asl-internal-ui:
  packages/asl-internal-ui/test/unit/
  packages/asl-internal-ui/test/integration/

asl-public-api:
  packages/asl-public-api/test/unit/routes/
  packages/asl-public-api/test/integration/routes/

asl-internal-api:
  packages/asl-internal-api/test/unit/
  packages/asl-internal-api/test/integration/

asl-workflow:
  packages/asl-workflow/test/unit/
  packages/asl-workflow/test/integration/

asl-permissions:
  packages/asl-permissions/test/unit/
  packages/asl-permissions/test/integration/

asl-schema:
  packages/asl-schema/test/

E2E Tests:
  asl-deployments/tests/
```

### Source Code by Layer

```
UI Components:
  packages/asl/
  packages/asl-internal-ui/
  packages/asl-components/

APIs:
  packages/asl-public-api/
  packages/asl-internal-api/

Business Logic:
  packages/asl-workflow/
  packages/asl-permissions/
  packages/asl-taskflow/
  packages/asl-notifications/

Data Layer:
  packages/asl-schema/

Framework & Utilities:
  packages/asl-service/
  packages/asl-constants/
  packages/asl-dictionary/
```

---

## Emergency Reference

### "Something broken in asl-permissions"

→ Every API depends on this
→ Check: functions.md → can()
→ Check: dependencies.md → asl-permissions section
→ Critical path issue

### "Something broken in asl-schema"

→ Multiple services affected
→ Check: dependencies.md → asl-schema section
→ Check: services.md → asl-schema
→ May need coordinated changes

### "Something broken in workflows"

→ Applications can't transition
→ Check: workflows.md → Application Lifecycle
→ Check: functions.md for workflow functions
→ Check: test-map.md for affected tests

### "Something broken in notifications"

→ Users don't get emails
→ Check: workflows.md → notification sections
→ Check: functions.md → job functions
→ Check: dependencies.md → asl-notifications

---

## Key Insights

1. **asl-constants** is imported by everything → changes cascade everywhere
2. **asl-permissions.can()** is called on every request → performance critical
3. **asl-schema** models are used by many services → schema changes affect many places
4. **Application state machine** is core to business logic → state transitions are critical
5. **Job queue** is async → eventual consistency model used
6. **Testing pyramid**: Unit (many) → Integration (some) → E2E (few)
7. **No circular dependencies**: Services follow layered architecture
8. **Services own their code**: Don't cross service boundaries for data access

---

## Resources

- **Getting Started**: Read `INDEX.md`
- **System Design**: Read `architecture.md`
- **Service Info**: Consult `services.md`
- **Function Details**: Check `functions.md`
- **API Specs**: See `api-contracts.md`
- **Journeys**: View `e2e-map.md`
- **Business Logic**: Study `workflows.md`
- **Testing**: Check `test-map.md`
- **Relationships**: Review `dependencies.md`
- **This Guide**: You're reading it!

---

**Remember**: These maps are guides. Always verify against actual source code and tests for authoritative details.

**Keep Updated**: When you discover new info, add it to the knowledge map!

**Questions?** Check INDEX.md or the relevant `.ai/` file.

---

*Created: October 8, 2026*
*For: ASPeL Development Team*
*By: AI-Assisted Knowledge Mapping System*

