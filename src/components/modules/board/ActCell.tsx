/**
 * @module ActCell
 * @description This component represents a single "act" column on the main board.
 * It is a droppable container for scene cards and also a sortable context for the scenes within it.
 */

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SceneCard } from '../../../components/Cards/SceneCard';
import type { Act, Scene } from '../../../pages/MainBoard/MainBoard';

interface ActCellProps {
  act: Act;
  scenes: Scene[];
  layoutDirection: 'vertical' | 'horizontal';
  overActId: string | null;
  onSceneOpen: (scene: Scene) => void;
  onResizeStart: (e: React.MouseEvent, actId: string) => void;
}

export const ActCell: React.FC<ActCellProps> = ({
  act,
  scenes,
  layoutDirection,
  overActId,
  onSceneOpen,
  onResizeStart,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: act.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`act-cell ${overActId === act.id ? 'dragging-over' : ''} ${isOver ? 'droppable-over' : ''}`}
      style={{ '--cell-ratio': act.cell_dimension_ratio } as React.CSSProperties}
    >
      <header className="act-header"><h3>Act {act.act_number}</h3></header>
      <SortableContext items={scenes.map(s => s.id)} strategy={layoutDirection === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy}>
        <div className="scene-list">
          {scenes.map(s => <SceneCard key={s.id} scene={s} onOpenDetail={() => onSceneOpen(s)} />)}
          {scenes.length === 0 && <div className="scene-card-empty placeholder"><span>Empty Act</span></div>}
        </div>
      </SortableContext>
      <div className="resize-handle" onMouseDown={(e) => onResizeStart(e, act.id)}><div className="handle-icon"></div></div>
    </div>
  );
};
