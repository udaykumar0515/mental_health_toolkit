
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StressAssessment from './components/StressAssessment';
import AssessmentResults from './components/AssessmentResults';
import BreathingExercise from './components/BreathingExercise';
import ThoughtReframer from './components/ThoughtReframer';
import CalmBot from './components/CalmBot';
import FloatingChatBot from './components/FloatingChatBot';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Journal from './components/Journal';
import MusicPlayer from './components/MusicPlayer';
import MoodTracker from './components/MoodTracker';
import { Page, AssessmentResult, Assessment, User, JournalEntry, Theme, MoodLog, StressLevel, Mood, Gender } from './types';
import { generateMotivationalQuote } from './services/geminiService';
import { getStreak, updateStreak } from './utils/streaks';
import { apiClient } from './services/apiClient';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<Assessment[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [streak, setStreak] = useState(0);
  const [breathingSessions, setBreathingSessions] = useState<Array<{ id: string; duration_seconds: number; cycles_completed: number; created_at: string }>>([]);
  const [currentStreakAPI, setCurrentStreakAPI] = useState(0);
  const [longestStreakAPI, setLongestStreakAPI] = useState(0);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('mind_ease_theme') as Theme;
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (userPrefersDark) {
      setTheme('dark');
    }
  }, []);

  // Apply theme class to root element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('mind_ease_theme', theme);
  }, [theme]);
  
  const loadUserData = async (user: User) => {
    try {
      const history = await apiClient.getAssessmentHistory();
        // Map API response to Assessment type
        const assessments: Assessment[] = history.map(h => ({
          id: Number(h.id.replace('assessment_', '')),
          date: h.created_at,
          score: h.score,
          level: h.stress_level as StressLevel,
          responses: Object.values(h.answers).map(a => parseInt(a as string))
        }));
        setAssessmentHistory(assessments);
      
      const journals = await apiClient.getJournals();
      const entries: JournalEntry[] = journals.map(j => ({
        id: Number(j.id.replace('journal_', '')),
        date: j.created_at,
        content: j.content
      }));
      setJournalEntries(entries);
      
      const moodLogsData = await apiClient.getMoodLogs();
        const logs: MoodLog[] = moodLogsData.map(m => ({
          id: Number(m.id.replace('mood_', '')),
          mood: m.mood as Mood,
          note: m.note,
          date: m.created_at
        }));
      setMoodLogs(logs);

      // Fetch breathing sessions and streak data
      const profileData = await apiClient.getProfile();
      if ((profileData as any).breathingSessions) {
        setBreathingSessions((profileData as any).breathingSessions);
      }
      if ((profileData as any).current_streak !== undefined) {
        setCurrentStreakAPI((profileData as any).current_streak);
      }
      if ((profileData as any).longest_streak !== undefined) {
        setLongestStreakAPI((profileData as any).longest_streak);
      }
      
      setStreak(getStreak(user.email));
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to empty arrays if API fails
      setAssessmentHistory([]);
      setJournalEntries([]);
      setMoodLogs([]);
    }
  };

  // Check for logged in user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        // If we have a token, try to fetch profile
        try {
          const profile = await apiClient.getProfile();
          const user: User = { 
            email: (profile as any).email || (profile as any).user?.email,
            name: (profile as any).full_name || (profile as any).user?.full_name,
            age: (profile as any).age || (profile as any).user?.age || 0,
            gender: ((profile as any).gender || (profile as any).user?.gender || 'prefer-not-to-say') as Gender
          };
          setCurrentUser(user);
          await loadUserData(user);
          setCurrentPage('dashboard');
        } catch (error) {
          // Token is invalid, clear it and go to login
          apiClient.setToken('');
          setCurrentPage('login');
        }
      } else {
        setCurrentPage('login');
      }
    };
    
    initializeAuth();
  }, []);

  // Persist assessment history to server
  useEffect(() => {
    if (currentUser && assessmentHistory.length > 0) {
      // Assessment history is automatically saved via submitAssessment endpoint
      // This effect is kept for consistency but actual saving happens in handleAssessmentComplete
    }
  }, [assessmentHistory, currentUser]);

  // Persist journal entries to server
  useEffect(() => {
    if (currentUser && journalEntries.length > 0) {
      // Journal entries are automatically saved via createJournal endpoint
      // This effect is kept for consistency but actual saving happens in handleSaveJournalEntry
    }
  }, [journalEntries, currentUser]);

  // Persist mood logs to server
  useEffect(() => {
    if (currentUser && moodLogs.length > 0) {
      // Mood logs are automatically saved via createMoodLog endpoint
      // This effect is kept for consistency but actual saving happens in handleSaveMoodLog
    }
  }, [moodLogs, currentUser]);


  const handleNavigate = (page: Page) => {
    setAuthError(null);
    if (!currentUser && !['login', 'signup'].includes(page)) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    try {
      const response = await apiClient.login(email, pass);
      const user: User = { 
        email: response.user.email,
        name: response.user.full_name,
        age: response.user.age || 0,
        gender: (response.user.gender as Gender) || 'prefer-not-to-say'
      };
      setCurrentUser(user);
        await loadUserData(user);
      setCurrentPage('dashboard');
      setAuthError(null);
    } catch (error) {
      setAuthError("Invalid email or password.");
    }
  };

  // Updated handleSignup to use API client
  const handleSignup = async (userProfile: User & { pass: string }) => {
    try {
      const response = await apiClient.signup(userProfile.email, userProfile.pass, userProfile.name, userProfile.age, userProfile.gender);
      const newUser: User = {
        email: response.user.email,
        name: response.user.full_name,
        age: response.user.age || 0,
        gender: (response.user.gender as Gender) || 'prefer-not-to-say'
      };

      setCurrentUser(newUser);
      setAssessmentHistory([]);
      setJournalEntries([]);
      setMoodLogs([]);
      setStreak(0);
      setCurrentPage('dashboard');
      setAuthError(null);
    } catch (error) {
      setAuthError("Signup failed. Please try again.");
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    apiClient.setToken(''); // Clear the token
    setAssessmentHistory([]);
    setJournalEntries([]);
    setMoodLogs([]);
    setStreak(0);
    setCurrentPage('login');
  };

  const handleAssessmentComplete = async (result: AssessmentResult, answers: number[]) => {
    setAssessmentResult(result);
    
    // Map answers to API format
    const answersMap: Record<string, string> = {};
    answers.forEach((answer, index) => {
      answersMap[`q${index + 1}`] = answer.toString();
    });

    try {
      const savedAssessment = await apiClient.submitAssessment(
        answersMap,
        result.level,
        result.score,
        result.recommendations.map(r => r.title)
      );
      
      const newAssessment: Assessment = {
        id: Number(savedAssessment.id.replace('assessment_', '')),
        date: savedAssessment.created_at,
        score: savedAssessment.score,
        level: savedAssessment.stress_level as StressLevel,
        responses: answers
      };
      
      setAssessmentHistory(prev => [...prev, newAssessment]);
      if (currentUser) {
        setStreak(updateStreak(currentUser.email));
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      // Still show results even if save fails
    }
    
    setCurrentPage('results');
  };

  const handleSaveJournalEntry = async (entry: { id?: number; content: string }) => {
    try {
      if (entry.id) {
        // Update existing journal entry
        const updated = await apiClient.updateJournal(
          `journal_${entry.id}`,
          undefined,
          entry.content
        );
        
        setJournalEntries(prev => prev.map(e => e.id === entry.id ? { 
          ...e, 
          content: entry.content, 
          date: updated.updated_at 
        } : e));
      } else {
        // Create new journal entry
        const newJournal = await apiClient.createJournal(
          'Untitled',
          entry.content
        );
        
        const newEntry: JournalEntry = {
          id: Number(newJournal.id.replace('journal_', '')),
          date: newJournal.created_at,
          content: newJournal.content
        };
        
        setJournalEntries(prev => [newEntry, ...prev]);
      }
      
      if (currentUser) {
        setStreak(updateStreak(currentUser.email));
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleSaveMoodLog = async (log: Omit<MoodLog, 'id' | 'date'>) => {
    try {
      const savedLog = await apiClient.createMoodLog(
        log.mood,
        log.intensity || 5,
        log.note
      );
      
      const newLog: MoodLog = {
        ...log,
        id: Number(savedLog.id.replace('mood_', '')),
        date: savedLog.created_at,
      };
      
      setMoodLogs(prev => [newLog, ...prev]);
      
      if (currentUser) {
        setStreak(updateStreak(currentUser.email));
      }
      
      handleNavigate('dashboard');
    } catch (error) {
      console.error('Error saving mood log:', error);
    }
  };
  
  const fetchQuote = useCallback(async () => {
    try {
      const motivationalQuote = await generateMotivationalQuote();
      setQuote(motivationalQuote);
    } catch (error) {
      console.error("Error fetching motivational quote:", error);
      setQuote({ quote: "The best way to predict the future is to create it.", author: "Peter Drucker" });
    }
  }, []);

  useEffect(() => {
    if (currentUser) { // Only fetch quote if logged in
        fetchQuote();
    }
  }, [fetchQuote, currentUser]);
  
  const renderPage = () => {
    if (!currentUser) {
        switch (currentPage) {
            case 'login':
                return <Login onLogin={handleLogin} onNavigate={handleNavigate} error={authError} />;
            case 'signup':
                return <Signup onSignup={handleSignup} onNavigate={handleNavigate} error={authError} />;
            default:
                 return <Login onLogin={handleLogin} onNavigate={handleNavigate} error={authError} />;
        }
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} quote={quote} streak={streak} user={currentUser} />;
      case 'assessment':
        return <StressAssessment onComplete={handleAssessmentComplete} />;
      case 'results':
        return assessmentResult ? <AssessmentResults result={assessmentResult} onNavigate={handleNavigate} /> : <Dashboard onNavigate={handleNavigate} quote={quote} streak={streak} user={currentUser}/>;
      case 'breathing':
        return <BreathingExercise onNavigate={handleNavigate} />;
      case 'reframer':
        return <ThoughtReframer onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile user={currentUser} assessmentHistory={assessmentHistory} moodLogs={moodLogs} theme={theme} onNavigate={handleNavigate} breathingSessions={breathingSessions} currentStreak={currentStreakAPI} longestStreak={longestStreakAPI} />;
       case 'journal':
        return <Journal entries={journalEntries} onSave={handleSaveJournalEntry} onNavigate={handleNavigate} />;
      case 'music':
        return <MusicPlayer onNavigate={handleNavigate} />;
      case 'mood-tracker':
        return <MoodTracker onSave={handleSaveMoodLog} onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} quote={quote} streak={streak} user={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header onNavigate={handleNavigate} currentUser={currentUser} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div key={currentPage} className="page-animate">
            {renderPage()}
        </div>
      </main>
      {currentUser && <FloatingChatBot />}
    </div>
  );
};

export default App;
