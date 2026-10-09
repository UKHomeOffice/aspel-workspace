---
name: bug-issue-analysis
description: 'Analyze bugs and issues systematically. Identify root cause, affected areas, impact scope, and fix strategy. Prevent regression with tests.'
---

# Bug & Issue Analysis Skill

## Purpose
Structured analysis of bugs and issues to find root cause and prevent recurrence.

## Bug Analysis Process

### Step 1: Understand the Bug

```
What?
  ├─ What is the observed behavior?
  ├─ What should be the expected behavior?
  └─ What is the gap?

When?
  ├─ Under what conditions does it happen?
  ├─ Always or intermittently?
  └─ Recently introduced or long-standing?

Where?
  ├─ Which service has the bug?
  ├─ Which function/module?
  └─ Which API endpoint or UI page?

Who?
  ├─ Which users affected?
  ├─ All users or specific subset?
  └─ Impact scope?

Scale?
  ├─ How many users affected?
  ├─ Data corruption risk?
  └─ Severity: Critical/High/Medium/Low?
```

### Step 2: Locate the Bug

**Use knowledge maps**:
```
1. Search `.ai/functions.md` - which function handles this?
2. Search `.ai/api-contracts.md` - which endpoint?
3. Search `.ai/workflows.md` - is it state machine issue?
4. Search `.ai/test-map.md` - what tests should catch this?
5. Locate source code
```

**Verification**:
- [ ] Can reproduce locally?
- [ ] Can trace through debugger?
- [ ] Have unit test that fails?

### Step 3: Find Root Cause

**Root Cause Analysis**:

```
Symptom → Investigation → Root Cause

Example:
Symptom: Application status not updating
  ↓
Investigate:
  ├─ Database query returning correct data? ✓
  ├─ Status variable set correctly? ✓
  ├─ Page showing old cached data? ← YES
  ↓
Root Cause: Page cache not invalidated after status update
```

**Common Root Causes**:
- [ ] Logic error (wrong condition)
- [ ] Null pointer / undefined variable
- [ ] Cache not invalidated
- [ ] Race condition / async issue
- [ ] Database transaction not committed
- [ ] Wrong variable scope
- [ ] Off-by-one error
- [ ] Type mismatch
- [ ] State machine violation
- [ ] Missing permission check
- [ ] Dependency not updated
- [ ] Test data corrupted
- [ ] Configuration wrong
- [ ] External service down
- [ ] Memory leak

### Step 4: Determine Impact

**Scope Analysis**:
```
Does this bug affect:
  ├─ Single user? → User-specific data issue
  ├─ All users? → Infrastructure/logic issue
  ├─ Specific workflow? → Workflow-specific logic
  ├─ Multiple services? → Cross-service issue
  └─ Data integrity? → Database issue
```

**Affected Code** (check `.ai/functions.md`):
```
Root cause function → Who calls it → Who calls them → ...
  ↓
Full impact chain identified
```

**Regression Risk**:
- [ ] Has this worked before? (regression)
- [ ] Is this new feature? (bug in new code)
- [ ] Did dependency change? (external factor)
- [ ] Did database schema change? (migration issue)

### Step 5: Design Fix

**Fix Criteria**:
- [ ] Fixes root cause (not symptom)
- [ ] Doesn't break other functionality
- [ ] Doesn't introduce new edge cases
- [ ] Doesn't degrade performance
- [ ] Includes test to prevent recurrence

**Fix Strategies**:
```
Null Pointer
  → Add null check or ensure non-null creation

Logic Error
  → Fix condition logic with test case

Cache Issue
  → Add cache invalidation on data change

Race Condition
  → Add locking or ensure atomicity

State Machine
  → Add transition validation

Permission
  → Add permission check before operation

Type Mismatch
  → Fix type or add conversion

Off-by-One
  → Adjust loop/array indices
```

### Step 6: Write Regression Test

**Test Template**:
```javascript
describe('Bug: [bug title]', () => {
  it('should NOT [reproduce bug]', () => {
    // Setup that reproduces bug conditions
    const app = await setupBugScenario();

    // Action that should work
    const result = await buggyFunction(app);

    // Verify it's fixed
    expect(result).toEqual(expectedValue);
    expect(app.status).toBe('correct_status');
  });
});
```

### Step 7: Fix & Verify

**Implementation**:
1. Write failing test
2. Implement fix
3. Test passes ✓
4. Run full test suite (no regression)
5. Run E2E tests (see `.ai/e2e-map.md`)
6. Manual testing in affected scenario

## Bug Severity Classification

| Severity | Criteria | Response | Example |
|----------|----------|----------|---------|
| 🔴 Critical | Data loss, security, all users down | Immediate | Permissions not checked, data deleted |
| 🟠 High | Core feature broken, many users affected | Today | Application submission broken |
| 🟡 Medium | Feature partially broken, specific users | This sprint | Some users can't access data |
| 🟢 Low | Cosmetic, rare conditions, edge cases | Next sprint | Wrong color, typo |

## Bug Analysis Report Template

