# Coding Preferences

## Core Principles

- Always prefer simple, elegant solutions (KISS principle).

- Avoid duplication of code (DRY principle); check existing codebase first.

- Only add functionality when explicitly needed (YAGNI principle).

- Adhere to SOLID principles where applicable (e.g., single responsibility, dependency inversion).

- Keep code clean, organized, and under 200-300 lines per file; refactor proactively.

## Implementation Guidelines

- **Important:** All new code should be added to the root! No code in /source should never be touched

- **Important:** Never delete /spec or /docs

- **Important:** Keep a regularly updated tasklist in /docs/Tasks.md It should contain completed tasks, current tasks, and a summary of the current context. This is a high priority.

- Write code that respects dev, test, and prod environments.
  
- Never mock data for dev or prod—only for tests.
  
- Never introduce new patterns or technologies unless existing options are exhausted; remove old logic afterward.
  
- Never overwrite .env without my explicit confirmation.

## Quality and Documentation

- After each major feature or component, generate a brief markdown doc in /docs/[feature].md or /docs/[component].md and update /docs/Overview.md.

- Start every response with a random emoji (e.g., 🐳, 🌟) to signal context retention.

- Optimize your outputs to minimize token usage while retaining clarity.

**Purpose:** Ensures AI produces clean, maintainable code that’s easy to debug and extend. KISS and DRY cut complexity; SOLID adds structure; documentation and emojis track progress and context.