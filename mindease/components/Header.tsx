import React from 'react';
import { Page, User, Theme } from '../types';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentUser: User | null;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentUser, onLogout, theme, setTheme }) => {
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white/60 backdrop-blur-lg dark:bg-gray-800/60 shadow-sm sticky top-0 z-50 border-b border-slate-200/80 dark:border-gray-700/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate(currentUser ? 'dashboard' : 'login')}>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">MindEase</h1>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-2">
                {currentUser ? (
                  <>
                    <NavItem onClick={() => onNavigate('dashboard')}>Dashboard</NavItem>
                    <NavItem onClick={() => onNavigate('assessment')}>Assessment</NavItem>
                    <NavItem onClick={() => onNavigate('journal')}>Journal</NavItem>
                    <NavItem onClick={() => onNavigate('profile')}>Profile</NavItem>
                    <NavItem onClick={onLogout}>Logout</NavItem>
                  </>
                ) : (
                  <>
                    <NavItem onClick={() => onNavigate('login')}>Login</NavItem>
                    <NavItem onClick={() => onNavigate('signup')}>Sign Up</NavItem>
                  </>
                )}
            </nav>
            <button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavItem: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
        {children}
    </button>
);


export default Header;