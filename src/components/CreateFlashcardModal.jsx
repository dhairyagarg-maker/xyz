import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, BookOpen, Layers, CheckCircle2, Wand2 } from 'lucide-react';

export default function CreateFlashcardModal({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  subjects = []
}) {
  const [subject, setSubject] = useState(initialData.subject || 'Machine Learning');
  const [videoTitle, setVideoTitle] = useState(initialData.videoTitle || 'Current Video');
  const [timestamp, setTimestamp] = useState(initialData.timestamp || '00:00');
  const [question, setQuestion] = useState(initialData.question || '');
  const [answer, setAnswer] = useState(initialData.answer || '');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    if (initialData.timestamp !== undefined) setTimestamp(initialData.timestamp);
    if (initialData.subject) setSubject(initialData.subject);
    if (initialData.videoTitle) setVideoTitle(initialData.videoTitle);
    if (initialData.question) setQuestion(initialData.question);
    if (initialData.answer) setAnswer(initialData.answer);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Auto-fill template for presentation convenience
  const handleAiAutoFill = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setQuestion(`What is the essential concept discussed at timestamp [${timestamp}]?`);
      setAnswer(`At ${timestamp}, the lecture emphasizes the mathematical intuition and key formulas needed for core problem-solving in ${subject}.`);
      setIsAiGenerating(false);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    onSave({
      id: `fc-${Date.now()}`,
      subject,
      videoTitle,
      youtubeId: initialData.youtubeId || '',
      timestamp: timestamp || '00:00',
      question,
      answer,
      difficulty,
      mastered: false,
      createdDate: 'Just now',
      reviewCount: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#0E1326] border border-purple-500/30 p-6 shadow-2xl shadow-purple-950/70 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Save Video Moment as Flashcard
              </h3>
              <p className="text-xs text-slate-400">Captured live from current YouTube stream</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Metadata Row: Subject & Live Captured Timestamp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                Subject / Topic
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (e.g. Machine Learning, Physics...)"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 text-xs font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Live Timestamp
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="00:00"
                  className="w-full px-3 py-2 rounded-xl bg-cyan-950/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Video Title info */}
          <div className="text-[11px] text-slate-400 truncate bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5">
            🎥 Video: <span className="text-slate-200">{videoTitle}</span>
          </div>

          {/* AI Helper Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-200">
                Want high-yield summary for moment [{timestamp}]?
              </span>
            </div>
            <button
              type="button"
              onClick={handleAiAutoFill}
              disabled={isAiGenerating}
              className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              {isAiGenerating ? 'Generating...' : 'Auto-Fill Card'}
            </button>
          </div>

          {/* Question Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Question or Core Concept
            </label>
            <textarea
              rows={2}
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Why does backpropagation traverse the network in reverse order?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 text-xs leading-relaxed placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Answer Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Answer & High-Yield Solution
            </label>
            <textarea
              rows={3}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. Because the chain rule computes intermediate gradients recursively starting from final cost loss ∂C/∂a."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 text-xs leading-relaxed placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">Target Difficulty:</span>
            <div className="flex gap-2">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    difficulty === diff
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Flashcard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
