# ASPeL AI Knowledge Index

This is the master guide for navigating ASPeL workspace documentation designed for AI-assisted development.

## What is This?

This is an **AI-readable architecture and traceability layer** for the ASPeL monorepo. Instead of trying to document everything comprehensively, it's designed as a **map** to help you (and AI assistants) discover relationships between code, tests, APIs, and user journeys.

Think of it as "How does code relate to tests?" and "What happens when I change this?" and "Where is this function used?"

## Quick Navigation

### I need to...

**Understand the system**
→ Start with [`architecture.md`](./architecture.md)
- System overview
- Services and how they interact
- Data flow
- Deployment topology

**Find a specific service**
→ Go to [`services.md`](./services.md)
- What each service does
- Tech stack
- Dependencies
- Key exports

**Trace a function**
→ Look in [`functions.md`](./functions.md)
- What it does
- Who calls it
- What it calls
- Which tests cover it

**Understand an API endpoint**
→ See [`api-contracts.md`](./api-contracts.md)
- Endpoint specifications
- Request/response formats
- Error codes
- Example calls

**Follow a user journey**
→ Check [`e2e-map.md`](./e2e-map.md)
- Step-by-step workflows
- Components involved
- Services called
- E2E test reference

**Learn business logic**
→ Read [`workflows.md`](./workflows.md)
- State machines
- Process flows
- Error handling patterns
- Performance considerations

**Check test coverage**
→ Go to [`test-map.md`](./test-map.md)
- Where tests are located
- What's covered
- Gaps in coverage
- How to run tests

**See service relationships**
→ Look at [`dependencies.md`](./dependencies.md)
- Direct dependencies
- Data flow contracts
- Resilience patterns
- Version compatibility

## The Workflow: From JIRA Ticket to Code Change

Here's how to use this knowledge map when implementing a feature:

### Step 1: Understand What Needs to Change

Start with the JIRA ticket acceptance criteria (AC).

Read: `architecture.md` → `services.md`
- Which service owns this feature?
- What does that service do?

### Step 2: Find the Code

Look for existing related code.

Read: `functions.md`
- Is there a similar function?
- Where does it live?
- How does it work?

Search: The actual source code
- Find the function
- Read the implementation
- Check existing tests

### Step 3: Understand the Impact

See what would be affected.

Read: `dependencies.md`
- What depends on this code?
- What does it depend on?

Read: `api-contracts.md`
- Does any API endpoint need updating?
- What's the current contract?

Read: `e2e-map.md`
- Which user journeys involve this?
- What end-to-end tests cover it?

### Step 4: Plan Tests

Know what testing is needed.

Read: `test-map.md`
- What test patterns are used?
- Where are similar tests?
- What gaps exist?

Read: `e2e-map.md`
- Which E2E tests should pass?
- Do new tests need to be added?

### Step 5: Check Workflows

Understand business logic.

Read: `workflows.md`
- What state transitions happen?
- Are there state machine implications?
- Error handling patterns?

### Step 6: Implement & Verify

Write code, then verify:
1. Did I change the right files?
2. Are all affected services updated?
3. Do tests pass?
4. Does E2E journey work?
5. Did I break anything?

## Document Structure

Each `.ai/` file serves a specific purpose:

```
.ai/
├── README.md              ← Overview (you are here)
├── architecture.md        ← System design & services
├── services.md            ← Individual service details
├── functions.md           ← Function registry & traceability
├── api-contracts.md       ← REST API specifications
├── e2e-map.md            ← User journey mapping
├── workflows.md           ← Business logic & state machines
├── test-map.md           ← Testing strategy & coverage
├── dependencies.md        ← Service interdependencies
└── fragile-areas.md      ← (Optional) Known problem zones
```

## How These Fit Together

### The Traceability Stack

```
User Action (E2E test) [see e2e-map.md]
        ↓
UI Component [see services.md → asl]
        ↓
REST API Endpoint [see api-contracts.md]
        ↓
API Handler Function [see functions.md]
        ↓
Business Logic [see workflows.md]
        ↓
Database Query [via asl-schema, documented in functions.md]
        ↓
Database [PostgreSQL]
        ↓
[Check unit tests in test-map.md]
```

### The Change Impact Path

When you change code, trace the impact:

