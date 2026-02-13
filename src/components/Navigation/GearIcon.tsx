import React from 'react';
import './Navigation.css';

interface GearIconProps {
  onClick: () => void;
  className?: string;
}

export const GearIcon: React.FC<GearIconProps> = ({ onClick, className = '' }) => {
  return (
    <button 
      className={`nav-control gear-icon ${className}`} 
      onClick={onClick}
      aria-label="Settings/Edit"
    >
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Circle */}
        <circle cx="12" cy="12" r="9" />
        {/* Inner Axel Bore */}
        <circle cx="12" cy="12" r="3" />
        {/* 8 radial spokes/teeth */}
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="22" y1="12" x2="20" y2="12" />
        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
        <line x1="19.07" y1="19.07" x2="17.66" y2="17.66" />
        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
        <line x1="19.07" y1="4.93" x2="17.66" y2="6.34" />
      </svg>
    </button>
  );
};
