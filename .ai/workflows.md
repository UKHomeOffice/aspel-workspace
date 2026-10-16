# ASPeL Key Business Workflows

This document describes the core business workflows and state machines in ASPeL.

---

## Application Lifecycle Workflow

The primary workflow manages the lifecycle of a license application from creation to approval or rejection.

### State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Lifecycle                     │
└─────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │  DRAFT   │  (Initial state, user filling form)
     └────┬─────┘
          │ user.submit()
          ▼
     ┌──────────────┐
     │  SUBMITTED   │  (Awaiting ASRU review)
     └──┬──────┬────┘
        │      │
        │      └─────────── reviewer.request_info()
        │                         │
        │                         ▼
        │                  ┌──────────────────┐
        │                  │  AWAITING_INFO   │
        │                  └────────┬─────────┘
        │                           │
        │                           │ user.submit_update()
        │                           │
        │                           ▼
        │                  (back to SUBMITTED)
        │
        ├─ reviewer.approve()
        │     │
        │     ▼
        │  ┌──────────┐
        │  │ APPROVED │
        │  └────┬─────┘ (triggers license activation)
        │       │
        │       └─→ License created, ACTIVE
        │
        └─ reviewer.reject()
             │
             ▼
          ┌─────────┐
          │ REJECTED │  (Final state, no further action)
          └──────────┘
