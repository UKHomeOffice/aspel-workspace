# ASPeL API Contracts

This document specifies the REST API contracts for ASPeL services. Use this to understand request/response formats and error handling.

**Important**: Treat this as a reference guide, but always verify against the actual implementation for authoritative details.

---

## API Metadata

### Base URLs

**Production**:
- Public API: `https://api.aspel.homeoffice.gov.uk`
- Internal API: `https://internal-api.aspel.homeoffice.gov.uk` (restricted to ASRU network)

**Staging**:
- Public API: `https://staging-api.aspel.homeoffice.gov.uk`
- Internal API: `https://staging-internal-api.aspel.homeoffice.gov.uk`

**Local Development**:
- Public API: `http://localhost:8080`
- Internal API: `http://localhost:8081`

### Authentication

All endpoints require authentication via:

```
Authorization: Bearer <keycloak_token>
```

OR

```
Authorization: ApiKey <api_key>
```

Token validation done in asl-service middleware.

### Common Headers

```
Content-Type: application/json
Accept: application/json
User-Agent: [client-name]/[version]
```

### Common Response Wrapper

Most responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "errors": null
}
```

Or on error:

```json
{
  "success": false,
  "data": null,
  "errors": [
    {
      "code": "INVALID_INPUT",
      "message": "Field 'email' is required"
    }
  ]
}
```

---

## Public API Endpoints (asl-public-api)

### Applications

#### GET /api/applications

List all applications accessible to the current user.

**Permission Required**:
- `read:application` for their own applications

**Query Parameters**:
```
?status=submitted     # Filter by status (draft, submitted, approved, rejected)
?reference=APP-2024  # Filter by reference prefix
?limit=50            # Pagination limit (default 20, max 100)
?offset=0            # Pagination offset
?sort=-createdAt     # Sort field (prefix with - for descending)
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": [
    {
      "id": "app-123",
      "reference": "APP-2024-001",
      "status": "submitted",
      "applicant": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "establishment": {
        "id": "est-456",
        "name": "Example Labs Ltd"
      },
      "licenseType": "research",
      "createdAt": "2024-10-01T10:00:00Z",
      "submittedAt": "2024-10-02T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

**Error Responses**:
```
400 Bad Request - Invalid query parameters
401 Unauthorized - Invalid or missing token
403 Forbidden - User lacks read:application permission
```

**Tests**:
- `packages/asl-public-api/test/integration/routes/applications.test.js` - List applications

---

#### GET /api/applications/:id

Get a specific application by ID.

**Permission Required**:
- Must own the application OR have `read:all_applications`

**Path Parameters**:
```
:id (string, required) - Application ID (e.g., "app-123")
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": {
    "id": "app-123",
    "reference": "APP-2024-001",
    "status": "submitted",
    "applicant": {
      "id": "user-789",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+44-0000-123456"
    },
    "establishment": {
      "id": "est-456",
      "name": "Example Labs Ltd",
      "address": "123 Science Street, Oxford"
    },
    "licenseType": "research",
    "licenseSubtype": "basic_research",
    "procedures": ["procedure_a", "procedure_b"],
    "documents": [
      {
        "id": "doc-1",
        "name": "Protocol.pdf",
        "uploadedAt": "2024-10-01T12:00:00Z"
      }
    ],
    "timeline": {
      "createdAt": "2024-10-01T10:00:00Z",
      "submittedAt": "2024-10-02T14:30:00Z",
      "decidedAt": null
    },
    "metadata": {
      "version": 1,
      "lastModifiedBy": "user-789",
      "lastModifiedAt": "2024-10-02T14:30:00Z"
    }
  }
}
```

**Error Responses**:
```
401 Unauthorized - Not authenticated
403 Forbidden - Don't have permission to view this application
404 Not Found - Application doesn't exist
```

**Tests**:
- `packages/asl-public-api/test/integration/routes/applications.test.js` - Get single application

---

#### POST /api/applications

Create a new application.

**Permission Required**:
- `create:application`

**Request Body**:
```json
{
  "licenseType": "research",
  "licenseSubtype": "basic_research",
  "establishment": {
    "id": "est-456"
  },
  "applicant": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+44-0000-123456"
  },
  "procedures": ["procedure_a"],
  "projectTitle": "Understanding Animal Behavior",
  "projectObjectives": "...",
  "duration": 5
}
```

**Response**:
```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/applications/app-123

{
  "success": true,
  "data": {
    "id": "app-123",
    "reference": "APP-2024-001",
    "status": "draft",
    "createdAt": "2024-10-08T10:00:00Z"
  }
}
```

**Error Responses**:
```
400 Bad Request - Invalid or missing required fields
  {
    "success": false,
    "data": null,
    "errors": [
      { "code": "MISSING_FIELD", "message": "licenseType is required" },
      { "code": "INVALID_VALUE", "message": "licenseType must be 'research' or 'testing'" }
    ]
  }

401 Unauthorized
403 Forbidden - User lacks create:application permission
409 Conflict - Duplicate application (same establishment + type)
```

**Tests**:
- `packages/asl-public-api/test/integration/routes/applications.test.js` - Create application

---

#### POST /api/applications/:id/submit

Submit a completed application for review.

**Permission Required**:
- Must own the application AND `submit:application`

**Path Parameters**:
```
:id (string, required) - Application ID
```

**Request Body**:
```json
{
  "declarationAccepted": true
}
```

**Response**:
```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "app-123",
    "reference": "APP-2024-001",
    "status": "submitted",
    "submittedAt": "2024-10-08T14:30:00Z"
  }
}
```

**Side Effects** (triggered immediately):
- Application status changed to 'submitted'
- Review task created in asl-taskflow
- Notification job queued in asl-notifications

**Error Responses**:
```
400 Bad Request - Invalid request
  - declarationAccepted is required and must be true

401 Unauthorized
403 Forbidden - User lacks submit:application permission

404 Not Found - Application doesn't exist

409 Conflict - Application already submitted
  {
    "code": "INVALID_STATE",
    "message": "Application is already submitted or decided"
  }

422 Unprocessable Entity - Application incomplete
  {
    "code": "INCOMPLETE_APPLICATION",
    "message": "Application missing required fields: ['procedures']"
  }
```

**Tests**:
- `packages/asl-public-api/test/integration/routes/applications.test.js` - Submit application
- `packages/asl-workflow/test/integration/workflows/SubmissionWorkflow.test.js`

---

#### PUT /api/applications/:id

Update an application (only in draft status).

**Permission Required**:
- Must own the application AND `update:application`

**Path Parameters**:
```
:id (string, required) - Application ID
```

**Request Body**:
```json
{
  "applicant": {
    "firstName": "Jane",
    "email": "jane@example.com"
  },
  "procedures": ["procedure_a", "procedure_b"]
}
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": {
    "id": "app-123",
    "status": "draft",
    "lastModifiedAt": "2024-10-08T15:00:00Z"
  }
}
```

**Error Responses**:
```
400 Bad Request - Invalid data
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict - Cannot modify submitted application
```

**Tests**:
- `packages/asl-public-api/test/integration/routes/applications.test.js` - Update application

---

### Establishments

#### GET /api/establishments

List establishments accessible to the current user.

**Permission Required**:
- For own establishments: always allowed
- For all establishments: `read:all_establishments`

**Query Parameters**:
```
?name=Example         # Filter by name
?licenseType=research # Filter by license type
?limit=50
?offset=0
?sort=-name
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": [
    {
      "id": "est-456",
      "name": "Example Labs Ltd",
      "address": "123 Science Street, Oxford",
      "country": "UK",
      "email": "contact@example.com",
      "telephone": "+44-0000-123456",
      "status": "active",
      "licenses": [
        {
          "id": "lic-789",
          "type": "research",
          "status": "active",
          "validFrom": "2023-01-01",
          "validUntil": "2028-01-01"
        }
      ]
    }
  ]
}
```

---

#### GET /api/establishments/:id

Get a specific establishment.

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": {
    "id": "est-456",
    "name": "Example Labs Ltd",
    "registrationNumber": "12345678",
    "address": { ... },
    "contact": { ... },
    "status": "active",
    "createdAt": "2020-01-01T00:00:00Z",
    "licenses": [ ... ],
    "applications": [ ... ]
  }
}
```

---

#### PUT /api/establishments/:id

Update establishment details.

**Permission Required**:
- Must own OR `admin:establishment`

**Request Body**:
```json
{
  "email": "newemail@example.com",
  "telephone": "+44-0000-999999",
  "address": {
    "street": "456 New Street",
    "postcode": "OX1 2JD"
  }
}
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": { ... }
}
```

---

### Licenses

#### GET /api/licenses

List licenses accessible to the current user.

**Query Parameters**:
```
?status=active       # active, inactive, suspended, expired
?licenseType=research
?establishment=est-456
?limit=50
?offset=0
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": [
    {
      "id": "lic-789",
      "licenseNumber": "LIC-2023-001",
      "establishment": { ... },
      "type": "research",
      "status": "active",
      "grantedAt": "2023-01-01",
      "validFrom": "2023-01-01",
      "validUntil": "2028-01-01",
      "renewal": {
        "nextDue": "2027-06-01",
        "isRenewable": true
      }
    }
  ]
}
```

---

#### GET /api/licenses/:id

Get a specific license.

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": {
    "id": "lic-789",
    "licenseNumber": "LIC-2023-001",
    "establishment": { ... },
    "type": "research",
    "procedures": [ ... ],
    "status": "active",
    "timeline": {
      "grantedAt": "2023-01-01",
      "validFrom": "2023-01-01",
      "validUntil": "2028-01-01"
    },
    "renewal": {
      "status": "not_due",  // not_due, due, overdue
      "nextDue": "2027-06-01",
      "lastRenewal": "2023-01-01"
    }
  }
}
```

