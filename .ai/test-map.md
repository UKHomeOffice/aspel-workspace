# ASPeL Test Coverage Map

This document maps testing strategy across the ASPeL monorepo. Use it to understand what's tested where and what gaps exist.

## Testing Philosophy

ASPeL uses a **pyramid testing strategy**:

```
        ▲
        │     E2E Tests
        │     (Few, slow, realistic)
        │   ┌──────────────┐
        │   │ Full Journeys│
        │   └──────────────┘
        │
        │   Integration Tests
        │   (More, medium-speed)
        │   ┌────────────────────┐
        │   │ Service + Database │
        │   └────────────────────┘
        │
        │ Unit Tests
        │ (Many, fast)
        │ ┌──────────────────────────┐
        │ │ Functions, logic, utils  │
        │ └──────────────────────────┘
        │
        └────────────────────────────→
                Coverage
```

## Test Structure by Service

### Frontend Services (asl, asl-internal-ui)

#### Test Files Location
```
packages/asl/test/
├── unit/
│   ├── components/ (React component tests)
│   ├── pages/ (Page component tests)
│   ├── reducers/ (Redux reducer tests)
│   └── utils/ (Utility function tests)
├── integration/
│   └── workflows/ (Multi-step user flow tests)
└── [E2E tests in asl-deployments/tests/]
```

#### Unit Testing (Jest + React Testing Library)
- **React Components**: Tested with React Testing Library
- **Redux Stores**: Tested with mock actions
- **Utilities**: Jest for logic testing
- **Configuration**: Jest config in `jest.config.js`

#### Component Testing Example
```javascript
// packages/asl/test/unit/components/ApplicationForm.test.js

describe('ApplicationForm', () => {
  it('should render form fields', () => {
    const { getByLabelText } = render(<ApplicationForm />);
    expect(getByLabelText('Application Reference')).toBeInTheDocument();
  });

  it('should submit form with valid data', () => {
    const onSubmit = jest.fn();
    const { getByRole } = render(<ApplicationForm onSubmit={onSubmit} />);

    userEvent.click(getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

#### Redux Testing Example
```javascript
// packages/asl/test/unit/reducers/applicationReducer.test.js

describe('applicationReducer', () => {
  it('should handle SET_APPLICATIONS', () => {
    const action = {
      type: 'SET_APPLICATIONS',
      payload: [{ id: 1, status: 'draft' }]
    };
    const state = applicationReducer(undefined, action);
    expect(state.applications[0].status).toBe('draft');
  });
});
```

#### Integration Testing
- Tests UI + API mocks
- Or UI + test database (if needed)
- Redux connected components working together

---

### API Services (asl-public-api, asl-internal-api)

#### Test Files Location
```
packages/asl-public-api/test/
├── unit/
│   ├── controllers/ (Endpoint logic)
│   ├── middleware/ (Custom middleware)
│   └── utils/ (Helper functions)
└── integration/
    ├── routes/ (Full endpoint testing)
    ├── auth/ (Permission checking)
    └── workflows/ (Multi-endpoint flows)
```

#### Unit Testing
- Express route handlers tested with Jest
- Mocked database (asl-schema)
- Mocked asl-permissions
- Focus on business logic

#### Example API Unit Test
```javascript
// packages/asl-public-api/test/unit/controllers/ApplicationController.test.js

describe('ApplicationController', () => {
  describe('getApplication', () => {
    it('should return application data', async () => {
      const mockApp = { id: 1, status: 'draft' };
      Application.query.mockResolvedValue(mockApp);

      const result = await getApplication({ params: { id: 1 } });
      expect(result).toEqual(mockApp);
    });

    it('should check permissions before returning', async () => {
      const user = { id: 'user1', role: 'establishment_user' };
      const canView = jest.fn().mockResolvedValue(false);
      permissions.can = canView;

      expect(() => getApplication({ user, params: { id: 1 } }))
        .toThrow('Not authorized');
    });
  });
});
```

#### Integration Testing with Supertest
```javascript
// packages/asl-public-api/test/integration/routes/applications.test.js

describe('GET /api/applications/:id', () => {
  beforeEach(async () => {
    // Setup test database
    await db.seed();
  });

  it('should return application with status 200', async () => {
    const response = await request(app)
      .get('/api/applications/1')
      .set('Authorization', 'Bearer test-token')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('status');
  });

  it('should return 403 if user lacks permission', async () => {
    // Mock permission denial
    await request(app)
      .get('/api/applications/1')
      .set('Authorization', 'Bearer invalid-token')
      .expect(403);
  });
});
```

---

### Backend Services (asl-workflow, asl-notifications, asl-permissions)

#### Test Files Location
```
packages/asl-workflow/test/
├── unit/
│   ├── workflows/ (State machine logic)
│   ├── jobs/ (Job handlers)
│   └── utils/ (Business logic)
└── integration/
    ├── workflows/ (Full workflow with DB)
    └── jobs/ (Job queue integration)
