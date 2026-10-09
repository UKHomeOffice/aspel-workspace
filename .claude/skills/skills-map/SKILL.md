---
name: skills-map
description: 'Master index of all SOLID SDLC skills. Navigate and understand when to use each skill for code analysis, verification, and development.'
---

# 🗺️ SOLID SDLC Skills Map

## Master Skill Navigation

All skills are focused, atomic, and designed to work together as a comprehensive system.

**Use this map to find the right skill for your task.**

---

## Skills Directory

### 🎯 Planning & Analysis Skills

#### 1. **development-plan** (PRIMARY SKILL)
**Purpose**: Plan JIRA ticket implementation using workspace knowledge
**When to Use**: Starting a new feature or bug fix
**Input**: JIRA ticket with acceptance criteria
**Output**: Impact analysis, implementation steps, test strategy

**Quick Process**:
```
1. Read JIRA ticket
2. Check .ai/functions.md for similar code
3. Map impact using this skill
4. Create implementation plan
5. Execute using other skills
```

**Related Skills**:
- `/skill anti-pattern-detection` - Check for design issues
- `/skill test-coverage-analysis` - Ensure test strategy
- `/skill journey-e2e-mapping` - Verify E2E coverage

---

### 🔍 Code Quality & Review Skills

#### 2. **code-review**
**Purpose**: Comprehensive code review using SOLID + DevSecOps approach
**When to Use**: Reviewing pull requests or code before merge
**Input**: Code to review
**Output**: SOLID violations, security issues, performance concerns

**Checklist**:
- [ ] SOLID principles (S, O, L, I, D)
- [ ] Security (input validation, auth, XSS, CSRF)
- [ ] Performance (DB queries, caching)
- [ ] Testing (coverage, edge cases)
- [ ] Code quality (naming, comments, DRY)

**Related Skills**:
- `/skill anti-pattern-detection` - Check for architectural issues
- `/skill code-smell-detection` - Flag refactoring opportunities
- `/skill false-positive-detection` - Eliminate noise from review

---

#### 3. **code-smell-detection**
**Purpose**: Identify code smells indicating deeper issues
**When to Use**: Code review, refactoring planning, or quality gates
**Input**: Source code
**Output**: List of smells by severity with fix suggestions

**15 Smells Detected**:
1. Long Method
2. Duplicated Code
3. Feature Envy
4. Data Clumps
5. Primitive Obsession
6. Switch Statements
7. Speculative Generality
8. Temporary Variables
9. Message Chains
10. Middle Man
11. Divergent Change
12. Shotgun Surgery
13. Lazy Class
14. Comments Everywhere
15. Global Variables

**Related Skills**:
- `/skill refactoring-strategy` - How to fix smells
- `/skill anti-pattern-detection` - Related issues
- `/skill code-review` - Part of review process

---

#### 4. **anti-pattern-detection**
**Purpose**: Catch architectural anti-patterns and design problems
**When to Use**: Design review, PR review, or architecture analysis
**Input**: Service design, dependency structure, code patterns
**Output**: Anti-patterns by category with remediation

**Patterns Detected**:
- Architectural: Circular deps, God objects, Silos
- Design: Feature envy, Data clumps, Switch statements
- Coding: Magic numbers, Global state, Dead code
- SOLID: All 5 SOLID violations

**Related Skills**:
- `/skill code-smell-detection` - Similar but code-level
- `/skill code-review` - Part of review criteria
- `/skill dependencies` (via architecture.md) - Service relationships

---

### 🐛 Testing & Bug Analysis Skills

#### 5. **bug-issue-analysis**
**Purpose**: Systematically analyze bugs and issues
**When to Use**: Bug investigation, root cause analysis, ticket creation
**Input**: Bug report with reproduction steps
**Output**: Root cause, impact analysis, fix strategy, regression test

