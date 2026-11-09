# ASPeL E2E Journey Map

This document maps end-to-end user journeys across the ASPeL system. Use it to understand which components, services, and tests are involved in each workflow.

## User Journey Template

```yaml
Journey: [Name]
Description: [What user is trying to accomplish]

Actors:
  - [Role/User type]

Entry Point:
  - URL: [Starting page/API]
  - Component: [UI component]
  - Condition: [When/why journey starts]

Steps:
  1.
    User Action: [What user does]
    UI Component: [Component involved]
    API Call: [If applicable]
    Backend Service: [If applicable]
    Expected Result: [What should happen]

Exit Point:
  - URL: [Final page]
  - Expected State: [Application state after journey]

Services Involved:
  - asl (if UI)
  - asl-public-api (if API)
  - asl-workflow (if async processing)
  - etc.

Tests:
  - E2E: tests/applications/submit-application.spec.js
  - Integration: packages/asl-public-api/test/integration/...
  - Unit: packages/asl/test/unit/...

Data Flow:
  - Database changes: [What records are created/modified]
  - Messages: [Events queued]
  - Notifications: [Emails sent, etc.]

Known Issues:
  - [Any known bugs or gotchas]

Related Journeys:
  - [Other journeys that interact with this one]
```

---

## Core User Journeys

### 1. Establishment Submits Application

**Description**: An establishment user (license holder) completes and submits a new license application.

**Actors**: Establishment user (license holder)

**Entry Point**:
- URL: `/applications`
- Action: User clicks "New Application"

**Steps**:

```
1. VIEW APPLICATION LIST
   └─ Component: ApplicationList (asl)
   └─ API: GET /api/applications
   └─ Backend: asl-public-api
   └─ Result: Display list of applications with statuses

2. START NEW APPLICATION
   └─ Component: ApplicationForm (asl)
   └─ Action: Click "Create New"
   └─ Result: Form displayed with empty fields

3. FILL APPLICATION FORM
   └─ Component: ApplicationForm
   └─ Fields:
      - Applicant details
      - License type
      - Establishment info
      - Declaration acceptance
   └─ Action: Fill all required fields
   └─ Result: Form validation as user types

4. REVIEW APPLICATION
   └─ Component: ApplicationReview
   └─ Action: Click "Review & Submit"
   └─ Result: Summary page showing all entered data

5. SUBMIT APPLICATION
   └─ API: POST /api/applications/:id/submit
   └─ Payload:
      {
        "applicationId": "123",
        "declarationAccepted": true,
        "timestamp": "2024-10-08T10:30:00Z"
      }
   └─ Backend: asl-public-api
   └─ Middleware: Permission check (asl-permissions)
   └─ Result: 202 Accepted
   └─ Response:
      {
        "id": "123",
        "status": "submitted",
        "reference": "APP-2024-001"
      }

6. TRIGGER WORKFLOW
   └─ Service: asl-workflow
   └─ Action: submitApplication()
   └─ Workflow Steps:
      a. Validate application
      b. Update status in database
      c. Create review task
      d. Queue notification job
   └─ Result: Application now in "submitted" state

7. SEND NOTIFICATION
   └─ Service: asl-notifications
   └─ Action: Application.submitted job
   └─ Email: Confirmation to applicant
   └─ Template: application-submitted.mustache
   └─ Result: Email sent to applicant@example.com

8. DISPLAY SUCCESS
   └─ Component: ApplicationConfirmation (asl)
   └─ Message: "Application submitted successfully"
   └─ Details: Reference number, next steps, support contact
   └─ Result: User sees confirmation screen
```

**Exit Point**:
- URL: `/applications/123/confirmation`
- Expected State:
  - Application status: "submitted" (in database)
  - Application task created: assigned to ASRU staff
  - Confirmation email sent to applicant
  - User sees success message

**Services Involved**:
- asl (establishment UI)
- asl-public-api (REST API)
- asl-permissions (authorization)
- asl-schema (database)
- asl-workflow (state machine)
- asl-taskflow (task creation)
- asl-notifications (email sending)

