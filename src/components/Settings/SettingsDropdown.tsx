import React from 'react';
import './Settings.css';

interface SettingsDropdownProps {
  actStructure: number;
  layoutDirection: 'vertical' | 'horizontal';
  onToggleActs: () => void;
  onToggleLayout: () => void;
  onOpenThemes: () => void;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  actStructure,
  layoutDirection,
  onToggleActs,
  onToggleLayout,
  onOpenThemes
}) => {
  return (
    <div className="settings-dropdown">
      <div className="dropdown-item" onClick={onToggleActs}>
        Switch to {actStructure === 3 ? '5' : '3'} Acts
      </div>
      <div className="dropdown-item" onClick={onToggleLayout}>
        Layout: {layoutDirection === 'vertical' ? 'Horizontal' : 'Vertical'}
      </div>
      <div className="dropdown-divider"></div>
      <div className="dropdown-item" onClick={onOpenThemes}>
        Select Theme
      </div>
    </div>
  );
};
