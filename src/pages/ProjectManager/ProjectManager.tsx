import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exec, initDB } from '../../db';
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
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      await initDB();
      const result = await exec('SELECT * FROM Projects ORDER BY last_modified DESC') as { values: any[][] }[];
      
      if (result && result.length > 0 && result[0].values) {
        const mappedProjects: Project[] = result[0].values.map((row: any[]) => ({
          id: row[0],
          name: row[1],
          act_structure: row[2],
          created_at: row[3],
          last_modified: row[4],
        }));
        setProjects(mappedProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const id = crypto.randomUUID();
    try {
      await exec('INSERT INTO Projects (id, name) VALUES (?, ?)', [id, newProjectName]);
      setNewProjectName('');
      await loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await exec('DELETE FROM Projects WHERE id = ?', [id]);
      await loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const loadProject = (id: string) => {
    navigate(`/project/${id}`);
  };

  if (loading) {
    return <div className="project-manager-loading">Loading Projects...</div>;
  }

  return (
    <div className="project-manager">
      <h1>BrainPlot</h1>
      
      <section className="create-project">
        <form onSubmit={createProject}>
          <input
            type="text"
            placeholder="New Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button type="submit">Create Project</button>
        </form>
      </section>

      <section className="project-list">
        <h2>Your Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet. Create one above!</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id} className="project-item">
                <div className="project-info" onClick={() => loadProject(project.id)}>
                  <span className="project-name">{project.name}</span>
                  <span className="project-date">Modified: {new Date(project.last_modified).toLocaleDateString()}</span>
                </div>
                <div className="project-actions">
                  <button onClick={() => deleteProject(project.id)} className="delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
