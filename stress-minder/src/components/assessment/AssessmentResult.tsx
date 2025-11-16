import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Brain, HeartPulse, ArrowRight } from 'lucide-react';

interface Assessment {
  id: string;
  stress_level: 'low' | 'moderate' | 'high' | 'severe';
  score: number;
  recommendations: string[];
  created_at: string;
}

interface AssessmentResultProps {
  assessment: Assessment;
}

export const AssessmentResult = ({ assessment }: AssessmentResultProps) => {
  const navigate = useNavigate();

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-success text-success-foreground';
      case 'moderate':
        return 'bg-warning text-warning-foreground';
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'severe':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-card border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${getStressColor(assessment.stress_level)}`}>
              <Brain className="w-12 h-12" />
            </div>
          </div>
          <CardTitle className="text-3xl">Your Stress Level</CardTitle>
          <CardDescription>Based on your assessment responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <Badge className={`text-lg px-6 py-2 ${getStressColor(assessment.stress_level)}`}>
              {assessment.stress_level.toUpperCase()}
            </Badge>
            <p className="text-4xl font-bold text-primary">{assessment.score}%</p>
            <p className="text-muted-foreground">Stress Score</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" />
              Recommended Actions
            </h3>
            <ul className="space-y-3">
              {assessment.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="flex-1">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate('/breathing')}
              className="flex-1 gap-2"
            >
              Try Breathing Exercise
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="flex-1"
            >
              View History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
