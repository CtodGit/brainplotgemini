/**
 * @module DraggableBoard
 * @description This module provides the main drag-and-drop board for arranging scene cards within acts.
 * It encapsulates all the logic related to `dnd-kit` for dragging, dropping, and reordering scenes.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'; // Added DragOverlay import
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { SceneCard } from '../../../components/Cards/SceneCard'; // Import SceneCard for DragOverlay
import type { ProjectSettings, Act, Scene } from '../../../pages/MainBoard/MainBoard';
import { ActCell } from './ActCell';
import './DraggableBoard.css';

// Type for organizing scenes by act ID for easier DND logic
type ScenesByAct = { [key: string]: Scene[] };

// Define the types for the props that the DraggableBoard component will accept.
interface DraggableBoardProps {
  settings: ProjectSettings;
  acts: Act[];
  scenes: Scene[];
  onScenesChange: (scenes: Scene[]) => void;
  onSceneOpen: (scene: Scene) => void;
  onResizeStart: (e: React.MouseEvent, actId: string) => void;
}

/**
 * Renders the main draggable board area.
 * @param {DraggableBoardProps} props The props for the component.
 * @returns {JSX.Element} The rendered draggable board.
 */
export const DraggableBoard: React.FC<DraggableBoardProps> = ({
  settings,
  acts,
  scenes,
  onScenesChange,
  onSceneOpen,
  onResizeStart,
}) => {
  // State for managing drag and drop operations.
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overActId, setOverActId] = useState<string | null>(null);

  // Memoize scenes organized by act for efficient access during DND operations
  const scenesByAct: ScenesByAct = useMemo(() => {
    const newScenesByAct: ScenesByAct = {};
    acts.forEach(act => {
      newScenesByAct[act.id] = scenes.filter(scene => scene.act_id === act.id);
    });
    return newScenesByAct;
  }, [acts, scenes]);

  useEffect(() => {
    // This is to satisfy the linter, as activeId is used implicitly by dnd-kit
    if (activeId) {
      console.log('Dragging scene:', activeId);
    }
  }, [activeId]);

  const sensors = useSensors(useSensor(PointerSensor));

  /**
   * Finds the container (act) for a given scene or act ID.
   * This is used to determine which act a scene belongs to during drag operations.
   * @param {string} id The ID of the scene or act.
   * @returns {string | undefined} The ID of the container act, or undefined if not found.
   */
  const findContainer = (id: string) => {
    if (acts.some(a => a.id === id)) {
      return id;
    }
    for (const actId in scenesByAct) {
      if (scenesByAct[actId].some(scene => scene.id === id)) {
        return actId;
      }
    }
    return undefined;
  };

  /**
   * Handles the start of a drag operation.
   * It sets the active scene ID and the act ID of the scene being dragged.
   * @param {DragStartEvent} event The drag start event object from dnd-kit.
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log('DRAG START', { active });
    setActiveId(active.id as string);
  };

  /**
   * Handles the drag over event, which fires when a draggable item is moved over a droppable container.
   * It sets the ID of the act being dragged over.
   * @param {DragOverEvent} event The drag over event object from dnd-kit.
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    console.log('DRAG OVER', { over });
    const overId = over?.id as string | undefined;
    if (!overId) return;

    const overContainer = findContainer(overId);
    if (overContainer) {
      setOverActId(overContainer);
    }
  };

  /**
   * Handles the end of a drag operation.
   * This is where the logic for reordering scenes within an act, or moving scenes between acts, is implemented.
   * @param {DragEndEvent} event The drag end event object from dnd-kit.
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('DRAG END', { active, over });

    if (!active || !over) { // If active or over is null/undefined, something went wrong or dropped outside
      setActiveId(null);
      setOverActId(null);
      return;
    }

    const activeContainerId = findContainer(active.id as string);
    const overContainerId = findContainer(over.id as string);

    // If active and over items are from invalid containers, reset
    if (!activeContainerId || !overContainerId) {
      setActiveId(null);
      setOverActId(null);
      return;
    }

    // Create a mutable copy of scenes organized by act
    const newScenesByAct = { ...scenesByAct };

    if (activeContainerId === overContainerId) {
      // Reordering within the same act
      const currentActScenes = newScenesByAct[activeContainerId];
      const activeIndex = currentActScenes.findIndex(s => s.id === active.id);
      const overIndex = currentActScenes.findIndex(s => s.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        newScenesByAct[activeContainerId] = arrayMove(currentActScenes, activeIndex, overIndex);
      }
    } else {
      // Moving to a different act
      const activeScene = scenes.find(s => s.id === active.id);
      if (!activeScene) {
        setActiveId(null);
        setOverActId(null);
        return;
      }

      // Remove from old container
      newScenesByAct[activeContainerId] = newScenesByAct[activeContainerId].filter(s => s.id !== active.id);

      // Add to new container
      const overScenes = newScenesByAct[overContainerId];
      const overIndex = overScenes.findIndex(s => s.id === over.id); // Find where to insert in the new act
      
      const movedScene = { ...activeScene, act_id: overContainerId }; // Update act_id of the moved scene

      if (overIndex !== -1) {
        overScenes.splice(overIndex, 0, movedScene);
      } else {
        // If dropping onto an empty act or directly on the act container
        overScenes.push(movedScene);
      }
      newScenesByAct[overContainerId] = [...overScenes]; // Ensure immutability
    }

    // Flatten newScenesByAct back into a single array and update scene_numbers
    const finalScenes: Scene[] = [];
    acts.forEach(act => {
      newScenesByAct[act.id].forEach((scene, index) => {
        finalScenes.push({ ...scene, act_id: act.id, scene_number: index + 1 });
      });
    });

    onScenesChange(finalScenes); // Notify parent of the updated scenes
    setActiveId(null);
    setOverActId(null);
  };

  /**
   * Find the active scene object based on its ID.
   * @returns {Scene | undefined} The active scene object or undefined if not found.
   */
  const activeScene = activeId ? scenes.find((scene) => scene.id === activeId) : undefined;


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={`board-container layout-${settings.layout_direction}`} style={{ '--act-count': settings.act_structure } as React.CSSProperties}>
        <div className="acts-grid">
          {acts.map((act) => (
            <ActCell
              key={act.id}
              act={act}
              scenes={scenesByAct[act.id]} // Pass filtered scenes from memoized object
              layoutDirection={settings.layout_direction}
              overActId={overActId}
              onSceneOpen={onSceneOpen}
              onResizeStart={onResizeStart}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeScene ? (
          <SceneCard scene={activeScene} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};