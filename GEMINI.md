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
  - **Header Architecture**:
    - Large 6rem centered title.
    - Left-aligned "file-folder" style tabs (50px height).
    - Gear icon pinned to top-right, vertically centered within the 135px header.
  - **Act Cell Behavior**:
    - Individual Act Resizing: Drag center-edge handles to grow cells.
    - Vertical Mode: Width is resizable; Height is auto (fits scenes).
    - Horizontal Mode: Height is resizable; Width is auto.
    - Minimum Size: Locked to the "Default View" (1/n width or 1/3 height).
    - Dimension Translation: Act Width % (Vertical) translates to Act Height % (Horizontal).
  - **Smart Interaction**:
    - Smart Add (FAB): The floating red plus button adds a scene to the act currently centered in the viewport.
    - Auto-Panning: Dragging a resize handle near screen edges automatically scrolls the board.
    - Safety Prompt: Warn user before deleting acts 4 & 5 if they contain scenes.
  - **Persistence**: Real-time SQLite saves for all dimensions, act structures, and scenes.

- [ ] **Task #7: Level 2 Page — The Detail View (Universal Modal)**
  - Develop the universal 85% viewport, centered modal component.
  - **Scene Detail Content**:
    - Read-only state with Gear-icon toggle for Edit mode.
    - Fields: Title, Location, Time of Day, and Cast List.
    - Placeholder for "Inspiration Board" snapshot preview.
    - Implementation of the "Apply" and "Delete" actions.
    - Entry Protocol: Double-tap/click the Scene Card or the Snapshot to enter Level 3.

- [ ] **Task #8: Level 3 Page — The Scene Inspiration Board**
- [ ] **Task #9: Level 3.5 Page — The Scripting Dock (Sidebar)**
- [ ] **Task #10: Level 5 Page — The Script Editor**

- [ ] **Audit 2: Page Scaffolding Review**
