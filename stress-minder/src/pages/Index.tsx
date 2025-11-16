import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getLatestAssessment, logoutUser } from '@/integrations/api/client';
import { AssessmentForm } from '@/components/assessment/AssessmentForm';
import { AssessmentResult } from '@/components/assessment/AssessmentResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Brain, User, Activity, LogOut } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface Assessment {
  id: string;
  user_id: string;
  stress_level: 'low' | 'moderate' | 'high' | 'severe';
  score: number;
  answers: Record<string, number>;
  recommendations: string[];
  created_at: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const navigate = useNavigate();

  const checkUserAndFetchData = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/auth');
        return;
      }
      setUser(currentUser as User);
      await fetchLatestAssessment();
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkUserAndFetchData();
  }, [checkUserAndFetchData]);

  const fetchLatestAssessment = async () => {
    try {
      const assessment = await getLatestAssessment();
      if (assessment) {
        setLatestAssessment(assessment as Assessment);
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
    }
  };

  const handleStartNewAssessment = () => {
    setLatestAssessment(null);
    setShowAssessment(true);
  };

  const handleAssessmentComplete = async () => {
    setShowAssessment(false);
    await fetchLatestAssessment();
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-soft p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mental Health Toolkit</h1>
              <p className="text-muted-foreground">Take care of your wellbeing</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/profile')} className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </Button>
            <Button variant="outline" onClick={() => navigate('/breathing')} className="gap-2">
              <Activity className="w-4 h-4" />
              Breathing
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {showAssessment ? (
          <AssessmentForm onComplete={handleAssessmentComplete} />
        ) : latestAssessment ? (
          <div className="space-y-6">
            <AssessmentResult assessment={latestAssessment} />
            <div className="text-center">
              <Button onClick={handleStartNewAssessment} size="lg" variant="outline">
                Take New Assessment
              </Button>
            </div>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto shadow-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Brain className="w-12 h-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Welcome to Your Mental Health Journey</CardTitle>
              <CardDescription className="text-base">
                Take a quick assessment to understand your stress levels and get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">5</p>
                  <p className="text-sm text-muted-foreground">Minutes</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">✓</p>
                  <p className="text-sm text-muted-foreground">Private</p>
                </div>
              </div>
              
              <Button onClick={handleStartNewAssessment} size="lg" className="w-full">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
