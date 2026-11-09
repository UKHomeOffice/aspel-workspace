# ASPeL Service Dependencies

This document maps dependencies between services and describes data flow contracts.

---

## Dependency Graph Overview

```
Layer 1: Base Utilities
├── asl-constants (no dependencies)
├── asl-components (React components only)
└── asl-dictionary (content only)

Layer 2: Data & Framework
├── asl-schema (depends on asl-constants)
└── asl-service (depends on asl-components)

Layer 3: Business Services
├── asl-permissions (depends on asl-service, asl-schema)
├── asl-taskflow (depends on asl-schema, asl-constants)
└── asl-workflow (depends on asl-service, asl-schema, asl-taskflow)

Layer 4: APIs
├── asl-public-api (depends on asl-service, asl-schema, asl-permissions)
├── asl-internal-api (depends on asl-service, asl-schema, asl-permissions)

Layer 5: UIs
├── asl (depends on asl-service, asl-components, asl-pages, asl-projects)
└── asl-internal-ui (depends on asl-service, asl-components, asl-pages, asl-projects)

Layer 6: Notifications
└── asl-notifications (depends on asl-service, asl-schema, asl-dictionary)
```

---

## Direct Dependencies

### asl-constants

**Purpose**: Base constants layer (no internal dependencies)

**Exports**:
- Application statuses
- License types
- User roles
- Permission actions
- Task types
- And many more constants

**Used by**: ALL services

**Impact of Changes**: HIGH - All services affected by constant changes

**Version Lock**: Should be tightly versioned across all services

---

### asl-schema

**Purpose**: Database models and ORM

**Depends on**:
- asl-constants (for constant values)
- PostgreSQL (external database)

**Exports**:
- Objection.js model classes
- Database migrations
- Seed data

**Used by**:
- asl-internal-api
- asl-workflow
- asl-permissions
- asl-notifications
- Any service needing database access

**Database Schema**:
```
Tables created/managed:
- applications
- establishments
- licenses
- tasks
- users
- project_versions
- procedures
- procedures_projects
- audit_logs
(and many more)
```

**Critical Relationships**:
```
applications
  ├─ belongs_to: establishments
  ├─ belongs_to: users (applicant)
  ├─ has_many: project_versions
  └─ has_many: tasks

licenses
  ├─ belongs_to: establishments
  ├─ belongs_to: applications
  └─ has_many: procedures

tasks
  ├─ belongs_to: applications
  └─ belongs_to: users (assignedTo)
```

**Migrations**:
- Stored in `packages/asl-schema/migrations/`
- Run with: `npm run migrate -w asl-schema`
- CRITICAL: Must maintain backward compatibility

**Impact of Changes**: CRITICAL - Schema changes affect many services

**Testing**:
- Integration tests use test database
- Migrations tested on CI/CD

---

### asl-service

**Purpose**: Express app bootstrapping framework

**Depends on**:
- asl-components (UI components)
- asl-constants (constants)
- Keycloak (authentication service)
- Redis (session storage)

**Exports**:
- UI app setup (Express + React + Redux + Auth)
- API app setup (Express + Auth middleware)
- Security middleware (CSP, CORS, etc)
- Session management middleware
- Logging setup (Winston)

**Used by**:
- asl (establishment UI)
- asl-internal-ui (internal UI)
- asl-public-api
- asl-internal-api
- asl-workflow
- asl-permissions
- asl-notifications

**Authentication Flow**:
```
Request arrives
    ↓
asl-service extracts user from Keycloak token
    ↓
User object available to application code
    ↓
Session stored in Redis
```

**Session Management**:
- Session store: Redis
- TTL: 24 hours (configurable)
- CSRF protection: enabled by default

**Impact of Changes**: CRITICAL - All services affected

**Compatibility Notes**:
- Don't change middleware order
- Auth configuration changes cascade everywhere
- Session format changes require migration

---

### asl-permissions

**Purpose**: Centralized authorization service

**Depends on**:
- asl-service (for app setup)
- asl-schema (for user roles)
- asl-constants (for permission values)
- Redis (for caching)

**Exports**:
- `can(user, action, resource)` function
- Permission checking middleware
- Role-based access control logic

**Used by**:
- asl-public-api (all routes)
- asl-internal-api (all routes)
- asl-workflow (state transitions)
- Frontend (Redux actions for UI disabling)

**Permission Matrix**:

