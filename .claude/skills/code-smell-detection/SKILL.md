---
name: code-smell-detection
description: 'Identify code smells, design issues, and maintainability problems. Flag long methods, duplicated code, feature envy, and complexity issues.'
---

# Code Smell Detection Skill

## Purpose
Systematically detect code smells that indicate deeper design problems needing refactoring.

## Common Smells to Check

### 1. Long Method
**Indicator**: Method > 50 lines
**Problem**: Hard to test, understand, modify
**Fix**: Extract methods, simplify logic

**Check**:
- [ ] Method line count
- [ ] Method complexity (cyclomatic complexity)
- [ ] Number of responsibilities

### 2. Duplicated Code
**Indicator**: Same code appears 2+ times
**Problem**: Maintenance nightmare, inconsistency
**Fix**: Extract to shared function/module

**Check**:
- [ ] Copy-paste code?
- [ ] Similar logic in different files?
- [ ] Constants duplicated?

### 3. Feature Envy
**Indicator**: Function calls many methods on another object
**Problem**: Misplaced responsibility
**Fix**: Move method to that object's class

**Check**:
- [ ] Accessing too many properties of another object?
- [ ] Method more related to another class?

### 4. Data Clumps
**Indicator**: Same set of variables always together
**Problem**: Should be object/class
**Fix**: Create dedicated class for grouped data

**Check**:
- [ ] Variables always passed together?
- [ ] Same parameters in multiple functions?

### 5. Primitive Obsession
**Indicator**: Using primitives instead of small objects
**Problem**: No type safety, easy to mix up
**Fix**: Create classes for domain concepts

**Check**:
- [ ] Using string/number for domain concept?
- [ ] Type confusion possible?

### 6. Switch Statements
**Indicator**: Large switch with many cases
**Problem**: Often violates Single Responsibility, hard to extend
**Fix**: Use polymorphism or strategy pattern

**Check**:
- [ ] Large switch statement?
- [ ] Adding new case requires modifying switch?

### 7. Speculative Generality
**Indicator**: Code for features not needed yet
**Problem**: Adds complexity, unused code
**Fix**: Delete, implement when actually needed

**Check**:
- [ ] "Future-proofing" that's never used?
- [ ] Over-engineered for current needs?

### 8. Temporary Variables
**Indicator**: Using variable to hold intermediate result
**Problem**: Hard to extract methods, scope issues
**Fix**: Replace with query method or pipeline

**Check**:
- [ ] Too many intermediate variables?
- [ ] Variable only used once?

### 9. Message Chains
**Indicator**: obj.a().b().c().d()
**Problem**: Tight coupling, breaks if structure changes
**Fix**: Hide structure, add methods

**Check**:
- [ ] Long chain of method calls?
- [ ] Knowledge of internal structure?

### 10. Middle Man
**Indicator**: Class only delegates to another
**Problem**: Unnecessary indirection
**Fix**: Delete middle man or add real responsibility

**Check**:
- [ ] Class mostly delegates?
- [ ] Adds no real value?

### 11. Divergent Change
**Indicator**: Class changes for different reasons
**Problem**: Multiple reasons to change (SRP violation)
**Fix**: Split into multiple classes

**Check**:
- [ ] Class changes for database reasons?
- [ ] Also changes for UI reasons?
- [ ] Also changes for business logic?

### 12. Shotgun Surgery
**Indicator**: One change requires modifying many files
**Problem**: Responsibility scattered everywhere
**Fix**: Move related code together

**Check**:
- [ ] Single feature change requires many file edits?
- [ ] Related code scattered?

### 13. Lazy Class
**Indicator**: Class does very little
**Problem**: Unnecessary abstraction
**Fix**: Merge with another class

**Check**:
- [ ] Class has minimal functionality?
- [ ] Could merge with related class?

### 14. Comments Everywhere
**Indicator**: Heavy use of comments explaining code
**Problem**: Code should be self-documenting
**Fix**: Refactor code to be clearer

**Check**:
- [ ] Comments explaining WHAT code does?
- [ ] Code could be clearer instead?

### 15. Global Variables
**Indicator**: Global state accessed everywhere
**Problem**: Hidden dependencies, hard to test
**Fix**: Use dependency injection, proper scoping

**Check**:
- [ ] Global variables used?
- [ ] Global state mutations?

## Detection Output Format

```
CODE SMELL SCAN RESULTS

🔴 Critical Smells (refactor required):
├─ Long Method: submitApplication() (145 lines)
│  └─ Action: Extract to 3-5 methods
├─ Duplicated Code: validation logic in 3 files
│  └─ Action: Extract to shared validator
└─ Shotgun Surgery: Status change affects 8 files
   └─ Action: Consolidate into workflow

🟡 Minor Smells (consider refactoring):
├─ Feature Envy: class A calls 5+ methods on class B
│  └─ Action: Move method to class B
├─ Data Clumps: (applicationId, userId, timestamp) repeated
│  └─ Action: Create RequestContext class
└─ Message Chains: obj.app().workflow().status().value()
   └─ Action: Simplify via facade method

✅ No Issues:
├─ Code duplication: Minimal
├─ Method sizes: Reasonable
└─ Complexity: Within limits

Next Steps:
1. Address critical smells first
2. Create tickets for refactoring
3. Plan refactoring with tests (from /skill code-smell-fix)
```

## Smell Severity Guide

| Severity | Impact | Timeline |
|----------|--------|----------|
| 🔴 Critical | Blocks maintenance, introduces bugs | Immediate |
| 🟡 Major | Slows development, hard to extend | This sprint |
| 🟠 Minor | Slightly harder to work with | Next sprint |
| ⚪ Negligible | Nice to clean up, low priority | Backlog |

## References
- Refactoring book: Martin Fowler's patterns
- Testing: `.ai/test-map.md`
- Code patterns: `.ai/services.md`
- Function guidelines: `.ai/functions.md`

