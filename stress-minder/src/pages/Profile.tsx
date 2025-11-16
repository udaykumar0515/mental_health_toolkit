import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getProfileData, logoutUser, getBreathingSessions } from '@/integrations/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, User, TrendingDown, TrendingUp, Calendar, ArrowLeft, Wind, Clock, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface Profile {
  id: string;
  full_name: string;
  created_at: string;
}

interface Assessment {
  id: string;
  stress_level: 'low' | 'moderate' | 'high' | 'severe';
  score: number;
  recommendations: string[];
  created_at: string;
}

interface BreathingSession {
  id: string;
  user_id: string;
  duration_seconds: number;
  cycles_completed: number;
  created_at: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [breathingSessions, setBreathingSessions] = useState<BreathingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const profileData = await getProfileData();
      if (profileData) {
        setProfile(profileData.user);
        setAssessments(profileData.assessments);
      }

      const sessions = await getBreathingSessions();
      if (sessions) {
        setBreathingSessions(sessions);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error(error.message || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-success text-success-foreground';
      case 'moderate':
        return 'bg-warning text-warning-foreground';
      case 'high':
      case 'severe':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const chartData = assessments
    .slice()
    .reverse()
    .map((assessment) => ({
      date: format(new Date(assessment.created_at), 'MMM dd'),
      score: assessment.score,
    }));

  const averageScore = assessments.length > 0
    ? Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length)
    : 0;

  const trend = assessments.length >= 2
    ? assessments[0].score - assessments[1].score
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
              <p className="text-muted-foreground">Your Mental Health Journey</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{assessments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Stress Level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{averageScore}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Breathing Sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary flex items-center gap-2">
                <Wind className="w-6 h-6" />
                {breathingSessions.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Recent Trend</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              {trend < 0 ? (
                <>
                  <TrendingDown className="w-6 h-6 text-success" />
                  <span className="text-2xl font-bold text-success">Improving</span>
                </>
              ) : trend > 0 ? (
                <>
                  <TrendingUp className="w-6 h-6 text-destructive" />
                  <span className="text-2xl font-bold text-destructive">Increasing</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">Stable</span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Stress Level Over Time</CardTitle>
              <CardDescription>Track your progress and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Breathing Sessions History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5" />
              Breathing Sessions
            </CardTitle>
            <CardDescription>Track your breathing exercises and relaxation sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {breathingSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No breathing sessions yet. Start your first session!</p>
                <Button onClick={() => navigate('/breathing')} className="mt-4">
                  Try Breathing Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {breathingSessions.slice().reverse().map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-lg border bg-card space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                          <Clock className="w-4 h-4" />
                          {Math.floor(session.duration_seconds / 60)} minute{Math.floor(session.duration_seconds / 60) !== 1 ? 's' : ''} {session.duration_seconds % 60} second{(session.duration_seconds % 60) !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BarChart3 className="w-4 h-4" />
                          {session.cycles_completed} cycle{session.cycles_completed !== 1 ? 's' : ''} completed
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(session.created_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assessment History */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
            <CardDescription>Your past assessments and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No assessments yet. Take your first assessment!</p>
                <Button onClick={() => navigate('/')} className="mt-4">
                  Start Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="p-4 rounded-lg border bg-card space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge className={getStressColor(assessment.stress_level)}>
                          {assessment.stress_level}
                        </Badge>
                        <p className="text-2xl font-bold text-primary">{assessment.score}%</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(assessment.created_at), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="space-y-1 text-sm">
                        {assessment.recommendations.slice(0, 3).map((rec, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