**Database Changes**:
- Applications table: status = 'submitted'
- Tasks table: new task created (type = 'application_review')
- Notifications table: record logged

**Messages/Events**:
- `application.submitted` → job queued for asl-notifications
- May trigger other workflows

**Tests**:
```
E2E:
  ✓ tests/applications/submit-application.spec.js

Integration:
  ✓ packages/asl-public-api/test/integration/routes/applications.test.js
    - POST /applications/:id/submit

Unit:
  ✓ packages/asl-workflow/test/unit/workflows/ApplicationWorkflow.test.js
    - submitApplication() logic
  ✓ packages/asl-notifications/test/unit/jobs/ApplicationSubmittedHandler.test.js
    - Email sending
```

**Data Flow Diagram**:
```
┌─ Establishment User ─────────────────────┐
│                                          │
│  1. View applications (GET /api/...)    │
│  2. Fill form (local state)             │
│  3. Submit (POST /api/.../submit)       │
│                                          │
└─────────────────┬────────────────────────┘
                  │
                  ▼
        ┌─ asl-public-api ──────┐
        │ - Check permissions   │
        │ - Validate input      │
        │ - Update database     │
        └───────┬───────────────┘
                │
                ▼
        ┌─ asl-workflow ────────────┐
        │ - State transition check  │
        │ - Create task             │
        │ - Queue notification job  │
        └───────┬───────────────────┘
                │
                ├──────┬──────────────┐
                │      │              │
                ▼      ▼              ▼
            Database  Task      Notification
                      Created   Queued
```

**Known Issues**:
- If database update fails, task may still be created (eventual consistency)
- Email delivery not guaranteed (may end up in spam)
- No rollback if workflow fails after database update

**Related Journeys**:
- ASRU Reviews Application (workflow initiated by this journey)
- Application Rejection (alternative path)
- Application Approval (final path)

---

### 2. ASRU Reviewer Reviews Application

**Description**: ASRU staff (regulator) reviews a submitted application and makes a decision.

**Actors**: ASRU Reviewer (asru_inspector role)

**Entry Point**:
- URL: `/tasks` (internal UI)
- Component: TaskList (asl-internal-ui)
- Condition: User logs in, has pending review tasks

**Steps**:

```
1. VIEW TASK LIST
   └─ Component: TaskList (asl-internal-ui)
   └─ API: GET /api/tasks
   └─ Backend: asl-internal-api
   └─ Query: Get tasks assigned to current user
   └─ Filter: Status = 'pending'
   └─ Result: Display pending review tasks

2. SELECT TASK
   └─ Component: TaskDetail
   └─ Action: Click on "Review Application-2024-001"
   └─ API: GET /api/applications/:id
   └─ Result: Load application detail page

3. REVIEW APPLICATION DETAILS
   └─ Component: ApplicationDetailView (asl-internal-ui)
   └─ Information shown:
      - Applicant information
      - License requested
      - All submitted documents
      - Application dates
   └─ User can: Download documents, view history

4. MAKE DECISION
   └─ Component: ReviewDecisionForm
   └─ Options:
      a. APPROVE
      b. REJECT (requires reason)
      c. REQUEST_MORE_INFO
   └─ User fills:
      - Decision: [approve/reject/request_info]
      - Reason/Comments: [text]
      - If reject: Justification (required)
   └─ Result: Form ready to submit

5. SUBMIT DECISION
   └─ API: POST /api/applications/:id/review
   └─ Payload:
      {
        "taskId": "task-123",
        "applicationId": "app-123",
        "decision": "approved",  // or "rejected", "request_info"
        "reason": "All requirements met",
        "reviewedBy": "reviewer@asru.gov.uk",
        "timestamp": "2024-10-08T14:30:00Z"
      }
   └─ Backend: asl-internal-api
   └─ Middleware: Permission check (must have review permission)
   └─ Result: 200 OK

6. WORKFLOW PROCESSING
   └─ Service: asl-workflow
   └─ Trigger: Application.reviewed
   └─ Steps:
      a. Check decision (approved/rejected/request_info)
      b. IF approved:
         ├─ Update License status to 'active'
         ├─ Create grant task
         └─ Queue approval notification
      c. IF rejected:
         ├─ Update License status to 'inactive'
         └─ Queue rejection notification
      d. IF request_info:
         ├─ Queue follow-up notification
         └─ Create new deadline
   └─ Result: Application state updated per decision

7. SEND NOTIFICATION
   └─ Service: asl-notifications
   └─ Jobs queued:
      - application.approved OR
      - application.rejected OR
      - application.info_requested
   └─ Emails sent to applicant with decision details
   └─ Result: Applicant notified

8. UPDATE TASK STATUS
   └─ Service: asl-taskflow
   └─ Action: Mark task as 'completed'
   └─ Result: Task no longer shows in reviewer's list

9. CONFIRMATION
   └─ Component: ReviewConfirmation (asl-internal-ui)
   └─ Message: "Decision recorded successfully"
   └─ Options:
      - View next task
      - Return to task list
   └─ Result: User sees confirmation
```

