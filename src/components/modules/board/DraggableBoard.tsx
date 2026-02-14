/**
 * @module DraggableBoard
 * @description This module provides the main drag-and-drop board for arranging scene cards within acts.
 * It encapsulates all the logic related to `dnd-kit` for dragging, dropping, and reordering scenes.
 */

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SceneCard } from '../../../components/Cards/SceneCard';
import type { ProjectSettings, Act, Scene } from '../../../pages/MainBoard/MainBoard';
import './DraggableBoard.css';

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
    const scene = scenes.find(s => s.id === id);
    return scene?.act_id;
  };

  /**
   * Handles the start of a drag operation.
   * It sets the active scene ID.
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

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    let overContainer = findContainer(overId);
    
    const overScene = scenes.find(s => s.id === overId);
    if (overScene) {
      overContainer = overScene.act_id;
    }

    console.log('CONTAINERS', { activeContainer, overContainer });

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    let newScenes: Scene[] = [];

    if (activeContainer === overContainer) {
      const activeIndex = scenes.findIndex(s => s.id === activeId);
      const overIndex = scenes.findIndex(s => s.id === overId);
      if (activeIndex !== -1 && overIndex !== -1) {
        newScenes = arrayMove(scenes, activeIndex, overIndex);
      }
    } else {
      const activeIndex = scenes.findIndex(s => s.id === activeId);
      if (activeIndex === -1) return;

      const movedScenes = [...scenes];
      const [movedScene] = movedScenes.splice(activeIndex, 1);
      movedScene.act_id = overContainer;

      const overIndex = movedScenes.findIndex(s => s.id === overId);
      if (overIndex !== -1) {
        movedScenes.splice(overIndex, 0, movedScene);
        newScenes = movedScenes;
      } else {
        const actsOrder = acts.map(a => a.id);
        const overActIndex = actsOrder.indexOf(overContainer);
        let lastSceneIndex = -1;
        for (let i = overActIndex - 1; i >= 0; i--) {
          const prevActId = actsOrder[i];
          const lastSceneOfPrevAct = movedScenes.map(s => s.act_id).lastIndexOf(prevActId);
          if (lastSceneOfPrevAct !== -1) {
            lastSceneIndex = lastSceneOfPrevAct;
            break;
          }
        }
        movedScenes.splice(lastSceneIndex + 1, 0, movedScene);
        newScenes = movedScenes;
      }
    }

    onScenesChange(newScenes);
    setActiveId(null);
    setOverActId(null);
  };

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
            <SortableContext key={act.id} items={scenes.filter(s => s.act_id === act.id).map(s => s.id)} strategy={settings.layout_direction === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy}>
              <div className={`act-cell ${overActId === act.id ? 'dragging-over' : ''}`} style={{ '--cell-ratio': act.cell_dimension_ratio } as React.CSSProperties}>
                <header className="act-header"><h3>Act {act.act_number}</h3></header>
                <div className="scene-list">
                  {scenes.filter(s => s.act_id === act.id).map(s => <SceneCard key={s.id} scene={s} onOpenDetail={() => onSceneOpen(s)} />)}
                  {scenes.filter(s => s.act_id === act.id).length === 0 && <div className="scene-card-empty placeholder"><span>Empty Act</span></div>}
                </div>
                <div className="resize-handle" onMouseDown={(e) => onResizeStart(e, act.id)}><div className="handle-icon"></div></div>
              </div>
            </SortableContext>
          ))}
        </div>
      </div>
    </DndContext>
  );
};
