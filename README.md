# BrainPlot — Documentation & Roadmap

This project follows a layered development approach, building the application hierarchy from the outside in.

## Current Progress
- **Phase 1 (Foundational Setup)**: COMPLETE ✅
- **Phase 2 (Page Scaffolding)**: IN PROGRESS 🏗️ (Tasks 4-6 COMPLETE)

---

# Roadmap

## Phase 1: Foundational Setup
- ✅ **Task #1: Project Scaffolding** (Vite, React, PWA, Courier Prime)
- ✅ **Task #2: Database & Storage** (sql.js + OPFS persistence)
- ✅ **Task #3: Universal Systems** (Custom Primary/Secondary themes, Auto-contrast)
- ✅ **Task #4: Universal Navigation** (Circle-X, Gear icon, Double-tap entry)

## Phase 2: Page Scaffolding (The Matryoshka Layers)
- ✅ **Task #5: Level 0 — The Landing Page** (Modals for Create/Load/Import)
- ✅ **Task #6: Level 1 — The Main Board** (Resizable Acts, Smart FAB, Auto-pan)
- 🏗️ **Task #7: The Scene Card — Full Lifecycle Implementation**
  - **1. Creation Flow**: Red FAB (+) opens the Universal Modal.
  - **2. Detail View (Level 2)**: 85% centered modal with Read-Only/Edit states.
  - **3. Card Face (Level 1)**: 16:9 layout, hero image area, metadata indicators.
  - **4. Re-arrangement**: Drag-and-drop within and between acts.
  - **5. Entry Protocol**: Double-tap to enter Level 3.
- [ ] **Task #8: Level 3 — Scene Inspiration Board** (Free-position workspace)
- [ ] **Task #9: Level 3.5 — Scripting Dock** (50% width sidebar)
- [ ] **Task #10: Level 4 — Script Element Detail** (Universal Modal reuse)
- [ ] **Task #11: Level 5 — Script Editor** (Full-screen Courier Prime editor)

## Phase 3: Card System (Remaining types)
- [ ] **Task #12: Card Anatomy — Remaining Types** (Character, Event, Dialogue, etc.)

## Phase 4: Feature Richness & Integration
- [ ] **Task #13: Global Libraries** (Character & Scripting Library tabs)
- [ ] **Task #14: Name Sync & Deletion Safeguards** (Triggers & confirmation prompts)
- [ ] **Task #15: Auto-Save System** (Persistent SQLite sync)
- [ ] **Task #16: Export & Print Engine** (PDF, .fadein, .fdx)
- [ ] **Task #17: PWA Finalization** (Icons, Service Worker, Lighthouse)

---

## Technical Stack
- **Frontend**: React (TypeScript) + Vite
- **Database**: sql.js (SQLite WASM)
- **Persistence**: Origin Private File System (OPFS)
- **Styling**: Vanilla CSS with dynamic variables
- **Typography**: Courier Prime
