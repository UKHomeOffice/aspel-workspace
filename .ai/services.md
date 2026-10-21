# ASPeL Services Directory

A reference for each service in the ASPeL monorepo. See `architecture.md` for how they interact.

---

## asl (Public Establishment UI)

**Location**: `packages/asl/`

**Purpose**: The main public-facing web application where establishments (license holders) manage their licenses and submit applications.

**Type**: Frontend UI Service

**Tech Stack**:
- Express.js (server-side rendering)
- React 18 (frontend)
- Redux (state management)
- Sass (styling)
- Webpack (bundling)

**Key Exports**:
- Server listening on configured port
- React component pages
- Redux store and actions

**Dependencies**:
- `@asl/pages` - Page components
- `@asl/projects` - Project/application management
- `@asl/service` - Express bootstrapping, auth
- `@ukhomeoffice/asl-components` - Design system
- `@ukhomeoffice/asl-constants` - Constants

**External Calls**:
- `asl-public-api` - REST API for data
- `asl-permissions` - Permission checks
- Redis - Session storage

**Key Workflows**:
- User login/logout
- View licenses
- Submit applications
- Track application status
- Update establishment information

**Testing**:
- Jest for unit tests
- React Testing Library for component tests
- WebdriverIO for E2E tests

**Configuration**:
- `config.js` - Environment-based config
- `nodemon.json` - Development auto-reload settings

**Common Code Paths**:
- `/pages` - React page components
- `/lib` - Utilities and helpers
- `/lib/pages` - Page container components

---

## asl-internal-ui (Internal ASRU UI)

**Location**: `packages/asl-internal-ui/`

**Purpose**: Internal-only web application for ASRU regulatory staff. Restricted to ASRU network (requires VPN/ACP Tunnel).

**Type**: Frontend UI Service

**Tech Stack**:
- Express.js (server-side rendering)
- React 18 (frontend)
- Redux (state management)
- AWS SDK (S3 access)
- docx (document generation)

**Key Exports**:
- Server listening on configured port
- React component pages
- Redux store

**Dependencies**:
- `@asl/pages` - Page components (shared with asl)
- `@asl/projects` - Project management
- `@asl/service` - Express bootstrapping
- `@ukhomeoffice/asl-components` - Design system
- AWS SDK (S3 for document uploads)

**External Calls**:
- `asl-internal-api` - Internal API
- `asl-public-api` - Some cross-service calls
- `asl-permissions` - Permission checks
- AWS S3 - Document storage
- Redis - Session storage

**Key Workflows**:
- Review applications (internal)
- Approve/reject licenses
- Manage regulatory processes
- Export data/reports
- Review establishment details

**Differences from asl**:
- More admin-focused features
- Access to internal/restricted data
- Document export capabilities
- Different permission model (internal roles)

**Testing**:
- Jest for unit tests
- React Testing Library for component tests
- WebdriverIO for E2E tests

**Configuration**:
- `config.js` - Environment configuration
- Different deployment restrictions (ASRU network only)

---

## asl-public-api (Public REST API)

**Location**: `packages/asl-public-api/`

**Purpose**: External REST API for consuming application data. Available to external API consumers with authentication.

**Type**: API Service

**Tech Stack**:
- Express.js
- Node.js
- RESTful JSON endpoints

**Key Exports**:
- REST API server
- JSON responses
- HTTP status codes

**Dependencies**:
- `@asl/service` - Express bootstrapping, auth
- `@asl/schema` - ORM and database models
- `@ukhomeoffice/asl-permissions` - Authorization
- `@ukhomeoffice/asl-constants` - Constants

**External Calls**:
- PostgreSQL (via asl-schema)
- asl-permissions - Permission checks
- Cache (Redis if configured)

**Key Endpoints**:
- GET /applications
- GET /applications/:id
- POST /applications/:id/submit
- GET /establishments
- GET /licenses
- More in `api-contracts.md`

