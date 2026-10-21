# 🔄 Skills Refresher & Update Mechanism

**Purpose**: How to use `/skill-update` to revalidate and refresh skills
**When to Use**: When workspace changes, knowledge maps updated, or skills need refresh

---

## What is Skill Refresh?

When you call `/skill-update`, the system should:

1. ✅ **Revalidate** all skill documentation against current workspace state
2. ✅ **Update** skills if knowledge maps changed
3. ✅ **Verify** examples still accurate
4. ✅ **Check** skill cross-references
5. ✅ **Ensure** consistency across all skills

---

## Skills to Revalidate

### Core Skills (Update if ANY of these change)

1. **development-plan**
   - Depends on: `.ai/functions.md`, `.ai/api-contracts.md`, `.ai/test-map.md`, `.ai/e2e-map.md`
   - Check: Are examples still accurate?
   - Verify: Knowledge map references valid?

2. **code-review**
   - Depends on: `.ai/services.md` patterns, `.ai/dependencies.md`
   - Check: SOLID principles still applicable?
   - Verify: Security checks still comprehensive?

3. **code-smell-detection**
   - Self-contained skill
   - Check: Are 15 smells still relevant?
   - Verify: Examples accurate?

4. **anti-pattern-detection**
   - Depends on: `.ai/architecture.md`, `.ai/dependencies.md`
   - Check: Are examples still problematic?
   - Verify: Service relationships accurate?

5. **bug-issue-analysis**
   - Self-contained skill
   - Check: Root cause patterns still accurate?
   - Verify: Examples relevant?

6. **test-coverage-analysis**
   - Depends on: `.ai/test-map.md`
   - Check: Test file locations accurate?
   - Verify: Coverage targets still valid?

7. **journey-e2e-mapping**
   - Depends on: `.ai/e2e-map.md`, `.ai/api-contracts.md`
   - Check: Are documented journeys accurate?
   - Verify: E2E test file locations valid?
   - Update: Add new journeys if created

8. **false-positive-detection**
   - Self-contained skill
   - Check: False positive categories still relevant?
   - Verify: Prevention strategies current?

9. **refactoring-strategy**
   - Self-contained skill
   - Check: Refactoring types still applicable?
   - Verify: Examples relevant?

10. **skills-map**
    - Depends on: All other skills
    - Check: Is skill matrix accurate?
    - Update: If any skill changed
    - Verify: Workflow sequences still valid?

---

## When to Run Skill Refresh

### Auto-Trigger Events

Automatically run `/skill-update` when:

1. **Any .ai/ file is updated**
   - Example: development-plan, journey-e2e-mapping
   - Action: Revalidate affected skills

2. **New service added to monorepo**
   - Check: Do examples cover new service?
   - Update: Add new service patterns?

3. **New API endpoint added**
   - Check: Is endpoint in api-contracts.md?
   - Update: journey-e2e-mapping affected?

4. **Test coverage significantly changes**
   - Check: test-coverage-analysis still accurate?
   - Update: knowledge maps need refresh?

5. **Major refactoring completed**
   - Check: All skill examples still accurate?
   - Update: Any patterns changed?

### Manual Trigger Events

Run manually when:

1. **Skill seems outdated**
   - Example: A skill example produces different result
   - Action: Run `/skill-update` to refresh

2. **Knowledge maps updated**
   - Example: `.ai/functions.md` revised
   - Action: Update dependent skills

3. **Team requests refresh**
   - Example: "Skills are giving inconsistent advice"
   - Action: Run `/skill-update` for diagnosis

4. **Regular maintenance**
   - When: Monthly or quarterly
   - Action: Ensure all skills current

---

## How to Run Skill Refresh

### Command Syntax

```bash
# Refresh all skills
/skill-update

# Refresh specific skill
/skill-update development-plan

# Refresh specific skill group
/skill-update core        # All core skills
/skill-update quality     # All quality skills
/skill-update testing     # All testing skills

# Refresh with verbose output
/skill-update --verbose

# Refresh and generate report
/skill-update --report skills-refresh-report.md
```

### What Happens During Refresh

```
1. VALIDATION PHASE
   ├─ Check skill file syntax
   ├─ Validate references to .ai/ files
   ├─ Verify examples executable
   └─ Check for broken links

2. KNOWLEDGE MAP SYNC
   ├─ Compare skill examples with actual code
   ├─ Verify function references valid
   ├─ Confirm API endpoints exist
   ├─ Validate test file locations
   └─ Check E2E journeys documented

3. CONSISTENCY CHECK
   ├─ Cross-skill references valid?
   ├─ Workflow sequences still accurate?
   ├─ Skill matrix up-to-date?
   └─ Integration points synchronized?

4. OUTPUT GENERATION
   ├─ Update skill documentation if needed
   ├─ Regenerate skill matrix
   ├─ Update cross-references
   └─ Generate refresh report
```

