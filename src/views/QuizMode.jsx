import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Clock, 
  Check, 
  Award, 
  ChevronRight,
  BookOpen,
  Zap,
  Layers
} from 'lucide-react';

export default function QuizMode({ 
  quizzes, 
  onQuizComplete, 
  onNavigateToFlashcards 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer while quiz is active
  useEffect(() => {
    let interval = null;
    if (!isFinished) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFinished]);

  const currentQuiz = quizzes[currentIndex];

  const handleSelectOption = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuiz.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQuiz.question,
        selected: selectedOption,
        correct: currentQuiz.correctIndex,
        isCorrect
      }
    ]);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished quiz!
      setIsFinished(true);

      // Trigger Confetti explosion for hackathon presentation delight
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
        });
      } catch (err) {
        console.error(err);
      }

      // Notify parent to increment quizzesCompleted in dashboard & analytics
      if (onQuizComplete) {
        onQuizComplete({
          score: score + (selectedOption === currentQuiz.correctIndex ? 1 : 0),
          total: quizzes.length,
          timeSpent
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
    setTimeSpent(0);
  };

  const progressPercent = ((currentIndex + 1) / quizzes.length) * 100;
  const accuracyPercent = Math.round((score / quizzes.length) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Quiz Top Header & Progress */}
      <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                Adaptive Flashcard Quiz
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ⏱ {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Test Your Concept Retention
            </h2>
          </div>

          {!isFinished && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-300">
                Question <span className="text-purple-400 font-bold">{currentIndex + 1}</span> of {quizzes.length}
              </span>
              <div className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold">
                Score: {score} pts
              </div>
            </div>
          )}
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${isFinished ? 100 : progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Interactive Stage */}
      {!isFinished ? (
        <div className="rounded-2xl bg-[#0D1224]/90 backdrop-blur-md border border-white/5 p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Metadata: Subject & Timestamp reference */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {currentQuiz.subject}
            </span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-md">
              From Lecture @ {currentQuiz.timestamp}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select the most accurate statement:
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuiz.question}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuiz.correctIndex;

              let buttonStyle = 'bg-white/[0.02] border-white/10 text-slate-200 hover:bg-white/[0.05] hover:border-purple-500/30';
              let badgeStyle = 'bg-white/10 text-slate-300';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  buttonStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-950/50';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                  badgeStyle = 'bg-rose-500 text-white font-bold';
                } else {
                  buttonStyle = 'opacity-40 bg-white/[0.01] border-white/5 text-slate-400';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-purple-600/20 border-purple-500 text-purple-100 shadow-lg shadow-purple-950/50';
                badgeStyle = 'bg-purple-500 text-white font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-200 ${buttonStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono flex-shrink-0 transition-colors ${badgeStyle}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium pt-0.5 leading-relaxed flex-1">
                    {option}
                  </span>
                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner (Revealed after submission) */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Concept Explanation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuiz.explanation}
              </p>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xs text-slate-400">
              {isAnswerSubmitted 
                ? (selectedOption === currentQuiz.correctIndex ? '✓ Correct! Well done.' : '✗ Incorrect. Review the explanation above.')
                : (selectedOption !== null ? 'Ready to submit your answer' : 'Choose an option to continue')}
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  selectedOption !== null
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-purple-600/30 hover:opacity-95'
                    : 'bg-white/5 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Check Answer</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-2"
              >
                <span>{currentIndex < quizzes.length - 1 ? 'Next Question' : 'See Final Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* FINISHED SCORE SCREEN */
        <div className="rounded-2xl bg-gradient-to-b from-[#11162F] to-[#0A0E1D] border border-purple-500/40 p-8 text-center space-y-6 shadow-2xl shadow-purple-950/60 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 mx-auto flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/30">
            <Trophy className="w-10 h-10 fill-current" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              Quiz Completed Successfully!
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Outstanding Focus, Alex!
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your concept retention from the watched lecture timestamps has been updated in your dashboard analytics.
            </p>
          </div>

          {/* Results Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto py-2">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-xs text-slate-400">Total Score</span>
              <p className="text-2xl font-extrabold text-white font-mono mt-1">
                {score} / {quizzes.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-xs text-slate-400">Accuracy</span>
              <p className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
                {accuracyPercent}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-xs text-slate-400">Time Taken</span>
              <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
                {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
              </p>
            </div>
          </div>

          {/* Unlocked Achievement */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 max-w-md mx-auto flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Badge Unlocked: High-Yield Scholar</p>
              <p className="text-[11px] text-slate-400">Consistently scoring above 80% on video-derived flashcard quizzes.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={onNavigateToFlashcards}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Review Flashcard Decks</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
