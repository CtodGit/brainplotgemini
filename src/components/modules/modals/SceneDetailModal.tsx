/**
 * @module SceneDetailModal
 * @description This module provides a modal for viewing and editing the details of a scene.
 * It includes fields for title, location, time of day, and a hero image.
 * It also has a placeholder for the inspiration board snapshot.
 */

import React from 'react';
import { Modal } from '../../../components/UI/Modal';
import { useDoubleTap } from '../../../hooks/useDoubleTap';
import type { Scene } from '../../../pages/MainBoard/MainBoard';
import './SceneDetailModal.css';

// Define the types for the props that the SceneDetailModal component will accept.
interface SceneDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: Partial<Scene> | null;
  isEditing: boolean;
  onSetIsEditing: (isEditing: boolean) => void;
  onUpdateScene: (scene: Partial<Scene> | null) => void;
  onApplyScene: () => void;
  onDeleteScene: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterInspirationBoard: () => void;
}

/**
 * Renders the scene detail modal.
 * @param {SceneDetailModalProps} props The props for the component.
 * @returns {JSX.Element} The rendered modal component.
 */
export const SceneDetailModal: React.FC<SceneDetailModalProps> = ({
  isOpen,
  onClose,
  scene,
  isEditing,
  onSetIsEditing,
  onUpdateScene,
  onApplyScene,
  onDeleteScene,
  onImageUpload,
  onEnterInspirationBoard,
}) => {
  if (!scene) return null;

  const doubleTapHandlers = useDoubleTap({
    onDoubleTap: () => {
      console.log('Inspiration board snapshot double-tapped!');
      onEnterInspirationBoard();
    }
  });

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Edit Scene' : scene.title || 'Scene Detail'}
    >
      <div className="scene-detail-modal-content">
        <div className="detail-meta-grid">
          <div className="detail-field">
            <label>Title</label>
            {isEditing ? <input type="text" value={scene.title} onChange={e => onUpdateScene({ ...scene, title: e.target.value })} /> : <span>{scene.title}</span>}
          </div>
          <div className="detail-field">
            <label>Location</label>
            {isEditing ? <input type="text" placeholder="e.g. INT. KITCHEN" value={scene.location || ''} onChange={e => onUpdateScene({ ...scene, location: e.target.value })} /> : <span>{scene.location || 'NONE'}</span>}
          </div>
          <div className="detail-field">
            <label>Time of Day</label>
            {isEditing ? (
              <select value={scene.time_of_day || 'DAY'} onChange={e => onUpdateScene({ ...scene, time_of_day: e.target.value })}>
                <option value="DAY">DAY</option>
                <option value="NIGHT">NIGHT</option>
                <option value="DUSK">DUSK</option>
                <option value="DAWN">DAWN</option>
              </select>
            ) : (
              <span>{scene.time_of_day || 'DAY'}</span>
            )}
          </div>
          {isEditing && (
            <div className="detail-field">
              <label>Scene Image</label>
              <label className="file-input-label">
                <span>{scene.hero_image_url ? 'Change Image' : 'Click to choose file'}</span>
                <input type="file" accept="image/*" onChange={onImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
          )}
        </div>
        <div className="inspiration-preview-placeholder">
          <div className="preview-label">Inspiration Board Snapshot</div>
          <div className="preview-snapshot" {...doubleTapHandlers}>
            <span>Double-tap to enter Inspiration Board</span>
          </div>
        </div>
        <div className="modal-actions-footer">
          <div className="footer-left">
            {isEditing ? (
              <button className="apply-btn modal-btn" onClick={onApplyScene}>Apply</button>
            ) : (
              <button className="edit-btn modal-btn" onClick={() => onSetIsEditing(true)}>Edit</button>
            )}
          </div>
          <div className="footer-right">
            {!isEditing && (
              <button className="delete-btn modal-btn" onClick={onDeleteScene}>Delete Scene</button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