```
Role: establishment_user
  ├─ read:application (own applications only)
  ├─ create:application
  ├─ update:application (draft only)
  ├─ submit:application
  ├─ read:establishment (own only)
  └─ update:establishment (own only)

Role: asru_inspector
  ├─ read:application (all)
  ├─ read:all_establishments
  ├─ review:application
  ├─ read:all_licenses
  └─ create:inspection

Role: asru_admin
  ├─ read:application (all)
  ├─ review:application
  ├─ admin:user
  ├─ admin:establishment
  ├─ admin:license
  └─ (all other permissions)
```

**Permission Checking Pattern**:
```javascript
// In API route
const allowed = await permissions.can(user, 'read:application', application);
if (!allowed) {
  return res.status(403).json({ error: 'Not authorized' });
}
```

**Caching**:
- Permissions cached in Redis for 5 minutes
- Cache key: `permissions:${userId}:${resource}`
- Invalidated on: role changes, permission updates

**Impact of Changes**: HIGH - Permission changes affect all APIs

**Critical Path**:
- If permissions.can() fails, all APIs blocked
- No fallback authorization
- Must have fast response time

---

### asl-taskflow

**Purpose**: Task creation and lifecycle management

**Depends on**:
- asl-schema (for Task model)
- asl-constants (for task types/statuses)

**Exports**:
- `createTask(type, data)`
- `assignTask(taskId, userId)`
- `completeTask(taskId)`
- Task state transitions

**Used by**:
- asl-workflow (creates tasks during state transitions)
- asl-notifications (may reference tasks)

**Task Types**:
- application_review
- inspection_scheduled
- follow_up_required
- grant_paperwork
- etc.

**Task Lifecycle**:
```
pending (created)
    ↓
[assigned]
    ↓
completed
    ↓
[archived]
```

**Important Notes**:
- Tasks are immutable once created (no updates)
- Created during workflow transitions
- Completion triggers notifications

**Impact of Changes**: MEDIUM - Only asl-workflow depends on it

---

### asl-workflow

**Purpose**: Application state machine and workflow orchestration

**Depends on**:
- asl-service (app setup)
- asl-schema (database)
- asl-taskflow (task creation)
- asl-constants (status values)

**Calls** (outbound):
- asl-permissions (permission checks)
- asl-notifications (queues jobs)
- AWS SQS (job queue)

**Exports**:
- State machine logic
- Workflow functions
- Job handlers

**Key Workflows**:

1. **Application Submission**
   ```
   Application created (DRAFT)
       ↓
   User submits
       ↓
   submitApplication() called
       ↓
   - Validate state
   - Update status to SUBMITTED
   - Create review task
   - Queue notification
   ```

2. **Application Review**
   ```
   Review task completed
       ↓
   Reviewer submits decision
       ↓
   reviewApplication() called
       ↓
   If APPROVED:
   - Update status to APPROVED
   - Create License
   - Queue approval notification

   If REJECTED:
   - Update status to REJECTED
   - Queue rejection notification
   ```

3. **License Activation**
   ```
   Application APPROVED
       ↓
   Workflow auto-triggers
       ↓
   activateLicense()
       ↓
   - Create License record
   - Set status to ACTIVE
   - Queue activation notification
   ```

**State Transitions**:
```
DRAFT
  └─ submit() ──→ SUBMITTED

SUBMITTED
  ├─ approve() ──→ APPROVED
  ├─ reject() ──→ REJECTED
  └─ request_info() ──→ AWAITING_INFO

AWAITING_INFO
  ├─ submit_updated() ──→ SUBMITTED
  └─ withdraw() ──→ WITHDRAWN

APPROVED
  └─ (license activated automatically)

REJECTED
  └─ (no further transitions)

WITHDRAWN
  └─ (terminal state)
```

**Job Queue**:
- Technology: AWS SQS (or similar)
- Job types: application.submitted, application.approved, etc.
- Consumed by: asl-notifications

**Important Constraints**:
- State transitions must be atomic
- Jobs queued AFTER database committed
- No rollback if notification fails
- Eventual consistency model

**Impact of Changes**: CRITICAL - Core business logic

**Testing**:
- Unit tests: State machine logic
- Integration tests: Full workflow with DB
- E2E tests: Full journey from UI

---

### asl-public-api

**Purpose**: External REST API for public consumers

**Depends on**:
- asl-service (app setup)
- asl-schema (database)
- asl-permissions (authorization)
- asl-constants (status values)

