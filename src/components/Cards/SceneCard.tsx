import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDoubleTap } from '../../hooks/useDoubleTap';
import './SceneCard.css';

interface Scene {
  id: string;
  act_id: string;
  title: string;
  scene_number: number;
  location?: string;
  time_of_day?: string;
  hero_image_url?: string;
}

interface SceneCardProps {
  scene: Scene;
  onOpenDetail?: () => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onOpenDetail }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDoubleTap = useDoubleTap({
    onDoubleTap: () => onOpenDetail?.(),
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`scene-card-container ${isDragging ? 'dragging' : ''}`}
      {...attributes}
    >
      <div className="drag-handle" {...listeners}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 5.5C10 6.32843 9.32843 7 8.5 7C7.67157 7 7 6.32843 7 5.5C7 4.67157 7.67157 4 8.5 4C9.32843 4 10 4.67157 10 5.5ZM10 12C10 12.8284 9.32843 13.5 8.5 13.5C7.67157 13.5 7 12.8284 7 12C7 11.1716 7.67157 10.5 8.5 10.5C9.32843 10.5 10 11.1716 10 12ZM10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5ZM17 5.5C17 6.32843 16.3284 7 15.5 7C14.6716 7 14 6.32843 14 5.5C14 4.67157 14.6716 4 15.5 4C16.3284 4 17 4.67157 17 5.5ZM17 12C17 12.8284 16.3284 13.5 15.5 13.5C14.6716 13.5 14 12.8284 14 12C14 11.1716 14.6716 10.5 15.5 10.5C16.3284 10.5 17 11.1716 17 12ZM17 18.5C17 19.3284 16.3284 20 15.5 20C14.6716 20 14 19.3284 14 18.5C14 17.6716 14.6716 17 15.5 17C16.3284 17 17 17.6716 17 18.5Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="scene-card-content" onClick={handleDoubleTap}>
        <div className="scene-card-hero">
          {scene.hero_image_url ? (
            <img src={scene.hero_image_url} alt={scene.title} />
          ) : (
            <div className="hero-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>
        <div className="scene-card-meta">
          <h4 className="scene-card-title">{scene.title}</h4>
          <div className="scene-card-sub">
            <span className="scene-card-loc">{scene.location || 'EXT. UNKNOWN'}</span>
            <span className="scene-card-time">{scene.time_of_day || 'DAY'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