**7-Step Process**:
1. Understand the bug (What/When/Where/Who/Scale)
2. Locate the bug (in code)
3. Find root cause (via analysis)
4. Determine impact (scope analysis)
5. Design fix (with criteria)
6. Write regression test
7. Fix & verify

**Related Skills**:
- `/skill test-coverage-analysis` - Create regression tests
- `/skill code-review` - Review the fix
- `/skill development-plan` - If bug requires feature changes

---

#### 6. **test-coverage-analysis**
**Purpose**: Analyze test coverage gaps and create testing strategy
**When to Use**: Feature implementation, quality gates, coverage improvement
**Input**: Code to test
**Output**: Coverage gaps, test strategy, priority plan

**Coverage Analysis**:
- Line coverage
- Branch coverage
- Path coverage
- Functional coverage

**Focus Areas**:
- Critical path code (95%+ target)
- Edge cases (80%+ target)
- Error handling (90%+ target)
- Integration (85%+ target)

**Related Skills**:
- `/skill journey-e2e-mapping` - Verify E2E coverage
- `/skill bug-issue-analysis` - Test for bug regression
- `/skill false-positive-detection` - Identify flaky tests

---

#### 7. **journey-e2e-mapping**
**Purpose**: Map user journeys to E2E tests and ensure coverage
**When to Use**: Feature delivery, E2E test planning, journey analysis
**Input**: User journey or feature requirement
**Output**: Journey documentation, E2E test coverage report

**Workflow**:
1. Document journey (steps, actors, entry/exit)
2. Create E2E test structure
3. Verify all steps covered
4. Add backend assertions
5. Maintain traceability

**Related Skills**:
- `/skill test-coverage-analysis` - Full testing strategy
- `/skill development-plan` - Impact on journeys
- `.ai/e2e-map.md` - Journey documentation

---

### 🔧 Refactoring & Optimization Skills

#### 8. **refactoring-strategy**
**Purpose**: Plan and execute safe refactoring
**When to Use**: Code cleanup, smell remediation, technical debt
**Input**: Code to refactor, target improvements
**Output**: Refactoring plan, step-by-step guide, safety checks

**Refactoring Types**:
1. Extract Method
2. Extract Class
3. Move Function
4. Rename
5. Consolidate Duplicated Code
6. Replace Temp with Query
7. Introduce Parameter Object
8. Preserve Change (behavior-preserving)

**Safety First**:
- Tests must exist before refactoring
- Small steps, tests after each
- No new features during refactoring
- Performance benchmarked

**Related Skills**:
- `/skill code-smell-detection` - What to refactor
- `/skill test-coverage-analysis` - Safety net
- `/skill code-review` - Verify refactoring

---

#### 9. **false-positive-detection**
**Purpose**: Eliminate noise from analysis by spotting false alarms
**When to Use**: Code review, test analysis, static analysis review
**Input**: Flagged issue or test failure
**Output**: Verdict (real issue vs false positive), action

**False Positive Categories**:
- Static analysis false alarms
- Linter over-aggressive rules
- Test flakiness
- Code review nitpicks
- Performance analysis false positives

**3-Step Analysis**:
1. Understand the flag
2. Analyze context deeply
3. Determine: Real vs False

**Related Skills**:
- `/skill code-review` - Distinguish real from nitpick
- `/skill test-coverage-analysis` - Identify flaky tests
- `/skill bug-issue-analysis` - Verify real issues

---

## Skill Usage Matrix

**By Task Type**:

| Task | Primary Skill | Supporting Skills |
|------|--------------|-------------------|
| New Feature | development-plan | test-coverage, journey-e2e |
| Bug Fix | bug-issue-analysis | test-coverage, code-review |
| Code Review | code-review | code-smell, anti-pattern, false-positive |
| Test Planning | test-coverage-analysis | journey-e2e, bug-issue |
| Refactoring | refactoring-strategy | code-smell, test-coverage, code-review |
| Architecture | anti-pattern-detection | development-plan, dependencies |
| E2E Testing | journey-e2e-mapping | test-coverage, development-plan |
| Issue Triage | false-positive-detection | code-review, bug-issue |