**Authentication**:
- Keycloak or API token based
- Implemented in asl-service middleware

**Testing**:
- Jest for unit tests
- Supertest for HTTP endpoint testing
- Integration tests with test database

**Configuration**:
- `config.js` - API configuration
- Environment variables for database, auth

---

## asl-internal-api (Internal REST API)

**Location**: `packages/asl-internal-api/`

**Purpose**: Internal-only REST API for internal system integration and internal UIs.

**Type**: API Service

**Tech Stack**:
- Express.js
- Objection.js ORM
- Node Fetch (for proxying)
- NDJSON (newline-delimited JSON for streaming)

**Key Exports**:
- REST API server
- JSON responses
- Streaming endpoints

**Dependencies**:
- `@asl/service` - Express bootstrapping
- `@asl/schema` - Database models
- `@ukhomeoffice/asl-constants` - Constants

**External Calls**:
- PostgreSQL (via asl-schema)
- asl-permissions - Permission checks
- Potential proxying to other services

**Key Features**:
- More permissive than public API
- May return more fields/data
- Streaming support for large datasets
- HTTP proxying for cross-service communication

**Testing**:
- Jest for unit tests
- Supertest for endpoint testing
- Integration tests

**Configuration**:
- `config.js` - API configuration
- Internal-only deployment

---

## asl-workflow (Workflow Processing)

**Location**: `packages/asl-workflow/`

**Purpose**: Handles complex multi-step workflows including application state transitions, deadline processing, and nightly batch jobs.

**Type**: Backend Service / Job Processor

**Tech Stack**:
- Express.js (for HTTP endpoints)
- Objection.js ORM
- AWS SQS or similar job queue
- AWS S3 for document storage
- Scheduled jobs (cron, nightly jobs)

**Key Exports**:
- Workflow engine
- State transition logic
- Job queue consumers
- Scheduled job handlers

**Dependencies**:
- `@asl/service` - Express bootstrapping
- `@asl/schema` - Database models
- `@asl/taskflow` - Task creation
- `@ukhomeoffice/asl-constants` - Constants, status values
- AWS SDK (SQS, S3)
- Moment.js, deep-diff

**External Calls**:
- PostgreSQL (via asl-schema)
- asl-taskflow - Create tasks
- asl-permissions - Permission checks
- asl-notifications - Trigger emails
- AWS SQS - Job queue
- AWS S3 - Document storage

**Key Workflows**:
- Application submission state machine
- License approval/rejection process
- Deadline enforcement
- Nightly deadline processing
- Document upload/storage
- Complex multi-service state transitions

**Jobs Handled**:
- ApplicationSubmitted event
- ApplicationApproved event
- ApplicationRejected event
- Deadline reached events
- Document upload jobs

**Testing**:
- Jest for business logic
- Integration tests with real database
- Job queue tests

**Configuration**:
- `config.js` - Workflow configuration
- Job queue credentials
- AWS credentials

---

## asl-permissions (Authorization Service)

**Location**: `packages/asl-permissions/`

**Purpose**: Centralized authorization service. Handles role-based access control (RBAC) and permission checking across all services.

**Type**: Backend Service

**Tech Stack**:
- Express.js
- Objection.js ORM
- Redis (for permission caching)
- apicache (response caching middleware)

**Key Exports**:
- Permission checking functions
- RBAC logic
- API endpoints for permission queries

**Dependencies**:
- `@asl/service` - Express bootstrapping
- `@asl/schema` - Database models (roles, users)
- `@ukhomeoffice/asl-constants` - Permission constants
- Redis - Caching

**External Calls**:
- PostgreSQL (via asl-schema) for role definitions
- Redis - Cached permission results

**Key Functionality**:
- `can(user, action, resource)` - Check if user can perform action
- `getPermissions(user)` - Get all permissions for user
- `hasRole(user, role)` - Check user role
- Caching layer to improve performance

**Roles** (from asl-constants):
- establishment_user
- asru_admin
- asru_inspector
- licensing_officer
- etc. (see asl-constants for full list)

