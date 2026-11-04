import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  RotateCw, 
  CheckCircle, 
  Clock, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  BookOpen, 
  Filter, 
  Play, 
  Check, 
  HelpCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export default function Flashcards({
  flashcards,
  onToggleMastered,
  openCreateModal,
  onNavigateToVideo,
  activeSubjectFilter,
  setActiveSubjectFilter
}) {
  const [flippedCards, setFlippedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, mastered, review

  // Flip toggle handler
  const handleFlip = (cardId, e) => {
    // If clicking a button on the back/front, don't trigger flip if it's an action
    if (e.target.closest('button.action-btn')) return;
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Flip all cards at once (fun hackathon demo interaction!)
  const handleFlipAll = () => {
    const allFlipped = Object.values(flippedCards).filter(Boolean).length === flashcards.length;
    const newState = {};
    if (!allFlipped) {
      flashcards.forEach(c => newState[c.id] = true);
    }
    setFlippedCards(newState);
  };

  // Filtered flashcards list
  const filteredCards = flashcards.filter(card => {
    const matchesSubject = activeSubjectFilter === 'all' || 
      card.subject.toLowerCase().includes(activeSubjectFilter.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'mastered' ? card.mastered : !card.mastered);

    const matchesSearch = searchQuery === '' || 
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesStatus && matchesSearch;
  });

  const masteredCount = flashcards.filter(c => c.mastered).length;
  const reviewCount = flashcards.length - masteredCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Video Timestamp Flashcards
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                {flashcards.length} Total Cards
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Click any card to flip 3D and reveal the high-yield answer & timestamped context.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Flip All Helper */}
            <button
              onClick={handleFlipAll}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Flip All Cards</span>
            </button>

            {/* Create New Flashcard Button */}
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Flashcard</span>
            </button>
          </div>
        </div>

        {/* Filter Bar: Subject pills, Search, and Status */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-white/5">
          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Subjects' },
              { id: 'Machine Learning', label: 'ML' },
              { id: 'Quantum Physics', label: 'Quantum' },
              { id: 'Computer Science', label: 'CS' },
              { id: 'Calculus', label: 'Calculus' },
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setActiveSubjectFilter(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                  activeSubjectFilter === pill.id
                    ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Right: Search & Mastery toggle */}
          <div className="flex items-center gap-2.5">
            {/* Status switcher */}
            <div className="flex p-0.5 rounded-xl bg-white/[0.03] border border-white/10">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  statusFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({flashcards.length})
              </button>
              <button
                onClick={() => setStatusFilter('review')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  statusFilter === 'review' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In Review ({reviewCount})
              </button>
              <button
                onClick={() => setStatusFilter('mastered')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  statusFilter === 'mastered' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mastered ({masteredCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cards..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Flashcards Grid with 3D Flip Effect */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0D1224]/50 border border-white/5 space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No flashcards found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filters or click "New Flashcard" to capture your next high-yield video moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => {
            const isFlipped = !!flippedCards[card.id];

            return (
              <div
                key={card.id}
                onClick={(e) => handleFlip(card.id, e)}
                className="perspective-1000 h-80 cursor-pointer group"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d rounded-2xl shadow-xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT FACE OF CARD */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-b from-[#10162B] to-[#0A0E1D] border border-white/10 group-hover:border-purple-500/40 p-6 flex flex-col justify-between shadow-lg shadow-black/40">
                    <div>
                      {/* Top Bar: Subject & Timestamp */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {card.subject}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" />
                          <span>{card.timestamp}</span>
                        </div>
                      </div>

                      {/* Video Title tag */}
                      <p className="text-[11px] text-slate-500 mt-3 line-clamp-1">
                        🎬 {card.videoTitle}
                      </p>

                      {/* Question */}
                      <div className="mt-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400/80">
                          Question / Prompt
                        </span>
                        <h3 className="text-base font-bold text-white mt-1 leading-snug group-hover:text-purple-100 transition-colors">
                          {card.question}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Status & Flip Hint */}
                    <div>
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          card.difficulty === 'Hard' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' :
                          card.difficulty === 'Medium' ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                          'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                        }`}>
                          {card.difficulty}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                          <span>Flip for Answer</span>
                          <RotateCw className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE OF CARD (Flipped 180deg) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-b from-[#131A36] to-[#0D1226] border border-purple-500/50 p-6 flex flex-col justify-between shadow-2xl shadow-purple-950/60 ring-1 ring-purple-400/30">
                    <div>
                      {/* Top Bar on back */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Key Answer & Solution</span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-300">
                          @ {card.timestamp}
                        </span>
                      </div>

                      {/* Answer Body */}
                      <div className="mt-3">
                        <p className="text-xs text-slate-200 leading-relaxed max-h-40 overflow-y-auto pr-1">
                          {card.answer}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions on Back */}
                    <div className="space-y-2 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        {/* Toggle Mastered button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMastered(card.id);
                          }}
                          className={`action-btn flex-1 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                            card.mastered
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{card.mastered ? 'Mastered ✓' : 'Mark Mastered'}</span>
                        </button>

                        {/* Jump to video button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToVideo(card);
                          }}
                          className="action-btn px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1 transition-all"
                          title="Jump to Video at timestamp"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Jump</span>
                        </button>
                      </div>

                      <p className="text-center text-[10px] text-slate-500">
                        Click card again to flip back
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
