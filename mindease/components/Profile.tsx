import React from 'react';
import { Assessment, MoodLog, Theme, Page, User } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import UserIcon from './icons/UserIcon';

interface ProfileProps {
  user: User;
  assessmentHistory: Assessment[];
  moodLogs: MoodLog[];
  theme: Theme;
  onNavigate: (page: Page) => void;
  breathingSessions?: Array<{ id: string; duration_seconds: number; cycles_completed: number; created_at: string }>;
  currentStreak?: number;
  longestStreak?: number;
}

const Profile: React.FC<ProfileProps> = ({ user, assessmentHistory, moodLogs, theme, onNavigate, breathingSessions = [], currentStreak = 0, longestStreak = 0 }) => {

  const chartData = assessmentHistory.map(a => ({
    name: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: a.score,
  }));

  const moodDistribution = moodLogs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moodChartData = Object.entries(moodDistribution).map(([name, value]) => ({ name, value }));
  
  const chartTextColor = theme === 'dark' ? '#a0aec0' : '#4a5568';
  const chartGridColor = theme === 'dark' ? '#4a5568' : '#e2e8f0';

  const moodColors = {
      happy: '#22c55e',
      calm: '#3b82f6',
      anxious: '#f97316',
      sad: '#6366f1',
      irritable: '#ef4444'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-0 transition-colors">
            <ArrowLeftIcon />
            Back to Dashboard
        </button>
      <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Your Wellness Journey</h2>
          <p className="text-slate-500 dark:text-slate-400">Review your progress and find insights.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Stress Score Over Time</h3>
                {assessmentHistory.length > 1 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                    <XAxis dataKey="name" stroke={chartTextColor} />
                    <YAxis domain={[0, 48]} stroke={chartTextColor} />
                    <Tooltip
                        contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#2d3748' : 'white', 
                            border: '1px solid',
                            borderColor: theme === 'dark' ? '#4a5568' : '#e2e8f0', 
                            borderRadius: '0.5rem',
                        }}
                    />
                    <Legend wrapperStyle={{ color: chartTextColor }} />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
                ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-16">Complete at least two assessments to see your progress chart.</p>
                )}
            </div>

             <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Assessment History</h3>
                {assessmentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
                    <thead className="bg-slate-50 dark:bg-gray-700/50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Level</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200 dark:bg-gray-800 dark:divide-gray-700">
                        {assessmentHistory.slice().reverse().map((assessment) => (
                        <tr key={assessment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-200">{new Date(assessment.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{assessment.score} / 48</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">{assessment.level}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">You haven't completed any assessments yet.</p>
                )}
            </div>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                 <div className="flex items-center gap-3 mb-4 text-slate-700 dark:text-slate-200">
                     <UserIcon />
                     <h3 className="text-xl font-bold">Personal Details</h3>
                 </div>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="font-semibold text-slate-600 dark:text-slate-400">Name:</span> <span>{user.name}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-slate-600 dark:text-slate-400">Email:</span> <span>{user.email}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-slate-600 dark:text-slate-400">Age:</span> <span>{user.age}</span></div>
                    <div className="flex justify-between"><span className="font-semibold text-slate-600 dark:text-slate-400">Gender:</span> <span className="capitalize">{user.gender}</span></div>
                 </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Wellness Stats</h3>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-slate-600 dark:text-slate-300">Breathing Sessions</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{breathingSessions.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <span className="text-slate-600 dark:text-slate-300">Current Streak</span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentStreak} days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="text-slate-600 dark:text-slate-300">Longest Streak</span>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{longestStreak} days</span>
                    </div>
                 </div>
            </div>
            {breathingSessions.length > 0 && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Recent Breathing Sessions</h3>
                 <div className="space-y-2 max-h-64 overflow-y-auto">
                    {breathingSessions.slice().reverse().slice(0, 10).map(session => (
                        <div key={session.id} className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{Math.floor(session.duration_seconds / 60)}:{String(session.duration_seconds % 60).padStart(2, '0')} min</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{session.cycles_completed} cycles</p>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(session.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            )}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Mood Distribution</h3>
                {moodLogs.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={moodChartData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" stroke={chartTextColor} axisLine={false} tickLine={false} width={80} style={{textTransform: 'capitalize'}} />
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? '#2d3748' : 'white', 
                                    border: '1px solid',
                                    borderColor: theme === 'dark' ? '#4a5568' : '#e2e8f0', 
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]}>
                                {moodChartData.map((entry, index) => (
                                    <Bar key={`cell-${index}`} fill={moodColors[entry.name as keyof typeof moodColors]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-16">Log your mood to see your distribution chart.</p>
                )}
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Recent Moods</h3>
                 {moodLogs.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {moodLogs.slice(0, 10).map(log => (
                            <div key={log.id} className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold capitalize" style={{ color: moodColors[log.mood] }}>{log.mood}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(log.date).toLocaleString()}</span>
                                </div>
                                {log.note && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic">"{log.note}"</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">You haven't logged any moods yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;