**Performance Notes**:
- Heavily used by all services
- Results are cached in Redis
- Cache invalidation critical
- Watch for performance bottlenecks in permission checks

**Testing**:
- Jest for permission logic
- Mock database for tests
- Cache behavior tests

**Configuration**:
- `config.js` - Permission configuration
- Redis connection settings

---

## asl-taskflow (Task Management)

**Location**: `packages/asl-taskflow/`

**Purpose**: Task creation, assignment, and lifecycle management. Supports workflow-driven task creation.

**Type**: Backend Service / Library

**Tech Stack**:
- Node.js module
- Task state machine logic
- Assignment logic

**Key Exports**:
- Task creation functions
- Task state transitions
- Task routing functions

**Dependencies**:
- `@asl/schema` - Database models (Task table)
- `@ukhomeoffice/asl-constants` - Task status constants

**External Calls**:
- PostgreSQL (via asl-schema) for task storage

**Key Functions**:
- `createTask(type, data)` - Create new task
- `assignTask(taskId, userId)` - Assign to user
- `completeTask(taskId)` - Mark task complete
- `getTasksByUser(userId)` - Get user's tasks

**Task Types**:
- inspection_required
- review_required
- approval_required
- follow_up
- etc. (see workflow code)

**Used By**:
- asl-workflow (creates tasks during state transitions)
- asl-notifications (may reference tasks)

**Testing**:
- Jest for task logic
- Database integration tests

---

## asl-notifications (Notifications Service)

**Location**: `packages/asl-notifications/`

**Purpose**: Sends email notifications and other messages triggered by system events.

**Type**: Backend Service / Job Consumer

**Tech Stack**:
- Job queue consumer
- Email templating (Mustache)
- StatsD metrics
- SMTP or email service

**Key Exports**:
- Job handlers
- Email notification functions
- Template rendering

**Dependencies**:
- `@asl/service` - Service boilerplate
- `@asl/schema` - Database models (User, Notification templates)
- `@ukhomeoffice/asl-constants` - Constants
- `@ukhomeoffice/asl-dictionary` - Email templates
- hot-shots (StatsD client)
- AWS SDK if using SES

**External Calls**:
- PostgreSQL (via asl-schema) for user emails, notification records
- Email service (SMTP, AWS SES, etc.)
- StatsD - Metrics reporting

**Job Types Consumed**:
- application.submitted
- application.approved
- application.rejected
- deadline.approaching
- document.uploaded
- etc.

**Email Templates**:
- Defined in asl-dictionary
- Rendered with Mustache templating
- Per-notification-type templates

**Metrics Tracked**:
- Emails sent
- Email failures
- Job processing time
- Job failure rate

**Testing**:
- Jest for job handlers
- Mock email service
- Template rendering tests

**Configuration**:
- `config.js` - Notification settings
- Email service credentials
- Template paths
- StatsD configuration

---

## asl-schema (Database Schema & ORM)

**Location**: `packages/asl-schema/`

**Purpose**: Centralized database schema, ORM models, and migrations. Single source of truth for database structure.

**Type**: Utility / Data Access Library

**Tech Stack**:
- Objection.js (ORM)
- Knex.js (query builder)
- PostgreSQL driver
- Migrations and seeding

**Key Exports**:
- Model classes (Application, Establishment, License, Task, User, etc.)
- Migration files
- Seed files

**Database Models**:
- `Application` - License applications
- `Establishment` - Organization data
- `License` - License records
- `Task` - Workflow tasks
- `User` - User profiles
- `ProjectVersion` - Application versions
- `Procedure` - Regulatory procedures
- And many more (see `/models` directory)

**Key Features**:
- Snake_case ↔ camelCase automatic mapping
- Relationships defined in models (hasMany, belongsTo)
- Timestamps (createdAt, updatedAt)
- Soft deletes
- Custom query scopes
- Validation hooks

