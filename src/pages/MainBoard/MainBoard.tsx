import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GearIcon } from '../../components/Navigation/GearIcon';
import { SettingsDropdown } from '../../components/Settings/SettingsDropdown';
import { ThemeSelector } from '../../components/Settings/ThemeSelector';
import { exec, initDB } from '../../db';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../../components/UI/Modal';
import { SceneCard } from '../../components/Cards/SceneCard';
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
  location?: string;
  time_of_day?: string;
  hero_image_url?: string;
}

export const MainBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor } = useTheme();
  
  const [activeTab, setActiveTab] = useState<Tab>('board');
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  // Scene Modal State
  const [showSceneModal, setShowSceneModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentScene, setCurrentScene] = useState<Partial<Scene> | null>(null);
  
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
      const projResult = await exec('SELECT name, act_structure, layout_direction, primary_color, secondary_color FROM Projects WHERE id = ?', [projectId]) as any[];
      if (projResult && projResult.length > 0) {
        setSettings(projResult[0]);
        setPrimaryColor(projResult[0].primary_color);
        setSecondaryColor(projResult[0].secondary_color);
      }

      const actsResult = await exec('SELECT id, act_number, name, cell_dimension_ratio FROM Acts WHERE project_id = ? ORDER BY act_number ASC', [projectId]) as any[];
      if (actsResult && actsResult.length > 0) {
        setActs(actsResult);
      } else {
        const initialActs: Act[] = [];
        const actCount = projResult[0]?.act_structure || 3;
        for (let i = 1; i <= actCount; i++) {
          const actId = crypto.randomUUID();
          await exec('INSERT INTO Acts (id, project_id, act_number, cell_dimension_ratio) VALUES (?, ?, ?, ?)', 
            [actId, projectId, i, 1.0]);
          initialActs.push({ id: actId, act_number: i, name: `Act ${i}`, cell_dimension_ratio: 1.0 });
        }
        setActs(initialActs);
      }

      const scenesResult = await exec('SELECT id, act_id, title, scene_number, location, time_of_day, hero_image_url FROM Scenes WHERE project_id = ? ORDER BY scene_number ASC', [projectId]) as any[];
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

  const handleAddSceneClick = () => {
    if (acts.length === 0 || !contentRef.current) return;
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
    targetActIndex = Math.max(0, Math.min(acts.length - 1, targetActIndex));
    const targetAct = acts[targetActIndex];

    setCurrentScene({
      id: crypto.randomUUID(),
      act_id: targetAct.id,
      title: '',
      location: '',
      time_of_day: 'DAY',
      scene_number: scenes.length + 1
    });
    setIsEditing(true);
    setShowSceneModal(true);
  };

  const handleApplyScene = async () => {
    if (!currentScene || !currentScene.title) return;
    try {
      const existing = await exec('SELECT id FROM Scenes WHERE id = ?', [currentScene.id]) as any[];
      if (existing && existing.length > 0) {
        await exec(
          'UPDATE Scenes SET title = ?, location = ?, time_of_day = ?, hero_image_url = ? WHERE id = ?',
          [currentScene.title, currentScene.location, currentScene.time_of_day, currentScene.hero_image_url, currentScene.id]
        );
      } else {
        await exec(
          'INSERT INTO Scenes (id, project_id, act_id, scene_number, title, location, time_of_day, hero_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [currentScene.id, projectId, currentScene.act_id, currentScene.scene_number, currentScene.title, currentScene.location, currentScene.time_of_day, currentScene.hero_image_url]
        );
      }
      setIsEditing(false); // Switch to Read-Only mode instead of closing
      loadProjectData();
    } catch (error) {
      console.error('Failed to apply scene:', error);
    }
  };

  const handleDeleteScene = async () => {
    if (!currentScene?.id) return;
    if (!window.confirm('Delete this scene permanently?')) return;
    try {
      await exec('DELETE FROM Scenes WHERE id = ?', [currentScene.id]);
      setShowSceneModal(false);
      loadProjectData();
    } catch (error) {
      console.error('Failed to delete scene:', error);
    }
  };

  const handleSceneOpen = (scene: Scene) => {
    setCurrentScene(scene);
    setIsEditing(false);
    setShowSceneModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (currentScene) {
        setCurrentScene({ ...currentScene, hero_image_url: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleActs = async () => {
    const currentCount = settings.act_structure;
    const nextCount = currentCount === 3 ? 5 : 3;
    if (nextCount < currentCount) {
      try {
        const removedActs = acts.filter(a => a.act_number > nextCount);
        const removedActIds = removedActs.map(a => a.id);
        if (removedActIds.length > 0) {
          const sql = `SELECT COUNT(*) as count FROM Scenes WHERE act_id IN (${removedActIds.map(() => '?').join(',')})`;
          const result = await exec(sql, removedActIds) as any[];
          if ((result[0]?.count || 0) > 0) {
            if (!window.confirm(`Act 4/5 contain scenes that will be deleted. Proceed?`)) return;
          }
        }
        await exec(`DELETE FROM Acts WHERE project_id = ? AND act_number > ?`, [projectId, nextCount]);
      } catch (e) { console.error(e); }
    } else {
      for (let i = currentCount + 1; i <= nextCount; i++) {
        await exec('INSERT INTO Acts (id, project_id, act_number, cell_dimension_ratio) VALUES (?, ?, ?, ?)', 
          [crypto.randomUUID(), projectId, i, 1.0]);
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
      let newRatio = settings.layout_direction === 'vertical' 
        ? startRatio + (currentClientX - startX + scrollDeltaX) / baseWidth
        : startRatio + (currentClientY - startY + scrollDeltaY) / baseHeight;

      setActs(prev => {
        const newActs = [...prev];
        newActs[actIndex] = { ...newActs[actIndex], cell_dimension_ratio: Math.max(1.0, newRatio) };
        return newActs;
      });
    };

    const autoScroll = () => {
      if (!contentEl) return;
      let scrolled = false;
      if (settings.layout_direction === 'vertical') {
        if (currentClientX > window.innerWidth - 50) { contentEl.scrollLeft += 10; scrolled = true; }
        else if (currentClientX < 50) { contentEl.scrollLeft -= 10; scrolled = true; }
      } else {
        if (currentClientY > window.innerHeight - 50) { contentEl.scrollTop += 10; scrolled = true; }
        else if (currentClientY < 165) { contentEl.scrollTop -= 10; scrolled = true; }
      }
      if (scrolled) updateRatio();
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    const onMove = (me: MouseEvent) => { currentClientX = me.clientX; currentClientY = me.clientY; updateRatio(); };
    const onUp = async () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(animationFrameId);
      setActs(latest => {
        const a = latest.find(act => act.id === actId);
        if (a) exec('UPDATE Acts SET cell_dimension_ratio = ? WHERE id = ?', [a.cell_dimension_ratio, actId]);
        return latest;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
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
              actStructure={settings.act_structure} layoutDirection={settings.layout_direction}
              onToggleActs={toggleActs} onToggleLayout={toggleLayout} onOpenThemes={() => { setShowThemeSelector(true); setShowSettings(false); }}
              onResetDefault={resetToDefault} onSaveExit={handleSaveExit}
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
          <div className={`board-container layout-${settings.layout_direction}`} style={{ '--act-count': settings.act_structure } as React.CSSProperties}>
            <div className="acts-grid">
              {acts.map((act) => (
                <div key={act.id} className="act-cell" style={{ '--cell-ratio': act.cell_dimension_ratio } as React.CSSProperties}>
                  <header className="act-header"><h3>Act {act.act_number}</h3></header>
                  <div className="scene-list">
                    {scenes.filter(s => s.act_id === act.id).map(s => <SceneCard key={s.id} scene={s} onOpenDetail={() => handleSceneOpen(s)} />)}
                    {scenes.filter(s => s.act_id === act.id).length === 0 && <div className="scene-card-empty placeholder"><span>Empty Act</span></div>}
                  </div>
                  <div className="resize-handle" onMouseDown={(e) => handleResizeStart(e, act.id)}><div className="handle-icon"></div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showThemeSelector && <ThemeSelector onClose={handleThemeClose} />}

      <Modal 
        isOpen={showSceneModal} 
        onClose={() => setShowSceneModal(false)} 
        title={isEditing ? 'Edit Scene' : currentScene?.title || 'Scene Detail'}
      >
        {currentScene && (
          <div className="scene-detail-modal-content">
            <div className="detail-meta-grid">
              <div className="detail-field"><label>Title</label>{isEditing ? <input type="text" value={currentScene.title} onChange={e => setCurrentScene({ ...currentScene, title: e.target.value })} /> : <span>{currentScene.title}</span>}</div>
              <div className="detail-field"><label>Location</label>{isEditing ? <input type="text" placeholder="e.g. INT. KITCHEN" value={currentScene.location || ''} onChange={e => setCurrentScene({ ...currentScene, location: e.target.value })} /> : <span>{currentScene.location || 'NONE'}</span>}</div>
              <div className="detail-field"><label>Time of Day</label>{isEditing ? <select value={currentScene.time_of_day || 'DAY'} onChange={e => setCurrentScene({ ...currentScene, time_of_day: e.target.value })}><option value="DAY">DAY</option><option value="NIGHT">NIGHT</option><option value="DUSK">DUSK</option><option value="DAWN">DAWN</option></select> : <span>{currentScene.time_of_day || 'DAY'}</span>}</div>
              {isEditing && (
                <div className="detail-field">
                  <label>Scene Image</label>
                  <label className="file-input-label">
                    <span>{currentScene.hero_image_url ? 'Change Image' : 'Click to choose file'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              )}
            </div>
            <div className="inspiration-preview-placeholder">
              <div className="preview-label">Inspiration Board Snapshot</div>
              <div className="preview-snapshot">
                <span>Double-tap to enter Inspiration Board</span>
              </div>
            </div>
            <div className="modal-actions-footer">
              <div className="footer-left">
                {isEditing ? (
                  <button className="apply-btn modal-btn" onClick={handleApplyScene}>Apply</button>
                ) : (
                  <button className="edit-btn modal-btn" onClick={() => setIsEditing(true)}>Edit</button>
                )}
              </div>
              <div className="footer-right">
                {!isEditing && (
                  <button className="delete-btn modal-btn" onClick={handleDeleteScene}>Delete Scene</button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <button className="fab-add-card" onClick={handleAddSceneClick} title="Add Scene">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
    </div>
  );
};
