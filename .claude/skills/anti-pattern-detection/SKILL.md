---
name: anti-pattern-detection
description: 'Identify architectural anti-patterns, design anti-patterns, and coding anti-patterns that violate SOLID, cause technical debt, or create future maintenance issues.'
---

# Anti-Pattern Detection Skill

## Purpose
Flag design decisions and patterns that will cause problems down the line.

## Architectural Anti-Patterns

### ❌ Circular Dependencies
**Problem**: Service A depends on B, B depends on A
**Impact**: Can't test independently, tight coupling
**Check**: `.ai/dependencies.md` - review service dependency graph
**Fix**: Introduce mediator service or event bus

**Detection**:
```
Service A imports from B
Service B imports from A
  → CIRCULAR DEPENDENCY
```

### ❌ God Object
**Problem**: One service does too many things
**Impact**: Hard to test, modify, understand
**Check**: Service has 5+ major responsibilities?
**Fix**: Split into focused services

**Example**: asl-workflow doing everything (validation, notification, task creation, state management)

### ❌ Silo Services
**Problem**: Services don't communicate, duplicate code
**Impact**: Inconsistency, maintenance nightmare
**Check**: Similar code in multiple services?
**Fix**: Extract shared service or library

### ❌ Missing Abstraction
**Problem**: Business logic scattered across API/UI
**Impact**: Logic inconsistency, hard to test
**Check**: Same logic in multiple places?
**Fix**: Move to service layer

### ❌ Implicit Contracts
**Problem**: API contracts not documented
**Impact**: Breaking changes go unnoticed
**Check**: See `.ai/api-contracts.md` - is endpoint documented?
**Fix**: Document in api-contracts.md

### ❌ Hidden Temporal Coupling
**Problem**: Functions must be called in specific order
**Impact**: Silent failures, hard to debug
**Example**: Must call init() before process()
**Fix**: Make order explicit in design

### ❌ Feature Envy Between Services
**Problem**: Service A calls many methods on Service B
**Impact**: Tight coupling, responsibility confusion
**Fix**: Move functions to Service B, call from A

### ❌ Database Coupling
**Problem**: Multiple services access same database directly
**Impact**: Schema changes break everything
**Check**: See `.ai/dependencies.md` (asl-schema used by?)
**Fix**: Use API to access shared data

### ❌ Missing Event Flow
**Problem**: Services not using event/job queue
**Impact**: Tight temporal coupling, testing hard
**Example**: Workflow directly calling notifications (sync)
**Fix**: Use job queue for async work

## Design Anti-Patterns

### ❌ Primitive Obsession
**Problem**: Using strings/numbers for domain concepts
**Impact**: Type confusion, easy to mix up
**Example**:
```javascript
// ❌ Bad
function changeStatus(appId: string, status: string)

// ✅ Good
function changeStatus(appId: ApplicationId, status: ApplicationStatus)
```

### ❌ Feature Envy
**Problem**: Method calls too many methods on other object
**Impact**: Misplaced responsibility
**Check**: Method accessing 5+ properties of another class?
**Fix**: Move method to that class

### ❌ Data Clumps
**Problem**: Same variables always together
**Impact**: Should be a class
**Example**: (applicationId, userId, timestamp) always passed together
**Fix**: Create Request/Context object

### ❌ Switch Statements
**Problem**: Large switch handling multiple types
**Impact**: Violates Open/Closed Principle
**Example**:
```javascript
// ❌ Bad - violates SRP
switch(decision) {
  case 'approve': createLicense(); ...
  case 'reject': sendEmail(); ...
  case 'info': ...
}

// ✅ Good - separate handlers
handlers[decision](application);
```

### ❌ Lazy Class
**Problem**: Class has minimal responsibility
**Impact**: Unnecessary abstraction
**Fix**: Merge with related class

### ❌ Speculative Generality
**Problem**: Code for features not needed yet
**Impact**: Adds complexity
**Fix**: Implement when actually needed (YAGNI)

### ❌ Divergent Change
**Problem**: Class changes for multiple different reasons
**Impact**: Violates SRP
**Example**: Class changed for: DB reasons, UI reasons, business logic
**Fix**: Split into focused classes

### ❌ Shotgun Surgery
**Problem**: One change affects many files
**Impact**: Responsibility scattered
**Fix**: Consolidate related code

### ❌ Parallel Class Hierarchies
**Problem**: For each class A, create similar class B
**Impact**: Duplication, hard to maintain
**Fix**: Use composition instead of inheritance

### ❌ Inappropriate Intimacy
**Problem**: Class knows too much about internals of another
**Impact**: Tight coupling, breaks encapsulation
**Fix**: Use proper interfaces/APIs

## Coding Anti-Patterns

