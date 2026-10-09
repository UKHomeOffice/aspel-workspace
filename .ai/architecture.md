# ASPeL Architecture

## System Overview

ASPeL is a monorepo containing a licensing management system with a public establishment UI, internal regulatory UI, and supporting backend services.

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                   │
├──────────────────┬──────────────────────────────┬───────────────┤
│                  │                              │               │
│         Establishments          ASRU/Regulator  │   Public API  │
│          (Public UI)          (Internal UI)     │   Consumers   │
│                  │                              │               │
└──────────────────┼──────────────────────────────┼───────────────┘
                   │                              │
        ┌──────────▼──────────┐      ┌────────────▼──────┐
        │                     │      │                   │
        │  asl (public UI)    │      │asl-internal-ui    │
        │                     │      │  (internal UI)    │
        └──────────┬──────────┘      └────────┬──────────┘
                   │                         │
                   └─────────────┬───────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   asl-public-api       │
                    │   REST API Endpoints   │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  asl-internal-api      │
                    │  Internal API          │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼──────────────────────────┐
        │                        │                          │
        ▼                        ▼                          ▼
  ┌─────────────┐         ┌─────────────┐         ┌────────────────┐
  │ asl-schema  │         │asl-workflow │         │asl-permissions │
  │ (ORM/DB)    │         │(Processes)  │         │(Auth/ACL)      │
  └─────────────┘         └─────────────┘         └────────────────┘
        │                        │                          │
        │                        ▼                          │
        │                 ┌─────────────┐                   │
        │                 │asl-taskflow │                   │
        │                 │             │                   │
        │                 └─────────────┘                   │
        │                        │                          │
        │                        ▼                          │
        │                ┌────────────────┐                │
        │                │asl-notifications                │
        │                │(Email/Messaging)               │
        │                └────────────────┘                │
        │                                                   │
        └────────────────────────┬───────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   PostgreSQL Database   │
                    │   (Applications, Users, │
                    │    Licenses, Tasks)     │
                    └─────────────────────────┘
```

## Core Layers

### 1. Presentation Layer (User-Facing)

**asl** (Establishment Public UI)
- Establishments manage their licenses and applications
- Built with React + Redux
- Served by Express application

**asl-internal-ui** (ASRU Internal UI)
- Internal regulatory staff manage licenses
- Same tech stack as asl
- Restricted to ASRU network

### 2. API Layer

**asl-public-api**
- External-facing REST API
- Available to public API consumers
- May have stricter rate limiting

**asl-internal-api**
- Internal REST API
- Used by internal UI and internal systems
- More permissive than public API

### 3. Business Logic / Service Layer

**asl-workflow**
- Processes application state transitions
- Handles change requests
- Manages deadlines and nightly jobs
- Orchestrates multi-service workflows

**asl-permissions**
- Authorization and access control
- Role-based permission checking
- Cached for performance

**asl-taskflow**
- Task creation and management
- Task routing and assignments
- Supports workflow-driven task creation

**asl-notifications**
- Email notifications
- Event-triggered message sending
- Templated content using asl-dictionary

### 4. Utility/Support Layer

**asl-service**
- Express application bootstrapping
- Authentication (Keycloak)
- Session management (Redis)
- Logging (Winston)
- CSP headers, security
- Used by all UI and API services

**asl-schema**
- ORM models (Objection.js + Knex.js)
- Database schema definitions
- Database migrations
- Data access layer

**asl-components**
- Shared React component library
- Design system components

**asl-constants**
- Centralized constants
- Used by all services

**asl-dictionary**
- Shared content/templates
- Email templates
- Text strings

### 5. Data Layer

**PostgreSQL Database**
- Stores applications, licenses, users, tasks
- Managed via Knex.js migrations (in asl-schema)

## Service Dependencies

### Dependency Rules

1. **Bottom-up dependencies**: Services can depend on layers below them
2. **No cross-layer cycles**: Peer services shouldn't create circular dependencies
3. **Base utilities first**: asl-constants → asl-schema → business services

### Detailed Dependency Map

```
asl-constants
    ↓
    ├─ Used by: ALL services (base constant values)
    └─ Exports: Status enums, role constants, permission types, etc.

asl-schema
    ↓
    ├─ Used by: asl-internal-api, asl-workflow, asl-permissions, asl-notifications
    └─ Exports: Database models (Application, Establishment, License, Task, etc.)

asl-service
    ↓
    ├─ Used by: asl, asl-internal-ui, asl-internal-api, asl-workflow, asl-permissions, asl-notifications
    └─ Exports: Express middleware, auth setup, session setup, base router

asl-components
    ↓
    ├─ Used by: asl, asl-internal-ui
    └─ Exports: React UI components (Design system)

asl-dictionary
    ↓
    ├─ Used by: asl-notifications, potentially asl/asl-internal-ui
    └─ Exports: Template strings, email content

asl-taskflow
    ↓
    ├─ Used by: asl-workflow, asl-notifications
    └─ Exports: Task creation and lifecycle functions

asl-public-api
    ↓
    ├─ Calls: asl-permissions, asl-schema
    └─ Provides: REST endpoints to external consumers

asl-internal-api
    ↓
    ├─ Calls: asl-permissions, asl-schema, potentially asl-public-api
    └─ Provides: REST endpoints to internal UIs

asl (public establishment UI)
    ↓
    ├─ Calls: asl-public-api, asl-permissions (for frontend permission checks)
    └─ Served by: Express server

