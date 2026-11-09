---
name: code-review
description: 'Comprehensive code review checking architecture, patterns, security, performance, and maintainability using workspace guidelines.'
---

# Code Review Skill

## Purpose
Structured code review using SOLID principles, workspace patterns, and DevSecOps approach.

## Quick Checklist

### Architecture & Design (SOLID)
- [ ] Single Responsibility: One reason to change?
- [ ] Open/Closed: Open for extension, closed for modification?
- [ ] Liskov Substitution: Proper inheritance/interface use?
- [ ] Interface Segregation: No fat interfaces?
- [ ] Dependency Inversion: Depends on abstractions, not concrete?

### Workspace Patterns
- [ ] Follows `.ai/services.md` patterns for this service?
- [ ] Uses functions from `.ai/functions.md` correctly?
- [ ] Respects `.ai/dependencies.md` (no circular deps)?
- [ ] Integrates properly with existing APIs from `.ai/api-contracts.md`?
- [ ] State machine transitions valid (see `.ai/workflows.md`)?

### Security (DevSecOps)
- [ ] Input validation present?
- [ ] SQL injection protection (parameterized queries)?
- [ ] XSS prevention (escaping/encoding)?
- [ ] CSRF tokens used?
- [ ] Authentication required?
- [ ] Authorization checked?
- [ ] Secrets not hardcoded?
- [ ] Error messages don't leak info?

### Performance
- [ ] Database queries optimized?
- [ ] No N+1 query problems?
- [ ] Caching used appropriately?
- [ ] Critical path optimized (see `.ai/dependencies.md`)?
- [ ] No unnecessary loops/recursion?
- [ ] Memory efficient?

### Testing
- [ ] Tests added for new code?
- [ ] Edge cases covered?
- [ ] Error cases tested?
- [ ] Mocks used for dependencies?
- [ ] No test fragility (flaky tests)?

### Code Quality
- [ ] Readable variable/function names?
- [ ] Functions reasonably sized (< 50 lines)?
- [ ] Comments explain WHY, not WHAT?
- [ ] DRY principle followed (no duplication)?
- [ ] Proper error handling?
- [ ] Logging appropriate?

### Documentation
- [ ] Changes documented?
- [ ] API contracts updated (if changed)?
- [ ] Knowledge map updated (if needed)?
- [ ] Breaking changes noted?
- [ ] Migration path documented?

## Review Output Format

```
✅ APPROVED / 🔴 NEEDS CHANGES

SOLID Principles:
├─ S [✓/✗]: [issue or OK]
├─ O [✓/✗]: [issue or OK]
├─ L [✓/✗]: [issue or OK]
├─ I [✓/✗]: [issue or OK]
└─ D [✓/✗]: [issue or OK]

Security:
├─ Input Validation: ✓
├─ Authentication: ✓
├─ Authorization: ✓
└─ Issues: [list or "None"]

Performance:
├─ Database Queries: ✓
├─ Caching: ✓
└─ Issues: [list or "None"]

Testing:
├─ Coverage: ✓
├─ Edge Cases: ✓
└─ Issues: [list or "None"]

Critical Issues:
└─ [List any blockers]

Nice-to-have:
└─ [List suggestions]
```

## Key References
- Workspace patterns: `.ai/services.md`
- Function guidelines: `.ai/functions.md`
- Dependency rules: `.ai/dependencies.md`
- API contracts: `.ai/api-contracts.md`
- Testing patterns: `.ai/test-map.md`