### ❌ Magic Numbers/Strings
**Problem**: Hard-coded values without explanation
**Impact**: Hard to understand, maintain
**Example**:
```javascript
// ❌ Bad
if (days > 30) { ... }

// ✅ Good
const DEADLINE_DAYS = 30;
if (days > DEADLINE_DAYS) { ... }
```

### ❌ Dead Code
**Problem**: Unreachable or unused code
**Impact**: Confusing, waste of space
**Fix**: Delete it

### ❌ Global Variables
**Problem**: Global state accessed everywhere
**Impact**: Hidden dependencies, hard to test
**Fix**: Use dependency injection

### ❌ Comment Hell
**Problem**: Code needs lots of comments to explain
**Impact**: Code not self-documenting
**Fix**: Refactor code to be clearer

### ❌ Mutable Global State
**Problem**: Global variables that get modified
**Impact**: Impossible to reason about, test
**Fix**: Use immutable config, pass state explicitly

### ❌ Long Parameter Lists
**Problem**: Function takes 5+ parameters
**Impact**: Hard to call, understand, test
**Example**:
```javascript
// ❌ Bad
processApplication(id, userId, status, decision, reason, timestamp, ...)

// ✅ Good
processApplication(review: ApplicationReview)
```

### ❌ Boolean Parameters
**Problem**: Boolean flag to change behavior
**Impact**: Violates SRP
**Example**: `function apply(data, isDraft)` - should be two functions
**Fix**: Split into separate functions

### ❌ Temporal Coupling
**Problem**: Must call functions in specific order
**Impact**: Silent failures
**Fix**: Make dependencies explicit

### ❌ Exception Abuse
**Problem**: Using exceptions for control flow
**Impact**: Performance hit, confusing
**Fix**: Use proper conditionals

### ❌ Null Checks Everywhere
**Problem**: Checking for null throughout code
**Impact**: Noise, fragile
**Fix**: Use Optional/Maybe types or guarantee non-null

## SOLID Violations

### ❌ Single Responsibility Violation
**Problem**: Class has multiple reasons to change
**Example**: Class handles: validation, database, email
**Fix**: Split into separate classes

### ❌ Open/Closed Violation
**Problem**: Must modify existing code to extend
**Fix**: Use polymorphism, strategy pattern

### ❌ Liskov Violation
**Problem**: Subclass breaks contract of parent
**Fix**: Proper inheritance/interface design

### ❌ Interface Segregation Violation
**Problem**: Fat interfaces forcing unnecessary dependencies
**Fix**: Split interface into smaller, focused ones

### ❌ Dependency Inversion Violation
**Problem**: Depends on concrete classes, not abstractions
**Fix**: Use interfaces/abstract classes

## Anti-Pattern Report Format

```
ANTI-PATTERN DETECTION RESULTS

🔴 CRITICAL Anti-Patterns:
├─ Circular Dependencies: asl-workflow ↔ asl-notifications
│  └─ Impact: Cannot test independently
│  └─ Fix: Use job queue for async communication
│
├─ God Object: asl-workflow (8 major responsibilities)
│  └─ Impact: Hard to test, modify
│  └─ Fix: Split workflow logic into focused services
│
└─ Missing Service Layer: Business logic in APIs
   └─ Impact: Logic scattered, hard to test
   └─ Fix: Extract to service layer

🟡 MEDIUM Anti-Patterns:
├─ Feature Envy: submitApplication calls 6+ methods on database
│  └─ Fix: Consolidate database operations
│
└─ Data Clumps: (appId, userId, timestamp) repeated 5x
   └─ Fix: Create Request context object

⚪ CODING Anti-Patterns:
├─ Magic Numbers: hardcoded 30 days in 3 places
│  └─ Fix: Extract to constant DEADLINE_DAYS
│
└─ Long Method: reviewApplication() 120 lines
   └─ Fix: Extract into smaller methods

Recommendations:
1. Fix circular dependencies immediately
2. Break down god objects in next sprint
3. Add service layer for business logic
4. Refactor data clumps
5. Extract magic numbers
```

## Detection Checklist

### Dependencies
- [ ] Circular dependencies exist?
- [ ] Services tightly coupled?
- [ ] Too many outbound dependencies?
- [ ] Implicit contracts (undocumented)?

### Design
- [ ] God objects?
- [ ] Missing abstractions?
- [ ] Feature envy?
- [ ] Data clumps?
- [ ] Primitive obsession?

### Coding
- [ ] Magic numbers/strings?
- [ ] Dead code?
- [ ] Global state?
- [ ] Long parameter lists?
- [ ] Comment hell?

### SOLID
- [ ] SRP violations?
- [ ] OCP violations?
- [ ] LSP violations?
- [ ] ISP violations?
- [ ] DIP violations?

## References
- Dependency map: `.ai/dependencies.md`
- Service design: `.ai/services.md`
- Code patterns: `.ai/functions.md`
- API contracts: `.ai/api-contracts.md`

