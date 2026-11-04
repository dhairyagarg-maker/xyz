export const parseTimestampToSeconds = (ts) => {
  if (typeof ts === 'number') return Math.floor(ts);
  if (!ts || typeof ts !== 'string') return 0;
  const clean = ts.replace(/[\[\]]/g, '').trim();
  const parts = clean.split(':').map(p => parseFloat(p) || 0);
  if (parts.length === 3) {
    return Math.floor(parts[0] * 3600 + parts[1] * 60 + parts[2]);
  } else if (parts.length === 2) {
    return Math.floor(parts[0] * 60 + parts[1]);
  } else if (parts.length === 1) {
    return Math.floor(parts[0]);
  }
  return 0;
};

export const INITIAL_SUBJECTS = [
  { id: 'all', name: 'All Subjects', color: 'from-purple-500 to-indigo-500', count: 12 },
  { id: 'ml', name: 'Machine Learning', color: 'from-purple-500 to-pink-500', count: 4, icon: 'Brain' },
  { id: 'quantum', name: 'Quantum Physics', color: 'from-blue-500 to-cyan-400', count: 3, icon: 'Atom' },
  { id: 'cs', name: 'Computer Science', color: 'from-emerald-400 to-teal-500', count: 3, icon: 'Code2' },
  { id: 'math', name: 'Calculus & Math', color: 'from-amber-400 to-orange-500', count: 2, icon: 'Sigma' },
];

export const SAMPLE_VIDEOS = [
  {
    id: 'vid-1',
    title: 'Neural Networks & Deep Learning: Visualizing Backpropagation',
    channel: '3Blue1Brown',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    subject: 'Machine Learning',
    subjectId: 'ml',
    youtubeId: 'aircAruvnKk',
    duration: '18:42',
    durationSeconds: 1122,
    currentTimestamp: '04:32',
    currentSeconds: 272,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    chapters: [
      { time: '00:00', seconds: 0, title: 'Introduction to Cost Functions' },
      { time: '04:15', seconds: 255, title: 'Gradient Descent Intuition' },
      { time: '09:30', seconds: 570, title: 'Deriving Partial Derivatives' },
      { time: '14:20', seconds: 860, title: 'Multi-layer Backprop Chain Rule' },
    ],
    summary: 'A geometric interpretation of how partial derivatives steer weights in high-dimensional error valleys.',
  },
  {
    id: 'vid-2',
    title: 'MIT 8.04: Quantum Mechanics — Wavepackets & Superposition',
    channel: 'MIT OpenCourseWare',
    channelAvatar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&auto=format&fit=crop&q=60',
    subject: 'Quantum Physics',
    subjectId: 'quantum',
    youtubeId: 'QuR969u81U4',
    duration: '48:15',
    durationSeconds: 2895,
    currentTimestamp: '12:05',
    currentSeconds: 725,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    chapters: [
      { time: '00:00', seconds: 0, title: 'The Double Slit Re-examined' },
      { time: '12:05', seconds: 725, title: 'Schrödinger Time-Dependent Equation' },
      { time: '24:50', seconds: 1490, title: 'Probability Density Conservation' },
      { time: '38:10', seconds: 2290, title: 'Heisenberg Uncertainty Principle' },
    ],
    summary: 'Mathematical formulation of wavefunctions in Hilbert space and measurement collapse dynamics.',
  },
  {
    id: 'vid-3',
    title: 'CS50: Memory, Pointers, and Heap Allocation in C',
    channel: 'Harvard University',
    channelAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=60',
    subject: 'Computer Science',
    subjectId: 'cs',
    youtubeId: 'z9bZufPHFLU',
    duration: '34:20',
    durationSeconds: 2060,
    currentTimestamp: '08:45',
    currentSeconds: 525,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    chapters: [
      { time: '00:00', seconds: 0, title: 'RAM Architecture & Addresses' },
      { time: '08:45', seconds: 525, title: 'Pointer Dereferencing & Segfaults' },
      { time: '19:15', seconds: 1155, title: 'Stack vs Heap Dynamic Memory' },
      { time: '27:00', seconds: 1620, title: 'Valgrind Memory Leak Detection' },
    ],
    summary: 'Mastering low-level memory layout, address pointers, malloc/free contracts and buffer guards.',
  },
  {
    id: 'vid-4',
    title: 'Essence of Linear Algebra: Eigenvalues & Eigenvectors',
    channel: '3Blue1Brown',
    channelAvatar: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&auto=format&fit=crop&q=60',
    subject: 'Calculus & Math',
    subjectId: 'math',
    youtubeId: 'PFDu9oVAE-g',
    duration: '17:15',
    durationSeconds: 1035,
    currentTimestamp: '06:12',
    currentSeconds: 372,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    chapters: [
      { time: '00:00', seconds: 0, title: 'Linear Transformations as Matrices' },
      { time: '06:12', seconds: 372, title: 'Invariant Lines & Eigenvectors' },
      { time: '11:40', seconds: 700, title: 'Characteristic Polynomial det(A - λI)' },
    ],
    summary: 'Visualizing axes that stay on their own span during spatial coordinate matrix warping.',
  }
];

