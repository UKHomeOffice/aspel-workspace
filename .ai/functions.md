# ASPeL Function Registry

This is a registry of key functions across ASPeL. Use this to understand what functions do, who calls them, what they depend on, and how to test them.

**Note**: This is a living document. Add entries as you discover important functions. Priority: functions that multiple services depend on, or functions that are frequently changed.

---

## How to Add a Function Entry

When you discover an important function, document it like this:

```yaml
- name: functionName
  service: service-name
  file: packages/service-name/lib/path/to/file.js
  line: 123

  signature: |
    async functionName(arg1, arg2) → Promise<Object>

  purpose: >
    What this function does in 1-2 sentences.

  inputs:
    - name: arg1
      type: string
      required: true
      description: What arg1 is for
    - name: arg2
      type: Object
      required: false
      description: What arg2 is for
      schema: |
        {
          field1: string,
          field2: number
        }

  outputs:
    type: Object
    schema: |
      {
        id: string,
        status: 'success' | 'failed'
      }
    description: What the function returns

  side_effects:
    - Updates database table X
    - Sends notification to user
    - Queues job Y

  called_by:
    - api-endpoint: POST /api/applications/:id/submit
    - function: anotherFunction (in asl-workflow)
    - test: submit-application.spec.js

  calls:
    - function: validateInput (local)
    - function: Application.query (asl-schema)
    - service: asl-notifications (via queue)
    - external: AWS SQS

  tests:
    unit:
      - file: packages/asl-workflow/test/unit/submitApplication.test.js
        coverage: Main path + error cases
    integration:
      - file: packages/asl-workflow/test/integration/workflows.test.js
        coverage: Full flow with database
    e2e:
      - file: tests/applications/submit-application.spec.js
        coverage: User journey from UI

  permissions_required:
    - submit:application

  error_cases:
    - condition: applicationId not found
      error: "Application not found"
      http_status: 404
    - condition: User lacks submit:application permission
      error: "Not authorized"
      http_status: 403
    - condition: Application not in DRAFT status
      error: "Invalid state: can only submit DRAFT applications"
      http_status: 409

  performance_notes: |
    Typical execution time: < 500ms
    Bottleneck: Database query for Application
    Optimization: Indexed on status field

  known_issues:
    - Issue: If task creation fails, application already submitted
      Impact: Inconsistent state, review task missing
      Workaround: No current workaround, eventual consistency model

  related_functions:
    - validateApplicationCompleteness (validation)
    - createReviewTask (post-submission)
    - queueNotification (post-submission)

  last_modified: 2024-10-08
  last_modified_by: team
```

---

## Core Application Functions

### asl-workflow

#### submitApplication

**Service**: asl-workflow
**File**: `packages/asl-workflow/lib/submit.js`
**Line**: 42

**Signature**:
```typescript
async submitApplication(applicationId: string, userId: string): Promise<{
  id: string;
  status: 'submitted';
  reference: string;
}>
```

**Purpose**: Submit a completed application for ASRU review. Transitions application from DRAFT to SUBMITTED status and initiates review workflow.

**Inputs**:
- `applicationId` (string, required): ID of the application to submit
- `userId` (string, required): ID of user submitting

**Outputs**:
```typescript
{
  id: string;           // Application ID
  status: 'submitted';  // New status
  reference: string;    // Application reference number
}
```

**Side Effects**:
- Application status → SUBMITTED
- Review task created in task queue
- Notification job queued
- Audit log entry created

**Called By**:
- API: POST /api/applications/:id/submit
- Tests: submit-application.spec.js (E2E)

**Calls**:
- Application.query() [asl-schema]
- permissions.can() [asl-permissions]
- validateApplicationCompleteness() [local]
- taskflow.createTask() [asl-taskflow]
- queue.job() [job queue]

**Tests**:
- Unit: `packages/asl-workflow/test/unit/workflows.test.js` (submitApplication block)
- Integration: `packages/asl-workflow/test/integration/workflows.test.js`
- E2E: `tests/applications/submit-application.spec.js`

**Permissions Required**:
- submit:application (on user)

**Error Cases**:
| Condition | Error | Status |
|-----------|-------|--------|
| App not found | "Application not found" | 404 |
| App not DRAFT | "Cannot submit non-draft application" | 409 |
| No permission | "Not authorized" | 403 |
| Incomplete | Validation errors | 422 |

**Performance**:
- Typical time: 200-500ms
- Database: 1-2 queries
- Critical path: Application.query() and status update

**Known Issues**:
- If task creation fails, application already marked submitted (eventual consistency)
- No rollback mechanism

**Related**:
- validateApplicationCompleteness()
- createReviewTask()
- queueNotification()
- reviewApplication()

**Last Modified**: 2024-10-08

---

#### reviewApplication

**Service**: asl-workflow
**File**: `packages/asl-workflow/lib/review.js`
**Line**: 15

**Signature**:
```typescript
async reviewApplication(
  applicationId: string,
  reviewerId: string,
  decision: 'approved' | 'rejected' | 'request_info',
  comments?: string
): Promise<{
  id: string;
  status: string;
  decision: string;
}>
```

