import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectManager } from './pages/ProjectManager/ProjectManager';
import { MainBoard } from './pages/MainBoard/MainBoard';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<ProjectManager />} />
          <Route path="/project/:projectId" element={<MainBoard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