export const INITIAL_FLASHCARDS = [
  {
    id: 'fc-1',
    subject: 'Machine Learning',
    subjectId: 'ml',
    youtubeId: 'aircAruvnKk',
    videoTitle: 'Neural Networks & Deep Learning: Visualizing Backpropagation',
    timestamp: '04:15',
    question: 'Why does Gradient Descent compute the negative of the gradient vector (-∇C)?',
    answer: 'The gradient vector ∇C points in the direction of the steepest ascent (maximum increase of the cost function). Taking the negative vector moves weights toward the steepest local decrease, minimizing cost.',
    mastered: true,
    difficulty: 'Medium',
    createdDate: 'Yesterday',
    reviewCount: 4,
  },
  {
    id: 'fc-2',
    subject: 'Machine Learning',
    subjectId: 'ml',
    youtubeId: 'aircAruvnKk',
    videoTitle: 'Neural Networks & Deep Learning: Visualizing Backpropagation',
    timestamp: '14:20',
    question: 'What is the role of the Chain Rule in multi-layer backpropagation?',
    answer: 'It enables calculating how a weight in early layers influences the final error by multiplying partial derivatives through consecutive intermediate activation activations: ∂C/∂w = (∂C/∂a)(∂a/∂z)(∂z/∂w).',
    mastered: false,
    difficulty: 'Hard',
    createdDate: '2 days ago',
    reviewCount: 2,
  },
  {
    id: 'fc-3',
    subject: 'Quantum Physics',
    subjectId: 'quantum',
    youtubeId: 'QuR969u81U4',
    videoTitle: 'MIT 8.04: Quantum Mechanics — Wavepackets & Superposition',
    timestamp: '12:05',
    question: 'What does |Ψ(x, t)|² physically represent according to the Born Rule?',
    answer: 'It represents the probability density of finding the particle at spatial position x at time t upon measurement, normalized so the integral over all space equals 1.',
    mastered: true,
    difficulty: 'Medium',
    createdDate: '3 days ago',
    reviewCount: 5,
  },
  {
    id: 'fc-4',
    subject: 'Quantum Physics',
    subjectId: 'quantum',
    youtubeId: 'QuR969u81U4',
    videoTitle: 'MIT 8.04: Quantum Mechanics — Wavepackets & Superposition',
    timestamp: '38:10',
    question: 'State the Heisenberg Uncertainty Principle formula for position and momentum.',
    answer: 'Δx · Δp ≥ ℏ / 2. The more precisely the position of a subatomic particle is localized, the less precisely its momentum can be known, and vice-versa.',
    mastered: false,
    difficulty: 'Hard',
    createdDate: '4 days ago',
    reviewCount: 3,
  },
  {
    id: 'fc-5',
    subject: 'Computer Science',
    subjectId: 'cs',
    youtubeId: 'z9bZufPHFLU',
    videoTitle: 'CS50: Memory, Pointers, and Heap Allocation in C',
    timestamp: '08:45',
    question: 'What distinguishes the stack memory from the heap in C?',
    answer: 'Stack memory is automatically managed with LIFO order for function local frames and has fixed limits. Heap memory is manually allocated via malloc() and lives until explicitly freed via free().',
    mastered: true,
    difficulty: 'Easy',
    createdDate: 'Oct 30',
    reviewCount: 6,
  },
  {
    id: 'fc-6',
    subject: 'Calculus & Math',
    subjectId: 'math',
    youtubeId: 'PFDu9oVAE-g',
    videoTitle: 'Essence of Linear Algebra: Eigenvalues & Eigenvectors',
    timestamp: '06:12',
    question: 'What is the mathematical condition for a vector v to be an eigenvector of matrix A?',
    answer: 'Av = λv (where v ≠ 0 and λ is a scalar eigenvalue). Applying matrix transformation A only stretches or squashes v along its span without rotating it away.',
    mastered: false,
    difficulty: 'Medium',
    createdDate: 'Oct 28',
    reviewCount: 1,
  },
  {
    id: 'fc-7',
    subject: 'Computer Science',
    subjectId: 'cs',
    youtubeId: 'z9bZufPHFLU',
    videoTitle: 'CS50: Memory, Pointers, and Heap Allocation in C',
    timestamp: '27:00',
    question: 'What occurs when an allocated block from malloc() is never passed to free()?',
    answer: 'A memory leak occurs: the memory remains marked as occupied by the operating system, exhausting available RAM over prolonged execution until eventual process termination.',
    mastered: true,
    difficulty: 'Easy',
    createdDate: 'Oct 25',
    reviewCount: 7,
  },
  {
    id: 'fc-8',
    subject: 'Machine Learning',
    subjectId: 'ml',
    youtubeId: 'aircAruvnKk',
    videoTitle: 'Neural Networks & Deep Learning: Visualizing Backpropagation',
    timestamp: '09:30',
    question: 'Why do exploding or vanishing gradients occur in deep neural networks?',
    answer: 'When weights are repeatedly multiplied across many layers using chain rule, gradients either decay exponentially toward 0 (vanishing) or blow up toward infinity (exploding) if weights are < 1 or > 1.',
    mastered: false,
    difficulty: 'Hard',
    createdDate: 'Oct 24',
    reviewCount: 2,
  }
];

