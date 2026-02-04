import React from 'react';
import { Page, User, Theme } from '../types';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentUser: User | null;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentUser, onLogout, theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  // Helper for duplicate nav logic
  const NavLinks = () => (
    <>
      {currentUser ? (
        <>
          <NavItem onClick={() => handleNavClick('dashboard')}>Dashboard</NavItem>
          <NavItem onClick={() => handleNavClick('profile')}>Profile</NavItem>
          <NavItem onClick={() => handleNavClick('feedback')}>Feedback</NavItem>
          <NavItem onClick={() => { onLogout(); setIsMenuOpen(false); }}>Logout</NavItem>
        </>
      ) : (
        <>
          <NavItem onClick={() => handleNavClick('login')}>Login</NavItem>
          <NavItem onClick={() => handleNavClick('signup')}>Sign Up</NavItem>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white/60 backdrop-blur-lg dark:bg-gray-800/60 shadow-sm sticky top-0 z-50 border-b border-slate-200/80 dark:border-gray-700/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate(currentUser ? 'dashboard' : 'login')}>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">MindEase</h1>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <nav className="flex items-center space-x-3">
              <NavLinks />
            </nav>
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl absolute w-full left-0 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
             {currentUser ? (
              <>
                <MobileNavItem onClick={() => handleNavClick('dashboard')}>Dashboard</MobileNavItem>
                <MobileNavItem onClick={() => handleNavClick('profile')}>Profile</MobileNavItem>
                <MobileNavItem onClick={() => handleNavClick('feedback')}>Feedback</MobileNavItem>
                <MobileNavItem onClick={() => { onLogout(); setIsMenuOpen(false); }}>Logout</MobileNavItem>
              </>
            ) : (
              <>
                <MobileNavItem onClick={() => handleNavClick('login')}>Login</MobileNavItem>
                <MobileNavItem onClick={() => handleNavClick('signup')}>Sign Up</MobileNavItem>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const NavItem: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
    {children}
  </button>
);

const MobileNavItem: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="w-full text-left text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
    {children}
  </button>
);


export default Header;