**Exit Point**:
- URL: `/tasks/completed` or `/tasks` (list refreshed)
- Expected State:
  - Task status: 'completed'
  - Application status: 'approved' or 'rejected'
  - License status: updated
  - Applicant notified via email
  - Task removed from reviewer's queue

**Services Involved**:
- asl-internal-ui (reviewer interface)
- asl-internal-api (internal API)
- asl-permissions (reviewer authorization)
- asl-schema (database)
- asl-workflow (decision processing)
- asl-taskflow (task completion)
- asl-notifications (decision notifications)

**Database Changes**:
- Applications table: status = 'approved' or 'rejected'
- Licenses table: status updated
- Tasks table: status = 'completed', completed_at = now()
- Notifications table: records logged

**Messages/Events**:
- `application.approved` → notification job
- `application.rejected` → notification job
- `application.info_requested` → follow-up job

**Tests**:
```
E2E:
  ✓ tests/applications/review-application.spec.js
  ✓ tests/applications/approve-application.spec.js
  ✓ tests/applications/reject-application.spec.js

Integration:
  ✓ packages/asl-internal-api/test/integration/routes/applications.test.js
    - POST /applications/:id/review

Unit:
  ✓ packages/asl-workflow/test/unit/workflows/ApplicationWorkflow.test.js
    - approveApplication() logic
    - rejectApplication() logic
  ✓ packages/asl-taskflow/test/unit/Task.test.js
    - completeTask() logic
```

**Known Issues**:
- If reviewer presses "Submit" twice, may create duplicate records
- No optimistic locking, concurrent reviews could conflict
- Email to applicant may be delayed

**Related Journeys**:
- Establishment Views Decision (user checks result)
- License Activation (if approved)
- Appeal Process (if rejected, user can appeal)

---

### 3. License Activation (Automatically Triggered)

**Description**: After approval, a license is automatically activated and becomes valid.

**Actors**: System (automated)

**Entry Point**:
- Event: Application.approved (from previous journey)
- Trigger: asl-workflow processing

**Steps**:

```
1. APPLICATION APPROVED
   └─ Event: application.approved queued
   └─ Source: ASRU reviewer submitted decision

2. WORKFLOW PROCESSES APPROVAL
   └─ Service: asl-workflow
   └─ Function: handleApproval()
   └─ Action: Check approval conditions

3. CREATE LICENSE RECORD
   └─ Service: asl-workflow
   └─ Database: asl-schema
   └─ Action: License.query().insert({
       application_id: 'app-123',
       establishment_id: 'est-123',
       status: 'active',
       valid_from: now(),
       valid_until: calculateExpiry()
     })
   └─ Result: License created in 'active' state

4. UPDATE APPLICATION STATUS
   └─ Database: Applications table
   └─ Update: status = 'approved'
   └─ Result: Application marked as approved

5. QUEUE NOTIFICATION
   └─ Service: asl-notifications
   └─ Job: license.activated
   └─ Payload: License details, activation date
   └─ Result: Job queued

6. SEND ACTIVATION EMAIL
   └─ Service: asl-notifications
   └─ Recipient: Establishment contact
   └─ Template: license-activated.mustache
   └─ Content:
      - License number
      - Valid from/until dates
      - Link to view license
      - Next renewal date
   └─ Result: Email sent

7. LOG EVENT
   └─ Database: Audit log
   └─ Event: license.activated
   └─ By: 'system'
   └─ Result: Audit trail created
```