**Purpose**: ASRU reviewer submits application decision. Transitions to APPROVED/REJECTED/AWAITING_INFO based on decision. Triggers subsequent workflows (license creation, notifications, etc).

**Inputs**:
- `applicationId`: Application being reviewed
- `reviewerId`: ASRU reviewer submitting decision
- `decision`: approval decision (approved/rejected/request_info)
- `comments`: Optional decision notes/reasons

**Outputs**:
- New application status
- Decision recorded
- Timestamps and audit info

**Side Effects**:
- Application status updated
- Task marked complete
- If approved: License created
- Notification job queued
- Audit log created

**Called By**:
- API: POST /api/applications/:id/review (internal-api only)
- Tests: review-application.spec.js (E2E)

**Tests**:
- Unit: `packages/asl-workflow/test/unit/workflows.test.js` (reviewApplication block)
- Integration: `packages/asl-workflow/test/integration/workflows.test.js`
- E2E: `tests/applications/review-application.spec.js`

**Permissions Required**:
- review:application (ASRU role only)

**Error Cases**:
| Condition | Error | Status |
|-----------|-------|--------|
| App not in reviewable status | "Cannot review application in this state" | 409 |
| No permission | "Not authorized" | 403 |
| Missing reason for rejection | "Reason required for rejection" | 400 |

**Related**:
- handleApprovalFlow()
- handleRejectionFlow()
- handleInfoRequestFlow()
- taskflow.completeTask()

**Last Modified**: 2024-10-08

---

### asl-permissions

#### can

**Service**: asl-permissions
**File**: `packages/asl-permissions/lib/can.js`
**Line**: 10

**Signature**:
```typescript
async can(
  user: User,
  action: string,
  resource?: Object
): Promise<boolean>
```

**Purpose**: Central permission checking function. Evaluates if a user can perform an action on a resource based on their roles and the permission matrix. Cached for performance.

**Inputs**:
- `user`: User object with `id`, `roles` array
- `action`: Permission string (e.g., "read:application")
- `resource`: Optional resource object for resource-specific checks (e.g., own vs all)

**Outputs**:
- `true` if permission granted
- `false` if denied
- Throws error if critical failure

**Side Effects**:
- Results cached in Redis (5 min TTL)
- Cache key: `permissions:${user.id}:${action}:${resource.id || '*'}`

**Called By**:
- EVERY API endpoint
- asl-workflow for state transitions
- Frontend for UI permission checks

**Calls**:
- User.query().withGraph('roles') [asl-schema]
- evaluatePermissionMatrix() [local]
- cache.get/set() [Redis]

**Tests**:
- Unit: `packages/asl-permissions/test/unit/can.test.js`
- Integration: `packages/asl-permissions/test/integration/permissions.test.js`

**Performance**:
- Cached: < 10ms
- Uncached (DB query): 100-200ms
- CRITICAL: Every API call depends on this

**Cache Invalidation**:
- Time-based: 5 minute TTL
- Event-based: On role/permission changes

**Caching Strategy**:
```
Check Redis cache
  ├─ Cache HIT → return result (fast)
  └─ Cache MISS
      ├─ Query database for roles
      ├─ Evaluate matrix
      ├─ Store in cache (5 min TTL)
      └─ Return result
```

**Known Issues**:
- Race condition if permissions changed and cache not expired (acceptable, 5 min max)
- If Redis down, falls back to DB (slower but works)

**Related**:
- User model [asl-schema]
- Role model [asl-schema]
- Permission matrix (hard-coded in this file)

**Last Modified**: 2024-10-08

---

### asl-taskflow

#### createTask

**Service**: asl-taskflow
**File**: `packages/asl-taskflow/lib/task.js`
**Line**: 30

**Signature**:
```typescript
async createTask(
  type: string,
  data: Object
): Promise<Task>
```

**Purpose**: Create a new task. Tasks are workflow-driven work items assigned to users. Immutable once created.

**Inputs**:
- `type`: Task type (e.g., "application_review", "inspection_scheduled")
- `data`: Task-specific data (applicationId, establishmentId, dueDate, etc)

**Outputs**:
- Task object with id, status='pending', createdAt

**Side Effects**:
- Task inserted into database
- Task appears in user's task queue

**Called By**:
- asl-workflow (on application submission, approval, etc)
- asl-notifications (indirectly)

**Tests**:
- Unit: `packages/asl-taskflow/test/unit/task.test.js`

**Error Cases**:
| Condition | Error |
|-----------|-------|
| Unknown task type | ValidationError |
| Missing required field | ValidationError |

**Related**:
- completeTask()
- Task model [asl-schema]

---

### asl-schema (Database Models)

#### Application.query()

**Service**: asl-schema
**File**: `packages/asl-schema/models/Application.js`
**Line**: 10

**Signature**:
```typescript
static query(): QueryBuilder
```

**Purpose**: Access Objection.js query builder for Application model. All database queries for applications go through this.

