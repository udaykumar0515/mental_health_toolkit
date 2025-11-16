import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { getQuestions, submitAssessment } from '@/integrations/api/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Option = { label: string; value: number };
type Question = { id: string; text: string; question?: string; options: Option[] | string[] };

const STRESS_RECOMMENDATIONS: { [key: string]: string[] } = {
  low: [
    'Keep up healthy habits',
    'Maintain regular exercise and sleep',
    'Continue your current wellness routine'
  ],
  moderate: [
    'Try short breathing exercises',
    'Take short breaks during work',
    'Practice mindfulness techniques',
    'Spend time on relaxing activities'
  ],
  high: [
    'Consider speaking to a friend or counselor',
    'Practice relaxation techniques daily',
    'Set boundaries and prioritize self-care',
    'Seek professional support if needed'
  ],
  severe: [
    'Seek professional help immediately',
    'Create a structured plan with a clinician',
    'Reach out to a mental health professional',
    'Contact a mental health crisis line if necessary'
  ]
};

interface AssessmentFormProps {
  onComplete?: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const fetchedQuestions = await getQuestions();
      setQuestions(fetchedQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load assessment questions');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No questions available. Please try again later.
        </CardContent>
      </Card>
    );
  }

  const total = questions.length;
  const currentQ = questions[currentQuestion];
  const questionText = currentQ.question || currentQ.text || '';
  const options = currentQ.options || [];
  const isAnswered = typeof answers[currentQ.id] !== 'undefined';
  const isLastQuestion = currentQuestion === total - 1;
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / total) * 100);

  // Get option value - handle both { label, value } and simple string arrays
  const getOptionValue = (opt: any): number => {
    if (typeof opt === 'object' && 'value' in opt) {
      return typeof opt.value === 'number' ? opt.value : parseInt(String(opt.value)) || 0;
    }
    if (typeof opt === 'string') {
      // Simple string option, use index
      return options.indexOf(opt);
    }
    return 0;
  };

  // Get option label
  const getOptionLabel = (opt: any): string => {
    if (typeof opt === 'object' && 'label' in opt) {
      return opt.label;
    }
    if (typeof opt === 'string') {
      return opt;
    }
    return String(opt);
  };

  const handleSelect = (value: string) => {
    const numValue = parseInt(value);
    setAnswers(prev => ({ ...prev, [currentQ.id]: numValue }));
  };

  const handleNext = () => {
    if (!isAnswered) {
      toast.warning('Please select an option before proceeding.');
      return;
    }
    setCurrentQuestion(i => Math.min(total - 1, i + 1));
  };

  const handlePrevious = () => {
    setCurrentQuestion(i => Math.max(0, i - 1));
  };

  const calculateScore = (): number => {
    return Object.values(answers).reduce((sum, v) => sum + (Number(v) || 0), 0);
  };

  const calculateStressLevel = (score: number): string => {
    const maxScore = total * 3; // Assuming max value per question is 3
    const percentage = (score / maxScore) * 100;
    
    if (percentage <= 30) return 'low';
    if (percentage <= 60) return 'moderate';
    if (percentage <= 80) return 'high';
    return 'severe';
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== total) {
      toast.warning('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const score = calculateScore();
      const stressLevel = calculateStressLevel(score);
      const recommendations = STRESS_RECOMMENDATIONS[stressLevel] || [];

      await submitAssessment({
        answers,
        stress_level: stressLevel,
        score: Math.round((score / (total * 3)) * 100), // Convert to percentage
        recommendations
      });

      toast.success('Assessment submitted successfully!');
      if (onComplete) {
        onComplete();
      }
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      toast.error(error.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stress Assessment</CardTitle>
        <CardDescription>Please answer the following questions honestly to get personalized recommendations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {total}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-4">{questionText}</h3>

          <RadioGroup 
            value={String(answers[currentQ.id] ?? '')} 
            onValueChange={handleSelect}
          >
            <div className="space-y-3">
              {options.map((opt: any, idx: number) => {
                const optValue = getOptionValue(opt);
                const optLabel = getOptionLabel(opt);
                
                return (
                  <div key={idx} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={String(optValue)} 
                      id={`${currentQ.id}-${idx}`} 
                    />
                    <label 
                      htmlFor={`${currentQ.id}-${idx}`}
                      className="flex-1 cursor-pointer font-medium text-sm"
                    >
                      {optLabel}
                    </label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between gap-3">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {isLastQuestion ? (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || !isAnswered}
              className="gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Assessment
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={!isAnswered}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { AssessmentForm };