**Exit Point**:
- Condition: License status = 'active' in database
- Expected State:
  - License is now valid and usable
  - Applicant can view/manage license
  - Activation email sent

**Services Involved**:
- asl-workflow (orchestrator)
- asl-schema (database)
- asl-taskflow (may create follow-up tasks)
- asl-notifications (email)

**Database Changes**:
- Licenses table: new record with status='active'
- Applications table: status='approved'
- Audit log: activation event

**Tests**:
```
Integration:
  ✓ packages/asl-workflow/test/integration/workflows/ApprovalWorkflow.test.js
    - License created on approval
    - Email queued

Unit:
  ✓ packages/asl-workflow/test/unit/workflows/ApplicationWorkflow.test.js
    - handleApproval() creates license
  ✓ packages/asl-notifications/test/unit/jobs/LicenseActivatedHandler.test.js
```

**Known Issues**:
- If license creation fails, user has no active license but approval notification sent
- No retry mechanism if email fails

**Related Journeys**:
- Establishment Views License (user discovers activated license)
- License Renewal (when expiry approaching)

---

## Quick Reference: Journey Map Matrix

| Journey | Start | End | Duration | Services | Key API | E2E Test |
|---------|-------|-----|----------|----------|---------|----------|
| Submit Application | `/applications` | confirmation | 2-5 min | 7 | POST /submit | submit-application.spec.js |
| Review Application | `/tasks` | confirmation | 5-10 min | 7 | POST /review | review-application.spec.js |
| License Activation | event | complete | < 1 sec | 4 | (internal) | (implicit) |
| View License | `/licenses` | details | < 1 sec | 2 | GET /licenses/:id | view-license.spec.js |
| Update Establishment | `/settings` | success | 1-2 min | 3 | PUT /establishment | update-establishment.spec.js |
| License Renewal | `/licenses/:id/renew` | confirmation | 5-10 min | 7 | POST /renew | renew-license.spec.js |

---

## Journey Dependencies

```
Establishment Submits Application
           ↓
ASRU Reviews Application
           ↓
      ┌────┴────┐
      │          │
    Approve    Reject
      │          │
      ▼          ▼
License Activated  Application Rejected
      │
      ▼
Establishment Views License
      │
      ▼
License Renewal (periodic, 5 years later)
```

---

## Performance Targets

| Journey | Start to Submit | DB Update | Notification | Full Cycle |
|---------|-----------------|-----------|--------------|-----------|
| Submit Application | < 2s | < 1s | < 5s | < 10s |
| Review Application | < 1s | < 1s | < 5s | < 10s |
| License Activation | N/A | < 1s | < 5s | < 10s |

---

## Testing These Journeys

### Running E2E Tests

```bash
# All E2E tests
npm run test:e2e

# Specific journey
npm run test:e2e -- submit-application.spec.js

# With specific test user
TEST_USER=establishment_user_1 npm run test:e2e
```

### Manual Testing Checklist

For each journey, verify:
- [ ] UI renders correctly
- [ ] Form validation works
- [ ] API responses correct
- [ ] Database state updated
- [ ] Email delivered
- [ ] Task created/completed
- [ ] Permissions enforced
- [ ] Error cases handled gracefully

---

## Known Gaps in Testing

- [ ] Concurrent submission handling
- [ ] Network failure scenarios
- [ ] Database transaction rollback
- [ ] Email delivery failure recovery
- [ ] Performance under load
- [ ] Accessibility compliance (all journeys)
- [ ] Mobile UI testing
- [ ] Timeout scenarios

---

## Future Journeys (Not Yet Implemented)

- Establishment Appeals Rejection
- License Suspension/Revocation
- Application Withdrawal
- License Amendment
- Bulk License Operations
- Inspection Scheduling

