import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exec, initDB, exportDB } from '../../db';
import { CircleX } from '../../components/Navigation/CircleX';
import { GearIcon } from '../../components/Navigation/GearIcon';
import { ThemeSelector } from '../../components/Settings/ThemeSelector';
import './ProjectManager.css';

interface Project {
  id: string;
  name: string;
  act_structure: number;
  created_at: string;
  last_modified: string;
}

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  
  // Create Form State
  const [newName, setNewName] = useState('');
  const [newActs, setNewActs] = useState(3);
  
  // Load State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      await initDB();
      const result = await exec('SELECT * FROM Projects ORDER BY last_modified DESC') as Project[];
      
      if (result && Array.isArray(result)) {
        setProjects(result);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(`Database Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!isCreateValid) return;

    const id = crypto.randomUUID();
    try {
      await exec('INSERT INTO Projects (id, name, act_structure) VALUES (?, ?, ?)', [id, newName, newActs]);
      navigate(`/project/${id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleLoad = () => {
    if (selectedProjectId) {
      navigate(`/project/${selectedProjectId}`);
    }
  };

  const handleExport = async (e: React.MouseEvent, projectName: string) => {
    e.stopPropagation(); // Don't select the row
    try {
      const data = await exportDB();
      const blob = new Blob([data as any], { type: 'application/x-sqlite3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.brainplot`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed.');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Implementation of import would go here (writing to OPFS)
    // For now, just logging
    console.log('Importing file:', file.name);
    alert('Import logic coming soon! This will overwrite the local library.');
  };

  const isCreateValid = newName.trim().length > 0 && !newName.includes(' ');

  if (loading) {
    return <div className="project-manager-loading">Initializing BrainPlot...</div>;
  }

  if (error) {
    return (
      <div className="project-manager-container">
        <h1>BrainPlot</h1>
        <div className="error-message" style={{ color: 'var(--color-accent)', textAlign: 'center', padding: '2rem' }}>
          <p>{error}</p>
          <button className="action-btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-manager-container">
      <div className="landing-gear-container">
        <GearIcon onClick={() => setShowThemeSelector(true)} />
      </div>

      <h1>BrainPlot</h1>
      
      <div className="landing-actions">
        <button className="action-btn" onClick={() => setShowCreateModal(true)}>
          Create Project
        </button>
        <button className="action-btn" onClick={() => setShowLoadModal(true)}>
          Load Project
        </button>
        <label className="action-btn import-label">
          Import Project
          <input type="file" accept=".brainplot" onChange={handleImport} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="manager-modal-overlay">
          <div className="manager-modal-window">
            <div className="modal-close-container">
              <CircleX onClick={() => setShowCreateModal(false)} />
            </div>
            <h2>Create New Project</h2>
            
            <div className="input-group">
              <label>Project Name</label>
              <input 
                type="text" 
                placeholder="Enter Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <span className="reminder-text">Project name (no spaces allowed)</span>
            </div>

            <div className="input-group">
              <label>Acts Structure</label>
              <div className="toggle-group">
                <button 
                  className={`act-toggle-btn ${newActs === 3 ? 'selected' : ''}`}
                  onClick={() => setNewActs(3)}
                >
                  3 Acts
                </button>
                <button 
                  className={`act-toggle-btn ${newActs === 5 ? 'selected' : ''}`}
                  onClick={() => setNewActs(5)}
                >
                  5 Acts
                </button>
              </div>
            </div>

            <button 
              className={`modal-submit-btn ${isCreateValid ? 'create-btn-ready' : 'btn-disabled'}`}
              disabled={!isCreateValid}
              onClick={handleCreate}
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      {/* Load Project Modal */}
      {showLoadModal && (
        <div className="manager-modal-overlay">
          <div className="manager-modal-window">
            <div className="modal-close-container">
              <CircleX onClick={() => setShowLoadModal(false)} />
            </div>
            <h2>Load Project</h2>
            
            {projects.length === 0 ? (
              <p style={{ textAlign: 'center' }}>No projects found.</p>
            ) : (
              <ul className="project-selection-list">
                {projects.map(p => (
                  <li 
                    key={p.id} 
                    className={`project-select-item ${selectedProjectId === p.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProjectId(p.id)}
                  >
                    <div className="project-item-info">
                      <span className="project-name-text">{p.name}</span>
                      <span className="project-date-text">
                        {new Date(p.last_modified).toLocaleDateString()}
                      </span>
                    </div>
                    <button 
                      className="export-icon-btn" 
                      onClick={(e) => handleExport(e, p.name)}
                      title="Export Project"
                    >
                      💾
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button 
              className={`modal-submit-btn ${selectedProjectId ? 'load-btn-ready' : 'btn-disabled'}`}
              disabled={!selectedProjectId}
              onClick={handleLoad}
            >
              Load Project
            </button>
          </div>
        </div>
      )}

      {showThemeSelector && (
        <ThemeSelector onClose={() => setShowThemeSelector(false)} />
      )}
    </div>
  );
};
