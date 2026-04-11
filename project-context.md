# Project Context for LLMs

This document provides a detailed summary of the RESQ-LINK project to allow other AI models to understand the codebase context quickly.

## Architecture
The project follows a modular "AI-Agent" architecture. 

1. **Service Layer (`src/services/mappls.ts`)**: Pure functions that interact with Mappls REST APIs.
2. **Tool Layer (`src/ai/tools/mappls-tools.ts`)**: Genkit tool wrappers around services, providing schema definitions so the LLM knows how to use them.
3. **Flow Layer (`src/ai/flows/`)**: Orchestrates multiple tool calls. 
    - `ai-driven-dispatch-status-flow`: A multi-step agent that verifies address, finds units, evaluates travel times, and assigns the best responder.
4. **UI Layer (`src/components/`)**: React components using ShadCN and Tailwind. Designed for a 375px wide mobile viewport.

## Design Language
- **Colors**: Deep dark background (`#0d0d0d`), vibrant red primary (`#ff2d2d`), and amber accent (`#f59e0b`).
- **Feel**: "Command & Control" aesthetic. Uses glassmorphism (`glass-card`), grain overlays, and heavy uppercase typography (`Bebas Neue`).

## Integration Points
- **SOS Activation**: Requires a 3-second hold to prevent accidental triggers.
- **Reporting**: Features an "AI Classification" button that uses Genkit to suggest categories based on text input.
- **Directory**: Pulls from `src/lib/placeholder-images.json` for consistent visual assets.

## Handover Instructions
When modifying this project:
1. Ensure all new AI logic is registered as a Genkit Tool or Flow.
2. Maintain the mobile-first constraint (375px max width in `layout.tsx`).
3. Use the `font-headline` class for all uppercase titles.
