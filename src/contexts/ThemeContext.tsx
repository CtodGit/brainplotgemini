import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_PRIMARY = '#000000';
const DEFAULT_SECONDARY = '#ff0000';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('theme-primary') || DEFAULT_PRIMARY);
  const [secondaryColor, setSecondaryColor] = useState(() => localStorage.getItem('theme-secondary') || DEFAULT_SECONDARY);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-background', primaryColor);
    root.style.setProperty('--color-accent', secondaryColor);
    
    // Calculate contrast text color (White or Black)
    const isDark = isColorDark(primaryColor);
    root.style.setProperty('--color-text', isDark ? '#ffffff' : '#000000');
    
    // Opaque surface color
    const surfaceColor = adjustColor(primaryColor, isDark ? 20 : -20);
    root.style.setProperty('--color-surface', surfaceColor);
    root.style.setProperty('--color-border', isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)');

    // Button hover color
    const hoverColor = adjustColor(secondaryColor, isDark ? 20 : -20);
    root.style.setProperty('--button-hover-background', hoverColor);

    localStorage.setItem('theme-primary', primaryColor);
    localStorage.setItem('theme-secondary', secondaryColor);
  }, [primaryColor, secondaryColor]);

  const resetTheme = () => {
    setPrimaryColor(DEFAULT_PRIMARY);
    setSecondaryColor(DEFAULT_SECONDARY);
  };

  return (
    <ThemeContext.Provider value={{ primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Helper to determine if a color is dark (for text contrast)
function isColorDark(color: string) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// Helper to lighten/darken a color
function adjustColor(color: string, amount: number) {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
