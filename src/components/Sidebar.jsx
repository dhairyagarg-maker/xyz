import React from 'react';
import { 
  LayoutDashboard, 
  PlayCircle, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ 
  currentSection, 
  setCurrentSection, 
  flashcardsCount, 
  masteredCount,
  streak,
  focusModeActive
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Overview & Goals'
    },
    {
      id: 'focus',
      label: 'Focus Mode',
      icon: PlayCircle,
      badge: focusModeActive ? 'LIVE' : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      desc: 'Zen Video Player'
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: Layers,
      badge: `${masteredCount}/${flashcardsCount}`,
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      desc: 'Timestamped Moments'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: '98%',
      badgeColor: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
      desc: 'Focus Insights'
    },
  ];

  return (
    <aside
      className="w-72 flex-shrink-0 backdrop-blur-xl border-r flex flex-col justify-between h-screen sticky top-0 z-40 transition-all select-none"
      style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-soft)' }}
    >
      <div>
        {/* Logo Brand Header */}
        <div className="p-6 pb-4 border-b" style={{ borderColor: 'var(--border-soft)' }}>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 shadow-lg shadow-purple-600/30 p-2.5 group cursor-pointer">
              {/* Play symbol with graduate cap overlay */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-[10px] font-black text-slate-950">
                ✦
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  YouTube LearnMode
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Distraction-Free Learning</p>
            </div>
          </div>
        </div>

        {/* Streak & Status Pill */}
        <div className="px-5 py-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/30 border border-purple-500/20 shadow-inner">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 animate-pulse">
                <Flame className="w-4 h-4 fill-orange-500/40" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{streak} Day Streak</p>
                <p className="text-[10px] text-slate-400">Keep learning today</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              🔥 ACTIVE
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="px-3 py-2 space-y-1.5">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-blue-600/20 text-white border border-purple-500/40 shadow-lg shadow-purple-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {/* Active glow indicator on left */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                )}

                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-purple-500/30 text-purple-200 shadow-sm shadow-purple-500/40' 
                      : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-white/5'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-none">{item.label}</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-400 leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-white/10 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom widgets & Distraction Shield status */}
      <div className="p-4 space-y-3 border-t border-white/5 bg-[#080B17]/60">
        {/* Distraction Blocker Shield Pill */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Distraction Blocker</p>
              <p className="text-[10px] text-emerald-400 font-mono">Shield Active</p>
            </div>
          </div>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0A0E1D]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Student Scholar</p>
              <p className="text-[10px] text-purple-300 font-medium">Self-Paced Learning</p>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
            PRO
          </div>
        </div>
      </div>
    </aside>
  );
}
