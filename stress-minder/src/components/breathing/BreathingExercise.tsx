import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, createBreathingSession } from '@/integrations/api/client';
import { toast } from 'sonner';

export const BreathingExercise = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const sessionStartTime = useRef<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // Start timer when exercise begins
    if (!sessionStartTime.current) {
      sessionStartTime.current = Date.now();
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        
        // Move to next phase
        if (phase === 'inhale') {
          setPhase('hold');
          return 4;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 4;
        } else {
          // Complete one full cycle
          setCyclesCompleted(c => c + 1);
          setPhase('inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const saveSession = async () => {
    if (!sessionStartTime.current) return;

    const durationSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    
    // Only save if session was at least 10 seconds
    if (durationSeconds < 10) {
      sessionStartTime.current = null;
      return;
    }

    setIsSaving(true);
    
    try {
      const user = await getCurrentUser();
      
      if (user) {
        await createBreathingSession({
          duration_seconds: durationSeconds,
          cycles_completed: cyclesCompleted,
        });

        toast.success(`Session Saved: ${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s of breathing exercise recorded.`);
      } else {
        toast.error('Please log in to save your breathing session.');
      }
    } catch (error) {
      console.error('Error saving breathing session:', error);
      toast.error('Could not save session. Please make sure you are logged in.');
    } finally {
      setIsSaving(false);
      sessionStartTime.current = null;
    }
  };

  const handleStop = async () => {
    setIsActive(false);
    await saveSession();
  };

  const handleReset = async () => {
    setIsActive(false);
    await saveSession();
    setPhase('inhale');
    setCountdown(4);
    setCyclesCompleted(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-primary to-secondary';
      case 'hold':
        return 'from-secondary to-accent';
      case 'exhale':
        return 'from-accent to-primary';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-soft p-4">
      <Card className="w-full max-w-2xl shadow-card border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1" />
          </div>
          <CardTitle className="text-3xl">Breathing Exercise</CardTitle>
          <CardDescription>Follow the animation to calm your mind</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Breathing circle */}
              <div
                className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ${
                  isActive && phase === 'inhale'
                    ? 'scale-150 opacity-80'
                    : isActive && phase === 'exhale'
                    ? 'scale-75 opacity-60'
                    : 'scale-100 opacity-70'
                }`}
              />
              
              {/* Inner circle with text */}
              <div className="relative z-10 w-32 h-32 rounded-full bg-card flex flex-col items-center justify-center shadow-lg">
                <p className="text-4xl font-bold text-primary">{countdown}</p>
                <p className="text-sm text-muted-foreground mt-1">{getPhaseText()}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!isActive ? (
              <Button onClick={() => setIsActive(true)} size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Start
              </Button>
            ) : (
              <Button 
                onClick={handleStop} 
                size="lg" 
                variant="secondary" 
                className="gap-2"
                disabled={isSaving}
              >
                <Pause className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Stop'}
              </Button>
            )}
            <Button 
              onClick={handleReset} 
              size="lg" 
              variant="outline" 
              className="gap-2"
              disabled={isSaving}
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds</p>
            <p>Repeat this cycle to reduce stress and anxiety</p>
            {cyclesCompleted > 0 && (
              <p className="text-primary font-medium">
                Cycles completed: {cyclesCompleted}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
