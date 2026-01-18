# Base AI Guidelines (Mandatory)

This document defines **non-negotiable rules** that apply to **all AI agents** operating in this repository.

It establishes project intent, architectural boundaries, and cross-cutting principles. Role- or layer-specific rules live elsewhere.

If a rule here is violated, the output is considered **incorrect**, even if it works.

---

## 1. Project Intent

- This repository is a **product application**.
- Primary goals (in order):
  1. **Maintainability**
  2. **Correctness & safety**

- Backward compatibility is **not a constraint**. Breaking refactors are allowed when they improve quality.

AI agents are expected to **improve the codebase over time**, not merely extend it.

---

## 2. Architectural Boundaries

- Architecture is a **guiding constraint**, not a suggestion.
- Boundaries **must be respected by default**.
- Exceptions are allowed **only when clearly justified** in code structure.

### Core Boundary Rules

- **Must** keep concerns separated (UI, business logic, infrastructure).
- **Must not** mix side effects with pure logic.
- **Must** isolate external systems behind adapters or service modules.
- **Must not** allow infrastructure details to leak into UI code.

### Project Structure

- Feature-based organization is preferred.
- Files that change together **must** live together.
- Cross-feature coupling **must be minimized**.

---

## 3. Coding Philosophy

- Prefer **explicit, boring, readable code**.
- Optimize for the **next engineer**, not cleverness.
- Code should be easy to delete, refactor, or replace.

### Mandatory Rules

- **Must** choose clarity over abstraction.
- **Must not** introduce indirection without clear benefit.
- **Must** make important decisions visible in code structure.
- **Avoid** over-generalization.
- **Avoid** speculative flexibility.

---

## 4. AI Agent Behavior

- Default behavior:
  - Improve code quality while making changes.
  - Prefer **small, safe diffs**, but allow larger refactors when quality clearly improves.

- When requirements are ambiguous:
  - **Must** ask clarifying questions before implementing.
  - **Must not** guess business logic.

- AI agents **must not** silently change behavior outside the requested scope.

---

## 5. Error Handling Strategy

- Errors are **part of the product experience**, not just failures.

### Rules

- **Must** use `try/catch` when interacting with:
  - external systems
  - I/O
  - network calls
  - persistence layers

- **Must** return structured, intentional error data to the frontend when user-facing feedback is required.

- **Must not** expose raw errors, stack traces, or internal details to the client.

- **Must** fail loudly on the server and predictably at boundaries.

- **Avoid** swallowing errors or logging without handling.

---

## 6. Testing & Testability

- Code **must be testable by design**, even if tests are not written.

### Rules

- **Must** separate pure logic from side effects.
- **Must** write functions with deterministic inputs and outputs where possible.
- **Must not** entangle business rules with framework glue code.
- **Avoid** hidden state and time-based coupling.

---

## 7. Readability & Maintainability

- Code is read far more often than it is written.

### Rules

- **Must** favor self-explanatory code over comments.
- **Must** name variables, functions, and files precisely.
- **Must not** rely on comments to explain confusing code.
- **Avoid** large files with multiple responsibilities.
- **Avoid** deep nesting and long functions.

---

## 8. Change Discipline

- Every change should make the system:
  - easier to reason about
  - safer to modify
  - harder to misuse

### Rules

- **Must not** introduce TODOs, stubs, or placeholders.
- **Must** remove dead code encountered during changes.
- **Must not** degrade overall code quality to ship faster.

---

## 9. Enforcement

- These rules override convenience.
- If a user instruction conflicts with this document, the AI agent **must ask for clarification**.
- Violations are considered defects, regardless of functionality.

---

**This document is intentionally strict.**

It exists to ensure that all AI-generated code moves the system toward long-term correctness, clarity, and maintainability.
