---
name: test-coverage-analysis
description: 'Analyze test coverage gaps. Identify untested code paths, missing edge cases, missing E2E scenarios, and create test strategy to increase coverage.'
---

# Test Coverage Analysis Skill

## Purpose
Systematic identification of test coverage gaps and creation of testing strategy.

## Coverage Types

### 1. Line Coverage
**Metric**: % of lines executed by tests
**Target**: 80%+
**Limitation**: Doesn't ensure all paths tested

**Check**:
```bash
npm run test:coverage -w service-name
```

### 2. Branch Coverage
**Metric**: % of if/else branches covered
**Target**: 85%+
**Limitation**: Doesn't ensure all condition combinations tested

**Check**: Coverage report shows branch coverage

### 3. Path Coverage
**Metric**: All combinations of conditions tested
**Target**: Hard to measure, but important
**Focus on**: Complex conditional logic

**Check**: Do tests cover:
- if (A && B)? Test: (T,T), (T,F), (F,T), (F,F)
- if (A || B)? Test: (T,T), (T,F), (F,T), (F,F)

### 4. Functional Coverage
**Metric**: Are feature requirements tested?
**Target**: 100% for critical features
**Check**: See `.ai/e2e-map.md` - does E2E cover journey?

## Coverage Analysis Process

### Step 1: Identify Code Gaps

**Line Coverage Gaps**:
```bash
# Run with coverage
npm run test:coverage -w service-name

# Review uncovered lines
# Example output:
# ✗ packages/asl-workflow/lib/workflow.js - 45 lines uncovered
#   Line 123: if (edge case condition)
#   Line 124: special handling
```

**Identify**:
- [ ] Which lines not covered?
- [ ] Why not covered?
- [ ] Edge case or error path?

### Step 2: Analyze Uncovered Code

**Questions to Ask**:
```
Is this line:
  ├─ Dead code? (never executed)
  │  └─ Fix: Delete it
  ├─ Error path? (only on failure)
  │  └─ Fix: Add test for error case
  ├─ Edge case? (rare condition)
  │  └─ Fix: Add edge case test
  ├─ Hard to test? (requires setup)
  │  └─ Fix: Refactor for testability
  └─ Optional feature? (feature flag)
     └─ Fix: Add feature flag test
```

**Root Cause**:
```
Why isn't this tested?
  ├─ Difficult to trigger condition?
  ├─ Test setup too complex?
  ├─ External service required?
  ├─ Test doesn't exist yet?
  ├─ Assumption it's not needed?
  └─ Oversight / forgot
```

### Step 3: Identify Missing Test Cases

**Input Boundary Testing**:
```
Function: processAmount(amount: number)

Test cases:
  ✓ Normal case: processAmount(100)
  ✓ Boundary: processAmount(0)
  ✓ Boundary: processAmount(999999)
  ✗ MISSING: Negative: processAmount(-100)
  ✗ MISSING: Max int: processAmount(Number.MAX_SAFE_INTEGER)
  ✗ MISSING: Null: processAmount(null)
  ✗ MISSING: Undefined: processAmount(undefined)
  ✗ MISSING: String: processAmount("100")
```

**Error Path Testing**:
```
Function: submitApplication(app)

Happy paths tested:
  ✓ Valid application
  ✗ MISSING ERROR CASES:
    - Application null?
    - Application invalid state?
    - User lacks permission?
    - Database error?
    - Validation fails?
```

**State Combinations**:
```
State machine transitions tested:
  ✓ DRAFT → SUBMITTED
  ✓ SUBMITTED → APPROVED
  ✓ SUBMITTED → REJECTED
  ✗ MISSING:
    - Invalid transition: APPROVED → DRAFT
    - Concurrent submissions?
    - State change during processing?
```

### Step 4: Check E2E Coverage

