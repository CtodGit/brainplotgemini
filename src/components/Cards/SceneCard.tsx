import React from 'react';
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
  const handleDoubleTap = useDoubleTap({
    onDoubleTap: () => onOpenDetail?.(),
  });

  return (
    <div 
      className="scene-card-container" 
      onClick={handleDoubleTap}
    >
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
  );
};
