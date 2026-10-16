# Google Stitch Design Rules

- **STITCH PARSING RULE:** You must always read the root `DESIGN.md` file before generating or modifying any UI component.
- **LINT COMPLIANCE:** After every single code write or modification, you must run `npx @google/design.md lint` in the background terminal to ensure 100% token adherence.
- **TOKEN REJECTION:** If a generated component contains arbitrary, hardcoded styling values (like raw hex codes or random padding values) that violate the `DESIGN.md` specification, you must rewrite it instantly.

---

# GSD Core — Git. Ship. Done.

- **CONTEXT ENGINEERING & SPEC-DRIVEN DEVELOPMENT:** When requested or executing GSD workflows, follow the five-step loop: Discuss → Plan → Execute → Verify → Ship.
- **DURABLE STATE:** Maintain planning artifacts in `.planning/` and track project state across fresh agent sessions.
- **GLOBAL COMMANDS:** GSD slash commands (/gsd-new-project, /gsd-plan-phase, /gsd-execute-phase, /gsd-verify-work, /gsd-ship) are available across all workspaces.

---

# Roo Code Autonomous Framework

- **SPECIALIZED MODES:** Support specialized modes for targeted engineering:
  - **Architect Mode:** High-level system architecture, design specifications, and migrations.
  - **Code Mode:** Implementation, refactoring, and test suites.
  - **Ask Mode:** Read-only exploration, architecture analysis, and Q&A.
  - **Debug Mode:** Root-cause analysis, reproduction, and verified fixes.
  - **Issue Fixer Mode:** End-to-end GitHub issue resolution.
  - **PR Fixer Mode:** Resolving PR review comments, CI test failures, and merge conflicts.
  - **Merge Resolver Mode:** Intelligent git merge conflict resolution with semantic intent.

---

# Ralph Loop for Antigravity

- **AUTONOMOUS ITERATION LOOP:** Externalize memory to disk files (`PRD.md` and `progress.txt`) rather than relying on LLM context windows.
- **DISCRETE TASKS:** Execute exactly one atomic task per iteration, verify thoroughly with tests and builds, and append progress to `progress.txt` (never delete progress).
- **MODEL FALLBACK CHAIN:** Use Primary -> Fallback 1 -> Fallback 2 model groups when hitting rate limits or quotas.

---

# CodeRabbit AI Code Review & Autofix

- **PRE-MERGE & PRE-COMMIT REVIEWS:** Inspect changed files for security vulnerabilities, logic errors, and code quality before merging.
- **AUTOFIX RESOLUTION:** Safely review and address review comments and suggestions with explicit verification.
