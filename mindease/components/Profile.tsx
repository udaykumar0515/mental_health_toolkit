import React, { useState } from 'react';
import { Assessment, MoodLog, Theme, Page, User } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Cell } from 'recharts';
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
    score: Math.round((a.score / 48) * 10) || 1,
  }));

  const moodDistribution = moodLogs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

    const moodChartData = Object.entries(moodDistribution).map(([name, value]) => ({ name, value }));
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const chartTextColor = theme === 'dark' ? '#a0aec0' : '#4a5568';
  const chartGridColor = theme === 'dark' ? '#4a5568' : '#e2e8f0';

  const moodColors = {
      happy: '#22c55e',
      calm: '#3b82f6',
      anxious: '#f97316',
      sad: '#6366f1',
      irritable: '#ef4444'
  };

    // Custom tooltip that only shows the count/value (keeps UI minimal)
    const CustomBarTooltip = ({ active, payload, theme }: any) => {
        if (!active || !payload || !payload.length) return null;
        const item = payload[0];
        return (
            <div className={`shadow-lg rounded-md p-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-slate-800'}`}>
                <div className="text-sm font-semibold">{item.payload.name}</div>
                <div className="text-xs opacity-80">value: {item.value}</div>
            </div>
        );
    };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-0 transition-colors">
            <ArrowLeftIcon />
            Back to Dashboard
        </button>
      <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">Your Wellness Journey</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">Review your progress and find insights.</p>
      </div>
      
      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-700">
                 <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2">BREATHING SESSIONS</p>
                 <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">{breathingSessions.length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-2xl shadow-lg border border-orange-200 dark:border-orange-700">
                 <p className="text-sm font-semibold text-orange-600 dark:text-orange-300 mb-2">CURRENT STREAK</p>
                 <p className="text-4xl font-bold text-orange-700 dark:text-orange-300">{currentStreak}</p>
                 <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">days</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700">
                 <p className="text-sm font-semibold text-purple-600 dark:text-purple-300 mb-2">LONGEST STREAK</p>
                 <p className="text-4xl font-bold text-purple-700 dark:text-purple-300">{longestStreak}</p>
                 <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">days</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-2xl shadow-lg border border-green-200 dark:border-green-700">
                 <p className="text-sm font-semibold text-green-600 dark:text-green-300 mb-2">ASSESSMENTS</p>
                 <p className="text-4xl font-bold text-green-700 dark:text-green-300">{assessmentHistory.length}</p>
            </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Personal Details */}
        <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 lg:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                 <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                     <UserIcon />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h3>
             </div>
             <div className="space-y-4">
                <div className="pb-4 border-b border-slate-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-white mt-1">{user.name}</p>
                </div>
                <div className="pb-4 border-b border-slate-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 break-all">{user.email}</p>
                </div>
                <div className="pb-4 border-b border-slate-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Age</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-white mt-1">{user.age} years</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gender</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-white mt-1 capitalize">{user.gender}</p>
                </div>
             </div>
        </div>

        {/* Middle Column - Stress Chart */}
        <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 lg:col-span-2">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Stress Score Over Time</h3>
            {assessmentHistory.length > 1 ? (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="name" stroke={chartTextColor} />
                <YAxis domain={[0, 10]} stroke={chartTextColor} />
                <Tooltip
                    contentStyle={{ 
                        backgroundColor: theme === 'dark' ? '#2d3748' : 'white', 
                        border: '1px solid',
                        borderColor: theme === 'dark' ? '#4a5568' : '#e2e8f0', 
                        borderRadius: '0.5rem',
                    }}
                />
                <Legend wrapperStyle={{ color: chartTextColor }} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} dot={{ fill: '#3b82f6', r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
            ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-16">Complete at least two assessments to see your progress chart.</p>
            )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Mood Distribution</h3>
                {moodLogs.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={moodChartData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" stroke={chartTextColor} axisLine={false} tickLine={false} width={60} style={{textTransform: 'capitalize'}} />
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? '#2d3748' : 'white', 
                                    border: '1px solid',
                                    borderColor: theme === 'dark' ? '#4a5568' : '#e2e8f0', 
                                    borderRadius: '0.5rem',
                                }}
                            />
                                    <Bar dataKey="value" barSize={25} radius={[0, 10, 10, 0]}>
                                        {moodChartData.map((entry, index) => {
                                            // fill: white in dark mode, dark in light mode; keep colored accents for labels elsewhere
                                            const fillColor = theme === 'dark' ? '#ffffff' : (moodColors[entry.name as keyof typeof moodColors] || '#0f172a');
                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={fillColor}
                                                    className={`bar-cell ${hoveredIndex === index ? 'bar-cell--lift' : ''}`}
                                                    onMouseEnter={() => setHoveredIndex(index)}
                                                    onMouseLeave={() => setHoveredIndex(null)}
                                                />
                                            );
                                        })}
                                    </Bar>
                                    <Tooltip content={<CustomBarTooltip theme={theme} />} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-16">Log your mood to see your distribution chart.</p>
                )}
            </div>

            <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Assessment History</h3>
                {assessmentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-gray-700">
                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Score</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                        {assessmentHistory.slice().reverse().slice(0, 5).map((assessment) => (
                        <tr key={assessment.id} className="hover:bg-slate-100 dark:hover:bg-gray-700/50 transition">
                            <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200">{new Date(assessment.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{Math.round((assessment.score / 48) * 10) || 1} / 10</td>
                            <td className="px-4 py-3 text-sm"><span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                assessment.level === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                                assessment.level === 'Mild' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                assessment.level === 'Moderate' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                                'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            }`}>{assessment.level}</span></td>
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
      {/* Bottom Section - Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {breathingSessions.length > 0 && (
            <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                 <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Recent Breathing Sessions</h3>
                 <div className="space-y-3 max-h-80 overflow-y-auto">
                    {breathingSessions.slice().reverse().slice(0, 8).map(session => (
                        <div key={session.id} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-lg">{Math.floor(session.duration_seconds / 60)}:{String(session.duration_seconds % 60).padStart(2, '0')}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{session.cycles_completed} cycles completed</p>
                                </div>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">{new Date(session.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            )}
            <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Recent Moods</h3>
                 {moodLogs.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {moodLogs.slice(0, 8).map(log => (
                            <div key={log.id} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl border border-slate-200 dark:border-gray-600 hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="inline-block font-bold text-lg px-3 py-1 rounded-full" style={{ backgroundColor: moodColors[log.mood] + '20', color: moodColors[log.mood] }}>
                                            {log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}
                                        </span>
                                        {log.note && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic">"{log.note}"</p>}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">{new Date(log.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">You haven't logged any moods yet.</p>
                )}
            </div>
      </div>
    </div>
  );
};

export default Profile;