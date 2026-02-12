# Our Workflow
1.  **Read & Plan:** Review this file to identify the next task and form a plan. For tasks with sub-points, the main task is considered complete only when all its sub-points have been addressed.
2.  **Discuss & Ask:** Explain the plan and ask for approval.
3.  **Implement:** Upon approval, execute the task.
4.  **Validate:** Run a build (`npm run build`) and/or tests to ensure changes work correctly.
5.  **Update:** Mark the task complete in this file and `README.md` using the format `✅ [x]`.
6.  **Commit:** Stage and commit the changes locally with a clear message.
7.  **Guide Push:** Provide instructions for publishing to GitHub as needed.

---

# BrainPlot — Layered Development Roadmap

This file outlines the project tasks in a sequential, layer-by-layer progression. We will build the foundational UI structure first, then implement the specific card types, and finally integrate global features.

## Phase 1: Foundational Setup (Tasks 1-3 & Audit)
*Core project scaffolding, database, and universal systems.*

- [x] **Task #1: Project Scaffolding — React + Vite PWA Boilerplate**
  - Set up `package.json`, Vite config, TypeScript, ESLint, and basic directory structure.
  - Create `index.html` with HashRouter, Courier Prime fonts, and Noir CSS variables.
  - Implement basic PWA manifest and COOP/COEP headers.

- [ ] **Task #2: Database & Storage — sql.js + OPFS**
  - Integrate sql.js WASM and initialize the OPFS persistence layer.
  - Define and implement the full SQLite database schema.
  - Set up SQL triggers for automated data synchronization (e.g., character names).

- [ ] **Task #3: Universal Systems — Theming & Navigation**
  - Build the theme context/provider for dark/light mode switching.
  - Implement universal navigation controls: Circle-X (exit), Gear icon (edit), and the double-tap entry protocol.

- [ ] **Audit 1: Foundational Setup Review**
  - Run `npm run preview` to verify that the project scaffolds correctly, basic theming is applied, and the universal navigation elements are present and function as expected.

## Phase 2: Page Scaffolding — The Matryoshka Layers (Tasks 4-10 & Audit)
*Build the primary UI container for each level of the application hierarchy.*

- [ ] **Task #4: Level 0 Page — The Landing Page (Project Manager)**
  - Create the main view for listing, creating, loading, exporting, and deleting projects from the OPFS database.

- [ ] **Task #5: Level 1 Page — The Main Board & Global Libraries**
  - Implement the primary tab bar: "Main Board" | "Characters" | "Script".
  - Scaffold the "Main Board" as a container for the future scene timeline.
  - Scaffold the "Characters" and "Script" tabs as containers for their respective global libraries.

- [ ] **Task #6: Level 2 Page — The Detail View (Universal Modal)**
  - Develop the universal 85% viewport, centered modal for detail views.
  - Implement the read-only state, gear-icon toggle for edit mode, and placeholder spots for metadata and a snapshot preview.

- [ ] **Task #7: Level 3 Page — The Scene Inspiration Board**
  - Create the full-screen workspace canvas for free-positioning cards.
  - Implement basic zoom and placeholder for the "add card" dropdown.

- [ ] **Task #8: Level 3.5 Page — The Scripting Dock (Sidebar)**
  - Implement the slide-out sidebar container, triggered by a tab on the middle-left of the screen.
  - Scaffold the container for future chronological Action/Dialogue cards.

- [ ] **Task #9: Level 4 Page — The Script Element Detail**
  - Re-use the universal modal pattern (Task #6) to serve as the detail view for script elements.

- [ ] **Task #10: Level 5 Page — The Script Editor**
  - Create the full-screen, distraction-free text editor environment.
  - Apply the specified Courier Prime font and industry-standard margins.

- [ ] **Audit 2: Page Scaffolding Review**
  - Run `npm run preview` to verify that all layered pages and their primary UI containers are correctly structured, navigable, and adhere to the visual specifications.

## Phase 3: Card System Implementation (Tasks 11-17 & Audit)
*Develop the specific anatomy and functionality for each card type.*

- [ ] **Task #11: Scene Card**
  - Implement the card's face (title, image, metadata) and its detail view content.

- [ ] **Task #12: Character Card**
  - Implement the "ID Badge" face (static/dynamic traits) and its detail view content.

- [ ] **Task #13: Event Card**
  - Implement the card's face (title, image) and its detail view content.

- [ ] **Task #14: Dialogue Card**
  - Implement the card's face (character portraits) and its detail view, linking to the Script Editor.

- [ ] **Task #15: Action Card**
  - Implement the card's face (themed color, script text) and its detail view, linking to the Script Editor.

- [ ] **Task #16: Image Card**
  - Implement the borderless image card face and its simple detail view.

- [ ] **Task #17: Sticky Note Card**
  - Implement the sticky note appearance and its text-editing detail view.

- [ ] **Audit 3: Card System Review**
  - Run `npm run preview` to verify that all card types are correctly implemented, display accurately on their respective pages, and their detail views function as expected.

## Phase 4: Feature Integration & Finalization (Tasks 18-21 & Audit)
*Connect the systems and add remaining high-level features.*

- [ ] **Task #18: Name Sync & Deletion Safeguards**
  - Implement and test the SQL triggers for character name propagation.
  - Add confirmation prompts for all global delete actions.

- [ ] **Task #19: Auto-Save System**
  - Connect the auto-save logic to the Circle-X button and card creation events.

- [ ] **Task #20: Export & Print Engine**
  - Add the floating printer icon to the Scripting Library.
  - Build the client-side export functionality for PDF, .fadein, and .fdx formats.

- [ ] **Task #21: PWA Finalization**
  - Add final PWA icons, tune the service worker, and run a Lighthouse audit.

- [ ] **Audit 4: Feature Integration & PWA Review**
  - Run `npm run preview` to perform a comprehensive review of all integrated features, ensuring data integrity, export functionality, and PWA readiness.

## Phase 5: Polish & Future (Tasks 22-23)
*Post-MVP enhancements.*

- [ ] **Task #22: Additional Theme Palettes**
  - Design and implement the 11 remaining genre-specific color themes.

- [ ] **Task #23: Auth, Cloud Sync & Monetization (Phase 7+)**
  - Plan for future implementation of Cloudflare Workers, D1 sync, and Stripe.