**Usage Example**:
```javascript
// Find application
const app = await Application.query()
  .findById(123)
  .withGraphFetched('[applicant, establishment, tasks]');

// Update status
await Application.query()
  .findById(123)
  .patch({ status: 'submitted' });

// List with filter
const apps = await Application.query()
  .where('status', 'submitted')
  .orderBy('createdAt', 'desc')
  .limit(20);
```

**Relationships**:
- `applicant` → User
- `establishment` → Establishment
- `tasks` → Task[]
- `previousVersions` → ApplicationVersion[]

**Called By**:
- asl-workflow (all functions)
- asl-public-api (all endpoints)
- asl-internal-api (all endpoints)

**Tests**:
- Integration tests in all services

---

## asl-notifications

#### queue.job()

**Service**: asl-notifications
**File**: `packages/asl-notifications/lib/queue.js`
**Line**: 50

**Signature**:
```typescript
async job(
  jobType: string,
  payload: Object
): Promise<{id: string}>
```

**Purpose**: Queue an async job for the notification service. Jobs are processed from SQS or similar queue.

**Inputs**:
- `jobType`: "application.submitted", "application.approved", etc
- `payload`: Job-specific data

**Outputs**:
- Job ID for tracking

**Side Effects**:
- Job inserted into queue
- Will be processed asynchronously

**Called By**:
- asl-workflow (after state transitions)

**Jobs Processed**:
- application.submitted
- application.approved
- application.rejected
- license.activated
- deadline.approaching

**Related**:
- Job handlers in asl-notifications/lib/jobs/

---

## Template for Adding New Functions

```yaml
- name: newFunctionName
  service: service-name
  file: packages/service-name/lib/path/file.js
  line: XXX

  signature: |
    async newFunctionName(arg1, arg2) → Promise<Result>

  purpose: >
    What this function does.

  inputs:
    - name: arg1
      type: string
      required: true

  outputs:
    type: Object

  side_effects:
    - List changes

  called_by:
    - function: callerFunction
    - api: GET /api/...

  calls:
    - function: calledFunction

  tests:
    unit:
      - file: test/unit/file.test.js
    integration:
      - file: test/integration/file.test.js
    e2e:
      - file: tests/journey.spec.js

  permissions_required:
    - permission:name

  error_cases:
    - condition: X
      error: "Error message"
      status: 400

  performance_notes: |
    Typical time: XXms

  known_issues:
    - Issue description

  related_functions:
    - relatedFunction

  last_modified: 2024-10-08
```

---

## Functions by Category

### Application Lifecycle

- submitApplication() [asl-workflow]
- reviewApplication() [asl-workflow]
- handleApprovalFlow() [asl-workflow]
- handleRejectionFlow() [asl-workflow]
- validateApplicationCompleteness() [asl-workflow] ← TODO: Document

### Task Management

- createTask() [asl-taskflow]
- completeTask() [asl-taskflow] ← TODO: Document
- assignTask() [asl-taskflow] ← TODO: Document

### Permissions

- can() [asl-permissions]
- evaluatePermissionMatrix() [asl-permissions] ← TODO: Document
- checkUserRole() [asl-permissions] ← TODO: Document

### Notifications

- queue.job() [asl-notifications]
- sendNotificationEmail() [asl-notifications] ← TODO: Document
- renderTemplate() [asl-notifications] ← TODO: Document

### Database Access

- Application.query() [asl-schema]
- License.query() [asl-schema] ← TODO: Document
- User.query() [asl-schema] ← TODO: Document

### Validation

- validateApplication() [asl-schema] ← TODO: Document
- validateLicenseData() [asl-schema] ← TODO: Document

---

## Functions by Service

### asl-workflow
- submitApplication()
- reviewApplication()
- handleApprovalFlow()
- handleRejectionFlow()
- handleInfoRequestFlow() ← TODO
- processDeadlines() ← TODO
- activateLicense() ← TODO
- renewLicense() ← TODO

### asl-permissions
- can()
- evaluatePermissionMatrix() ← TODO
- getUserRoles() ← TODO
- hasRole() ← TODO

### asl-taskflow
- createTask()
- completeTask() ← TODO
- assignTask() ← TODO
- getTasksByUser() ← TODO

### asl-notifications
- queue.job()
- handleApplicationSubmittedJob() ← TODO
- sendNotificationEmail() ← TODO

### asl-schema (Models)
- Application.query()
- License.query() ← TODO
- User.query() ← TODO
- Task.query() ← TODO

---

## Functions to Prioritize

When filling in this registry, prioritize:

1. **Critical Path Functions** (used by many services)
   - can() ✓
   - submitApplication() ✓
   - reviewApplication() ✓

2. **Frequently Changed**
   - State transition logic
   - Permission rules

3. **Error-Prone**
   - Validation functions
   - Database operations with constraints

4. **Performance-Critical**
   - Permission checking
   - Large query functions

---

## Maintenance

- **Monthly**: Review for functions that should be added
- **After major changes**: Update affected function entries
- **On refactoring**: Update called_by and calls sections
- **On bugs**: Add to known_issues
- **On new tests**: Update test references

---

For more information on specific services, see:
- `services.md` - Service overview
- `api-contracts.md` - API endpoints
- `workflows.md` - Business logic flows
- `test-map.md` - Testing strategy