```
You modify: submitApplication() function
        ↓
See in functions.md:
  - What it does
  - Who calls it (callers)
  - What it calls (dependencies)
  - Tests that cover it
        ↓
Check dependencies.md:
  - What services depend on this?
  - Database changes needed?
  - Events fired?
        ↓
Check e2e-map.md:
  - Which journeys exercise this?
  - What should still work?
        ↓
Run tests:
  - Unit tests (test-map.md)
  - Integration tests
  - E2E tests
        ↓
Verify impact is complete
```

## Key Concepts

### Services and Layers

```
Layer 5: User Interfaces
  ├─ asl (public UI)
  └─ asl-internal-ui (internal UI)

Layer 4: Public APIs
  ├─ asl-public-api
  └─ asl-internal-api

Layer 3: Business Services
  ├─ asl-workflow
  ├─ asl-permissions
  ├─ asl-taskflow
  └─ asl-notifications

Layer 2: Utilities & Frameworks
  ├─ asl-service (express setup)
  ├─ asl-schema (ORM)
  ├─ asl-components (UI components)
  └─ asl-dictionary (content)

Layer 1: Base
  └─ asl-constants (constants)
```

Services depend on layers below them. **No circular dependencies allowed.**

### Critical Paths

Three functions are called by almost everything:

1. **can()** [asl-permissions]
   - Every API endpoint checks permissions
   - Performance critical (cached)
   - See: functions.md, dependencies.md

2. **Application.query()** [asl-schema]
   - All database access to applications
   - Used by asl-workflow, all APIs
   - See: functions.md, dependencies.md

3. **submitApplication()** [asl-workflow]
   - Core workflow function
   - Triggered by API endpoint
   - Creates tasks, queues notifications
   - See: workflows.md, functions.md, e2e-map.md

### State Machines

Applications have state machines:

```
DRAFT → SUBMITTED → APPROVED/REJECTED/AWAITING_INFO
```

Each state transition involves:
- Permission check [asl-permissions]
- Database update [asl-schema]
- Task creation [asl-taskflow]
- Notification queue [asl-notifications]

See: workflows.md for detailed flows

### Testing Pyramid

```
        E2E (few, slow)
        tests/applications/submit-application.spec.js
           │
      Integration (some, medium)
      packages/asl-workflow/test/integration/
           │
      Unit (many, fast)
      packages/asl-workflow/test/unit/
```

See: test-map.md for test locations and patterns

## Common Questions & Where to Find Answers

| Question | Answer Location |
|----------|-----------------|
| What does service X do? | `services.md` |
| How do services talk to each other? | `architecture.md`, `dependencies.md` |
| What API endpoints exist? | `api-contracts.md` |
| Where is function X defined? | `functions.md` |
| Who calls function X? | `functions.md` in "called_by" |
| What does function X call? | `functions.md` in "calls" |
| What tests cover function X? | `functions.md` in "tests" |
| What E2E journey uses this code? | `e2e-map.md` |
| What state transitions are valid? | `workflows.md` |
| If I change X, what might break? | `dependencies.md`, `functions.md` |
| Where are the tests for service X? | `test-map.md` |
| How do I run tests? | `test-map.md` |
| What's the permission model? | `dependencies.md` in "asl-permissions" |
| Where is the database schema? | `services.md` (asl-schema) + source code |
| What's the job queue system? | `workflows.md` + `dependencies.md` (AWS SQS) |

## Working with This Knowledge Base

### Keep It Updated

When you make changes:
- Modified a state machine? → Update `workflows.md`
- Added a new API endpoint? → Update `api-contracts.md`
- Changed how services interact? → Update `dependencies.md`
- Created new E2E journey? → Add to `e2e-map.md`
- Found important function? → Add to `functions.md`

### Verify Against Source Code

**Important Rule**:

```
       Source Code
      (single source of truth)
             ↑
    ↙────────┼────────↖
   /         │         \
Tests     Config     This KB
   \       │         /
    ╚────────┼────────╝
          For Reference
```

- Always check actual source code for truth
- This KB helps you navigate and understand
- Tests prove behavior (more truthful than code comments)
- If KB conflicts with code, trust the code

### For AI Assistance

When asking Copilot to help:

