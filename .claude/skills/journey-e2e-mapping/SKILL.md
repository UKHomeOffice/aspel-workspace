---
name: journey-e2e-mapping
description: 'Map user journeys to E2E tests. Identify missing journey tests, verify E2E coverage, create journey tests, and maintain journey-to-test traceability.'
---

# Journey to E2E Mapping Skill

## Purpose
Ensure every user journey has E2E test coverage and maintain traceability between journeys and tests.

## Journey Definition

A **journey** is a complete user workflow from start to finish.

```
User Goal: Submit an application for approval

Journey Steps:
1. User logs in
2. Navigates to applications
3. Creates new application
4. Fills in details
5. Saves draft
6. Submits application
7. Gets confirmation
8. Receives email

Success Criteria:
✓ Application status changed to SUBMITTED
✓ Confirmation page shown
✓ Email sent to applicant
✓ Task created for ASRU reviewer
```

## Journey Identification

### Primary Journeys (Happy Path)

**Journey 1: Establishment Submits Application**
```
Actor: Establishment User
Goal: Submit a new application
Status: SHOULD HAVE E2E TEST

Current Test:
  ✓ tests/applications/submit-application.spec.js

Coverage:
  ✓ Login
  ✓ Navigate to applications
  ✓ Create application
  ✓ Fill details
  ✓ Submit
  ✓ See confirmation
  ✓ Verify task created

Status: GOOD ✓
```

**Journey 2: ASRU Reviews Application**
```
Actor: ASRU Reviewer
Goal: Review submitted application and approve/reject
Status: SHOULD HAVE E2E TEST

Current Test:
  ✓ tests/applications/review-application.spec.js

Coverage:
  ✓ Login as ASRU
  ✓ Navigate to tasks
  ✓ View application details
  ✓ Make decision (approve)
  ✓ See confirmation

Status: GOOD ✓
```

**Journey 3: License Activation**
```
Actor: System (automatic)
Goal: Activate license after approval
Status: SHOULD HAVE E2E TEST

Current Test:
  ✗ MISSING - No E2E test

Action Required:
  1. Create test: tests/applications/license-activation.spec.js
  2. Verify license active
  3. Verify email sent
  4. Check task created

Status: NEEDS TEST ✗
```

### Alternative Journeys (Sad Path)

**Journey: Application Rejection**
```
Actor: ASRU Reviewer
Goal: Reject application with reason
Status: SHOULD HAVE E2E TEST

Current Test:
  ✓ tests/applications/reject-application.spec.js

Status: GOOD ✓
```

**Journey: Request More Information**
```
Actor: ASRU Reviewer / Establishment User
Goal: Request additional info from applicant
Status: SHOULD HAVE E2E TEST

Current Test:
  ✗ MISSING - No E2E test

Action Required:
  1. Create test: tests/applications/request-info.spec.js
  2. Verify applicant notified
  3. Verify deadline set
  4. Verify applicant can submit update

Status: NEEDS TEST ✗
```

**Journey: Application Withdrawal**
```
Actor: Establishment User
Goal: Withdraw submitted application
Status: SHOULD HAVE E2E TEST

Current Test:
  ✗ MISSING - No E2E test

Action Required:
  1. Create test: tests/applications/withdraw-application.spec.js
  2. Verify status changed
  3. Verify task cancelled
  4. Verify notification sent

Status: NEEDS TEST ✗
```

## Journey to Test Mapping

### Mapping Format

```yaml
Journey: [Name]
  Goal: [What user wants to accomplish]
  Actor: [Who performs journey]

  E2E Test: tests/path/file.spec.js

  Steps:
    - Step 1: [action]
      └─ Component: [UI component]
      └─ API Call: [endpoint if applicable]
      └─ Test Assertion: [what to verify]

    - Step 2: [action]
      └─ Component: [UI component]
      └─ API Call: [endpoint if applicable]
      └─ Test Assertion: [what to verify]

  Covered: ✓ Complete / ⚠ Partial / ✗ Missing

  Coverage %: XX%

  Missing Steps: [list uncovered steps]

  Last Updated: [date]
```

## Creating Journey E2E Tests

### Step 1: Document the Journey

See `.ai/e2e-map.md` for detailed journey documentation.

