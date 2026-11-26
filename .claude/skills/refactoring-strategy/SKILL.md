---
name: refactoring-strategy
description: 'Plan and execute refactoring safely. Identify refactoring type, create test safety net, execute incrementally, and verify no regression.'
---

# Refactoring Strategy Skill

## Purpose
Safe refactoring using test-driven approach with zero risk of regression.

## Refactoring Types

### 1. Extract Method
**Goal**: Break long method into smaller, focused methods
**Steps**:
```
1. Write test covering current behavior
2. Identify code segment to extract
3. Create new method with extracted code
4. Replace original with method call
5. Run tests (should still pass)
6. Repeat for other segments
```

**Safety**: Tests must pass at each step

### 2. Extract Class
**Goal**: Move related code to new class
**Steps**:
```
1. Write comprehensive tests
2. Create new class
3. Move related methods one by one
4. Update references
5. Run tests after each move
6. Delete old class methods
```

**Safety**: Testing at each step prevents breakage

### 3. Move Function
**Goal**: Relocate function to better class/module
**Steps**:
```
1. Tests must exist for function
2. Create function in target location
3. Add delegation in original location
4. Run tests (should pass)
5. Move callers gradually to new location
6. Remove delegation/original
7. Run full test suite
```

**Safety**: Gradual migration, tests verify each step

### 4. Rename
**Goal**: Better naming for clarity
**Steps**:
```
1. Create new function with better name
2. Call new from old (delegation)
3. Update all callers to use new name
4. Run tests
5. Delete old function
6. Run tests
```

**Safety**: Automated refactoring tool recommended

### 5. Consolidate Duplicated Code
**Goal**: Remove code duplication
**Steps**:
```
1. Identify duplicated segments
2. Write test for duplication
3. Extract to shared function
4. Update all copies to call shared
5. Run tests (should pass)
6. Repeat for other duplications
```

**Safety**: Each duplication removed independently

### 6. Replace Temp with Query
**Goal**: Remove intermediate variables
**Steps**:
```
1. Extract variable assignment to method
2. Replace temp variable with method call
3. Run tests
4. Simplify further if possible
```

**Safety**: Tests verify behavior unchanged

### 7. Introduce Parameter Object
**Goal**: Group related parameters
**Steps**:
```
1. Create new class/object for grouped params
2. Update function signature (old + new)
3. Add delegation to new param
4. Gradually move callers
5. Remove old parameters
6. Run tests
```

**Safety**: Backward compatible approach

### 8. Preserve Change Tests
**Goal**: Refactor without changing behavior
**Process**:
```
1. Document original behavior in tests
2. Refactor code
3. Run tests (must pass)
4. Behavior unchanged ✓
```

**Safety**: Tests are regression safeguard

## Refactoring Checklist

### Before Starting
- [ ] Full test coverage exists? (see `/skill test-coverage-analysis`)
- [ ] No tests failing currently?
- [ ] Backup/branch strategy clear?
- [ ] Refactoring scope limited?
- [ ] No other changes in same PR?

### During Refactoring
- [ ] One small change at a time?
- [ ] Tests run after each change?
- [ ] No new functionality added?
- [ ] Behavior identical to before?
- [ ] Code complexity reduced?
- [ ] Performance not degraded?

### After Refactoring
- [ ] All tests pass?
- [ ] Code review passed? (see `/skill code-review`)
- [ ] No code smells introduced? (see `/skill code-smell-detection`)
- [ ] Performance benchmarked?
- [ ] Documentation updated?
- [ ] Knowledge map updated (if needed)?

## Refactoring Plan Template

```
REFACTORING PLAN

Target: [what to refactor]
Scope: [affected functions/classes]
Goal: [what should improve]

Safety Net:
├─ Test Coverage: X% (see .ai/test-map.md)
├─ Critical Tests: [list tests that must pass]
└─ Rollback Plan: [how to undo if needed]

Refactoring Steps:
├─ Step 1: [extract/move/etc]
│  └─ Tests: [verify behavior]
├─ Step 2: [next step]
│  └─ Tests: [verify behavior]
└─ Step N: [final step]
   └─ Tests: [verify behavior]

Expected Improvements:
├─ Complexity: [metrics before/after]
├─ Duplication: [reduction %]
├─ Testability: [improved]
└─ Performance: [impact]

Risks:
├─ Low Risk Items: [list]
├─ Medium Risk Items: [list]
└─ Mitigation: [strategy]

Timeline:
├─ Estimated: [time]
├─ Per-step: [time breakdown]
└─ Buffer: [contingency]
```

## Anti-Patterns to Avoid

### ❌ Big Bang Refactoring
**Problem**: Refactor everything at once
**Result**: Many bugs, hard to debug
**Do Instead**: Refactor incrementally, test after each step

### ❌ Refactoring + Features
**Problem**: Refactor and add features in same PR
**Result**: Hard to review, hard to debug
**Do Instead**: Refactor in one PR, features in next

### ❌ No Test Coverage
**Problem**: Refactor without tests
**Result**: Hidden bugs, regression risk
**Do Instead**: Add tests first (see `/skill test-coverage-analysis`)

### ❌ Skipping Code Review
**Problem**: Merge refactoring without review
**Result**: Technical debt introduced
**Do Instead**: Require code review (see `/skill code-review`)

### ❌ Performance Assumptions
**Problem**: Refactor assuming performance impact
**Result**: Unexpected performance regression
**Do Instead**: Benchmark before/after

## Refactoring Workflow

```
Identify Smell
    ↓ (run `/skill code-smell-detection`)
Analyze Impact
    ↓ (check tests with `/skill test-coverage-analysis`)
Plan Refactoring
    ↓ (use template above)
Add Test Safety Net
    ↓ (see `/skill test-coverage-analysis`)
Execute Refactoring
    ├─ Small step
    ├─ Run tests (all pass?)
    └─ Repeat until done
    ↓
Code Review
    ↓ (run `/skill code-review`)
Benchmark
    ↓ (if performance-related)
Merge
    ↓
Verify in Deployment
```

## Refactoring by Component

**UI Components** (asl, asl-internal-ui):
- Extract smaller components
- Move state to container
- Simplify Redux selectors

**APIs** (asl-public-api, asl-internal-api):
- Extract handlers to services
- Consolidate validation
- Simplify middleware

**Services** (asl-workflow, asl-permissions):
- Break large files
- Consolidate duplicated logic
- Move to separate files

**Database** (asl-schema):
- Consolidate migrations
- Simplify query scopes
- Extract validators

**Tests**:
- Extract test utilities
- Consolidate mocking
- Reduce duplication

## Key References
- Test strategy: `.ai/test-map.md`
- Code patterns: `.ai/services.md`
- Dependency analysis: `.ai/dependencies.md`
- Anti-patterns: `/skill anti-pattern-detection`