```

#### Workflow Testing
```javascript
// packages/asl-workflow/test/unit/workflows/ApplicationWorkflow.test.js

describe('ApplicationWorkflow', () => {
  describe('submitApplication', () => {
    it('should transition from DRAFT to SUBMITTED', () => {
      const app = { status: 'draft' };
      const result = submitApplication(app);
      expect(result.status).toBe('submitted');
    });

    it('should create task on submit', () => {
      const createTaskSpy = jest.spyOn(taskflow, 'createTask');
      submitApplication({ id: 1 });
      expect(createTaskSpy).toHaveBeenCalled();
    });

    it('should trigger notification on submit', () => {
      const notifySpy = jest.spyOn(notifications, 'queue');
      submitApplication({ id: 1 });
      expect(notifySpy).toHaveBeenCalledWith('application.submitted', expect.any(Object));
    });
  });
});
```

#### Job Handler Testing
```javascript
// packages/asl-notifications/test/unit/jobs/ApplicationSubmittedHandler.test.js

describe('ApplicationSubmitted Job Handler', () => {
  it('should send notification email', async () => {
    const mockApp = { id: 1, applicant: { email: 'test@example.com' } };
    const sendEmailSpy = jest.spyOn(emailService, 'send');

    await handleApplicationSubmitted({ applicationId: 1 }, mockApp);

    expect(sendEmailSpy).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'test@example.com' })
    );
  });

  it('should include correct template variables', async () => {
    const sendEmailSpy = jest.spyOn(emailService, 'send');

    await handleApplicationSubmitted({ applicationId: 1 }, mockApp);

    const callArgs = sendEmailSpy.mock.calls[0][0];
    expect(callArgs.template).toBe('application-submitted');
    expect(callArgs.data).toHaveProperty('applicationReference');
  });
});
```

---

### Test Database Setup

#### Using asl-schema for Tests

```javascript
// test/setup.js

const { migrate, rollback } = require('@asl/schema');

beforeAll(async () => {
  // Run migrations on test database
  await migrate('test');
});

afterEach(async () => {
  // Rollback to clean state after each test
  await rollback('test');
});

afterAll(async () => {
  // Cleanup
  await closeDatabase();
});
```

#### Seeding Test Data

```javascript
// test/factories.js

async function createTestApplication(overrides = {}) {
  const defaults = {
    reference: 'APP-001',
    status: 'draft',
    applicant: { email: 'test@example.com' },
    ...overrides
  };

  return Application.query().insert(defaults);
}

async function createTestUser(overrides = {}) {
  const defaults = {
    email: 'user@example.com',
    role: 'establishment_user',
    ...overrides
  };

  return User.query().insert(defaults);
}

module.exports = { createTestApplication, createTestUser };
```

---

## E2E Testing Structure

#### E2E Test Files Location
```
asl-deployments/tests/
├── applications/
│   ├── submit-application.spec.js
│   ├── review-application.spec.js
│   └── reject-application.spec.js
├── licenses/
│   ├── view-license.spec.js
│   └── update-license.spec.js
├── workflows/
│   └── complete-workflow.spec.js
└── shared/
    ├── test-data.js
    ├── page-objects/
    └── helpers/
```

#### E2E Test Technology
- **Framework**: WebdriverIO
- **Language**: JavaScript
- **Configuration**: `wdio.conf.js`
- **Test Users**: See `TEST_USERS.md`

#### E2E Test Example
```javascript
// asl-deployments/tests/applications/submit-application.spec.js

describe('Submit Application Journey', () => {
  beforeEach(async () => {
    await browser.maximizeWindow();
    await login('establishment_user_1@example.com');
  });

  it('should allow establishment to submit application', async () => {
    // Navigate to applications list
    await browser.url('/applications');
    const appRow = await $('tr[data-app-id="1"]');

    // Click on draft application
    await appRow.click();

    // Fill in required fields
    await browser.execute(() => {
      document.getElementById('applicant-name').value = 'John Doe';
    });

    // Submit the form
    const submitBtn = await $('button[type="submit"]');
    await submitBtn.click();

    // Verify success message
    const successMsg = await $('div.success-message');
    expect(await successMsg.isDisplayed()).toBe(true);
    expect(await successMsg.getText()).toContain('Application submitted');

    // Verify application status changed
    await browser.url('/applications');
    const status = await $('tr[data-app-id="1"] td.status');
    expect(await status.getText()).toBe('Submitted');
  });

  it('should show validation errors for incomplete form', async () => {
    await browser.url('/applications/1');

    const submitBtn = await $('button[type="submit"]');
    await submitBtn.click();

    // Expect error messages
    const errorMsg = await $('div.error-message');
    expect(await errorMsg.isDisplayed()).toBe(true);
  });
});
```

#### E2E Test Page Objects (Recommended Pattern)

```javascript
// asl-deployments/tests/shared/page-objects/ApplicationForm.page.js