**Journey Coverage** (see `.ai/e2e-map.md`):
```
Journey: Establishment submits application
  ├─ Step 1: View applications ✓ (E2E test)
  ├─ Step 2: Fill form ✓ (E2E test)
  ├─ Step 3: Submit ✓ (E2E test)
  ├─ Step 4: Confirmation ✓ (E2E test)
  └─ Step 5: Follow-up email ✗ MISSING E2E verification
```

**Missing Journeys**:
```
Happy path journeys:
  ✓ Submit application
  ✓ Approve application
  ✓ Reject application
  ✗ MISSING: Request more info workflow
  ✗ MISSING: Concurrent applications
  ✗ MISSING: Deadline handling
```

**Error Journeys**:
```
Sad path scenarios:
  ✓ Validation error
  ✗ MISSING: Permission denied
  ✗ MISSING: Application already submitted
  ✗ MISSING: System error handling
```

## Coverage Report Template

```
TEST COVERAGE ANALYSIS

Service: [service name]
Current Coverage: XX%

LINE COVERAGE
├─ Total Lines: 1000
├─ Covered: 850 (85%)
├─ Uncovered: 150 (15%)
└─ Target: 80% ✓ MEETS TARGET

UNCOVERED LINES BY CATEGORY
├─ Dead Code: 30 lines (remove)
├─ Error Paths: 50 lines (add tests)
├─ Edge Cases: 40 lines (add tests)
├─ Hard to Test: 20 lines (refactor)
└─ Optional: 10 lines (feature flag tests)

CRITICAL GAPS
├─ 🔴 High Priority:
│  ├─ Error handling in submitApplication() [50 lines]
│  ├─ Null checks in reviewApplication() [20 lines]
│  └─ Edge case: concurrent submissions [15 lines]
│
├─ 🟡 Medium Priority:
│  ├─ Boundary values [30 lines]
│  └─ Feature flags [15 lines]
│
└─ 🟢 Low Priority:
   └─ Logging edge cases [5 lines]

E2E COVERAGE
├─ Happy Path Journeys: 3/4 (75%)
│  ├─ ✓ Submit application
│  ├─ ✓ Approve application
│  ├─ ✓ Reject application
│  └─ ✗ MISSING: Request info workflow
│
├─ Error Journeys: 1/4 (25%)
│  ├─ ✓ Validation error
│  ├─ ✗ MISSING: Permission denied
│  ├─ ✗ MISSING: Already submitted
│  └─ ✗ MISSING: System error
│
└─ Edge Cases: 0/5 (0%)
   ├─ ✗ MISSING: Concurrent applications
   ├─ ✗ MISSING: Deadline processing
   └─ ✗ MISSING: Timeout handling

TEST DISTRIBUTION
├─ Unit Tests: 150 (70% of tests)
├─ Integration Tests: 45 (20% of tests)
├─ E2E Tests: 15 (10% of tests)
└─ Recommendation: Add more E2E tests

TEST QUALITY ISSUES
├─ 🔴 Flaky Tests: 3 tests (fix immediately)
│  ├─ deadline-processing.test.js (timing issue)
│  ├─ notification-handler.test.js (async issue)
│  └─ task-creation.test.js (race condition)
│
├─ 🟡 Slow Tests: 5 tests (optimize)
│  └─ Average time: 500ms (target: 100ms)
│
└─ 🟢 Test Duplication: 8 tests (consolidate)
   └─ Similar test cases repeated

ACTION PLAN

Priority 1 (This Sprint):
1. Fix flaky tests [3 tests] - causes false failures
2. Add error path tests [50 lines] - high impact
3. Add concurrent scenario tests [15 lines] - real risk

Priority 2 (Next Sprint):
1. Add edge case tests [40 lines]
2. Add missing E2E journeys [4 journeys]
3. Remove dead code [30 lines]

Priority 3 (Backlog):
1. Optimize slow tests [5 tests]
2. Consolidate duplicate tests [8 tests]
3. Add feature flag tests [15 lines]

TESTING STRATEGY

Test Distribution Target:
├─ Unit: 70% (fast, focused)
├─ Integration: 20% (slower, realistic)
└─ E2E: 10% (slow, business validation)

Coverage Target:
├─ Overall: 85%+
├─ Critical paths: 95%+
├─ Error handling: 90%+
└─ E2E: 80% of journeys

Quality Metrics:
├─ Flaky tests: 0 (zero tolerance)
├─ Avg test time: < 100ms (unit)
├─ Test duplication: < 5%
└─ False positives: < 2%
```

