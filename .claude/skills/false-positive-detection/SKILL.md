---
name: false-positive-detection
description: 'Identify false positives in code analysis, test results, and static analysis. Distinguish real issues from false alarms to reduce noise.'
---

# False Positive Detection Skill

## Purpose
Eliminate noise from analysis by identifying false positives and distinguishing them from real issues.

## What is a False Positive?

A **false positive** is when analysis or a test reports an issue that doesn't actually exist.

```
Example:
Code: if (user && user.permissions.includes('admin'))
Analyzer says: "Null pointer risk, user.permissions might be undefined"
Reality: If user is truthy, permissions is guaranteed to exist
Verdict: FALSE POSITIVE (real issue check would flag actual risks)
```

## Common False Positive Categories

### 1. Static Analysis False Positives

#### Unused Variable Warning

**False Alarm**:
```javascript
// ❌ Flagged as unused
const app = getApplication(id);
// But used in test/assertion
expect(app.status).toBe('draft');
```

**Real Issue**:
```javascript
// ✓ Actually unused
const app = getApplication(id);
const status = 'draft'; // Not using app
```

**Check**:
- [ ] Is variable used in assertions?
- [ ] Is variable used in next line?
- [ ] Is it used in callback/promise?

#### Unreachable Code Warning

**False Alarm**:
```javascript
// ❌ Flagged as unreachable
if (condition) {
  return result;
}
// But this IS reachable (when condition false)
console.log('continued');
```

**Real Issue**:
```javascript
// ✓ Actually unreachable
return result;
console.log('never runs'); // Dead code
```

**Check**:
- [ ] Can condition be false?
- [ ] Is there a path that doesn't return?
- [ ] Could error be caught elsewhere?

#### Type Mismatch Warning

**False Alarm**:
```javascript
// ❌ Flagged as type mismatch
const amount: number = getValue(); // getValue might return number | string
if (typeof amount === 'string') {
  return; // Never happens with good data
}
// But application ensures type
```

**Real Issue**:
```javascript
// ✓ Actually could be wrong type
const amount = getValue(); // Returns number | string
const doubled = amount * 2; // Could fail if string
```

**Check**:
- [ ] Is input validated/converted?
- [ ] Is there type guard?
- [ ] Can this actually happen?

#### Null Pointer Warning

**False Alarm**:
```javascript
// ❌ Flagged as null pointer
const app = getApplication(id); // Could return null
if (!app) return;
console.log(app.status); // Safe - checked above
```

**Real Issue**:
```javascript
// ✓ Actually unsafe
const app = getApplication(id); // Could return null
console.log(app.status); // No check!
```

**Check**:
- [ ] Is null checked before use?
- [ ] Does constructor guarantee non-null?
- [ ] Does API spec say it's always present?

### 2. Linter False Positives

#### ESLint: Missing Return Type

**False Alarm**:
```javascript
// ESLint says: "no return type"
// But TypeScript infers it correctly
const greet = (name: string) => name.toUpperCase();
// Inferred: (name: string) => string
```

**Real Issue**:
```javascript
// ✓ Actually missing
const process = (data) => {
  // Return type unclear
  if (condition) return { status: 'ok' };
  else return 'error'; // Different types!
};
```

**Check**:
- [ ] Can return type be inferred safely?
- [ ] Is it explicit in context?
- [ ] Could caller be confused?

#### Complexity Warning

**False Alarm**:
```javascript
// Flagged: "Function too complex (20)"
const validate = (app) => {
  // Multiple independent conditions
  if (!app.name) return false;
  if (!app.email) return false;
  if (!app.phone) return false;
  // Each check is simple, total is easy to understand
  return true;
};
```

**Real Issue**:
```javascript
// ✓ Actually complex
const validate = (app) => {
  // Nested conditions with many branches
  if (app.type === 'A') {
    if (app.subtype === 'A1') {
      if (app.category === 'research') {
        // Deep nesting, hard to follow
      }
    }
  }
};
```

**Check**:
- [ ] Is complexity from repeated simple checks?
- [ ] Or deep nesting of conditions?
- [ ] Can it be refactored?

### 3. Test False Positives

#### Flaky Test (False Failure)