---

## Skill Refresh Report

After running `/skill-update`, you get a report:

```
SKILL REFRESH REPORT
Generated: 2026-10-08 14:30:00

VALIDATION RESULTS
├─ Total Skills: 9
├─ ✅ Valid: 8
├─ ⚠️  Needs Update: 1 (test-coverage-analysis)
└─ ❌ Broken: 0

KNOWLEDGE MAP SYNC
├─ .ai/functions.md: ✅ In sync
├─ .ai/api-contracts.md: ✅ In sync
├─ .ai/test-map.md: ⚠️ CHANGED - 3 new test files
├─ .ai/e2e-map.md: ✅ In sync
├─ .ai/workflows.md: ✅ In sync
├─ .ai/services.md: ✅ In sync
├─ .ai/dependencies.md: ✅ In sync
└─ .ai/architecture.md: ✅ In sync

SKILLS NEEDING UPDATE

⚠️ test-coverage-analysis
   └─ Reason: .ai/test-map.md changed
   └─ Action: Update test file locations
   └─ Impact: Medium
   └─ Time: ~15 min to fix

CONSISTENCY CHECK
├─ development-plan → code-review: ✅ Valid
├─ code-review → code-smell: ✅ Valid
├─ code-smell → refactoring: ✅ Valid
├─ test-coverage → journey-e2e: ✅ Valid
└─ All cross-references: ✅ Valid

WORKFLOW SEQUENCES
├─ Feature Implementation: ✅ Current
├─ Bug Fix: ✅ Current
├─ Code Review: ✅ Current
└─ Refactoring: ✅ Current

SUMMARY
├─ Skills Updated: 0
├─ Skills Modified: 1
├─ Skills Valid: 8
├─ Documentation Issues: 0
└─ Status: ⚠️ NEEDS UPDATE

RECOMMENDATIONS
1. Update test-coverage-analysis with new test file locations
2. Re-run /skill-update to verify
3. All other skills current and ready to use
```

---

## After Skill Update

### If All Skills Valid ✅

```
EXCELLENT! All skills are current and accurate.

Next Steps:
1. Continue using skills on current work
2. Skills are fresh and up-to-date
3. Schedule next refresh: 1 month from now
```

### If Some Skills Need Update ⚠️

```
MINOR UPDATES NEEDED

Skills to Update:
1. test-coverage-analysis
   └─ File: .claude/skills/test-coverage-analysis/SKILL.md
   └─ Changes: Update test file paths to reflect new tests
   └─ Time: 15 min

2. journey-e2e-mapping
   └─ File: .claude/skills/journey-e2e-mapping/SKILL.md
   └─ Changes: Add new journey documentation
   └─ Time: 20 min

Next Steps:
1. AI will propose updates
2. Review proposed changes
3. Apply updates
4. Re-run /skill-update --verify
```

### If Skills Are Broken ❌

```
CRITICAL UPDATES NEEDED

Skills with Issues:
1. development-plan
   └─ Issue: .ai/functions.md references invalid
   └─ Cause: Functions refactored, names changed
   └─ Action: Update function references
   └─ Time: 30 min

2. anti-pattern-detection
   └─ Issue: Service architecture changed
   └─ Cause: New circular dependency detected
   └─ Action: Update architecture examples
   └─ Time: 20 min

Recovery Steps:
1. Run: /skill-update --diagnose
2. AI provides detailed repair steps
3. Apply fixes one by one
4. Verify: /skill-update --verify-all
```

---

## Skill Refresh Schedule

### Recommended Schedule

```
MONTHLY (Lightweight Check)
  └─ Run: /skill-update --quick
  └─ Time: 5 minutes
  └─ Focus: Obvious issues only
  └─ When: First Friday of month

QUARTERLY (Full Refresh)
  └─ Run: /skill-update --full
  └─ Time: 30-45 minutes
  └─ Focus: Complete validation and sync
  └─ When: Beginning of each quarter

AS-NEEDED (Event-Triggered)
  └─ Run: When specific changes made
  └─ Examples:
     - New service added → refresh immediately
     - Major refactoring → refresh after
     - .ai/ files changed → refresh immediately
```

---

## Skill Refresh Triggers (Automated)

System should automatically detect and trigger refresh when:

```
File System Events:

1. .ai/ directory changes
   └─ .ai/functions.md updated → refresh development-plan, anti-pattern
   └─ .ai/e2e-map.md updated → refresh journey-e2e-mapping
   └─ .ai/test-map.md updated → refresh test-coverage-analysis
   └─ .ai/api-contracts.md updated → refresh development-plan
   └─ .ai/workflows.md updated → refresh bug-issue-analysis
   └─ .ai/dependencies.md updated → refresh anti-pattern
   └─ .ai/architecture.md updated → refresh anti-pattern
   └─ .ai/services.md updated → refresh development-plan

2. Skills directory changes
   └─ Any skill file modified → validate syntax
   └─ Cross-references changed → sync all skills

3. Major code changes
   └─ New service added → check examples
   └─ Service removed → verify still accurate
   └─ API endpoint removed → verify contracts
   └─ Test structure changed → update test-map references

4. Time-based
   └─ Monthly check (automatic lightweight refresh)
   └─ Quarterly full refresh (automatic)
```

