import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CreateFlashcardModal from './components/CreateFlashcardModal';
import Toast from './components/Toast';

import Dashboard from './views/Dashboard';
import FocusMode from './views/FocusMode';
import Flashcards from './views/Flashcards';
import Analytics from './views/Analytics';

import { 
  SAMPLE_VIDEOS, 
  INITIAL_FLASHCARDS, 
  INITIAL_STATS, 
  WEEKLY_STUDY_DATA,
  INITIAL_SUBJECTS,
  parseTimestampToSeconds
} from './data/sampleData';

export default function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [stats, setStats] = useState(INITIAL_STATS);
  const [videos, setVideos] = useState(SAMPLE_VIDEOS);
  const [activeVideo, setActiveVideo] = useState(SAMPLE_VIDEOS[0]);
  const [flashcards, setFlashcards] = useState(INITIAL_FLASHCARDS);
  const [weeklyData, setWeeklyData] = useState(WEEKLY_STUDY_DATA);
  
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [eyeCareActive, setEyeCareActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('all');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialData, setCreateModalInitialData] = useState({});
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync dark/light mode to <html> data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Helper to trigger feedback toast
  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Open Create Modal from Focus Mode with AUTOMATICALLY SELECTED LIVE TIMESTAMP!
  const handleSaveCurrentMoment = (exactTimestamp, video) => {
    const currentVid = video || activeVideo;
    setCreateModalInitialData({
      timestamp: exactTimestamp || '00:00',
      videoTitle: currentVid.title,
      subject: currentVid.subject || 'Lecture',
      youtubeId: currentVid.youtubeId || '',
      question: '',
      answer: ''
    });
    setIsCreateModalOpen(true);
  };

  // Save new flashcard
  const handleSaveFlashcard = (newCard) => {
    setFlashcards(prev => [newCard, ...prev]);
    setStats(prev => ({
      ...prev,
      flashcardsSaved: prev.flashcardsSaved + 1,
      distractionsBlocked: prev.distractionsBlocked + 3
    }));
    showToast(
      'Flashcard Saved Live!', 
      `Captured moment at [${newCard.timestamp}] for ${newCard.subject}.`
    );
  };

  // Toggle card mastered state & dynamically update dashboard stats!
  const handleToggleMastered = (cardId) => {
    setFlashcards(prev => prev.map(card => {
      if (card.id === cardId) {
        const nextMastered = !card.mastered;
        setStats(s => ({
          ...s,
          flashcardsMastered: Math.max(0, s.flashcardsMastered + (nextMastered ? 1 : -1))
        }));
        showToast(
          nextMastered ? 'Concept Mastered! 🎯' : 'Marked for Review',
          `Updated card: "${card.question.slice(0, 32)}..."`
        );
        return { ...card, mastered: nextMastered };
      }
      return card;
    }));
  };

  // When user clicks "Jump" from flashcard to video -> Start AT THE EXACT TIMESTAMP!
  const handleNavigateToVideo = (card) => {
    const targetSeconds = parseTimestampToSeconds(card.timestamp);

    let matchingVideo = null;
    if (card.youtubeId) {
      matchingVideo = videos.find(v => v.youtubeId === card.youtubeId);
    }
    if (!matchingVideo && card.videoTitle) {
      matchingVideo = videos.find(v => v.title.toLowerCase().includes(card.videoTitle.toLowerCase()));
    }
    if (!matchingVideo && card.subject) {
      matchingVideo = videos.find(v => v.subject.toLowerCase() === card.subject.toLowerCase());
    }
    if (!matchingVideo) {
      matchingVideo = activeVideo;
    }

    setActiveVideo({
      ...matchingVideo,
      currentTimestamp: card.timestamp,
      currentSeconds: targetSeconds,
      seekToSeconds: targetSeconds,
      timestampTrigger: Date.now()
    });

    setCurrentSection('focus');
    showToast('Jumped to Lecture', `Playing video from timestamp [${card.timestamp}]`);
  };

  // When a study session / timer finishes
  const handleStudySessionComplete = (addedHours) => {
    const hrs = addedHours || 0.42; // ~25 mins
    setStats(prev => ({
      ...prev,
      studyHours: +(prev.studyHours + hrs).toFixed(1),
      distractionsBlocked: prev.distractionsBlocked + 8
    }));
    showToast('Focus Session Logged!', `Added +${(hrs * 60).toFixed(0)} mins to study record.`);
  };

  const masteredCount = flashcards.filter(c => c.mastered).length;

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col md:flex-row font-sans selection:bg-purple-600/30 selection:text-purple-200 antialiased transition-colors duration-500`}
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Eye Care Amber Blue-Light Absorption Overlay */}
      {eyeCareActive && (
        <div 
          className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            backdropFilter: 'sepia(24%) brightness(96%) contrast(98%)'
          }}
        />
      )}

      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-700 ${
          eyeCareActive ? 'bg-amber-600/15' : isDarkMode ? 'bg-purple-600/10' : 'bg-purple-500/8'
        }`} />
        <div className={`absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] transition-all duration-700 ${
          eyeCareActive ? 'bg-orange-600/15' : isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/8'
        }`} />
        <div className={`absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full blur-[160px] transition-all duration-700 ${
          eyeCareActive ? 'bg-amber-700/15' : isDarkMode ? 'bg-indigo-600/10' : 'bg-indigo-400/6'
        }`} />
      </div>

      {/* Sidebar Navigation */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block fixed lg:relative z-40 h-full`}>
        <Sidebar
          currentSection={currentSection}
          setCurrentSection={(sec) => {
            setCurrentSection(sec);
            setMobileMenuOpen(false);
          }}
          flashcardsCount={flashcards.length}
          masteredCount={masteredCount}
          streak={stats.learningStreak}
          focusModeActive={focusModeActive}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Navbar */}
        <Navbar
          currentSection={currentSection}
          eyeCareActive={eyeCareActive}
          setEyeCareActive={setEyeCareActive}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          openCreateModal={() => {
            setCreateModalInitialData({
              timestamp: activeVideo.currentTimestamp || '00:00',
              videoTitle: activeVideo.title,
              subject: activeVideo.subject,
              youtubeId: activeVideo.youtubeId || '',
              question: '',
              answer: ''
            });
            setIsCreateModalOpen(true);
          }}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <Dashboard
              stats={{
                ...stats,
                flashcardsSaved: flashcards.length,
                flashcardsMastered: masteredCount
              }}
              weeklyData={weeklyData}
              recentCards={flashcards}
              onNavigate={setCurrentSection}
              activeVideo={activeVideo}
            />
          )}

          {currentSection === 'focus' && (
            <FocusMode
              videos={videos}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              focusModeActive={focusModeActive}
              setFocusModeActive={setFocusModeActive}
              eyeCareActive={eyeCareActive}
              setEyeCareActive={setEyeCareActive}
              onSaveCurrentMoment={handleSaveCurrentMoment}
              onStudySessionComplete={handleStudySessionComplete}
            />
          )}

          {currentSection === 'flashcards' && (
            <Flashcards
              flashcards={flashcards}
              onToggleMastered={handleToggleMastered}
              openCreateModal={() => {
                setCreateModalInitialData({
                  timestamp: activeVideo.currentTimestamp || '00:00',
                  videoTitle: activeVideo.title,
                  subject: activeVideo.subject,
                  youtubeId: activeVideo.youtubeId || '',
                  question: '',
                  answer: ''
                });
                setIsCreateModalOpen(true);
              }}
              onNavigateToVideo={handleNavigateToVideo}
              activeSubjectFilter={activeSubjectFilter}
              setActiveSubjectFilter={setActiveSubjectFilter}
            />
          )}

          {currentSection === 'analytics' && (
            <Analytics
              stats={{
                ...stats,
                flashcardsSaved: flashcards.length,
                flashcardsMastered: masteredCount
              }}
            />
          )}
        </main>
      </div>

      {/* Create Flashcard Modal */}
      <CreateFlashcardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveFlashcard}
        initialData={createModalInitialData}
        subjects={INITIAL_SUBJECTS}
      />

      {/* Floating Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
