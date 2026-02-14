/**
 * @module Header
 * @description This module provides the main header for the application pages.
 * It includes the project title and navigation tabs to switch between different boards.
 * It also contains a gear icon which, when clicked, triggers a settings toggle.
 * The actual settings and theme selection UI are handled by the parent component.
 */

import React from 'react';
import { GearIcon } from '../../../components/Navigation/GearIcon';
import type { ProjectSettings } from '../../../pages/MainBoard/MainBoard'; // ProjectSettings type is still needed for settings.name

import './Header.css';

// Define the types for the props that the Header component will accept.
interface HeaderProps {
  settings: ProjectSettings;
  activeTab: 'board' | 'characters' | 'script';
  setActiveTab: (tab: 'board' | 'characters' | 'script') => void;
  onSettingsToggle: () => void; // Callback to toggle settings visibility in parent
}

/**
 * Renders the main application header.
 * @param {HeaderProps} props The props for the component.
 * @returns {JSX.Element} The rendered header component.
 */
export const Header: React.FC<HeaderProps> = ({
  settings,
  activeTab,
  setActiveTab,
  onSettingsToggle,
}) => {

  return (
    <header className="main-board-header">
      <h1 className="project-title">{settings.name}</h1>
      <div className="settings-wrapper">
        {/* The GearIcon now directly calls the onSettingsToggle prop to inform the parent */}
        <GearIcon className="tab-gear" onClick={onSettingsToggle} />
      </div>
      <div className="toolbar-row">
        <div className="tab-bar">
          {activeTab !== 'board' && <button className="tab-btn" onClick={() => setActiveTab('board')}>Main Board</button>}
          {activeTab !== 'characters' && <button className="tab-btn" onClick={() => setActiveTab('characters')}>Characters</button>}
          {activeTab !== 'script' && <button className="tab-btn" onClick={() => setActiveTab('script')}>Script</button>}
        </div>
      </div>
    </header>
  );
};