**Migrations**:
- Located in `/migrations`
- Run with `npm run migrate` -w asl-schema
- Rollback with `npm run rollback` -w asl-schema

**Used By**:
- Almost all backend services
- asl-public-api
- asl-internal-api
- asl-workflow
- asl-permissions
- asl-notifications

**Important Notes**:
- Schema changes affect many services
- Migrations should be carefully tested
- Always include rollback migration
- Data consistency is critical

**Testing**:
- Jest with test database
- Seed with test data
- Transaction rollback per test

**Configuration**:
- `config.js` - Database connection settings
- Knex configuration for migrations
- Environment-based connection strings

---

## asl-service (Service Framework)

**Location**: `packages/asl-service/`

**Purpose**: Express.js application bootstrapping and middleware. Provides standardized setup for authentication, sessions, logging, and security.

**Type**: Utility Framework Library

**Tech Stack**:
- Express.js
- Keycloak-connect (authentication)
- Express-session (session management)
- Redis (session store)
- Winston (logging)
- Helmet (security headers)
- Morgan (HTTP logging)
- Redux (if UI)

**Key Exports**:
- `/ui` - UI app bootstrapping (Express + React + Redux setup)
- `/api` - API app bootstrapping (Express + auth middleware setup)
- Middleware functions
- Security configuration

**Exports**:
- `service/ui()` - Initialize UI application
  - Sets up Express
  - Configures session middleware
  - Configures Redux store
  - Sets up Keycloak auth
  - Adds security headers

- `service/api()` - Initialize API application
  - Sets up Express
  - Configures API authentication
  - Adds logging middleware
  - Configures error handling

**Middleware Provided**:
- Authentication (Keycloak)
- Session management (Redis)
- CSRF protection
- CSP headers
- CORS
- Logging
- Error handling

**Used By**:
- asl (establishment UI)
- asl-internal-ui (internal UI)
- asl-public-api (API)
- asl-internal-api (API)
- asl-workflow (API endpoints)
- asl-permissions (API)
- asl-notifications (jobs)

**Configuration**:
- `config.js` - Service configuration
- Keycloak realm settings
- Session secrets
- Redis connection
- Logging levels

**Important Notes**:
- Single source of truth for app setup
- Changes here affect all services
- Security configuration centralized here
- Auth patterns standardized

---

## asl-constants (Shared Constants)

**Location**: `packages/asl-constants/`

**Purpose**: Centralized constants used across all services. Single source of truth for enums, status values, roles, permissions, etc.

**Type**: Utility Library (Constants)

**Tech Stack**:
- Pure JavaScript
- No external dependencies (except lodash, uuid)

**Key Exports**:

```javascript
// Status values
STATUSES: {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  // ...
}

// User roles
ROLES: {
  ESTABLISHMENT_USER: 'establishment_user',
  ASRU_ADMIN: 'asru_admin',
  // ...
}

// Actions (for permission checking)
ACTIONS: {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  // ...
}

// And many more...
```

**Used By**:
- ALL services import from here

**Important Notes**:
- Changes here cascade to all services
- Must be backward compatible
- Don't remove values, deprecate instead
- New status? Add here first, then implement logic

**Testing**:
- Values should be self-documenting
- No logic to test, just values

**Configuration**:
- No configuration needed
- Just export constants

---

## asl-components (Design System)

**Location**: `packages/asl-components/`

**Purpose**: Shared React component library. Design system components used by UI services.

**Type**: Frontend Component Library

**Tech Stack**:
- React 18
- Sass/CSS
- Storybook (possibly)

**Key Exports**:
- React UI components
- Styled button, form, layout components
- Reusable patterns

**Used By**:
- asl (establishment UI)
- asl-internal-ui (internal UI)

**Component Categories**:
- Layout components (Header, Footer, Sidebar)
- Form components (Input, Select, Checkbox)
- Buttons and controls
- Cards and containers
- Navigation
- etc.