export const INITIAL_STATS = {
  studyHours: 14.5,
  flashcardsSaved: 8,
  flashcardsMastered: 4,
  learningStreak: 7,
  distractionsBlocked: 142,
  focusScore: 96,
};

export const WEEKLY_STUDY_DATA = [
  { day: 'Mon', hours: 2.2, target: 2.0, cards: 3, efficiency: 92 },
  { day: 'Tue', hours: 1.8, target: 2.0, cards: 1, efficiency: 88 },
  { day: 'Wed', hours: 3.1, target: 2.0, cards: 5, efficiency: 96 },
  { day: 'Thu', hours: 2.5, target: 2.0, cards: 2, efficiency: 94 },
  { day: 'Fri', hours: 1.4, target: 2.0, cards: 1, efficiency: 86 },
  { day: 'Sat', hours: 3.5, target: 2.5, cards: 4, efficiency: 98 },
  { day: 'Sun', hours: 2.8, target: 2.5, cards: 2, efficiency: 95 },
];

export const SUBJECT_PROGRESS_DATA = [
  { subject: 'Machine Learning', hours: 5.8, flashcards: 4, masteryRate: 75, fill: '#8b5cf6' },
  { subject: 'Quantum Physics', hours: 3.4, flashcards: 3, masteryRate: 67, fill: '#3b82f6' },
  { subject: 'Computer Science', hours: 3.2, flashcards: 3, masteryRate: 100, fill: '#10b981' },
  { subject: 'Calculus & Math', hours: 2.1, flashcards: 2, masteryRate: 50, fill: '#f59e0b' },
];

export const RETENTION_TREND_DATA = [
  { session: 'Day 1', retention: 68, activeCards: 2 },
  { session: 'Day 2', retention: 74, activeCards: 4 },
  { session: 'Day 3', retention: 79, activeCards: 5 },
  { session: 'Day 4', retention: 85, activeCards: 6 },
  { session: 'Day 5', retention: 91, activeCards: 7 },
  { session: 'Day 6', retention: 96, activeCards: 8 },
];

export const HOURLY_FOCUS_DATA = [
  { hour: '8 AM', focus: 65 },
  { hour: '10 AM', focus: 88 },
  { hour: '12 PM', focus: 72 },
  { hour: '2 PM', focus: 84 },
  { hour: '4 PM', focus: 95 },
  { hour: '6 PM', focus: 91 },
  { hour: '8 PM', focus: 98 },
  { hour: '10 PM', focus: 82 },
];

export const ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'Laser Focus',
    description: 'Complete 3 full Pomodoro sessions without distraction',
    icon: 'Target',
    unlocked: true,
    date: 'Earned Nov 2',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'ach-2',
    title: '7-Day Scholar Streak',
    description: 'Study consecutively for 7 days without missing a beat',
    icon: 'Flame',
    unlocked: true,
    date: 'Earned Today!',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'ach-3',
    title: 'Flashcard Architect',
    description: 'Save 10 high-yield video timestamps to memory cards',
    icon: 'Sparkles',
    unlocked: false,
    progress: '8/10',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'ach-4',
    title: 'Concept Master',
    description: 'Master at least 5 complex concepts across disciplines',
    icon: 'Award',
    unlocked: true,
    date: 'Earned Nov 3',
    color: 'from-emerald-400 to-teal-500'
  }
];
