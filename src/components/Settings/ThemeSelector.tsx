import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { CircleX } from '../Navigation/CircleX';
import './Settings.css';

interface ThemeSelectorProps {
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor, resetTheme } = useTheme();

  return (
    <div className="theme-selector-overlay">
      <div className="theme-selector-window">
        <header className="theme-selector-header">
          <h2>Theme Colors</h2>
          <CircleX onClick={onClose} className="menu-close" />
        </header>

        <div className="color-picker-container">
          <div className="color-input-group">
            <label>Primary Color</label>
            <div className="color-row">
              <input 
                type="color" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)} 
              />
              <input 
                type="text" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="hex-input"
              />
            </div>
          </div>

          <div className="color-input-group">
            <label>Secondary Color</label>
            <div className="color-row">
              <input 
                type="color" 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)} 
              />
              <input 
                type="text" 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="hex-input"
              />
            </div>
          </div>

          <button className="reset-btn" onClick={resetTheme}>
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};