**False Alarm**:
```javascript
// ❌ Test sometimes fails, sometimes passes
it('should display message', async () => {
  const message = await getText('#msg'); // Timing
  expect(message).toBe('Hello');
  // Sometimes message not loaded yet
  // Sometimes tests runs before load finishes
});
```

**Real Issue**:
```javascript
// ✓ Test consistently fails
it('should greet user', () => {
  const greeting = createGreeting('Bob');
  expect(greeting).toBe('Hello Bob');
  // Always fails if logic is wrong
});
```

**Check**:
- [ ] Does test pass if run alone?
- [ ] Does test pass if run multiple times?
- [ ] Is it timing-dependent?
- [ ] Does it depend on test order?

#### False Assertion

**False Alarm**:
```javascript
// ❌ Assertion looks wrong but isn't
expect(app).toBeDefined();
expect(app).toBeTruthy();
// Both might seem redundant but one checks existence, other checks value
```

**Real Issue**:
```javascript
// ✓ Actually wrong assertion
expect(app.status).toBe('pending');
expect(app.status).toBe('completed');
// Can't be both!
```

**Check**:
- [ ] Do assertions contradict?
- [ ] Does test actually verify behavior?
- [ ] Could assertions pass by accident?

#### Test Data Issue

**False Alarm**:
```javascript
// ❌ Test setup seems wrong but is correct
const app = { id: null, status: 'draft' };
// We want to test null id handling
expect(validate(app)).toBe(false);
```

**Real Issue**:
```javascript
// ✓ Actually bad test data
const app = { id: 123 }; // Missing status field
expect(app.status).toBe('draft'); // Will fail
```

**Check**:
- [ ] Is test data intentional?
- [ ] Or is it incomplete?
- [ ] Could it be more realistic?

### 4. Code Review False Positives

#### Nitpick vs Real Issue

**False Alarm** (nitpick):
```javascript
// Reviewer: "variable name too short"
const app = getApplication(id);
// But 'app' is conventional, clear in context
```

**Real Issue**:
```javascript
// Reviewer: "Null check missing"
const app = getApplication(id);
console.log(app.status); // app could be null
```

**Check**:
- [ ] Is this nitpick or real issue?
- [ ] Would it cause bugs?
- [ ] Does it affect maintainability?

#### Style vs Substance

**False Alarm** (style):
```javascript
// Reviewer: "Use arrow function"
function validate(app) { return app.name; }
// Style preference, functionally identical
```

**Real Issue**:
```javascript
// Reviewer: "Missing permission check"
app.status = 'approved'; // Anyone can approve!
```

**Check**:
- [ ] Is this style preference?
- [ ] Or functional improvement?
- [ ] Do we care about this style?

### 5. Performance Analysis False Positives

#### False Slowness

**False Alarm**:
```javascript
// Flagged: "N+1 query problem"
for (let i = 0; i < apps.length; i++) {
  const tasks = getTasks(apps[i].id); // Looks like N+1
  // But in tests, getTasks is mocked/cached
  // Production uses batch API
}
```

**Real Issue**:
```javascript
// ✓ Actually N+1
for (const app of apps) {
  const tasks = query('SELECT * FROM tasks WHERE app_id = ?', app.id);
  // Separate query per app! N+1 queries
}
```

**Check**:
- [ ] Is this mocked/cached?
- [ ] Does production use batch?
- [ ] Is there actually sequential DB calls?

#### Memory Leak False Alarm

**False Alarm**:
```javascript
// Flagged: "Memory leak - object not released"
const data = new Array(1000000);
// But it's in local scope, garbage collected after function
```

**Real Issue**:
```javascript
// ✓ Actually memory leak
global.cache[key] = new Array(1000000);
// Grows forever, never released
```

**Check**:
- [ ] Is object in global scope?
- [ ] Is there lifecycle management?
- [ ] Or is it local/temporary?

## False Positive Detection Framework

### Step 1: Understand the Flag

**What is being flagged?**
```
Issue: "Null pointer risk"
Location: Variable 'user' might be null
Severity: High
```

### Step 2: Analyze Context

**Questions**:
- [ ] How could this actually fail?
- [ ] What would need to be true?
- [ ] Is there a guard/check?
- [ ] Does API guarantee non-null?
- [ ] Would tests catch this?

### Step 3: Search Code

**Look for**:
- Null checks before use
- Type guards
- Assertions
- Validation
- API documentation