```

### Application Submission Flow

**Trigger**: User clicks "Submit" button in establishment UI

**Preconditions**:
- Application status = DRAFT
- All required fields completed
- User has submit:application permission

**Process**:

```javascript
async submitApplication(applicationId, userId) {
  // 1. Validate
  const app = await Application.findById(applicationId);
  if (app.status !== 'DRAFT') {
    throw new Error('Invalid state: can only submit DRAFT applications');
  }

  // 2. Check permissions
  const allowed = await permissions.can(userId, 'submit:application', app);
  if (!allowed) {
    throw new Error('Not authorized');
  }

  // 3. Validate completeness
  const errors = validateApplicationCompleteness(app);
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  // 4. Update database
  await Application.query()
    .findById(applicationId)
    .patch({
      status: 'SUBMITTED',
      submittedAt: new Date(),
      submittedBy: userId
    });

  // 5. Create review task
  await taskflow.createTask('application_review', {
    applicationId: applicationId,
    reference: app.reference,
    title: `Review Application ${app.reference}`
  });

  // 6. Queue notification
  await queue.job('application.submitted', {
    applicationId: applicationId,
    submittedBy: userId,
    timestamp: new Date()
  });

  // 7. Return confirmation
  return {
    id: applicationId,
    status: 'SUBMITTED',
    reference: app.reference
  };
}
```

**Side Effects**:
- Application status updated
- Review task created
- ASRU staff assigned task
- Confirmation email queued
- Audit log entry created

**Error Handling**:
- ✓ Validate state before proceeding
- ✓ Permission check
- ✓ Validation errors returned to user
- ✗ No rollback if notification fails (eventual consistency)

**Rollback**:
- Not possible after SUBMITTED (by design)
- User must contact ASRU to withdraw

---

### Application Review Flow

**Trigger**: ASRU reviewer submits decision

**Preconditions**:
- Application status = SUBMITTED or AWAITING_INFO
- User has review:application permission
- Reviewer filled in decision form

**Process**:

```javascript
async reviewApplication(applicationId, reviewerId, decision, comments) {
  // 1. Validate
  const app = await Application.findById(applicationId);
  if (!['SUBMITTED', 'AWAITING_INFO'].includes(app.status)) {
    throw new Error('Invalid state for review');
  }

  // 2. Check permissions
  const allowed = await permissions.can(reviewerId, 'review:application', app);
  if (!allowed) {
    throw new Error('Not authorized');
  }

  // 3. Validate decision
  if (!['approved', 'rejected', 'request_info'].includes(decision)) {
    throw new Error('Invalid decision');
  }

  if (decision === 'rejected' && !comments) {
    throw new Error('Reason required for rejection');
  }

  // 4. Update application
  await Application.query()
    .findById(applicationId)
    .patch({
      status: decision === 'approved' ? 'APPROVED'
              : decision === 'rejected' ? 'REJECTED'
              : 'AWAITING_INFO',
      decidedAt: new Date(),
      decidedBy: reviewerId,
      decision: decision,
      comments: comments
    });

  // 5. Mark task as completed
  await taskflow.completeTask(app.reviewTaskId);

  // 6. Handle decision-specific logic
  if (decision === 'approved') {
    await handleApprovalFlow(app);
  } else if (decision === 'rejected') {
    await handleRejectionFlow(app);
  } else if (decision === 'request_info') {
    await handleInfoRequestFlow(app);
  }

  // 7. Return confirmation
  return {
    id: applicationId,
    status: app.status,
    decision: decision,
    decidedAt: new Date()
  };
}
```

**Approval Flow**:
```javascript
async handleApprovalFlow(app) {
  // 1. Create license
  const license = await License.query().insert({
    establishmentId: app.establishmentId,
    applicationId: app.id,
    status: 'ACTIVE',
    licenseNumber: generateLicenseNumber(),
    validFrom: new Date(),
    validUntil: addYears(new Date(), 5),
    grantedAt: new Date()
  });

  // 2. Create grant task (documentation)
  await taskflow.createTask('grant_paperwork', {
    applicationId: app.id,
    licenseId: license.id
  });

  // 3. Queue notifications
  await queue.job('application.approved', {
    applicationId: app.id,
    licenseId: license.id
  });

  // 4. Audit log
  await AuditLog.insert({
    event: 'application.approved',
    applicationId: app.id,
    by: app.decidedBy
  });
}
```

**Rejection Flow**:
```javascript
async handleRejectionFlow(app) {
  // 1. No license created

  // 2. Queue rejection notification
  await queue.job('application.rejected', {
    applicationId: app.id,
    reason: app.comments
  });

  // 3. Audit log
  await AuditLog.insert({
    event: 'application.rejected',
    applicationId: app.id,
    reason: app.comments
  });
}
```

**Info Request Flow**:
```javascript
async handleInfoRequestFlow(app) {
  // 1. Create new deadline (e.g., 14 days)
  const deadline = addDays(new Date(), 14);

  // 2. Update application
  await Application.query()
    .findById(app.id)
    .patch({
      infoRequestDeadline: deadline
    });

  // 3. Queue notification
  await queue.job('application.info_requested', {
    applicationId: app.id,
    deadline: deadline
  });

  // 4. Create follow-up task
  await taskflow.createTask('follow_up', {
    applicationId: app.id,
    dueDate: deadline
  });
}
```

---

### License Activation Flow

**Trigger**: Application status changes to APPROVED

**Preconditions**:
- handleApprovalFlow() creates the license

**Process**:

```javascript
async activateLicense(licenseId) {
  // 1. Get license
  const license = await License.findById(licenseId);

  // 2. License should already be created with status='ACTIVE'
  // This is done in handleApprovalFlow()

  // 3. Queue activation notification
  await queue.job('license.activated', {
    licenseId: licenseId,
    establishmentId: license.establishmentId
  });

  // 4. Possibly trigger other workflows
  if (requiresInspection(license)) {
    await createInspectionScheduleTask(license);
  }
}
```

---

## License Management Workflow

### License Lifecycle

```
License created (ACTIVE)
        ↓
[... 5 year validity ...]
        ↓
Expiry approaching (6 months before)
  └─ Renewal reminder email sent
        ↓
User renews OR
Expiry date reached
        ↓