**Calls**:
- asl-workflow (submits applications)
- PostgreSQL (via asl-schema)
- asl-permissions (checks access)

**API Endpoints**:
- GET /api/applications
- POST /api/applications
- GET /api/applications/:id
- POST /api/applications/:id/submit
- GET /api/establishments
- GET /api/licenses
- (see api-contracts.md for full list)

**Response Contract**:
- All responses wrapped in `{ success, data, errors }`
- Error format standardized
- Pagination for list endpoints

**Authentication**:
- Keycloak tokens via asl-service
- API key optional (implemented in asl-service)

**Impact of Changes**: HIGH - Public API, external consumers

**Backwards Compatibility**:
- MUST maintain for external consumers
- Deprecations must be versioned
- No breaking changes without major version

---

### asl-internal-api

**Purpose**: Internal-only REST API for ASRU systems

**Depends on**:
- asl-service (app setup)
- asl-schema (database)
- asl-permissions (authorization)

**Calls**:
- asl-workflow
- asl-permissions
- asl-notifications
- PostgreSQL (via asl-schema)

**Key Differences from Public API**:
- More permissive access (internal only)
- Returns more fields
- Batch operations
- Streaming endpoints (NDJSON)

**Critical Endpoint**:
- POST /api/applications/:id/review
  - Used by ASRU staff to review applications
  - Triggers asl-workflow → license creation

**Impact of Changes**: MEDIUM - Internal only, fewer external dependencies

---

### asl-notifications

**Purpose**: Email and notification delivery

**Depends on**:
- asl-service (app setup)
- asl-schema (database for user emails)
- asl-dictionary (email templates)
- asl-constants (status values)

**Calls**:
- AWS SQS (consume jobs)
- AWS SES or SMTP (send emails)
- StatsD (metrics)

**Triggers**:
- Job queue receives: application.submitted
- Job queue receives: application.approved
- Job queue receives: application.rejected
- Job queue receives: deadline.approaching
- etc.

**Email Templates**:
- application-submitted.mustache
- application-approved.mustache
- application-rejected.mustache
- license-activated.mustache
- deadline-reminder.mustache

**Guaranteed Delivery**:
- NOT guaranteed (eventual consistency)
- Retries via job queue
- Failed jobs logged
- No UI feedback for delivery

**Metrics Collected**:
- emails_sent
- email_failures
- job_processing_time

**Important Notes**:
- Jobs consumed asynchronously
- Job queue can be delayed (ensure idempotency)
- Template changes require testing

**Impact of Changes**: MEDIUM - Affects user experience but not core logic

---

### asl / asl-internal-ui (Frontends)

**Purpose**: User-facing web applications

**Depends on**:
- asl-service (app setup)
- asl-components (UI components)
- asl-pages (page components)
- asl-projects (application logic)

**Calls**:
- asl-public-api (data)
- asl-permissions (frontend permission checks)
- asl-internal-api (asl-internal-ui only)

**Redux Store Structure**:
- authentication (user, roles)
- applications (list, detail)
- establishments
- licenses
- ui (modals, notifications)

**Session**:
- Stored in Redis via asl-service
- 24 hour TTL
- CSRF token included

**Impact of Changes**: MEDIUM - User experience affected

---

## External Dependencies

### Keycloak

**Purpose**: User authentication and identity management

**Used by**: asl-service (via middleware)

**Functionality**:
- User login/logout
- Token generation
- Role assignment
- User attributes

**Integration**:
```javascript
// In asl-service
app.use(keycloak.middleware());
app.use(keycloak.protect());
```

**Failure Impact**:
- If Keycloak down: all services reject requests
- No fallback authentication
- Users locked out

**Configuration**:
- Realm: aspel-realm (or similar)
- Client ID per service
- Keycloak URL in env vars

---

### PostgreSQL

**Purpose**: Primary data store

**Used by**: asl-schema (via Objection.js)

**Databases**:
- Production: Multi-region replicated
- Staging: Single instance
- Local dev: Docker container

**Connection**:
```javascript
// Via asl-schema Knex configuration
const knex = require('knex')(config.client);
```

**Performance**:
- Connection pooling essential
- Max 20 connections typical
- Prepared statements used

**Failure Impact**:
- If DB down: all backend services fail
- Queued jobs from SQS not processed
- Notifications delayed

---

### Redis

**Purpose**: Session store and caching

