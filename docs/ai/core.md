# AI Coding Guidelines (Mandatory)

These rules are **mandatory** for all AI-generated code in this repository. Treat them as compile-time constraints.

Stack: **Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui, Zod, Prisma, Clerk, OpenAI**.

---

## 1. General Rules

- **Must** generate TypeScript only. No `any`.
- **Must** prefer explicit, narrow types over inference when crossing boundaries.
- **Must not** introduce new libraries without explicit instruction.
- **Must not** modify unrelated files.
- **Avoid** clever abstractions. Prefer boring, explicit code.
- **Avoid** premature optimization.

---

## 2. Project Structure & Boundaries

- **Must** respect Next.js App Router conventions.
- **Must** keep server-only code in `app/**/server` or `lib/server`.
- **Must not** import server code into client components.
- **Must** isolate external services (OpenAI, Clerk, Prisma) behind adapter modules in `lib/`.
- **Must not** access environment variables outside server-only files.

---

## 3. React & Next.js

- **Must** default to Server Components.
- **Must** add `'use client'` only when strictly required.
- **Must not** fetch data in client components if it can be done on the server.
- **Must** colocate data fetching with the route or server action.
- **Avoid** prop drilling beyond 2 levels.
- **Avoid** global state unless explicitly required.

---

## 4. Server Actions & API Routes

- **Must** validate all inputs with Zod.
- **Must** define Zod schemas in a `schema.ts` file per feature.
- **Must** return typed, serializable data only.
- **Must not** throw raw errors to the client.
- **Must** map errors to controlled error shapes.

---

## 5. TypeScript

- **Must** enable strict typing patterns.
- **Must** use `unknown` instead of `any`.
- **Must** define explicit return types for public functions.
- **Must not** use non-null assertions (`!`).
- **Avoid** deeply nested conditional types.

---

## 6. Validation (Zod)

- **Must** validate all external input (API, forms, webhooks).
- **Must** reuse schemas between server actions and forms.
- **Must not** duplicate validation logic.
- **Avoid** optional fields unless truly optional.

---

## 7. Database (Prisma)

- **Must** access Prisma only through `lib/db` or feature repositories.
- **Must** type all query results.
- **Must** use transactions for multi-step writes.
- **Must not** leak Prisma models directly to the client.
- **Avoid** N+1 queries.

---

## 8. Authentication & Authorization (Clerk)

- **Must** enforce auth on the server.
- **Must** check authorization explicitly (not just authentication).
- **Must not** trust client-provided user identifiers.
- **Must** centralize auth helpers in `lib/auth`.

---

## 9. OpenAI Usage

- **Must** wrap OpenAI calls in a dedicated service module.
- **Must** define strict input/output schemas.
- **Must** handle rate limits and failures gracefully.
- **Must not** expose raw model responses to the client.
- **Avoid** dynamic prompt construction without schema enforcement.

---

## 10. Styling (Tailwind & shadcn/ui)

- **Must** use Tailwind utility classes.
- **Must** use shadcn components as the base UI layer.
- **Must not** inline styles.
- **Avoid** custom CSS unless unavoidable.
- **Avoid** duplicating component variants.

---

## 11. Error Handling & Logging

- **Must** fail loudly on the server, gracefully on the client.
- **Must** log structured errors on the server.
- **Must not** swallow errors.
- **Avoid** console logging in production client code.

---

## 12. Testing & Safety

- **Must** write code that is testable by default.
- **Must** separate pure logic from side effects.
- **Must not** hardcode secrets or IDs.
- **Avoid** time-based logic without clear abstraction.

---

## 13. Code Generation Checklist (Before Output)

- Types are explicit and correct
- Boundaries are respected
- Inputs validated
- Errors handled
- No unused code
- No TODOs left behind

**If a rule conflicts with a user instruction, ask for clarification before proceeding.**
