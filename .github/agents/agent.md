# Agent Instructions

This file provides guidance for any custom agents defined in this repository.

## General rules

- Code should be maintainable, readable, and efficient.
- Always asssume the server is already running.

## React & React Native rules

When generating or editing React or React Native code, adhere to the following guidelines:

- Prefer functional components over class components.
- Use custom hooks to encapsulate reusable logic.
- Prefer utilizing Zustand over React Context for managing global state.
- Ensure all components are properly typed with TypeScript.
- Follow best practices for component structure, state management, and side effects.
- Maintain a clean and organized file structure for components, hooks, and utilities.
- Write clear and concise comments to explain complex logic.
- Ensure proper error handling and loading states in components that fetch data.
- Optimize performance by using memoization techniques (e.g., React.memo, useMemo, useCallback) where appropriate.