**Used by**:
- asl-service (sessions)
- asl-permissions (permission cache)
- Potentially other services

**Configuration**:
- Host: localhost:6379 (dev) or cluster (prod)
- TTL: 24 hours (sessions), 5 minutes (permissions)

**Failure Impact**:
- If Redis down:
  - Users logged out
  - Permissions re-checked against DB (slower)
  - Non-fatal, but degraded performance

---

### AWS Services

**Purpose**: Cloud infrastructure

**Services Used**:
- **S3**: Document/file storage (asl-attachments, asl-workflow)
- **SQS**: Job queue (asl-workflow → asl-notifications)
- **SES**: Email delivery (asl-notifications)
- **CloudWatch**: Logging
- **IAM**: Access control

**Configuration**:
- Region: Default AWS region
- Credentials: IAM roles in production

**Failure Impact**:
- If S3 down: File uploads/downloads fail
- If SQS down: Jobs not queued
- If SES down: Emails not sent

---

## Dependency Issues & Risk

### Tight Coupling

**Problem Areas**:
1. asl-workflow calls asl-notifications (via SQS)
   - Risk: If notification fails, no retry
   - Solution: Job queue ensures retry

2. API calls asl-permissions on every request
   - Risk: If permissions service slow, API slow
   - Solution: Caching + fallback to DB check

3. All services depend on asl-schema
   - Risk: Schema changes break everything
   - Solution: Maintain backward compatibility

### Resilience

**Current Resilience**:
- ✓ Keycloak failure → all APIs reject requests (OK)
- ✓ Database failure → graceful error (degraded)
- ✓ Redis failure → graceful with fallback (degraded)
- ✓ SQS failure → jobs lost (risk)
- ✓ Email failure → eventual retry (acceptable)

**Improvements Needed**:
- [ ] SQS job persistence/dead-letter queue
- [ ] Database connection pool monitoring
- [ ] Circuit breaker for asl-permissions
- [ ] Graceful degradation for non-critical features

### Version Compatibility

| Service | Version Locked | Why |
|---------|---|---|
| asl-constants | ✓ Tight | Imported by all services |
| asl-schema | ✓ Tight | Database models shared |
| asl-service | ✓ Tight | Framework for all services |
| asl-permissions | ✓ Medium | Used by many APIs |
| asl-workflow | ~ Medium | Only used by APIs |
| asl-public-api | ~ Loose | Versioned API responses |

---

## Adding New Services

When adding a new service:

1. **Identify Dependencies**: What other services does it call?
2. **Update This Map**: Add to dependency graph
3. **Design API Contract**: If exposing endpoints, document in api-contracts.md
4. **Implement Tests**: Unit, integration, E2E
5. **Update E2E Journeys**: How do users interact with it?
6. **Document Workflows**: If part of business logic
7. **Add to CI/CD**: Build, test, deploy pipeline

---

## Checking Circular Dependencies

Circular dependencies are NOT allowed. To check:

```bash
# Check import cycles in a service
cd packages/asl-service
npx depcheck --circular

# Or manually: grep for imports between sibling services
grep -r "from '@asl/" packages/asl-permissions/
grep -r "from '@asl/" packages/asl-schema/
# asl-schema should NOT import from asl-permissions
```

---

## Dependency Health

**Healthy State**:
- ✓ All tests pass
- ✓ No circular imports
- ✓ Compatible versions across services
- ✓ External services (Keycloak, DB, etc.) up and healthy

**Unhealthy State**:
- ✗ Service A needs version X of asl-schema, Service B needs version Y
- ✗ Tests fail due to version mismatch
- ✗ External service timeout
- ✗ Circular imports detected

**Recovery**:
- Update both services to compatible versions
- Check monorepo lock file
- Run full test suite
- Deploy together (if breaking changes)

---

## Future Optimization

Potential dependency improvements:

1. **Event-Driven Architecture**
   - Decouple asl-workflow from asl-notifications via events
   - Use message broker instead of SQS polling

2. **API Gateway**
   - Centralize asl-permissions checks
   - Reduce per-service permission overhead

3. **Microservices**
   - Current monorepo; could split into separate services
   - Would require API versioning and contracts

4. **Caching Layer**
   - Add Redis more strategically
   - Cache database queries (carefully)

---

For more detail, see:
- `architecture.md` - System overview
- `services.md` - Individual service details
- `api-contracts.md` - API specifications

