import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircleX } from '../../components/Navigation/CircleX';
import { GearIcon } from '../../components/Navigation/GearIcon';
import './MainBoard.css';

type Tab = 'board' | 'characters' | 'script';

export const MainBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('board');

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
          <GearIcon className="tab-gear" onClick={() => console.log('Settings clicked')} />
        </div>
        <CircleX onClick={() => navigate('/')} />
      </header>
      
      <main className="main-board-content">
        {activeTab === 'board' && (
          <div className="board-container">
            <h2>Scene Timeline (Coming Soon)</h2>
            <p>Project ID: {projectId}</p>
          </div>
        )}
        {activeTab === 'characters' && (
          <div className="characters-container">
            <h2>Character Library (Coming Soon)</h2>
          </div>
        )}
        {activeTab === 'script' && (
          <div className="script-container">
            <h2>Global Script Library (Coming Soon)</h2>
          </div>
        )}
      </main>
    </div>
  );
};
