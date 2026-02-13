import React from 'react';
import './Settings.css';

interface SettingsDropdownProps {
  actStructure: number;
  layoutDirection: 'vertical' | 'horizontal';
  onToggleActs: () => void;
  onToggleLayout: () => void;
  onOpenThemes: () => void;
  onResetDefault: () => void;
  onSaveExit: () => void;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  actStructure,
  layoutDirection,
  onToggleActs,
  onToggleLayout,
  onOpenThemes,
  onResetDefault,
  onSaveExit
}) => {
  return (
    <div className="settings-dropdown">
      <div className="dropdown-item" onClick={onToggleActs}>
        Switch to {actStructure === 3 ? '5' : '3'} Acts
      </div>
      <div className="dropdown-item" onClick={onToggleLayout}>
        Layout: {layoutDirection === 'vertical' ? 'Horizontal' : 'Vertical'}
      </div>
      <div className="dropdown-item" onClick={onResetDefault}>
        Reset to Default Zoom
      </div>
      <div className="dropdown-divider"></div>
      <div className="dropdown-item" onClick={onOpenThemes}>
        Theme Colors
      </div>
      <div className="dropdown-divider"></div>
      <div className="dropdown-item" style={{ color: 'var(--color-accent)' }} onClick={onSaveExit}>
        Save and Exit
      </div>
    </div>
  );
};
