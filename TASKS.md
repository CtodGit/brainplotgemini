# BrainPlot — Task Breakdown

19 tasks progressing from foundation to feature-complete PWA.

## Phase 1: Foundation (Tasks 1-4)

- [x] **Task #1: Project Scaffolding — React + Vite PWA Boilerplate**
  Package.json, Vite config, TypeScript configs, ESLint, index.html, HashRouter, Courier Prime fonts, Noir CSS variables, PWA manifest, COOP/COEP headers, directory structure.

- [x] **Task #2: SQLite Database Schema + sql.js Integration**
  sql.js WASM init, OPFS persistence layer, full schema (Projects, Acts, Scenes, Characters, Events, Actions, Dialogues, Sticky Notes, Images, Inspiration Boards), SQL triggers for name sync, D1-compatible schema.

- [x] **Task #3: Universal Systems — Theming & Navigation**
  - Build the dynamic custom theme context/provider for Primary/Secondary color selection.
  - Implement automatic text contrast (Black/White) based on background brightness.
  - Implement universal navigation controls: Glowing Circle-X (exit) and minimalist 1px Gear icon (settings).
  - Build the `useDoubleTap` entry protocol hook.

- [x] **Task #4: Universal Navigation System — Entry/Exit Protocols**
  Final verification of Circle-X exit button, Gear icon settings, and double-tap interaction across the foundation.

## Phase 2: UI Layout — Matryoshka Hierarchy (Tasks 5-11)

- [x] **Task #5: Level 0 — Landing Page (Project Manager)**
  - Center "BrainPlot" title with secondary color glow effect.
  - Standardized "Create", "Load", and "Import" buttons with uniform sizing and centering.
  - Implement "Create Project" modal with "no spaces" name validation and 3/5 Act toggle.
  - Implement "Load Project" modal with project list and selection highlighting.
  - Add Export (download) and Import (upload) functionality for project files (.brainplot).
  - Integrate global Theme Selector (color pickers) directly on the landing page.

- [x] **Task #6: Level 1 — Main Board (Zoomable Scene Timeline)**
  - Header: Large 6rem centered title, left-aligned folder tabs (50px), top-right Gear icon (centered vertically in header).
  - Acts: Individually resizable cells, min-size locked to default (1/n or 1/3), V-Width % <-> H-Height % translation.
  - Interaction: Smart FAB (adds to viewport-centered act), continuous auto-panning near edges, scene deletion safety prompts.
  - Persistence: Full SQLite sync for all structural changes.

- [ ] **Task #7: The Scene Card — Full Lifecycle Implementation**
  - **1. Creation Flow**: Red FAB (+) opens the Universal Modal in "Create Mode" (pre-placement).
  - **2. Detail View (Level 2)**: Universal 85% centered modal with Read-Only/Edit states. Metadata: Title, Location, Time, Cast List placeholder.
  - **3. Card Face (Level 1)**: 16:9 layout, hero image area, and metadata indicators. Fit-to-cell scaling (96% width / 90% height).
  - **4. Placement & Saving**: "Apply" action saves the scene to SQLite and renders it on the board.
  - **5. Re-arrangement**: Drag-and-drop reordering within an act and movement between different acts (updating `act_id`).
  - **6. Entry Protocol**: Double-tap/click card or snapshot to enter Level 3 Inspiration Board.

- [ ] **Task #8: Level 3 — Scene Inspiration Board (Full-Screen Workspace)**
  Free-position canvas for Character/Event/Sticky Note/Image cards, zoom, drag-to-place, add card dropdown, drag-and-drop image upload, board state snapshot on save.

- [ ] **Task #9: Level 3.5 — Scripting Dock (Sidebar)**
  Tab trigger on middle-left, expands to 50% width, chronological Action/Dialogue cards, vertical scroll, add toggle (Action/Dialogue), drag-and-drop reordering with reactive gap.

- [ ] **Task #10: Level 4 — Script Element Detail (Action/Dialogue Modal)**
  Same universal detail view pattern, metadata + script document snapshot preview, double-tap snapshot to enter Script Editor.

- [ ] **Task #11: Level 5 — Script Editor (Full-Screen Screenplay Editor)**
  12pt Courier Prime distraction-free editor, industry-standard margins (1.25" L/R), character names uppercase centered at 3.7", parentheticals at 3.1", dialogue blocks 3.5" wide centered.

## Phase 3: Card System (Task 12)

- [ ] **Task #12: Card Anatomy — Remaining Card Types**
  Character Card (ID badge grid, static + dynamic traits), Event Card (title, image, description), Dialogue Card (character list + portraits), Action Card (theme color + fit-to-frame text), Image Card (maximized image, no border), Sticky Note Card (yellow paper, fit-to-frame text).

## Phase 4: Feature Richness (Tasks 13-17)

- [ ] **Task #13: Global Libraries — Character Library + Scripting Library**
  Characters tab (sorted by first appearance, static traits only, global delete), Script tab (chronological feed of all Actions/Dialogues, read-only, global delete).

- [ ] **Task #14: Name Sync + Deletion Safeguards**
  SQL triggers for character name propagation to all Dialogue/Scripting cards, global delete confirmation prompts, soft delete for scenes (preserves children), local removal from inspiration boards.

- [ ] **Task #15: Auto-Save System**
  Circle-X triggers auto-commit to SQLite, adding a card triggers immediate save, debounced saves during editing.

- [ ] **Task #16: Export & Print Engine — PDF, .fadein, .fdx**
  Floating printer icon in Scripting Library, modes (Rough Script, Only Dialogue, Only Actions, Print by Character), client-side jsPDF + custom .fdx/.fadein writers.

- [ ] **Task #17: PWA Finalization — Offline, Installability, Performance**
  Proper PWA icons (192, 512, apple-touch), service worker tuning, precache manifest, offline verification, Lighthouse audit pass.

## Phase 5: Polish (Task 18)

- [ ] **Task #18: Remaining 11 Theme Color Palettes**
  Historical presets built using the new Primary/Secondary color system.

## Phase 6: Future (Task 19)

- [ ] **Task #19: Auth, Cloud Sync & Monetization (Phase 7+)**
  Cloudflare Workers + D1 backend, login/accounts, local OPFS <-> D1 sync, Stripe integration (tip jar, one-time purchase, subscription).