## Testing Strategy by Code Type

### Critical Path Code
**Target**: 95%+ coverage
**Focus**:
- All main flows
- All error cases
- All state transitions

**Example**: submitApplication() should have:
- ✓ Happy path
- ✓ Validation error
- ✓ Permission denied
- ✓ Database error
- ✓ State validation

### Edge Case Code
**Target**: 80%+ coverage
**Focus**:
- Boundary values
- Null/undefined
- Empty collections
- Concurrent access

**Example**: For numeric field:
- ✓ Normal value
- ✓ Zero
- ✓ Negative
- ✓ Very large
- ✓ Decimal
- ✓ Non-numeric

### Error Handling Code
**Target**: 90%+ coverage
**Focus**:
- Expected errors
- Unexpected errors
- Recovery paths
- Cleanup code

### Integration Code
**Target**: 85%+ coverage
**Focus**:
- Service calls
- Data flow
- Transaction handling
- Rollback scenarios

## Test Gap Resolution

### Scenario: Uncovered Error Path

```
Problem: 150 lines uncovered in error handling

1. Analyze
   └─ Why not tested? → Hard to trigger error

2. Design Test
   └─ Mock error condition
   └─ Test error handling
   └─ Test recovery

3. Implement Test
   ```javascript
   it('should handle database error', async () => {
     // Mock error
     Database.query.mockRejectedValue(new Error('Connection failed'));

     // Call function
     const result = await submitApplication(app);

     // Verify error handling
     expect(result.success).toBe(false);
     expect(result.error).toBeDefined();
   });
   ```

4. Verify
   └─ Test passes
   └─ Coverage increases
   └─ No new issues
```

### Scenario: Missing E2E Journey

```
Problem: Request info workflow not tested end-to-end

1. Check `.ai/e2e-map.md`
   └─ See if journey documented

2. Create E2E Test
   ```javascript
   describe('Request info workflow', () => {
     it('should allow ASRU to request more info', async () => {
       // Login as ASRU
       // Navigate to task
       // Submit request
       // Verify status changed
       // Verify email sent
     });
   });
   ```

3. Run Test
   └─ Verify works end-to-end

4. Update Knowledge Map
   └─ Add to `.ai/e2e-map.md`
```

## Flaky Test Detection

**Symptoms**:
- Same test passes sometimes, fails other times
- Failures intermittent
- Parallel test runs cause failures

**Common Causes**:
- Timing assumptions
- Shared test data
- Async/await issues
- Random data generation
- External service flakiness

**Fix**:
```javascript
// ❌ Flaky - timing assumption
it('should update UI', async () => {
  action();
  setTimeout(() => {
    expect(ui.updated).toBe(true);
  }, 100);
});

// ✅ Fixed - proper await
it('should update UI', async () => {
  await action();
  expect(ui.updated).toBe(true);
});
```

## Coverage Report Commands

```bash
# Generate coverage report
npm run test:coverage -w service-name

# View HTML coverage report
open coverage/index.html

# Coverage for specific file
npm run test:coverage -- src/file.js

# Coverage threshold check
npm run test:coverage -- --collectCoverageFrom="src/**/*.js"
```

## References
- Test locations: `.ai/test-map.md`
- E2E journeys: `.ai/e2e-map.md`
- Function registry: `.ai/functions.md`
- Workflows: `.ai/workflows.md`

