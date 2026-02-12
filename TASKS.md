# BrainPlot — Task Breakdown

19 tasks progressing from foundation to feature-complete PWA.

## Phase 1: Foundation (Tasks 1-4)

- [x] **Task #1: Project Scaffolding — React + Vite PWA Boilerplate**
  Package.json, Vite config, TypeScript configs, ESLint, index.html, HashRouter, Courier Prime fonts, Noir CSS variables, PWA manifest, COOP/COEP headers, directory structure.

- [x] **Task #2: SQLite Database Schema + sql.js Integration**
  sql.js WASM init, OPFS persistence layer, full schema (Projects, Acts, Scenes, Characters, Events, Actions, Dialogues, Sticky Notes, Images, Inspiration Boards), SQL triggers for name sync, D1-compatible schema.

- [x] **Task #3: Theming System — CSS Variables + Noir Default**
  Theme context/provider, dark/light mode toggle, localStorage persistence, `[data-theme]` and `[data-theme-mode]` attribute switching, Noir fully designed.

- [x] **Task #4: Universal Navigation System — Entry/Exit Protocols**
  Circle-X exit button (top-left), Gear icon (top-right), double-tap/double-click entry protocol, blur/dim parent views, navigation context tracking across hierarchy levels.

## Phase 2: UI Layout — Matryoshka Hierarchy (Tasks 5-11)

- [x] **Task #5: Level 0 — Landing Page (Project Manager)**
  Project list from OPFS, new project (filename + 3/5 act selection), load/import .sqlite.db, export, delete with confirmation.

- [x] **Task #6: Level 1 — Main Board (Zoomable Scene Timeline)**
  Tab bar (Main Board | Characters | Script), scene cards on timeline, act lines/labels, zoom in/out, vertical/horizontal toggle, no negative-space panning.

- [x] **Task #7: Level 2 — Detail View (Scene Metadata Modal)**
  Universal 85% viewport centered modal pattern, read-only metadata, gear icon toggles edit mode, apply/delete buttons, inspiration board snapshot preview.

- [x] **Task #8: Level 3 — Scene Inspiration Board (Full-Screen Workspace)**
  Free-position canvas for Character/Event/Sticky Note/Image cards, zoom, drag-to-place, add card dropdown, drag-and-drop image upload, board state snapshot on save.

- [x] **Task #9: Level 3.5 — Scripting Dock (Slide-Out Sidebar)**
  Tab trigger on middle-left, expands to 50% width, chronological Action/Dialogue cards, vertical scroll, add toggle (Action/Dialogue), drag-and-drop reordering with reactive gap.

- [x] **Task #10: Level 4 — Script Element Detail (Action/Dialogue Modal)**
  Same universal detail view pattern, metadata + script document snapshot preview, double-tap snapshot to enter Script Editor.

- [x] **Task #11: Level 5 — Script Editor (Full-Screen Screenplay Editor)**
  12pt Courier Prime distraction-free editor, industry-standard margins (1.25" L/R), character names uppercase centered at 3.7", parentheticals at 3.1", dialogue blocks 3.5" wide centered.

## Phase 3: Card System (Task 12)

- [x] **Task #12: Card Anatomy — All 7 Card Types**
  Scene Card (title, 16:9 image, act/location/time, cast list), Character Card (ID badge grid, static + dynamic traits), Event Card (title, image, description), Dialogue Card (character list + portraits), Action Card (theme color + fit-to-frame text), Image Card (maximized image, no border), Sticky Note Card (yellow paper, fit-to-frame text).

## Phase 4: Feature Richness (Tasks 13-17)

- [x] **Task #13: Global Libraries — Character Library + Scripting Library**
  Characters tab (sorted by first appearance, static traits only, global delete), Script tab (chronological feed of all Actions/Dialogues, read-only, global delete).

- [x] **Task #14: Name Sync + Deletion Safeguards**
  SQL triggers for character name propagation to all Dialogue/Scripting cards, global delete confirmation prompts, soft delete for scenes (preserves children), local removal from inspiration boards.

- [x] **Task #15: Auto-Save System**
  Circle-X triggers auto-commit to SQLite, adding a card triggers immediate save, debounced saves during editing.

- [x] **Task #16: Export & Print Engine — PDF, .fadein, .fdx**
  Floating printer icon in Scripting Library, modes (Rough Script, Only Dialogue, Only Actions, Print by Character), client-side jsPDF + custom .fdx/.fadein writers.

- [ ] **Task #17: PWA Finalization — Offline, Installability, Performance**
  Proper PWA icons (192, 512, apple-touch), service worker tuning, precache manifest, offline verification, Lighthouse audit pass.

## Phase 5: Polish (Task 18)

- [ ] **Task #18: Remaining 11 Theme Color Palettes**
  Horror, Drama, Comedy, Sci-Fi, Western, Romance, Action, Thriller, Mystery, Greyscale, Rainbow — each with dark/light variants matching genre vibe.

## Phase 6: Future (Task 19)

- [ ] **Task #19: Auth, Cloud Sync & Monetization (Phase 7+)**
  Cloudflare Workers + D1 backend, login/accounts, local OPFS <-> D1 sync, Stripe integration (tip jar, one-time purchase, subscription).