---

## Workflow Sequences

### Workflow 1: Implement New Feature

```
User has: JIRA ticket with feature request

1. Start: development-plan
   └─ Map impact, plan implementation

2. Design: anti-pattern-detection
   └─ Check for architectural issues

3. Develop: [code here]
   └─ Use patterns from .ai/ docs

4. Test: test-coverage-analysis
   └─ Ensure coverage meets targets

5. E2E: journey-e2e-mapping
   └─ Create/update E2E tests

6. Review: code-review
   └─ Verify SOLID, security, performance

7. Merge: false-positive-detection
   └─ Clean up any flaky tests

✅ Feature complete and tested
```

### Workflow 2: Fix a Bug

```
User has: Bug report with reproduction steps

1. Analyze: bug-issue-analysis
   └─ Find root cause, determine impact

2. Design: refactoring-strategy (if structural change needed)
   └─ Plan safe fix

3. Test: test-coverage-analysis
   └─ Write regression test first

4. Fix: [implement fix]
   └─ Follow existing patterns

5. Verify: code-review
   └─ Ensure fix is solid

6. Cleanup: false-positive-detection
   └─ Eliminate test noise

✅ Bug fixed with regression test
```

### Workflow 3: Code Review

```
User has: Pull request to review

1. Structure: anti-pattern-detection
   └─ Check architecture/design

2. Quality: code-review
   └─ SOLID, security, performance

3. Smells: code-smell-detection
   └─ Flag refactoring opportunities

4. Testing: test-coverage-analysis
   └─ Verify test coverage

5. Sanity: false-positive-detection
   └─ Remove nitpicks, keep real issues

6. Journeys: journey-e2e-mapping
   └─ Verify E2E impacts

✅ Comprehensive review complete
```

### Workflow 4: Technical Debt Cleanup

```
User has: List of technical debt items

1. Smell Analysis: code-smell-detection
   └─ Prioritize by impact

2. Strategy: refactoring-strategy
   └─ Plan safe refactoring

3. Testing: test-coverage-analysis
   └─ Ensure safety net

4. Implement: [refactor here]
   └─ Small steps, test after each

5. Review: code-review
   └─ Final quality check

✅ Technical debt reduced
```

---

## Quick Reference: Which Skill When?

### "I'm starting work on a JIRA ticket"
→ `/skill development-plan`

### "I need to review code"
→ `/skill code-review`

### "This code smells, needs refactoring"
→ `/skill code-smell-detection` → `/skill refactoring-strategy`

### "Architecture feels wrong"
→ `/skill anti-pattern-detection`

### "Investigating a bug"
→ `/skill bug-issue-analysis`

### "Test coverage insufficient"
→ `/skill test-coverage-analysis`

### "Need E2E test for journey"
→ `/skill journey-e2e-mapping`

### "This is flagged but doesn't seem wrong"
→ `/skill false-positive-detection`

### "Implementing a new feature"
→ `/skill development-plan` → `/skill test-coverage-analysis` → `/skill journey-e2e-mapping` → `/skill code-review`

### "Creating a refactoring plan"
→ `/skill code-smell-detection` → `/skill refactoring-strategy` → `/skill test-coverage-analysis` → `/skill code-review`

---

## Skill Relationships

```
                  development-plan
                   /  |  |  \
                  /   |  |   \
           code-review  |   test-coverage
           /  |  \      |      /  |  \
          /   |   \     |     /   |   \
  code-smell  |  anti-   |  journey-  false-
  detection   |  pattern |  e2e-mapping positive
              |          |           /
         refactoring--bug-issue----/
         strategy    analysis
```

**Key Relationships**:
- `development-plan` → uses all other skills
- `code-review` → incorporates code-smell + anti-pattern
- `refactoring-strategy` → requires test-coverage + code-smell
- `journey-e2e-mapping` → validates test-coverage
- `false-positive-detection` → cleans up other skill outputs