Status changes to: EXPIRED or RENEWED
```

### License Renewal

**Trigger**: User initiates renewal (within 6 months of expiry)

**Process**:

```javascript
async renewLicense(licenseId, userId) {
  // 1. Get license
  const license = await License.findById(licenseId);

  // 2. Check eligibility
  if (license.status !== 'ACTIVE') {
    throw new Error('Can only renew active licenses');
  }

  if (!isRenewableNow(license)) {
    throw new Error('Too early to renew (min 6 months before expiry)');
  }

  // 3. Create renewal application
  const renewalApp = await Application.query().insert({
    licenseId: licenseId,
    type: 'renewal',
    status: 'SUBMITTED',
    applicant: userId,
    reference: generateRenewalReference(license)
  });

  // 4. Create review task
  await taskflow.createTask('renewal_review', {
    applicationId: renewalApp.id,
    licenseId: licenseId
  });

  // 5. Queue notification
  await queue.job('license.renewal_submitted', {
    licenseId: licenseId,
    renewalAppId: renewalApp.id
  });
}
```

---

## Inspection Workflow

### Inspection Scheduling

**Trigger**: License created or inspection due

**Process**:

```javascript
async scheduleInspection(licenseId) {
  // 1. Get license
  const license = await License.findById(licenseId);

  // 2. Check if inspection needed
  if (!requiresInspection(license)) {
    return;
  }

  // 3. Get eligible inspectors
  const inspectors = await User.query()
    .where('role', 'asru_inspector')
    .where('active', true);

  // 4. Assign round-robin
  const assignedInspector = selectNextInspector(inspectors);

  // 5. Create inspection task
  const task = await taskflow.createTask('inspection_scheduled', {
    licenseId: licenseId,
    establishmentId: license.establishmentId,
    assignedTo: assignedInspector.id,
    dueDate: calculateDueDate()
  });

  // 6. Queue notification
  await queue.job('inspection.scheduled', {
    licenseId: licenseId,
    inspectorId: assignedInspector.id,
    taskId: task.id
  });
}
```

---

## Deadline Management Workflow

### Nightly Deadline Processing

**Trigger**: Cron job runs nightly (configured in asl-workflow)

**Process**:

```javascript
async processDeadlines() {
  // 1. Find applications with approaching deadlines
  const approaching = await Application.query()
    .where('status', 'AWAITING_INFO')
    .whereRaw('info_request_deadline <= ?', [new Date()])
    .whereNull('overdueNotificationSent');

  // 2. Find overdue applications
  const overdue = await Application.query()
    .where('status', 'AWAITING_INFO')
    .whereRaw('info_request_deadline < ?', [new Date()]);

  // 3. Send reminder emails
  for (const app of approaching) {
    await queue.job('deadline.approaching', {
      applicationId: app.id,
      daysRemaining: calculateDaysRemaining(app.infoRequestDeadline)
    });
  }

  // 4. Auto-close overdue applications
  for (const app of overdue) {
    // Automatically reject if no response
    await Application.query()
      .findById(app.id)
      .patch({
        status: 'AUTO_REJECTED',
        autoRejectedAt: new Date(),
        autoRejectionReason: 'Information not provided within deadline'
      });

    // Queue notification
    await queue.job('application.auto_rejected', {
      applicationId: app.id
    });
  }
}
```

---

## Permission & Authorization Workflows

### Permission Checking

**Used in**: Every API endpoint

```javascript
async checkPermission(user, action, resource) {
  // 1. Get user roles
  const roles = await getUserRoles(user.id);

  // 2. Check permission matrix
  const hasPermission = evaluatePermissionMatrix(roles, action, resource);

  // 3. Handle resource-specific checks
  if (action === 'read:application') {
    // User can read their own or all applications
    if (roles.includes('asru_admin')) {
      return true; // Can read all
    }
    if (resource.applicantId === user.id) {
      return true; // Can read own
    }
    return false;
  }

  // 4. Cache result
  await cache.set(
    `permissions:${user.id}:${action}:${resource.id}`,
    hasPermission,
    { ttl: 300 } // 5 minutes
  );

  return hasPermission;
}
```

---

## Error Handling in Workflows

### Pattern: Graceful Degradation

```javascript
async submitApplication(appId, userId) {
  try {
    // 1. Main workflow
    await updateApplicationStatus(appId, 'SUBMITTED');

    // 2. Non-critical operations
    try {
      await createReviewTask(appId);
    } catch (err) {
      logger.error('Task creation failed', err);
      // Don't throw - application still submitted
    }

    try {
      await queueNotification(appId);
    } catch (err) {
      logger.error('Notification failed', err);
      // Don't throw - will retry from queue
    }

    return { success: true };

  } catch (err) {
    // Critical error - rollback
    if (err.code === 'PERMISSION_DENIED') {
      throw err;
    }
    if (err.code === 'INVALID_STATE') {
      throw err;
    }

    // Database error - log and return
    logger.error('Application submission failed', err);
    throw err;
  }
}
```

### Pattern: Eventual Consistency

```javascript
// Jobs are processed asynchronously
// Applications may be in intermediate states