---

### Tasks

#### GET /api/tasks

List tasks (internal API primarily, but may be available via public API).

**Query Parameters**:
```
?status=pending      # pending, completed
?type=application_review
?assignedTo=user-789
?limit=50
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": [
    {
      "id": "task-123",
      "type": "application_review",
      "status": "pending",
      "title": "Review Application APP-2024-001",
      "application": { id: "app-123", reference: "APP-2024-001" },
      "assignedTo": {
        "id": "user-789",
        "name": "Jane Smith",
        "email": "jane@asru.gov.uk"
      },
      "createdAt": "2024-10-02T14:30:00Z",
      "dueDate": "2024-10-09T23:59:59Z"
    }
  ]
}
```

---

## Internal API Endpoints (asl-internal-api)

The internal API has similar endpoints but with additional features:

- More fields exposed (internal-only data)
- Batch operations
- Streaming endpoints (NDJSON)
- Advanced filtering

### POST /api/applications/:id/review

Review an application (ASRU staff only).

**Permission Required**:
- `review:application` (ASRU role)

**Request Body**:
```json
{
  "decision": "approved",  // or "rejected", "request_info"
  "reason": "All requirements met",
  "comments": "Good quality application"
}
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": {
    "id": "app-123",
    "status": "approved",
    "reviewedAt": "2024-10-08T16:00:00Z",
    "reviewedBy": "user-789"
  }
}
```

