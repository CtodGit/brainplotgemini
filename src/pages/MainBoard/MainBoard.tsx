import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircleX } from '../../components/Navigation/CircleX';
import { GearIcon } from '../../components/Navigation/GearIcon';
import { SettingsDropdown } from '../../components/Settings/SettingsDropdown';
import { ThemeSelector } from '../../components/Settings/ThemeSelector';
import { exec, initDB } from '../../db';
import { useTheme } from '../../contexts/ThemeContext';
import './MainBoard.css';

type Tab = 'board' | 'characters' | 'script';

interface ProjectSettings {
  name: string;
  act_structure: number;
  layout_direction: 'vertical' | 'horizontal';
  primary_color: string;
  secondary_color: string;
}

export const MainBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor } = useTheme();
  
  const [activeTab, setActiveTab] = useState<Tab>('board');
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const [settings, setSettings] = useState<ProjectSettings>({
    name: '',
    act_structure: 3,
    layout_direction: 'vertical',
    primary_color: '#000000',
    secondary_color: '#ff0000'
  });

  useEffect(() => {
    loadProjectSettings();
  }, [projectId]);

  const loadProjectSettings = async () => {
    try {
      await initDB();
      const result = await exec('SELECT name, act_structure, layout_direction, primary_color, secondary_color FROM Projects WHERE id = ?', [projectId]) as any[];
      
      if (result && result.length > 0) {
        const data = result[0];
        const loadedSettings: ProjectSettings = {
          name: data.name,
          act_structure: data.act_structure,
          layout_direction: data.layout_direction as 'vertical' | 'horizontal',
          primary_color: data.primary_color || '#000000',
          secondary_color: data.secondary_color || '#ff0000'
        };
        setSettings(loadedSettings);
        setPrimaryColor(loadedSettings.primary_color);
        setSecondaryColor(loadedSettings.secondary_color);
      }
    } catch (error) {
      console.error('Failed to load project settings:', error);
    }
  };

  const handleSaveSettings = async (updatedSettings: Partial<ProjectSettings>) => {
    const newSettings = { ...settings, ...updatedSettings };
    setSettings(newSettings);

    try {
      await exec(
        'UPDATE Projects SET act_structure = ?, layout_direction = ?, primary_color = ?, secondary_color = ? WHERE id = ?',
        [newSettings.act_structure, newSettings.layout_direction, newSettings.primary_color, newSettings.secondary_color, projectId]
      );
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const toggleActs = () => {
    handleSaveSettings({ act_structure: settings.act_structure === 3 ? 5 : 3 });
  };

  const toggleLayout = () => {
    handleSaveSettings({ layout_direction: settings.layout_direction === 'vertical' ? 'horizontal' : 'vertical' });
  };

  const handleCloseSettings = () => {
    setShowThemeSelector(false);
    setShowSettings(false);
    // Project is already saved on each change as per logic above, 
    // but we could also do a final save here if needed.
  };

  return (
    <div className="main-board">
      <header className="main-board-header">
        <div className="tab-bar">
          <button 
            className={`tab-btn ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            Main Board
          </button>
          <button 
            className={`tab-btn ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            Characters
          </button>
          <button 
            className={`tab-btn ${activeTab === 'script' ? 'active' : ''}`}
            onClick={() => setActiveTab('script')}
          >
            Script
          </button>
          <div className="settings-wrapper">
            <GearIcon 
              className="tab-gear" 
              onClick={() => setShowSettings(!showSettings)} 
            />
            {showSettings && (
              <SettingsDropdown 
                actStructure={settings.act_structure}
                layoutDirection={settings.layout_direction}
                onToggleActs={toggleActs}
                onToggleLayout={toggleLayout}
                onOpenThemes={() => { setShowThemeSelector(true); setShowSettings(false); }}
              />
            )}
          </div>
        </div>
        <CircleX onClick={() => navigate('/')} />
      </header>
      
      <main className="main-board-content">
        {activeTab === 'board' && (
          <div className={`board-container layout-${settings.layout_direction}`}>
            <h2>{settings.name} - {settings.act_structure} Acts</h2>
            <div className="acts-grid">
              {Array.from({ length: settings.act_structure }).map((_, i) => (
                <div key={i} className="act-column">
                  <h3>Act {i + 1}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'characters' && (
          <div className="characters-container">
            <h2>Character Library</h2>
          </div>
        )}
        {activeTab === 'script' && (
          <div className="script-container">
            <h2>Global Script Library</h2>
          </div>
        )}
      </main>

      {showThemeSelector && (
        <ThemeSelector 
          onClose={async () => {
            // Save final choices to DB
            await handleSaveSettings({ primary_color: primaryColor, secondary_color: secondaryColor });
            handleCloseSettings();
          }} 
        />
      )}
    </div>
  );
};