**Template**:
```markdown
## Journey: [Name]

**Description**: What user is trying to accomplish

**Actors**: User roles involved

**Entry Point**:
- URL: /path/to/start
- Component: ComponentName
- Condition: When/why started

**Steps**:
1. User does this
   ├─ Component: ComponentName
   ├─ API Call: GET /api/endpoint
   └─ Expected Result: ...

2. Next action
   └─ ...

**Exit Point**:
- URL: /path/to/end
- Expected State: What's different after journey

**Services Involved**:
- Frontend: asl
- API: asl-public-api
- Backend: asl-workflow
- Database: PostgreSQL

**Tests Covering**:
- E2E: tests/journey-name.spec.js
- Integration: packages/asl-public-api/test/...
- Unit: packages/asl-workflow/test/...
```

### Step 2: Create E2E Test Structure

```javascript
// tests/applications/new-journey.spec.js

describe('Journey: [Name]', () => {
  beforeEach(async () => {
    // Setup
    await browser.maximizeWindow();
    await browser.deleteAllCookies();
  });

  it('should complete [journey name]', async () => {
    // Step 1: Setup / Login
    await browser.url('/login');
    await login('user@example.com', 'password');

    // Verify logged in
    await expect(browser.getTitle()).resolves.toBe('Dashboard');

    // Step 2: Navigate
    await browser.url('/applications');
    const appCount = await $$('tr.application').length;
    expect(appCount).toBeGreaterThan(0);

    // Step 3: Action
    await $('button[data-action="new-app"]').click();
    await browser.switchToFrame($('iframe[name="form"]'));

    // Fill form
    await $('input[name="applicant-name"]').setValue('John Doe');
    await $('input[name="email"]').setValue('john@example.com');

    // Step 4: Submit
    await $('button[type="submit"]').click();

    // Verify result
    const message = await $('.success-message').getText();
    expect(message).toContain('submitted successfully');

    // Verify status changed
    const status = await $('span[data-field="status"]').getText();
    expect(status).toBe('Submitted');

    // Verify confirmation shown
    const confirmationUrl = await browser.getUrl();
    expect(confirmationUrl).toContain('/confirmation');
  });

  it('should handle validation errors', async () => {
    // Try to submit without required fields
    await browser.url('/applications/new');

    // Submit empty form
    await $('button[type="submit"]').click();

    // Verify error messages
    const errors = await $$('.error-message');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should prevent unauthorized access', async () => {
    // Try to access without login
    await browser.deleteAllCookies();
    await browser.url('/applications/new');

    // Should redirect to login
    const url = await browser.getUrl();
    expect(url).toContain('/login');
  });
});
```

### Step 3: Verify All Steps Covered

```javascript
describe('Step Coverage for [Journey]', () => {

  it('[Step 1] should allow user to log in', async () => {
    // Test step 1 explicitly
  });

  it('[Step 2] should show application list', async () => {
    // Test step 2 explicitly
  });

  it('[Step 3] should allow form submission', async () => {
    // Test step 3 explicitly
  });

  it('[Step 4] should show confirmation', async () => {
    // Test step 4 explicitly
  });

  it('[Step 5] should send notification', async () => {
    // Could be implicit in journey test
    // Or verify via API
  });
});
```

### Step 4: Add Assertions for Backend Changes

```javascript
it('should update database after journey', async () => {
  // Complete the journey
  await submitApplication();

  // Verify backend state changed
  // (Query database or call API)

  const app = await getApplication('app-123');
  expect(app.status).toBe('SUBMITTED');
  expect(app.submittedAt).toBeDefined();
  expect(app.reviewTaskId).toBeDefined();
});
```

## Journey E2E Test Inventory

### All Documented Journeys

```
✓ Establishment Submits Application
  └─ E2E Test: tests/applications/submit-application.spec.js
  └─ Coverage: 100% (7/7 steps)
  └─ Last Updated: 2026-10-08

✓ ASRU Reviews Application (Approve)
  └─ E2E Test: tests/applications/approve-application.spec.js
  └─ Coverage: 100% (6/6 steps)
  └─ Last Updated: 2026-10-08

✓ ASRU Reviews Application (Reject)
  └─ E2E Test: tests/applications/reject-application.spec.js
  └─ Coverage: 100% (6/6 steps)
  └─ Last Updated: 2026-10-08

✗ Request More Information
  └─ E2E Test: MISSING
  └─ Coverage: 0%
  └─ Action: CREATE TEST
  └─ Priority: HIGH

✗ License Activation (Auto)
  └─ E2E Test: MISSING
  └─ Coverage: 0%
  └─ Action: CREATE TEST
  └─ Priority: HIGH

✗ Application Withdrawal
  └─ E2E Test: MISSING
  └─ Coverage: 0%
  └─ Action: CREATE TEST
  └─ Priority: MEDIUM

✗ Deadline Processing
  └─ E2E Test: MISSING
  └─ Coverage: 0%
  └─ Action: CREATE TEST
  └─ Priority: MEDIUM

Overall: 3/8 journeys tested (37.5%)
Target: 8/8 (100%)
```

