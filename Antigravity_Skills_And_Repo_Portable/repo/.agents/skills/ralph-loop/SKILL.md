---
name: ralph-loop
description: >-
  Autonomous iterative coding agent loop for Antigravity. Externalizes state to PRD.md and
  progress.txt, executing discrete tasks in fresh iterations until completion or test passes.
---

# Ralph Loop for Antigravity

Autonomous iterative execution loop based on the Ralph Wiggum / Ralph Loop methodology.

## Philosophy
1. **Durable State Beats Memory**: Do not rely on LLM context windows to remember long multi-step project state. Externalize state to disk (`PRD.md`, `progress.txt`).
2. **One Task Per Iteration**: Focus 100% of reasoning on a single atomic unit of work.
3. **Verify Before Progress**: Run linters, compilers, and test suites before writing progress.
4. **Append-Only Progress**: Never delete previous progress entries in `progress.txt`.

## The Loop Workflow

Each iteration executes this exact sequence:

```
1. Read PRD.md (or task spec) to identify pending requirements.
2. Read progress.txt to understand completed milestones and recent context.
3. Select the next uncompleted task.
4. Execute the implementation.
5. Verify changes (run build, test suites, and linters).
6. Append results and timestamped notes to progress.txt.
7. If pending tasks remain, proceed to the next task in the loop.
```

## Task File Templates

### PRD.md (Specification)
```markdown
# Project Requirements Document

## Milestone 1: Core Foundation
- [ ] Task 1.1: Initialize schema and migrations
- [ ] Task 1.2: Implement authentication endpoints
- [ ] Task 1.3: Add integration tests
```

### progress.txt (Execution Log)
```
[2026-09-20T22:00:00Z] Completed Task 1.1: Initialized schema and migrations. Tests passed.
[2026-09-20T22:15:00Z] Completed Task 1.2: Implemented authentication endpoints. 4 tests passing.
```