**Design Consistency**:
- All UIs should use these components
- Consistent styling across application
- Accessibility built-in

**Testing**:
- Jest for component logic
- Storybook for visual testing

---

## asl-dictionary (Content & Templates)

**Location**: `packages/asl-dictionary/`

**Purpose**: Centralized content, email templates, and text strings used across services.

**Type**: Content/Template Library

**Tech Stack**:
- Mustache templating
- JSON or YAML for content
- YAML for structured data

**Key Exports**:
- Email templates
- Content strings
- Dictionary entries
- Static text

**Used By**:
- asl-notifications (email templates)
- asl-public-api (response text)
- asl-internal-api (response text)
- Potentially asl/asl-internal-ui

**Template Format**:
- Mustache syntax for variables
- Supports conditionals and loops
- Example:

```mustache
Dear {{user.firstName}},

Your application {{application.reference}} has been
{{#if application.approved}}approved{{/if}}
{{#if application.rejected}}rejected{{/if}}.

For more information, visit: {{urls.applicationStatus}}
```

**Content Organization**:
- Email templates in `/templates`
- Common content strings
- Status messages
- Error messages

**Important Notes**:
- Changes here affect user-facing text
- Should be reviewed for accuracy and tone
- Localization hooks may be in place

---

## asl-pages (Page Components)

**Location**: `packages/asl-pages/`

**Purpose**: Shared React page components used by asl and asl-internal-ui.

**Type**: Frontend Component Library

**Tech Stack**:
- React 18
- Redux (connected to store)
- React Router

**Key Exports**:
- Page components (Application, License, Task pages)
- Connected components (with Redux)
- Page layouts

**Used By**:
- asl (establishment UI)
- asl-internal-ui (internal UI)

**Example Pages**:
- Application list page
- Application detail page
- License page
- Task list page
- etc.

**Pattern**:
- Container components with Redux `connect()`
- Presentational components (dumb components)
- Redux actions dispatched from containers

---

## asl-projects (Project Management)

**Location**: `packages/asl-projects/`

**Purpose**: Project/application management logic, likely shared utilities for managing application workflows.

**Type**: Frontend/Business Logic Library

**Tech Stack**:
- React 18
- Redux actions and reducers
- Business logic utilities

**Key Exports**:
- Redux actions for application management
- Application workflow logic
- Project/application utilities

**Used By**:
- asl (establishment UI)
- asl-internal-ui (internal UI)

---

## Other Services

The following services exist but are not fully detailed here. See their README.md files:

- **asl-resolver** - GraphQL or similar resolver logic
- **asl-search** - Search indexing and querying
- **asl-data-exports** - Data export functionality
- **asl-attachments** - File/attachment handling
- **asl-metrics** - Metrics collection
- **asl-toolbox** - Admin/operational tools
- **asl-public-api** - Public REST API (see above)
- **asl-internal-api** - Internal REST API (see above)

---

## Summary Table

| Service | Type | Purpose | Key Callers |
|---------|------|---------|-------------|
| asl | UI | Establishment public UI | Users, browser |
| asl-internal-ui | UI | ASRU internal UI | ASRU staff, browser |
| asl-public-api | API | External API | External consumers, asl |
| asl-internal-api | API | Internal API | asl-internal-ui, asl-workflow |
| asl-workflow | Service | Workflow processing | asl-public-api, scheduled jobs |
| asl-permissions | Service | Authorization | All services |
| asl-taskflow | Service | Task management | asl-workflow, asl-notifications |
| asl-notifications | Service | Email notifications | asl-workflow, job queue |
| asl-schema | Library | Database/ORM | All backend services |
| asl-service | Library | App bootstrapping | All UI/API services |
| asl-constants | Library | Shared constants | All services |
| asl-components | Library | UI components | asl, asl-internal-ui |
| asl-dictionary | Library | Content/templates | asl-notifications |

---

For more details on specific services, see their individual README.md files in `packages/[service]/README.md`.