---

## Skill Attributes

| Skill | Complexity | Speed | Automation | Manual | Depth |
|-------|-----------|-------|-----------|--------|-------|
| development-plan | High | 30 min | Medium | High | Deep |
| code-review | High | 15 min | Low | High | Deep |
| code-smell | Medium | 10 min | High | Medium | Medium |
| anti-pattern | High | 15 min | Low | High | Deep |
| bug-issue | High | 20 min | Medium | High | Very Deep |
| test-coverage | Medium | 15 min | High | Medium | Medium |
| journey-e2e | Medium | 20 min | Low | High | Medium |
| false-positive | Low | 10 min | Low | High | Medium |

---

## Integration with Knowledge Maps

All skills reference and integrate with `.ai/` documentation:

```
Skill → Knowledge Map → Source Code

development-plan → .ai/functions.md → packages/*/lib/
              ↓ .ai/api-contracts.md ↓
           .ai/workflows.md packages/*/
              ↓ .ai/test-map.md ↓
           .ai/e2e-map.md packages/*/test/

code-review ↔ .ai/services.md (patterns)
          ↔ .ai/dependencies.md (coupling)

anti-pattern ↔ .ai/architecture.md (design)
            ↔ .ai/dependencies.md (graph)

test-coverage ↔ .ai/test-map.md (locations)
             ↔ .ai/functions.md (what to test)

journey-e2e ↔ .ai/e2e-map.md (journeys)
           ↔ .ai/api-contracts.md (endpoints)
```

---

## Team Adoption

### Phase 1: Introduction (Week 1)
- [ ] Team reads this skills-map
- [ ] Each dev picks one skill to master
- [ ] Create team Slack channel for skill questions

### Phase 2: Usage (Week 2-3)
- [ ] Apply skills to current work
- [ ] Share experiences (what works, what doesn't)
- [ ] Adjust skill usage based on feedback

### Phase 3: Standardization (Week 4+)
- [ ] Make skills part of standard process
- [ ] Code review checklist uses skills
- [ ] JIRA templates reference skills
- [ ] CI/CD integrations with skill outputs

---

## Troubleshooting

### "I'm using skill X but getting inconsistent results"

**Possible causes**:
1. Knowledge maps out of sync with code
   - Solution: Check actual source code for truth
2. Skill not designed for this use case
   - Solution: Try complementary skill
3. Missing context or information
   - Solution: Provide more details

### "Skills are giving me too much information"

**Solution**:
- Use focused skills one at a time
- Create shorter checklist (take only relevant items)
- Run skills sequentially, not all at once

### "I'm spending too much time on analysis"

**Solution**:
- Start with quick skill run (10 min)
- Focus on critical issues only
- Skip nice-to-haves initially
- Use skill progressively

### "Skills conflict with each other"

**Solution**:
- Different skills serve different purposes
- One might flag as issue, another as false positive
- Use human judgment to reconcile
- `/skill false-positive-detection` helps

---

## References

- **Knowledge Maps**: `.ai/` directory
- **Workspace Structure**: `.ai/architecture.md`
- **Services**: `.ai/services.md`
- **Functions**: `.ai/functions.md`
- **APIs**: `.ai/api-contracts.md`
- **Tests**: `.ai/test-map.md`
- **Journeys**: `.ai/e2e-map.md`
- **Workflows**: `.ai/workflows.md`
- **Dependencies**: `.ai/dependencies.md`

---

**Using the Skills System?**
- 👍 Working well? Tell the team!
- 🤔 Confusing? Which part?
- 💡 Improvement idea? File ticket!
- 🐛 Found false positive from skill? Report it!

**Start Here**: Pick one skill that matches your current task and try it.

**Question?** Reference this map, then read the specific skill documentation.

**Master Workflow**: development-plan → code-review → test-coverage → merge ✅