### Step 4: Determine: Real vs False

**Real Issue**: Actual risk, can fail
**False Positive**: No actual risk, false alarm

### Step 5: Action

**If False Positive**:
- [ ] Suppress warning (if tool allows)
- [ ] Add comment explaining why safe
- [ ] Configure rule to avoid future false positives

**If Real Issue**:
- [ ] Create ticket
- [ ] Add test that fails
- [ ] Fix issue
- [ ] Verify test passes

## False Positive Report Template

```
FALSE POSITIVE ANALYSIS

Issue Flagged: [what tool said]
Tool: [linter/analyzer/test/reviewer]
Severity: [critical/high/medium/low in flag]

Analysis:
├─ Tool Reason: [why flagged]
├─ Code Context: [relevant code snippet]
├─ Actual Risk: [is there real risk?]
└─ Verdict: [REAL ISSUE / FALSE POSITIVE]

Evidence:
├─ Guard Present? [yes/no]
├─ API Guarantees? [yes/no]
├─ Tests Catch? [yes/no]
└─ Code Pattern: [is this common/safe?]

Confidence: [HIGH / MEDIUM / LOW]
- [evidence 1]
- [evidence 2]
- [evidence 3]

Action:
├─ If False Positive: [suppress/document/fix-rule]
└─ If Real Issue: [create-ticket/add-test/fix]

Resolution: [DONE/IN-PROGRESS]
```

## Prevention Strategies

### 1. Configure Tools Properly

**ESLint**:
```javascript
// .eslintrc.js
{
  rules: {
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'no-console': 'off', // Avoid false positives if console used intentionally
  }
}
```

**TypeScript**:
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true, // Catch real issues, but requires handling
  }
}
```

### 2. Add Suppression Comments

```javascript
// When it's genuinely safe, document it
// eslint-disable-next-line no-console
console.log('debug info'); // Intentional

// @ts-ignore - API guarantees this is non-null
const value = getValue();
```

### 3. Improve Test Reliability

**Eliminate Flaky Tests**:
```javascript
// ❌ Flaky - timing assumption
setTimeout(() => expect(result).toBe(true), 100);

// ✓ Reliable - proper wait
await waitFor(() => expect(result).toBe(true));
```

### 4. Code Review Process

**Distinguish**:
```
Is this a real issue or false positive?

Real Issues to Flag:
  ✓ Null pointer without check
  ✓ Type mismatch that causes error
  ✓ Performance problem that affects users
  ✓ Missing permission check
  ✓ Deadlock/race condition

False Positives to Ignore:
  ✗ Style preference
  ✗ Intentional pattern (documented)
  ✗ Tool false alarm
  ✗ Not practically exploitable
```

## Common Tools & Their False Positive Rates

| Tool | False Positive Rate | Notes |
|------|-------------------|-------|
| ESLint | Low (5-10%) | Mostly configuration issues |
| TypeScript | Low (2-5%) | Strict mode helps |
| SonarQube | Medium (15-25%) | Needs tuning |
| Jest | Low (< 5%) | Usually accurate |
| SecurityScan | High (30-40%) | Many edge cases |

## Team Communication

**When reporting false positives**:

```
Message Template:
Subject: False Positive - [Tool]: [Issue]

This was flagged as: [issue description]

Why it's a false positive:
1. [Evidence 1]
2. [Evidence 2]
3. [Evidence 3]

Recommendation: [suppress/ignore/fix-rule]

Confidence: [HIGH/MEDIUM/LOW]
```

## Reducing False Positive Noise

### Measure False Positive Rate

```
Total Warnings: 100
Investigated: 50
- Real Issues: 10 (20%)
- False Positives: 40 (80%)

Goal: Reduce false positives to < 10%
```

### Action Plan

```
Week 1: Audit current warnings
  └─ Which are false positives?

Week 2: Configure tools
  └─ Suppress known false positives
  └─ Adjust thresholds

Week 3: Team training
  └─ When to ignore warnings
  └─ When to create tickets

Week 4: Measure improvement
  └─ Reduced false positive rate?
  └─ More actionable warnings?
```

## References
- Code review: `/skill code-review`
- Test analysis: `/skill test-coverage-analysis`
- Bug analysis: `/skill bug-issue-analysis`
- Code smells: `/skill code-smell-detection`