async handleApplicationSubmittedJob(appId) {
  try {
    // 1. Verify application still in correct state
    const app = await Application.findById(appId);
    if (app.status !== 'SUBMITTED') {
      logger.warn('Job run but app status changed', app.status);
      return;
    }

    // 2. Send email
    const result = await emailService.send({
      to: app.applicant.email,
      template: 'application-submitted',
      data: { application: app }
    });

    // 3. Log result
    await JobResult.query().insert({
      jobId: appId,
      status: result.success ? 'delivered' : 'failed',
      result: result
    });

  } catch (err) {
    // Job queue will retry
    logger.error('Job failed, will retry', err);
    throw err;
  }
}
```

---

## Performance Considerations

### Workflow Optimization

1. **Async Operations**:
   - Task creation: fire-and-forget
   - Notifications: job queue (don't block)
   - Audit logging: batch async

2. **Database Queries**:
   - Use indexes on status, dates
   - Batch operations where possible
   - Avoid N+1 queries

3. **Caching**:
   - User roles cached (5 min TTL)
   - Permissions cached (5 min TTL)
   - License data cached (variable)

4. **Locking**:
   - No pessimistic locking (causes contention)
   - Optimistic locking where needed (version checking)

---

## Monitoring & Alerting

### Key Metrics

```
workflow.application.submitted (counter)
workflow.application.approved (counter)
workflow.application.rejected (counter)
workflow.deadline.processed (counter)
workflow.state_transition_failed (counter)

workflow.submission_time (histogram) - time to submit
workflow.review_time (histogram) - time to review
workflow.notification_delay (histogram) - job queue delay
```

### Alert Conditions

- High failure rate in state transitions
- Long workflow processing delays
- Job queue backed up (> 1 hour delay)
- Deadline processing errors
- Permission check failures

---

## Testing Workflows

### Unit Tests

Test individual functions:

```javascript
describe('submitApplication', () => {
  it('should transition status from DRAFT to SUBMITTED', async () => {
    const app = { id: '1', status: 'DRAFT' };
    const result = await submitApplication('1', 'user1');
    expect(result.status).toBe('SUBMITTED');
  });

  it('should create review task', async () => {
    const createTaskSpy = jest.spyOn(taskflow, 'createTask');
    await submitApplication('1', 'user1');
    expect(createTaskSpy).toHaveBeenCalled();
  });

  it('should fail if application not DRAFT', async () => {
    const app = { status: 'SUBMITTED' };
    await expect(submitApplication('1', 'user1')).rejects.toThrow();
  });
});
```

### Integration Tests

Test full workflow with database:

```javascript
describe('Application submission workflow', () => {
  beforeEach(async () => {
    await db.seed();
  });

  it('should complete full submission flow', async () => {
    const appId = '1';

    // Submit
    await submitApplication(appId, 'user1');

    // Verify state
    const app = await Application.findById(appId);
    expect(app.status).toBe('SUBMITTED');

    // Verify task created
    const task = await Task.query()
      .where('applicationId', appId);
    expect(task).toHaveLength(1);

    // Verify notification queued
    const job = await jobQueue.peek();
    expect(job.type).toBe('application.submitted');
  });
});
```

### E2E Tests

Test from user perspective:

```javascript
describe('Application submission E2E', () => {
  it('should allow establishment to submit application', async () => {
    // Login
    await browser.url('/login');
    await browser.login('establishment@example.com', 'password');

    // Navigate to applications
    await browser.url('/applications');

    // Submit application
    await $('.submit-btn').click();

    // Verify success
    const msg = await $('.success-message').getText();
    expect(msg).toContain('Application submitted');

    // Verify UI updated
    const status = await $('tr[data-app-id="1"] .status').getText();
    expect(status).toBe('Submitted');
  });
});
```

---

For more details, see:
- `architecture.md` - System overview
- `e2e-map.md` - End-to-end journeys
- `dependencies.md` - Service dependencies
- `api-contracts.md` - API specifications

