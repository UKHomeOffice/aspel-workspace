# ASPeL AI Workspace Knowledge Maps

This directory contains workspace-specific documentation designed for AI-assisted development.

**Important**: These are reference maps, not specifications. Always verify against source code and tests.

## Files

- **architecture.md** — System overview, services, how they connect
- **services.md** — Details about each service, tech stack, ownership
- **functions.md** — Function registry with traceability (manual, partially auto-generated)
- **api-contracts.md** — REST API endpoints, request/response schemas
- **test-map.md** — Test registry and coverage mapping
- **e2e-map.md** — End-to-end journeys, user flows, test files
- **workflows.md** — Key business workflows and state transitions
- **dependencies.md** — Service dependencies and event contracts
- **fragile-areas.md** — Known problem zones and legacy patterns (when created)

## How to Use

See `.claude/skills/development-plan/SKILL.md` for detailed guidance.

TL;DR:
1. Read the maps to understand relationships
2. Verify against actual source code
3. Run tests to confirm understanding
4. Update maps if you find them out of sync

## Updating These Maps

These documents should be kept reasonably current:

- After significant refactoring, update relevant maps
- When adding new services or major functions, add to registry
- When API contracts change, update immediately
- When adding new E2E journeys, add to e2e-map.md
- When creating new tests, cross-reference in test-map.md

Some of this could eventually be auto-generated from source code analysis (AST, imports, test discovery). For now, maintain manually.