class ApplicationFormPage {
  get applicantNameInput() {
    return $('input#applicant-name');
  }

  get submitButton() {
    return $('button[type="submit"]');
  }

  get successMessage() {
    return $('div.success-message');
  }

  async fillApplicantName(name) {
    await this.applicantNameInput.setValue(name);
  }

  async submit() {
    await this.submitButton.click();
  }

  async getSuccessMessage() {
    return this.successMessage.getText();
  }
}

module.exports = new ApplicationFormPage();
```

---

## Test Coverage by Feature

### Application Submission Feature
```
✓ Unit Tests
  - validateApplication() logic
  - getApplicationStatus() logic
  - Status transition validation

✓ Integration Tests
  - API: POST /api/applications/:id/submit
  - Database: Application record updated
  - asl-workflow: Job queued
  - asl-permissions: Authorization checked

✓ E2E Tests
  - submit-application.spec.js
  - Full user workflow from UI to confirmation

✗ Gap: Visual regression tests for form UI
✗ Gap: Performance tests for large batches
```

### License Review Feature
```
✓ Unit Tests
  - License review logic
  - Decision validation

✓ Integration Tests
  - API: POST /api/licenses/:id/review
  - asl-workflow: License updated
  - asl-notifications: Review email sent

✓ E2E Tests
  - review-license.spec.js (ASRU staff)

✗ Gap: Testing concurrent reviews
✗ Gap: Deadline processing tests
```

### Permission Checking
```
✓ Unit Tests
  - Permission evaluation logic
  - Role checking

✓ Integration Tests
  - API endpoints with various roles
  - Cache invalidation
  - Permission cascading

✗ Gap: Integration with Keycloak auth
✗ Gap: Performance tests under load
```

---

## Test Gaps & Recommendations

### Known Gaps

| Gap | Impact | Recommendation |
|-----|--------|-----------------|
| No visual regression tests | UI changes go unnoticed | Add Percy/BackstopJS |
| Limited concurrent scenario tests | Race conditions | Add concurrency tests |
| No API contract tests | Breaking changes | Use OpenAPI + dredd |
| Limited permissions integration tests | Authorization bugs | Add more role-based E2E |
| No load/performance tests | Scalability unknown | Add k6 or similar |
| Notification timing untested | Message delays | Add job queue timing tests |
| No disaster recovery tests | Failover scenarios unknown | Add failover E2E tests |
| Limited accessibility tests | Accessibility compliance | Add axe-core tests |

### Testing Best Practices

1. **Test Data**
   - Use factories, not fixtures
   - Keep test data realistic
   - Clean up after each test

2. **Test Isolation**
   - Rollback database after each test
   - Mock external services
   - Don't depend on test order

3. **Test Naming**
   - Describe behavior, not implementation
   - Use "should" pattern: "should return 404 when not found"
   - Clear test purpose from name alone

4. **Assertions**
   - One logical assertion per test
   - Use meaningful assertion messages
   - Avoid asserting implementation details

5. **Performance**
   - Unit tests: < 10ms
   - Integration tests: < 100ms
   - E2E tests: < 5s per test

---

## Running Tests

### All Tests
```bash
npm run test
```

### By Service
```bash
npm run test -w asl
npm run test -w asl-internal-api
```

### By Type
```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode (Development)
```bash
npm run test:watch
```

---

## Continuous Integration

Tests run automatically on:
- **Pull Request**: All unit + integration tests
- **Before Merge**: All tests including E2E
- **Before Deploy**: Full test suite + security checks

See `.drone.yml` or CI configuration for details.

---

## Coverage Targets

Current targets:
- **Unit tests**: 80% line coverage
- **Critical functions**: 95%+ coverage
- **Frontend components**: 70%+
- **API endpoints**: 85%+

---

## Test Documentation

For detailed setup and running instructions, see:
- `packages/asl/test/README.md`
- `packages/asl-internal-api/test/README.md`
- `asl-deployments/tests/README.md`
- `asl-deployments/tests/config.js` (E2E configuration)