---

## Skill Version Tracking

Each skill should track version and last refresh:

```yaml
# Example: development-plan/SKILL.md header
---
name: development-plan
version: 2.1
last_refreshed: 2026-10-08 14:30:00
last_updated_by: skill-update-system
knowledge_maps:
  - .ai/functions.md (v1.2)
  - .ai/api-contracts.md (v1.0)
  - .ai/test-map.md (v1.1)
  - .ai/e2e-map.md (v1.0)
  - .ai/workflows.md (v1.0)
examples_verified: true
documentation_complete: true
---
```

---

## Troubleshooting Skill Refresh

### "Skill refresh says something is broken but I don't see the issue"

**Steps to diagnose**:
1. Run: `/skill-update --diagnose [skill-name]`
2. Get detailed error report
3. Review actual vs expected state
4. Verify knowledge maps haven't changed
5. Fix specific issue identified

### "Skill refresh is taking too long"

**Optimization**:
```bash
# Quick check only (5 min)
/skill-update --quick

# Check specific skill only (2 min)
/skill-update [skill-name]

# Check specific category (10 min)
/skill-update quality
```

### "After refresh, skill still gives different results"

**Possible causes**:
1. Knowledge map still out of sync
   - Run: `/skill-update --full` again
2. External tool/linter changed behavior
   - Review tool configuration
3. Workspace state ambiguous
   - Verify against actual source code
4. Skill refresh incomplete
   - Run: `/skill-update --verify-all`

### "I get false positives even after refresh"

**Solution**:
1. Run: `/skill false-positive-detection`
2. Verify if real issue or false alarm
3. If false positive, document in skill
4. Configure tool rules to avoid in future

---

## Maintaining Skills Long-Term

### Best Practices

1. **Regular Refresh Schedule**
   - Monthly lightweight check
   - Quarterly full validation
   - Event-triggered as needed

2. **Monitor Skill Usage**
   - Track which skills used most
   - Gather user feedback
   - Refine based on experience

3. **Keep Knowledge Maps Current**
   - Update .ai/ files when code changes
   - Trigger skill refresh after
   - Maintain single source of truth

4. **Version Control**
   - Track skill versions
   - Document changes
   - Maintain changelog

5. **Team Communication**
   - Announce skill updates
   - Explain what changed
   - Gather feedback for next refresh

---

## Command Reference

```bash
# Basic refresh
/skill-update

# Refresh specific skill
/skill-update development-plan
/skill-update code-review
/skill-update code-smell-detection

# Quick check (5 min)
/skill-update --quick

# Full validation (45 min)
/skill-update --full

# Diagnose issues
/skill-update --diagnose

# Verify after fixes
/skill-update --verify-all

# Generate report
/skill-update --report filename.md

# Verbose output
/skill-update --verbose

# Show what would change (dry-run)
/skill-update --dry-run

# Auto-apply fixes
/skill-update --auto-fix

# Monitor skill health over time
/skill-update --health-check

# Compare current vs latest version
/skill-update --diff
```

---

## Integration with CI/CD

Skills refresh should integrate with your CI/CD:

```yaml
# Example: .drone.yml or similar

trigger:
  event:
    - pull_request
    - push

pipeline:
  # Skill validation stage
  validate-skills:
    image: node
    commands:
      - /skill-update --verify-all
      - /skill-update --report skills-check.md
    on_failure: fail

  # If skills need update, generate diff
  skill-diff:
    image: node
    commands:
      - /skill-update --diff
    when:
      status: failure

  # Your normal tests follow
  test:
    image: node
    commands:
      - npm run test
```

---

## Summary

**Skills Refresher Mechanism**:
- ✅ Validates all skills against workspace state
- ✅ Syncs with knowledge maps (.ai/ documentation)
- ✅ Detects broken references and examples
- ✅ Generates detailed reports
- ✅ Proposes fixes automatically
- ✅ Scheduled and event-triggered
- ✅ Integrated with CI/CD
- ✅ Long-term maintainability built-in

**Start using**: `/skill-update` monthly or after major changes

---

**Next Steps**:
1. ✅ All 9 skills created and documented
2. ✅ Skill refresh mechanism defined
3. ✅ Ready to use on real work
4. ✅ First refresh: Run after this sprint

Run `/skill-update` now to verify all skills are valid! ✨