1. **Reference these docs**: "See `.ai/functions.md` for function X"
2. **Ask for traceability**: "Show me who calls this function"
3. **Ask for impacts**: "What breaks if I change this?"
4. **Ask for tests**: "What tests cover this?"
5. **Ask for workflows**: "Walk through the state machine"

Example:
```
Q: I need to change the application submission workflow.
   Start by reading `.ai/workflows.md` to understand the state machine.
   Then check `.ai/functions.md` for submitApplication().
   See `.ai/api-contracts.md` for the API endpoint.
   Look at `.ai/test-map.md` for existing tests.
   Use `.ai/e2e-map.md` to find affected journeys.
```

## Architecture Rules

To maintain system health:

1. **No circular dependencies** between services
2. **Dependencies flow downward** only (to lower layers)
3. **asl-constants** imported by all, depends on nothing
4. **asl-schema** is widely used, changes cascade everywhere
5. **Permissions checked on every API call** (can be cached)
6. **Database transactions for atomic operations**
7. **Job queue for async operations** (eventual consistency)
8. **State machines** validate transitions before applying

Violating these will cause problems. See `dependencies.md` for details.

## Performance Considerations

Critical paths (optimize these):

1. **can()** [permission check]
   - Used on every API call
   - Must be < 50ms (cached preferred)
   - See: dependencies.md, functions.md

2. **Application.query()**
   - Frequently used
   - Needs indexes on status, dates
   - See: services.md (asl-schema)

3. **Large list queries**
   - Paginate to avoid loading everything
   - See: api-contracts.md

## Known Limitations

- This KB may lag behind code changes (check source code for truth)
- Generated indices not yet auto-generated (manual for now)
- Some functions not yet documented (add as discovered)
- Test gaps exist (documented in test-map.md)

## Future Improvements

Potential enhancements:

1. **Auto-generate function registry** from AST
2. **Impact analyzer tool** "What breaks if I change X?"
3. **Test coverage reporter** linked to this KB
4. **Visual dependency graph** with interactive exploration
5. **API contract enforcement** (prevent breaking changes)
6. **Traceability reports** (function → tests → E2E)

## Getting Started

**First time here?**

1. Read `architecture.md` (5 min) for system overview
2. Read `services.md` (10 min) to understand each service
3. Read the section above "The Workflow" to see how to use this
4. When implementing, follow the 6 steps in that workflow

**Implementing a feature?**

1. Read the relevant JIRA ticket carefully
2. Follow the 6-step workflow above
3. Reference specific `.ai/` files as needed
4. Always verify against actual source code
5. Run all relevant tests
6. Update this KB if you discover new info

**Debugging a bug?**

1. Locate the buggy function in `functions.md`
2. See who calls it [callers]
3. See what it calls [dependencies]
4. Check relevant tests in test-map.md
5. Review workflows.md for state machine issues
6. Verify database state with asl-schema
7. Check for permission issues in dependencies.md

**Reviewing a PR?**

1. Find changed files in functions.md / services.md
2. Check who depends on those functions
3. Verify tests added/updated appropriately
4. Check if API contracts changed (breaking?)
5. Review if workflows affected
6. Verify dependencies.md implications

## Contributing to This KB

When you discover something important:

1. **Add to relevant `.ai/` file**:
   - New service? → `services.md`
   - New API endpoint? → `api-contracts.md`
   - Important function? → `functions.md`
   - New user journey? → `e2e-map.md`
   - State machine change? → `workflows.md`

2. **Use standard formats** (see templates in each file)

3. **Link across files** (e.g., functions.md → api-contracts.md)

4. **Keep it concise** but complete

5. **Always verify** against source code before adding

---

## Quick Links

- **Master Reference**: This file (index)
- **System Overview**: [`architecture.md`](./architecture.md)
- **Service Directory**: [`services.md`](./services.md)
- **Function Registry**: [`functions.md`](./functions.md)
- **API Specifications**: [`api-contracts.md`](./api-contracts.md)
- **User Journeys**: [`e2e-map.md`](./e2e-map.md)
- **Business Workflows**: [`workflows.md`](./workflows.md)
- **Testing Guide**: [`test-map.md`](./test-map.md)
- **Service Dependencies**: [`dependencies.md`](./dependencies.md)

---

**Last Updated**: October 8, 2026
**Maintained By**: ASPeL Development Team
**Status**: Active Knowledge Base