asl-internal-ui (internal ASRU UI)
    ↓
    ├─ Calls: asl-internal-api, asl-public-api, asl-permissions
    └─ Served by: Express server

asl-workflow
    ↓
    ├─ Calls: asl-schema, asl-taskflow, asl-permissions, asl-notifications
    └─ Triggers: Application state transitions, task creation, notifications

asl-permissions
    ↓
    ├─ Calls: asl-schema
    └─ Provides: Permission checks for all services

asl-notifications
    ↓
    ├─ Calls: asl-schema, asl-dictionary
    └─ Triggers: Email notifications based on events
```

## Communication Patterns

### 1. Request-Response (HTTP REST)

Most communication between UIs and APIs is standard HTTP request-response.

```
UI (asl/asl-internal-ui)
    │
    ├─ GET /api/applications/:id
    │
    ▼
API (asl-public-api / asl-internal-api)
    │
    ├─ Check permissions (calls asl-permissions)
    │
    ├─ Fetch data (calls asl-schema)
    │
    ▼
Response (JSON)
```

### 2. Service-to-Service (HTTP)

Backend services call each other via HTTP for cross-service operations.

```
asl-workflow
    │
    ├─ POST to asl-permissions/check
    │
    ├─ Query via asl-schema (ORM)
    │
    ├─ POST to asl-taskflow/create
    │
    ▼
Results
```

### 3. Database (ORM)

Services use asl-schema (Objection.js) to query PostgreSQL.

```
Service
    │
    ├─ const applications = await Application.query()
    │
    ▼
PostgreSQL
```

### 4. Events/Jobs (Job Queue)

asl-workflow and asl-notifications use job queues for async processing (AWS SQS, or similar).

```
asl-workflow
    │
    ├─ Enqueue notification job
    │
    ▼
Job Queue
    │
    ▼
asl-notifications (consumes job)
    │
    ├─ Sends email
    │
    ▼
Done
```

## Key Workflows

### Application Submission Workflow

```
1. User submits application (asl UI)
   │
   ▼
2. POST /api/applications/:id/submit (asl-public-api)
   │
   ▼
3. Check permissions (asl-permissions)
   │
   ▼
4. Update application status (asl-schema → PostgreSQL)
   │
   ▼
5. Trigger workflow (asl-workflow)
   │
   ├─ Create task (asl-taskflow)
   ├─ Send notification (asl-notifications)
   └─ Update related records
   │
   ▼
6. Return success to UI
```

### Permission Check Flow

```
1. Request arrives at API
   │
   ▼
2. asl-service middleware extracts user
   │
   ▼
3. Call asl-permissions.can(user, action, resource)
   │
   ├─ asl-permissions queries asl-schema (role info)
   ├─ Evaluates permission rules
   └─ Returns true/false (cached)
   │
   ▼
4. Allow or deny request
```

## Critical Relationships

### Data Flow for License Status

When a license status changes:

```
User Action → UI Button
    ↓
API Endpoint
    ↓
asl-workflow (orchestrator)
    ├─ Validates state transition (business rules)
    ├─ Updates DB via asl-schema
    ├─ Creates task via asl-taskflow
    ├─ Sends notification via asl-notifications
    └─ May trigger more workflow steps
    ↓
Events propagate through system
```

### Testing Implications

- **Unit tests** should mock asl-schema, asl-permissions, asl-taskflow
- **Integration tests** should use real database
- **E2E tests** should exercise full workflow: UI → API → asl-workflow → asl-notifications

## Deployment Topology

Each service runs in its own container:

```
┌─────────────────────────────────────────────────┐
│              Kubernetes Cluster                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐  ┌──────────────────┐        │
│  │ asl          │  │ asl-internal-ui  │        │
│  │ (2+ replicas)│  │ (2+ replicas)    │        │
│  └──────────────┘  └──────────────────┘        │
│                                                  │
│  ┌──────────────┐  ┌──────────────────┐        │
│  │asl-public-api│  │asl-internal-api  │        │
│  └──────────────┘  └──────────────────┘        │
│                                                  │
│  ┌──────────────┐  ┌──────────────────┐        │
│  │asl-workflow  │  │asl-permissions   │        │
│  └──────────────┘  └──────────────────┘        │
│                                                  │
│  ┌──────────────────────────────────────┐      │
│  │ asl-notifications                    │      │
│  └──────────────────────────────────────┘      │
│                                                  │
│  ┌──────────────────────────────────────┐      │
│  │ Shared: Redis (sessions)             │      │
│  └──────────────────────────────────────┘      │
│                                                  │
└──────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────┐
│   PostgreSQL (stateful, read replicas)           │
└──────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────┐
│   AWS S3, SQS, CloudWatch, etc.                  │
└──────────────────────────────────────────────────┘
```

## Known Constraints

1. **asl-schema** is heavily used by multiple services — schema changes affect many places
2. **asl-permissions** is called frequently — performance is critical (caching in place)
3. **PostgreSQL** is the bottleneck for scaling — needs careful query optimization
4. **Circular dependencies**: Avoid creating circular imports between services
5. **Event ordering**: asl-workflow and asl-notifications must handle eventual consistency

## For More Detail

- See `services.md` for individual service details
- See `api-contracts.md` for API endpoint specifications
- See `functions.md` for specific function locations and usage
- See `test-map.md` for testing coverage
- See `e2e-map.md` for user journey traceability

