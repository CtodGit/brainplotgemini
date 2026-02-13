import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

interface Act {
  id: string;
  act_number: number;
  name: string;
  cell_dimension_ratio: number;
}

interface Scene {
  id: string;
  act_id: string;
  title: string;
  scene_number: number;
}

export const MainBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor } = useTheme();
  
  const [activeTab, setActiveTab] = useState<Tab>('board');
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  const [settings, setSettings] = useState<ProjectSettings>({
    name: '',
    act_structure: 3,
    layout_direction: 'vertical',
    primary_color: '#000000',
    secondary_color: '#ff0000'
  });

  const [acts, setActs] = useState<Act[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      await initDB();
      // Load Settings
      const projResult = await exec('SELECT name, act_structure, layout_direction, primary_color, secondary_color FROM Projects WHERE id = ?', [projectId]) as any[];
      if (projResult && projResult.length > 0) {
        setSettings(projResult[0]);
        setPrimaryColor(projResult[0].primary_color);
        setSecondaryColor(projResult[0].secondary_color);
      }

      // Load Acts
      const actsResult = await exec('SELECT id, act_number, name, cell_dimension_ratio FROM Acts WHERE project_id = ? ORDER BY act_number ASC', [projectId]) as any[];
      
      let currentActs = actsResult;
      if (!actsResult || actsResult.length === 0) {
        const initialActs: Act[] = [];
        const actCount = projResult[0]?.act_structure || 3;
        for (let i = 1; i <= actCount; i++) {
          const actId = crypto.randomUUID();
          await exec('INSERT INTO Acts (id, project_id, act_number, cell_dimension_ratio) VALUES (?, ?, ?, ?)', 
            [actId, projectId, i, 1.0]);
          initialActs.push({ id: actId, act_number: i, name: `Act ${i}`, cell_dimension_ratio: 1.0 });
        }
        currentActs = initialActs;
      }
      setActs(currentActs);

      // Load Scenes
      const scenesResult = await exec('SELECT id, act_id, title, scene_number FROM Scenes WHERE project_id = ? ORDER BY scene_number ASC', [projectId]) as any[];
      setScenes(scenesResult || []);

    } catch (error) {
      console.error('Failed to load project data:', error);
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

  const handleSaveExit = async () => {
    await handleSaveSettings(settings);
    navigate('/');
  };

  const handleAddScene = async () => {
    if (acts.length === 0 || !contentRef.current) return;
    
    // Determine which act is currently centered in the viewport
    const container = contentRef.current;
    let targetActIndex = 0;

    if (settings.layout_direction === 'vertical') {
      const scrollCenter = container.scrollLeft + (container.clientWidth / 2);
      const cellWidth = container.scrollWidth / acts.length;
      targetActIndex = Math.floor(scrollCenter / cellWidth);
    } else {
      const scrollCenter = container.scrollTop + (container.clientHeight / 2);
      const cellHeight = container.scrollHeight / acts.length;
      targetActIndex = Math.floor(scrollCenter / cellHeight);
    }

    // Clamp index to valid range
    targetActIndex = Math.max(0, Math.min(acts.length - 1, targetActIndex));
    const targetAct = acts[targetActIndex];
    
    const newSceneId = crypto.randomUUID();
    const sceneNumber = scenes.length + 1;
    
    try {
      await exec(
        'INSERT INTO Scenes (id, project_id, act_id, scene_number, title) VALUES (?, ?, ?, ?, ?)',
        [newSceneId, projectId, targetAct.id, sceneNumber, `New Scene ${sceneNumber}`]
      );
      loadProjectData();
    } catch (error) {
      console.error('Failed to add scene:', error);
    }
  };

  const toggleActs = async () => {
    const currentCount = settings.act_structure;
    const nextCount = currentCount === 3 ? 5 : 3;

    if (nextCount < currentCount) {
      // Reducing acts: Check for scenes in acts that will be removed (Act 4 and 5)
      try {
        const removedActs = acts.filter(a => a.act_number > nextCount);
        const removedActIds = removedActs.map(a => a.id);
        
        if (removedActIds.length > 0) {
          const sql = `SELECT COUNT(*) as count FROM Scenes WHERE act_id IN (${removedActIds.map(() => '?').join(',')})`;
          const result = await exec(sql, removedActIds) as any[];
          const sceneCount = result[0]?.count || 0;

          if (sceneCount > 0) {
            const confirmed = window.confirm(
              `Warning: Act 4 and 5 contain ${sceneCount} scenes. Reducing the act structure will permanently delete these scenes. Proceed?`
            );
            if (!confirmed) return;
          }
        }
        
        // Surgical delete of removed acts
        await exec(`DELETE FROM Acts WHERE project_id = ? AND act_number > ?`, [projectId, nextCount]);
      } catch (error) {
        console.error('Failed safety check during act toggle:', error);
      }
    } else {
      // Increasing acts: Add new acts
      for (let i = currentCount + 1; i <= nextCount; i++) {
        const actId = crypto.randomUUID();
        await exec('INSERT INTO Acts (id, project_id, act_number, cell_dimension_ratio) VALUES (?, ?, ?, ?)', 
          [actId, projectId, i, 1.0]);
      }
    }

    await handleSaveSettings({ act_structure: nextCount });
    loadProjectData();
    setShowSettings(false);
  };

  const toggleLayout = () => {
    handleSaveSettings({ layout_direction: settings.layout_direction === 'vertical' ? 'horizontal' : 'vertical' });
    setShowSettings(false);
  };

  const resetToDefault = async () => {
    await exec('UPDATE Acts SET cell_dimension_ratio = 1.0 WHERE project_id = ?', [projectId]);
    loadProjectData();
    setShowSettings(false);
  };

  const handleThemeClose = async () => {
    setShowThemeSelector(false);
    await handleSaveSettings({ primary_color: primaryColor, secondary_color: secondaryColor });
  };

  // Resizing logic for individual act
  const handleResizeStart = (e: React.MouseEvent, actId: string) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const contentEl = contentRef.current;
    const startScrollLeft = contentEl?.scrollLeft || 0;
    const startScrollTop = contentEl?.scrollTop || 0;
    
    const actIndex = acts.findIndex(a => a.id === actId);
    const startRatio = acts[actIndex].cell_dimension_ratio;
    
    let currentClientX = startX;
    let currentClientY = startY;
    let animationFrameId: number;

    const baseWidth = (window.innerWidth - (settings.act_structure + 1) * 12) / settings.act_structure;
    const baseHeight = (window.innerHeight - 115 - (3 + 1) * 12) / 3;

    const updateRatio = () => {
      if (!contentEl) return;
      
      const scrollDeltaX = contentEl.scrollLeft - startScrollLeft;
      const scrollDeltaY = contentEl.scrollTop - startScrollTop;
      const mouseDeltaX = currentClientX - startX;
      const mouseDeltaY = currentClientY - startY;

      let newRatio;
      if (settings.layout_direction === 'vertical') {
        newRatio = startRatio + (mouseDeltaX + scrollDeltaX) / baseWidth;
      } else {
        newRatio = startRatio + (mouseDeltaY + scrollDeltaY) / baseHeight;
      }

      setActs(prev => {
        const newActs = [...prev];
        const limitedRatio = Math.max(1.0, newRatio);
        if (newActs[actIndex].cell_dimension_ratio !== limitedRatio) {
          newActs[actIndex] = { ...newActs[actIndex], cell_dimension_ratio: limitedRatio };
          return newActs;
        }
        return prev;
      });
    };

    const autoScroll = () => {
      if (!contentEl) return;
      let scrolled = false;
      const scrollSpeed = 10;

      if (settings.layout_direction === 'vertical') {
        if (currentClientX > window.innerWidth - 50) {
          contentEl.scrollLeft += scrollSpeed;
          scrolled = true;
        } else if (currentClientX < 50) {
          contentEl.scrollLeft -= scrollSpeed;
          scrolled = true;
        }
      } else {
        if (currentClientY > window.innerHeight - 50) {
          contentEl.scrollTop += scrollSpeed;
          scrolled = true;
        } else if (currentClientY < 165) {
          contentEl.scrollTop -= scrollSpeed;
          scrolled = true;
        }
      }

      if (scrolled) {
        updateRatio();
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      currentClientX = moveEvent.clientX;
      currentClientY = moveEvent.clientY;
      updateRatio();
    };

    const handleMouseUp = async () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
      
      // Get the latest state for the database update
      setActs(latestActs => {
        const finalAct = latestActs.find(a => a.id === actId);
        if (finalAct) {
          exec('UPDATE Acts SET cell_dimension_ratio = ? WHERE id = ?', [finalAct.cell_dimension_ratio, actId]);
        }
        return latestActs;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    animationFrameId = requestAnimationFrame(autoScroll);
  };

  return (
    <div className="main-board">
      <header className="main-board-header">
        <h1 className="project-title">{settings.name}</h1>
        
        <div className="settings-wrapper">
          <GearIcon className="tab-gear" onClick={() => setShowSettings(!showSettings)} />
          {showSettings && (
            <SettingsDropdown 
              actStructure={settings.act_structure}
              layoutDirection={settings.layout_direction}
              onToggleActs={toggleActs}
              onToggleLayout={toggleLayout}
              onOpenThemes={() => { setShowThemeSelector(true); setShowSettings(false); }}
              onResetDefault={resetToDefault}
              onSaveExit={handleSaveExit}
            />
          )}
        </div>

        <div className="toolbar-row">
          <div className="toolbar-spacer"></div>
          <div className="tab-bar">
            {activeTab !== 'board' && <button className="tab-btn" onClick={() => setActiveTab('board')}>Main Board</button>}
            {activeTab !== 'characters' && <button className="tab-btn" onClick={() => setActiveTab('characters')}>Characters</button>}
            {activeTab !== 'script' && <button className="tab-btn" onClick={() => setActiveTab('script')}>Script</button>}
          </div>
        </div>
      </header>
      
      <main className="main-board-content" ref={contentRef}>
        {activeTab === 'board' && (
          <div 
            className={`board-container layout-${settings.layout_direction}`}
            style={{ '--act-count': settings.act_structure } as React.CSSProperties}
          >
            <div className="acts-grid">
              {acts.map((act) => (
                <div 
                  key={act.id} 
                  className="act-cell"
                  style={{ '--cell-ratio': act.cell_dimension_ratio } as React.CSSProperties}
                >
                  <header className="act-header">
                    <h3>Act {act.act_number}</h3>
                  </header>
                  <div className="scene-list">
                    {scenes.filter(s => s.act_id === act.id).map(scene => (
                      <div key={scene.id} className="scene-card">
                        <span>{scene.title}</span>
                      </div>
                    ))}
                    {scenes.filter(s => s.act_id === act.id).length === 0 && (
                      <div className="scene-card placeholder">
                        <span>No Scenes</span>
                      </div>
                    )}
                  </div>
                  <div className="resize-handle" onMouseDown={(e) => handleResizeStart(e, act.id)}>
                    <div className="handle-icon"></div>
                  </div>
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
        <ThemeSelector onClose={handleThemeClose} />
      )}

      <button className="fab-add-card" onClick={handleAddScene} title="Add Scene">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};