```
BUG ANALYSIS REPORT

BUG: [Title/Issue Number]

SEVERITY: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low

OBSERVED BEHAVIOR:
[What users see / what happens]

EXPECTED BEHAVIOR:
[What should happen]

ROOT CAUSE:
[Why it happens - include code reference]

AFFECTED AREAS:
├─ Service: [service name]
├─ Function: [function name] (see .ai/functions.md)
├─ API: [endpoint if applicable]
├─ Users: [who affected]
└─ Scope: [impact estimate]

AFFECTED CODE PATH:
[Function A calls B calls C → Problem in C]

REGRESSION RISK:
- ✓ This is a new bug (not regression)
- ✓ Tests don't catch it (test gap identified)

FIX STRATEGY:
1. [Step 1 of fix]
2. [Step 2 of fix]
3. [Test to verify]

TEST CASE:
└─ File: [test file location from .ai/test-map.md]
└─ Reproduces: [bug scenario]
└─ Verifies: [fix works]

DEPLOYMENT:
├─ Requires migration? [yes/no]
├─ Requires config change? [yes/no]
├─ Breaking change? [yes/no]
└─ Rollback plan: [how to undo]

PREVENTION:
└─ Add test? [yes → which test]
└─ Update docs? [yes → which docs]
└─ Code review focus? [what to check in similar code]
```

## Common Bug Patterns

### Pattern: Cache Invalidation
**Problem**: Data changes but old data shown
**Symptoms**: Changes don't appear, wrong status shown, stale data
**Fix**: Invalidate cache when data changes
**Test**: Update data, verify page shows new value

### Pattern: Null Pointer
**Problem**: Code assumes non-null, but null received
**Symptoms**: Crash, TypeError, undefined error
**Fix**: Check for null before using
**Test**: Pass null value, verify handled gracefully

### Pattern: Race Condition
**Problem**: Async operations in wrong order
**Symptoms**: Intermittent failures, timing-dependent
**Fix**: Add proper await, locks, or ordering
**Test**: Run many times, verify consistent

### Pattern: State Machine Violation
**Problem**: Invalid state transition allowed
**Symptoms**: Object in impossible state
**Fix**: Validate transitions before applying
**Test**: Try invalid transition, verify rejected

### Pattern: Permission Check Missing
**Problem**: Authorization check forgotten
**Symptoms**: User can do what they shouldn't
**Fix**: Add permission check before operation
**Test**: Try as unauthorized user, verify denied

### Pattern: Database Transaction
**Problem**: Partial data update, not atomic
**Symptoms**: Inconsistent state, partial failures
**Fix**: Wrap in transaction
**Test**: Trigger failure mid-operation, verify rollback

### Pattern: Off-by-One
**Problem**: Loop/array index wrong
**Symptoms**: Wrong item processed, missing item
**Fix**: Adjust index logic
**Test**: Edge cases (first, last, empty)

### Pattern: Type Confusion
**Problem**: Wrong type treated as other
**Symptoms**: Calculations wrong, comparisons fail
**Fix**: Add type checking or conversion
**Test**: Different types, verify handling

## Debugging Techniques

### 1. Console Logging
```javascript
console.log('Before operation:', value);
result = operation(value);
console.log('After operation:', result);
```

### 2. Debugger Breakpoints
```javascript
debugger; // Set breakpoint
const result = buggyFunction();
```

### 3. Test Isolation
Write minimal test that reproduces bug:
```javascript
it('should handle null', () => {
  const result = function(null);
  expect(result).toBeDefined();
});
```

### 4. Trace Call Stack
See `.ai/functions.md` to understand:
- Who calls buggy function?
- What does it call?
- In what order?

### 5. Database Inspection
Check actual database state:
```sql
SELECT * FROM applications WHERE id = 'app-123';
```

### 6. Network Inspection
Check API calls:
- What request sent?
- What response received?
- HTTP status?

### 7. Performance Profiling
If slow:
- Which function takes time?
- Which database queries slow?
- Cache hits/misses?

## Prevention Strategies

**Before Production**:
- [ ] Unit test added (see `.ai/test-map.md`)
- [ ] Integration test added
- [ ] E2E test updated (see `.ai/e2e-map.md`)
- [ ] Code review passed (see `/skill code-review`)
- [ ] No similar pattern elsewhere? (see `/skill code-smell-detection`)

**After Production**:
- [ ] Monitoring alert for similar issue?
- [ ] Log issue for investigation?
- [ ] Update documentation?
- [ ] Train team on pattern?

## Ticket Template

When reporting bug:
```
Title: [Clear bug description]

Severity: [Critical/High/Medium/Low]

Reproduction Steps:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected: [What should happen]

Actual: [What actually happens]

Environment:
- Browser: [if UI bug]
- Service: [which service]
- Data: [test user/data]

Additional Info:
- Error message? [paste]
- Screenshots? [attach]
- Network trace? [attach]
```

## References
- Function reference: `.ai/functions.md`
- Test locations: `.ai/test-map.md`
- State machines: `.ai/workflows.md`
- API contracts: `.ai/api-contracts.md`
- Code patterns: `/skill anti-pattern-detection`

