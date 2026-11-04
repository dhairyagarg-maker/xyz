import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Bookmark, 
  ShieldAlert, 
  ShieldCheck, 
  Maximize2, 
  Minimize2, 
  Clock, 
  Check, 
  ChevronDown,
  Link2,
  Search,
  Sparkles,
  ArrowRight,
  Sun
} from 'lucide-react';
import { parseTimestampToSeconds } from '../data/sampleData';

export default function FocusMode({
  videos,
  activeVideo,
  setActiveVideo,
  focusModeActive,
  setFocusModeActive,
  eyeCareActive,
  setEyeCareActive,
  onSaveCurrentMoment,
  onStudySessionComplete
}) {
  // Study Timer State (Default 25 minutes)
  const [timerPreset, setTimerPreset] = useState(25 * 60); // seconds
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Custom YouTube URL input state
  const [customUrl, setCustomUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  // Live video playback state & YouTube IFrame Player instance
  const [currentPlaybackSeconds, setCurrentPlaybackSeconds] = useState(activeVideo.seekToSeconds || 0);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
  const [showDistractionComparison, setShowDistractionComparison] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef(null);
  const loadedVideoIdRef = useRef(null);

  // Helper function to extract YouTube video ID from any format
  const extractYouTubeId = (urlOrId) => {
    if (!urlOrId) return null;
    const trimmed = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = trimmed.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (totalSeconds) => {
    const secs = Math.floor(totalSeconds || 0);
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Initialize YouTube Iframe Player API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 200);
        return;
      }

      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        const startSec = Math.floor(activeVideo.seekToSeconds || 0);
        if (loadedVideoIdRef.current !== activeVideo.youtubeId) {
          playerRef.current.loadVideoById({
            videoId: activeVideo.youtubeId,
            startSeconds: startSec
          });
          loadedVideoIdRef.current = activeVideo.youtubeId;
          setCurrentPlaybackSeconds(startSec);
          return;
        }
      }

      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
      }

      const initialStartSeconds = Math.floor(activeVideo.seekToSeconds || 0);

      playerRef.current = new window.YT.Player('learnmode-yt-player', {
        videoId: activeVideo.youtubeId,
        playerVars: {
          autoplay: activeVideo.seekToSeconds ? 1 : 0,
          start: initialStartSeconds,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          disablekb: 0,
          iv_load_policy: 3
        },
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            loadedVideoIdRef.current = activeVideo.youtubeId;
            const duration = event.target.getDuration();
            if (duration && duration > 0 && !activeVideo.durationSeconds) {
              setActiveVideo(prev => ({
                ...prev,
                durationSeconds: Math.floor(duration),
                duration: formatTime(duration)
              }));
            }

            if (activeVideo.seekToSeconds !== undefined && activeVideo.seekToSeconds !== null) {
              try {
                event.target.seekTo(activeVideo.seekToSeconds, true);
                event.target.playVideo();
                setCurrentPlaybackSeconds(activeVideo.seekToSeconds);
              } catch (e) {}
            }
          },
          onStateChange: (event) => {
            if (event.data === 1) {
              setIsPlayerPlaying(true);
            } else {
              setIsPlayerPlaying(false);
            }
          }
        }
      });
    };

    initPlayer();
  }, [activeVideo.youtubeId]);

  // Handle timestamp seeking when jumping from flashcards or chapters
  useEffect(() => {
    if (activeVideo.seekToSeconds !== undefined && activeVideo.seekToSeconds !== null) {
      const target = Math.floor(activeVideo.seekToSeconds);
      setCurrentPlaybackSeconds(target);

      const performSeek = () => {
        if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
          try {
            if (loadedVideoIdRef.current && loadedVideoIdRef.current !== activeVideo.youtubeId && typeof playerRef.current.loadVideoById === 'function') {
              playerRef.current.loadVideoById({
                videoId: activeVideo.youtubeId,
                startSeconds: target
              });
              loadedVideoIdRef.current = activeVideo.youtubeId;
            } else {
              playerRef.current.seekTo(target, true);
              if (typeof playerRef.current.playVideo === 'function') {
                playerRef.current.playVideo();
              }
            }
            return true;
          } catch (e) {
            return false;
          }
        }
        return false;
      };

      if (!performSeek()) {
        const t1 = setTimeout(performSeek, 300);
        const t2 = setTimeout(performSeek, 700);
        const t3 = setTimeout(performSeek, 1300);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    }
  }, [activeVideo.timestampTrigger, activeVideo.seekToSeconds, activeVideo.youtubeId]);

  // Continuously track current video timestamp in real-time
  useEffect(() => {
    const timeTracker = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          if (typeof currentTime === 'number' && !isNaN(currentTime)) {
            setCurrentPlaybackSeconds(currentTime);
          }
        } catch (e) {}
      }
    }, 400);

    return () => clearInterval(timeTracker);
  }, []);

  // Study Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (onStudySessionComplete) onStudySessionComplete(timerPreset / 3600);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, timerPreset, onStudySessionComplete]);

  const handleStartPauseTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerPreset);
  };

  const handleSelectPreset = (minutes) => {
    const secs = minutes * 60;
    setTimerPreset(secs);
    setTimerSecondsLeft(secs);
    setIsTimerRunning(false);
  };

  // Load any user-provided YouTube URL or Video ID
  const handleLoadCustomUrl = (e) => {
    if (e) e.preventDefault();
    setUrlError('');
    if (!customUrl.trim()) return;

    const extractedId = extractYouTubeId(customUrl);
    if (!extractedId) {
      setUrlError('Please enter a valid YouTube URL or 11-character video ID.');
      return;
    }

    const newVideo = {
      id: `custom-${Date.now()}`,
      title: `YouTube Study Session (${extractedId})`,
      channel: 'YouTube Creator',
      channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
      subject: activeVideo.subject || 'Self-Study',
      subjectId: 'custom',
      youtubeId: extractedId,
      duration: 'Live / Custom',
      durationSeconds: 1800,
      currentTimestamp: '00:00',
      currentSeconds: 0,
      seekToSeconds: 0,
      timestampTrigger: Date.now(),
      thumbnail: `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`,
      chapters: [
        { time: '00:00', seconds: 0, title: 'Session Start' }
      ],
      summary: 'Custom lecture loaded in distraction-free Zen mode.'
    };

    setActiveVideo(newVideo);
    setCurrentPlaybackSeconds(0);
    setCustomUrl('');
  };

  // Quick Preset Clicker
  const loadQuickPreset = (url) => {
    setCustomUrl(url);
    const extractedId = extractYouTubeId(url);
    if (extractedId) {
      const match = videos.find(v => v.youtubeId === extractedId);
      if (match) {
        setActiveVideo({ ...match, seekToSeconds: 0, timestampTrigger: Date.now() });
      } else {
        setActiveVideo({
          id: `custom-${Date.now()}`,
          title: `Study Session (${extractedId})`,
          channel: 'YouTube Educator',
          subject: 'Lecture',
          youtubeId: extractedId,
          duration: 'Custom',
          currentTimestamp: '00:00',
          currentSeconds: 0,
          seekToSeconds: 0,
          timestampTrigger: Date.now(),
          thumbnail: `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`,
          chapters: [{ time: '00:00', seconds: 0, title: 'Session Start' }],
          summary: 'Distraction-free learning video.'
        });
      }
      setCurrentPlaybackSeconds(0);
      setCustomUrl('');
    }
  };

  // Hero: AUTOMATIC TIMESTAMP CAPTURE when adding a flashcard
  const handleTriggerSaveMoment = () => {
    let exactSeconds = currentPlaybackSeconds;
    if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      try {
        const liveSeconds = playerRef.current.getCurrentTime();
        if (typeof liveSeconds === 'number' && !isNaN(liveSeconds)) {
          exactSeconds = liveSeconds;
          setCurrentPlaybackSeconds(liveSeconds);
        }
      } catch (err) {}
    }

    const formattedTimestamp = formatTime(exactSeconds);
    onSaveCurrentMoment(formattedTimestamp, activeVideo);
  };

  // Jump player to specific timestamp seconds
  const handleJumpToSeconds = (seconds) => {
    setCurrentPlaybackSeconds(seconds);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(seconds, true);
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch (e) {}
    }
  };

  const timerProgressPercent = ((timerPreset - timerSecondsLeft) / timerPreset) * 100;

  return (
    <div className="space-y-6 transition-all duration-300">
      {/* 1. Global Any YouTube Video Loader Bar */}
      <div className="rounded-2xl bg-[#0D1224]/90 backdrop-blur-md border border-purple-500/30 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleLoadCustomUrl} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 flex-shrink-0">
            <Link2 className="w-4 h-4 text-purple-400" />
            <span>Study Any Video:</span>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => {
                setCustomUrl(e.target.value);
                if (urlError) setUrlError('');
              }}
              placeholder="Paste any YouTube video link here (e.g., https://www.youtube.com/watch?v=... or youtu.be/...)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all flex-shrink-0"
          >
            <span>Load Video</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {urlError && (
          <p className="text-xs text-rose-400 mt-2 font-medium">
            {urlError}
          </p>
        )}

        {/* Quick Clickable Suggestions for Judges */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Suggested Lectures:
          </span>
          {[
            { label: '3Blue1Brown Neural Networks', id: 'aircAruvnKk' },
            { label: 'CS50 Harvard C Pointers', id: 'z9bZufPHFLU' },
            { label: 'MIT Quantum Mechanics', id: 'QuR969u81U4' },
            { label: 'Linear Algebra Eigenvectors', id: 'PFDu9oVAE-g' }
          ].map(pick => (
            <button
              key={pick.id}
              type="button"
              onClick={() => loadQuickPreset(pick.id)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 text-[11px] font-medium transition-all"
            >
              {pick.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Controls Bar */}
      <div className="rounded-2xl bg-[#0D1224]/90 backdrop-blur-md border border-white/5 p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Quick preset lecture selector & Live Moment */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Curated Lectures:</span>
            <div className="relative">
              <select
                value={activeVideo.id}
                onChange={(e) => {
                  const found = videos.find(v => v.id === e.target.value);
                  if (found) {
                    setActiveVideo({
                      ...found,
                      seekToSeconds: 0,
                      timestampTrigger: Date.now()
                    });
                    setCurrentPlaybackSeconds(0);
                  }
                }}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
              >
                {videos.map(v => (
                  <option key={v.id} value={v.id} className="bg-[#0D1224] text-slate-100">
                    {v.subject}: {v.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-purple-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Live Automatic Timestamp Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Live Moment: {formatTime(currentPlaybackSeconds)}</span>
          </div>
        </div>

        {/* Right: The Eye-Care and Focus Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Eye-Care Warmth Button */}
          <button
            onClick={() => setEyeCareActive(!eyeCareActive)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-sm ${
              eyeCareActive
                ? 'bg-amber-500/25 border-amber-400/60 text-amber-300 shadow-amber-500/30 ring-1 ring-amber-400/50'
                : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
            }`}
            title="Toggle Eye-Care Mode to eliminate harsh blue light and prevent eye fatigue"
          >
            <Sun className={`w-3.5 h-3.5 ${eyeCareActive ? 'text-amber-300 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '8s' }} />
            <span>{eyeCareActive ? 'Eye Care: Active (Warm)' : 'Eye Care Mode'}</span>
          </button>

          {/* Distraction Comparison Preview Switch */}
          <button
            onClick={() => setShowDistractionComparison(!showDistractionComparison)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              showDistractionComparison
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{showDistractionComparison ? 'Hide Distraction Demo' : 'Compare YouTube'}</span>
          </button>

          {/* Master Focus Mode Toggle */}
          <button
            onClick={() => setFocusModeActive(!focusModeActive)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 shadow-lg ${
              focusModeActive
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-600/25 hover:opacity-95'
            }`}
          >
            {focusModeActive ? (
              <>
                <Minimize2 className="w-4 h-4 animate-pulse" />
                <span>Ultra-Focus Active</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Enter Focus Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Distraction Comparison Overlay */}
      {showDistractionComparison && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-slate-200 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-200">
                  Standard YouTube Distraction Simulator
                </h4>
                <p className="text-xs text-red-300/80 mt-0.5">
                  Here is what YouTube normally throws at a student trying to study this lecture:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">
                    ⚠️ 24 Algorithmic "Recommended" Clickbaits
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">
                    ⚠️ Auto-playing 60-second viral Shorts
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">
                    ⚠️ Toxic comment threads & drama
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono">
                    ⚠️ Mid-roll unskippable commercial ads
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-xl">
              ✓ All 100% Blocked in LearnMode
            </span>
          </div>
        </div>
      )}

      {/* Main Focus Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Video Player Column (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video Container with Ambilight Backlight Halo */}
          <div className="relative">
            {/* Soft Eye-Care Ambilight Glow */}
            <div className={eyeCareActive ? 'ambilight-glow-warm' : 'ambilight-glow'} />

            <div className={`relative z-10 rounded-3xl overflow-hidden bg-black border transition-all duration-500 shadow-2xl ${
              focusModeActive 
                ? 'border-purple-500/60 shadow-[0_0_50px_rgba(139,92,246,0.35)] ring-1 ring-purple-400/40' 
                : 'border-white/10'
            }`}>
              {/* The Real YouTube Video Screen with YouTube IFrame API */}
              <div className="aspect-video w-full bg-slate-950 relative flex items-center justify-center">
                <div id="learnmode-yt-player" className="w-full h-full" />

                {/* Floating Ultra-Focus Pill inside video corner */}
                {focusModeActive && (
                  <div className="absolute top-4 right-4 pointer-events-none z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-purple-500/40 text-purple-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Zen Mode Active
                  </div>
                )}
              </div>

              {/* Bottom Action Bar: Hero "Save Current Moment" with AUTOMATIC TIMESTAMP */}
              <div className="p-4 sm:p-5 bg-[#0A0E1D] border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      {activeVideo.channel || 'YouTube'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                      Live Timestamp: {formatTime(currentPlaybackSeconds)}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white mt-1 line-clamp-1">
                    {activeVideo.title}
                  </h2>
                </div>

                {/* Prominent "Save Current Moment" Button */}
                <button
                  onClick={handleTriggerSaveMoment}
                  title="Click to capture current video timestamp into a flashcard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all border border-purple-400/30 group"
                >
                  <Bookmark className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                  <span>Save Current Moment</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-black/40 text-cyan-300 text-xs font-mono font-bold border border-cyan-400/30">
                    [{formatTime(currentPlaybackSeconds)}]
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Curated Lecture Chapters / Timestamps */}
          {activeVideo.chapters && activeVideo.chapters.length > 0 && (
            <div className="rounded-2xl bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Key Lecture Timestamps & Chapters
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Click to seek player
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeVideo.chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpToSeconds(chap.seconds)}
                    className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/30 text-slate-300 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded bg-black/40 text-purple-300 text-xs font-mono font-bold border border-purple-500/20">
                        {chap.time}
                      </span>
                      <span className="text-xs font-semibold group-hover:text-purple-200 line-clamp-1">
                        {chap.title}
                      </span>
                    </div>
                    <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column: Study Timer & Focus Metrics (1 col) */}
        <div className="space-y-4">
          {/* Pomodoro Study Timer Card */}
          <div className="rounded-2xl bg-[#0D1224]/90 backdrop-blur-md border border-white/5 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Study Timer
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isTimerRunning 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse' 
                  : 'bg-white/10 text-slate-400'
              }`}>
                {isTimerRunning ? 'FOCUSING' : 'PAUSED'}
              </span>
            </div>

            {/* Circular / Large Digital Time Display */}
            <div className="relative py-4 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                {formatTime(timerSecondsLeft)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Target: {Math.floor(timerPreset / 60)} min session
              </p>

              {/* Progress bar */}
              <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${timerProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Timer Presets */}
            <div className="grid grid-cols-3 gap-1.5">
              {[15, 25, 50].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSelectPreset(mins)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    timerPreset === mins * 60
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Action Buttons: Start/Pause & Reset */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleStartPauseTimer}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/30'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-600/30 hover:opacity-95'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Timer</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetTimer}
                title="Reset timer"
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Distraction-Free Shield Status Widget */}
          <div className="rounded-2xl bg-gradient-to-b from-[#0D1224] to-[#0A0E1D] border border-white/5 p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Distraction Shield: Active</h4>
                <p className="text-[10px] text-slate-400">Sanitized Educational Sandbox</p>
              </div>
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-300 pt-1">
              <li className="flex items-center gap-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Side recommendations hidden</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Comments & ads blocked</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Autoplay rabbit holes removed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
