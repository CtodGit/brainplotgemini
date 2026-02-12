import React from 'react';
import './Navigation.css';

interface CircleXProps {
  onClick: () => void;
  className?: string;
}

export const CircleX: React.FC<CircleXProps> = ({ onClick, className = '' }) => {
  return (
    <button 
      className={`nav-control circle-x ${className}`} 
      onClick={onClick}
      aria-label="Exit"
    >
      <svg className="nav-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
};
