import React from 'react';
import { 
  PlusCircle, 
  Menu, 
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({ 
  currentSection, 
  eyeCareActive, 
  setEyeCareActive,
  isDarkMode,
  setIsDarkMode,
  openCreateModal,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  const titles = {
    dashboard: { main: 'Learning Dashboard', sub: 'Weekly progress, study streak, and memory retention metrics' },
    focus: { main: 'Focus Mode Player', sub: 'Distraction-free YouTube viewing with live moment capture' },
    flashcards: { main: 'Memory Flashcards', sub: 'Interactive 3D timestamped review cards captured from lecture moments' },
    analytics: { main: 'Performance & Deep Work Analytics', sub: 'Detailed breakdown of study time, subject allocation, and focus efficiency' },
  };

  return (
    <header
      className="sticky top-0 z-30 h-18 backdrop-blur-2xl border-b px-6 flex items-center justify-between transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-navbar)',
        borderColor: 'var(--border-soft)',
      }}
    >
      {/* Left: Mobile hamburger & Section Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl border transition-colors"
          style={{ background: 'var(--bg-hover)', borderColor: 'var(--border-mid)', color: 'var(--text-secondary)' }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {titles[currentSection]?.main || 'YouTube LearnMode'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Focus Shield Active
            </span>
          </div>
          <p className="hidden md:block text-xs" style={{ color: 'var(--text-muted)' }}>
            {titles[currentSection]?.sub}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Dark / Light Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
            isDarkMode
              ? 'bg-slate-700/40 border-slate-600/50 text-slate-200 hover:bg-slate-600/50'
              : 'bg-amber-50 border-amber-200/60 text-amber-700 hover:bg-amber-100'
          }`}
        >
          {isDarkMode
            ? <Moon className="w-3.5 h-3.5 text-blue-300" />
            : <Sun className="w-3.5 h-3.5 text-amber-500" />
          }
          <span className="hidden sm:inline">{isDarkMode ? 'Dark' : 'Light'}</span>
        </button>

        {/* Eye-Care / Blue-Light Warmth Toggle */}
        <button
          onClick={() => setEyeCareActive(!eyeCareActive)}
          title="Toggle Eye-Care mode to filter harsh blue light and soften screen contrast"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
            eyeCareActive
              ? 'bg-amber-500/25 border-amber-400/70 text-amber-300 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40'
              : 'border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
          }`}
          style={!eyeCareActive ? { background: 'var(--bg-hover)', borderColor: 'var(--border-mid)' } : {}}
        >
          <Sun className={`w-3.5 h-3.5 ${eyeCareActive ? 'text-amber-300 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">{eyeCareActive ? 'Eye Care: ON' : 'Eye Care'}</span>
        </button>

        {/* Global Create Flashcard Button */}
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all border border-purple-400/30 active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5 text-white" />
          <span>New Flashcard</span>
        </button>
      </div>
    </header>
  );
}
