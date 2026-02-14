# Our Workflow
1.  **Read & Plan:** Review this file to identify the next task and form a plan. For tasks with sub-points, the main task is considered complete only when all its sub-points have been addressed.
2.  **Discuss & Ask:** Explain the plan and ask for approval.
3.  **Implement:** Upon approval, execute the task.
4.  **Validate:** Run a build (`npm run build`) and/or tests to ensure changes work correctly and **all errors are resolved**.
5.  **Update:** Mark the task complete in this file and `README.md` using the format `✅ [x]`.
6.  **Commit:** Stage and commit the changes locally with a clear message.
7.  **Guide Push:** Provide instructions for publishing to GitHub as needed.

---

# BrainPlot — Layered Development Roadmap

## Phase 1: Foundational Setup (Tasks 1-3 & Audit)
✅ [x] **Task #1: Project Scaffolding — React + Vite PWA Boilerplate**
✅ [x] **Task #2: Database & Storage — sql.js + OPFS**
✅ [x] **Task #3: Universal Systems — Theming & Navigation**
✅ [x] **Audit 1: Foundational Setup Review**

## Phase 2: Page Scaffolding — The Matryoshka Layers (Tasks 4-10 & Audit)

✅ [x] **Task #4: Level 0 Page — The Landing Page (Project Manager)**
  - Center "BrainPlot" title with secondary color glow effect.
  - Standardized "Create", "Load", and "Import" buttons with uniform sizing and centering.
  - Implement "Create Project" modal with "no spaces" name validation and 3/5 Act toggle.
  - Add Export and Import functionality for project files (.brainplot).

✅ [x] **Task #5: Level 1 Page — The Main Board (Part A - Scaffold)**
  - Implement the primary tab bar with contextual visibility (hides active tab).
  - Scaffold "Characters" and "Script" tabs.

✅ [x] **Task #6: Level 1 Page — The Main Board (Part B - Refined Timeline)**
  - Header: Large 6rem centered title, left-aligned folder tabs, top-right Gear icon (centered).
  - Acts: Individually resizable cells, min-size locked to default (1/n or 1/3), V-Width % <-> H-Height % translation.
  - Interaction: Smart FAB (adds to viewport-centered act), continuous auto-panning near edges, safety prompts.
  - Persistence: Full SQLite sync for all structural changes.

✅ [x] **Task #7: The Scene Card — Full Lifecycle Implementation**
  - ✅ **1. Creation Flow**: Red FAB (+) opens the Universal Modal in "Create Mode" (pre-placement).
  - ✅ **2. Detail View (Level 2)**: Universal 85% centered modal with Read-Only/Edit states. Metadata: Title, Location, Time, Cast List placeholder.
  - ✅ **3. Card Face (Level 1)**: 16:9 layout, hero image area, and metadata indicators. Fit-to-cell scaling.
  - ✅ **4. Placement & Saving**: "Apply" action saves the scene to SQLite and renders it on the board.
  - ✅ [x] **5. Re-arrangement**: Drag-and-drop reordering within an act and movement between different acts.
  - ✅ [x] **6. Entry Protocol**: Double-tap/click card or snapshot to enter Level 3 Inspiration Board.

- [ ] **Task #8: Level 3 — Scene Inspiration Board (Full-Screen Workspace)**
  - Free-position canvas for Character/Event/Sticky Note/Image cards, zoom, drag-to-place, add card dropdown, drag-and-drop image upload, board state snapshot on save.

- [ ] **Task #9: Level 3.5 — Scripting Dock (Sidebar)**
  - Tab trigger on middle-left, expands to 50% width, chronological Action/Dialogue cards, vertical scroll, add toggle (Action/Dialogue), drag-and-drop reordering with reactive gap.

- [ ] **Task #10: Level 4 — Script Element Detail (Action/Dialogue Modal)**
  - Same universal detail view pattern, metadata + script document snapshot preview, double-tap snapshot to enter Script Editor.

- [ ] **Task #11: Level 5 — Script Editor (Full-Screen Screenplay Editor)**
  - 12pt Courier Prime distraction-free editor, industry-standard margins (1.25" L/R), character names uppercase centered at 3.7", parentheticals at 3.1", dialogue blocks 3.5" wide centered.

- [ ] **Audit 2: Page Scaffolding Review**

## Phase 3: Card System Implementation (Tasks 12-17)
- [ ] **Task #12: Card Anatomy — Remaining Types**
  - Character Card (ID badge grid), Event Card, Dialogue Card, Action Card, Image Card, Sticky Note Card.
- [ ] **Task #13: Global Libraries — Character Library + Scripting Library**
  - Characters tab (sorted by first appearance, static traits only, global delete), Script tab (chronological feed of all Actions/Dialogues, read-only, global delete).
- [ ] **Task #14: Name Sync & Deletion Safeguards**
  - SQL triggers for character name propagation, confirmation prompts for global deletes.
- [ ] **Task #15: Auto-Save System**
  - Circle-X triggers auto-commit to SQLite, debounced saves during editing.
- [ ] **Task #16: Export & Print Engine**
  - PDF, .fadein, and .fdx formats. Modes: Rough Script, Only Dialogue, Only Actions.
- [ ] **Task #17: PWA Finalization**
  - Final icons, service worker tuning, Lighthouse audit pass.