**Side Effects**:
- Application status updated
- License created (if approved)
- Notification queued
- Task marked complete

**Error Responses**:
```
403 Forbidden - User is not ASRU reviewer
404 Not Found
409 Conflict - Application already reviewed
```

**Tests**:
- `packages/asl-internal-api/test/integration/routes/applications.test.js` - Review application
- `packages/asl-workflow/test/integration/workflows/ReviewWorkflow.test.js`

---

## Error Handling

### HTTP Status Codes

```
200 OK - Request succeeded
201 Created - Resource created successfully
202 Accepted - Request accepted for async processing
204 No Content - Request succeeded, no body

400 Bad Request - Invalid request parameters
401 Unauthorized - Missing or invalid authentication
403 Forbidden - Authenticated, but lacks permission
404 Not Found - Resource doesn't exist
409 Conflict - Request conflicts with current state
422 Unprocessable Entity - Request validation failed
429 Too Many Requests - Rate limit exceeded

500 Internal Server Error - Server error
502 Bad Gateway - Service unavailable
503 Service Unavailable - Temporary issue
```

### Error Response Format

```json
{
  "success": false,
  "data": null,
  "errors": [
    {
      "code": "PERMISSION_DENIED",
      "message": "User lacks read:application permission",
      "field": "application",
      "details": { ... }
    }
  ]
}
```

### Common Error Codes

```
INVALID_INPUT - Request validation failed
MISSING_FIELD - Required field missing
INVALID_VALUE - Field value out of range/invalid format
PERMISSION_DENIED - User lacks required permission
AUTHENTICATION_FAILED - Invalid token
RESOURCE_NOT_FOUND - Resource doesn't exist
INVALID_STATE - Resource in wrong state for operation
CONFLICT - Concurrent modification or duplicate
RATE_LIMIT_EXCEEDED - Too many requests
SERVICE_UNAVAILABLE - Downstream service unreachable
```

---

## Rate Limiting

API requests are rate-limited per user/token:

```
Public API: 1000 requests per hour
Internal API: 5000 requests per hour
```

Rate limit info in response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1633696800
```

When limit exceeded:

```http
HTTP/1.1 429 Too Many Requests

{
  "success": false,
  "errors": [
    {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Rate limit exceeded: 1000 requests per hour"
    }
  ]
}
```

---

## Pagination

Responses with multiple records use pagination:

```
?limit=20    # Max 100
?offset=0    # Start index
```

Response includes:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 1500,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Sorting

Sort by any field using `?sort` parameter:

```
?sort=name              # Ascending
?sort=-name             # Descending
?sort=-createdAt,name   # Multiple sorts
```

Default sort usually by `-createdAt` (newest first).

---

## Filtering

Filters depend on endpoint:

```
?status=submitted       # Exact match
?createdAt=2024-10-01   # Date range
?reference=*APP*        # Wildcard search
?search=john            # Full-text search (some endpoints)
```

---

## API Testing

### Unit Tests
- Located in `packages/asl-public-api/test/unit/`
- Mock database and dependencies

### Integration Tests
- Located in `packages/asl-public-api/test/integration/routes/`
- Test with real database
- Examples of all major endpoints

### Running Tests
```bash
# All API tests
npm run test -w asl-public-api

# Specific test file
npm run test -w asl-public-api -- applications.test.js

# With coverage
npm run test:coverage -w asl-public-api
```

---

## API Documentation

For complete, up-to-date API documentation, see:
- Swagger/OpenAPI spec (if available): `/api/docs`
- Individual service README: `packages/asl-public-api/README.md`
- Integration test files: Show all real usage

---

## Future Enhancements

- [ ] GraphQL API variant
- [ ] WebSocket support for real-time updates
- [ ] Bulk operation endpoints
- [ ] Webhooks for event subscriptions
- [ ] OAuth2 / OIDC support
- [ ] Request signing