## Journey Coverage Analysis

### Coverage Report Template

```
JOURNEY E2E COVERAGE REPORT

Total Documented Journeys: 8

Test Coverage:
  ✓ Happy Path: 3/3 (100%)
  ✗ Alternative Paths: 0/3 (0%)
  ✗ Error Scenarios: 0/2 (0%)

Overall: 3/8 (37.5%)

PRIORITY MATRIX

🔴 Critical (Do Immediately):
  ├─ Request More Information (affects 30% of applications)
  ├─ License Activation (affects 100% of approvals)
  └─ [Impact: High]

🟡 Important (Next Sprint):
  ├─ Application Withdrawal (affects 5% of applications)
  ├─ Deadline Processing (scheduled job, hard to test)
  └─ [Impact: Medium]

⚪ Nice to Have (Backlog):
  └─ Edge cases and concurrent scenarios

EFFORT ESTIMATE

Test Creation Effort:
  ├─ Simple journey: 2-3 hours
  ├─ Complex journey: 4-6 hours
  └─ With setup/fixtures: +1-2 hours

Total Remaining Effort: ~20 hours

IMPLEMENTATION PLAN

Week 1:
  1. Create request-info-workflow test (4 hours)
  2. Create license-activation test (3 hours)

Week 2:
  1. Create application-withdrawal test (3 hours)
  2. Create deadline-processing test (4 hours)
  3. Add edge case tests (2-3 hours)

Result: Full journey coverage (100%)
```

## Journey Test Maintenance

### When Journey Workflow Changes

```
Journey behavior changed (e.g., new step added)
    ↓
Update `.ai/e2e-map.md` journey documentation
    ↓
Update E2E test to match new journey
    ↓
Add tests for new step
    ↓
Run tests (should pass)
    ↓
Update this skill with new journey info
```

### When E2E Test Breaks

```
E2E test fails
    ↓
Is it real bug or test issue?
    ├─ Real bug: Use `/skill bug-issue-analysis`
    └─ Test issue: Update test (selectors, timing, etc.)
    ↓
Verify journey still works
    ↓
Check if `.ai/e2e-map.md` needs update
```

### When New Features Added

```
New feature implemented
    ↓
Is there a new user journey?
    ├─ Yes: Document in `.ai/e2e-map.md`
    │       └─ Create E2E test
    └─ No: Verify existing journeys still work
    ↓
Run all E2E tests
    ↓
Update journey coverage report
```

## Journey Test Performance

### Performance Targets

| Test Type | Target | Typical |
|-----------|--------|---------|
| Single step | < 5 seconds | 2-3 sec |
| Full journey | < 30 seconds | 15-20 sec |
| Error scenario | < 10 seconds | 5-7 sec |
| Setup/teardown | < 5 seconds | 2-3 sec |

### Optimization

**If test too slow**:
1. Identify slow step (add timings)
2. Parallelize independent steps?
3. Simplify test data setup
4. Mock external services
5. Reduce waits/sleeps

## Traceability: Journey ↔ Code ↔ Tests

**Complete Traceability**:

```
User Journey
  ↓ (documented in)
.ai/e2e-map.md
  ↓ (exercised by)
E2E Test: journey.spec.js
  ↓ (which calls)
API Endpoint (documented in .ai/api-contracts.md)
  ↓ (which calls)
Handler Function (documented in .ai/functions.md)
  ├─ Unit tests (in .ai/test-map.md)
  ├─ Integration tests (in .ai/test-map.md)
  └─ E2E tests (this skill)
  ↓ (which queries)
Database (documented in .ai/services.md)
```

## References
- Journey documentation: `.ai/e2e-map.md`
- API contracts: `.ai/api-contracts.md`
- Function registry: `.ai/functions.md`
- Test locations: `.ai/test-map.md`
- Service details: `.ai/services.md`

