import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timer } from '@/components/Timer';
import { useGameSession } from '@/hooks/useGameSession';
import { usePlayerAnswers } from '@/hooks/usePlayerAnswers';
import { useBoxUnlock } from '@/hooks/useBoxUnlock';
import { useBoxAttempts } from '@/hooks/useBoxAttempts';
import { getQuestionsForBox } from '@/lib/gameStorage';
import { shuffleArray } from '@/lib/utils';
import { BoxType } from '@/types/game';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const QUIZ_DURATION = 600; // 10 minutes in seconds
const PASS_THRESHOLD = 0.6; // 60% minimum to pass

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const boxType = searchParams.get('box') as BoxType;
  const { session, loading } = useGameSession();
  const { saveAnswer } = usePlayerAnswers();
  const { unlockBox } = useBoxUnlock();
  const { startAttempt, endAttempt } = useBoxAttempts();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStartTime] = useState(Date.now());
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeUp, setTimeUp] = useState(false);

  // Get box data before any early returns
  const box = session?.boxes.find(b => b.type === boxType);
  const questionsCount = box && boxType && session ? getQuestionsForBox(boxType, session.players.length) : 0;
  
  // Shuffle questions once using useMemo (must be called before any conditional returns)
  const shuffledQuestions = useMemo(() => {
    if (!box || !box.questions) return [];
    const questions = box.questions.slice(0, questionsCount);
    return shuffleArray(questions);
  }, [box?.questions, questionsCount]);

  useEffect(() => {
    if (loading) return;
    
    if (!session || !boxType) {
      navigate('/dashboard');
      return;
    }

    const box = session.boxes.find(b => b.type === boxType);
    if (!box || box.status === 'unlocked') {
      navigate('/dashboard');
      return;
    }

    // Start the attempt and assign box to player
    const playerId = localStorage.getItem('current_player_id');
    if (playerId && !attemptId) {
      startAttempt(session.code, boxType, playerId).then(data => {
        if (data) {
          setAttemptId(data.id);
        }
      });

      // Assign box to player
      supabase
        .from('session_players')
        .update({ assigned_box: boxType })
        .eq('id', playerId)
        .then();
    }

    // Cleanup: unassign box when leaving
    return () => {
      if (playerId) {
        supabase
          .from('session_players')
          .update({ assigned_box: null })
          .eq('id', playerId)
          .then();
      }
    };
  }, [loading, session, boxType, navigate, attemptId, startAttempt]);

  if (!session || !boxType || !box || shuffledQuestions.length === 0) return null;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleTimeUp = async () => {
    setTimeUp(true);
    toast.error('⏰ Temps écoulé ! La boîte reste verrouillée.');
    
    // Calculate final score
    const score = (answers.filter(a => a).length / shuffledQuestions.length) * 100;
    
    if (attemptId) {
      await endAttempt(attemptId, score, false);
    }

    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const handleAnswerSelect = (index: number) => {
    if (showExplanation || timeUp) return;
    setSelectedAnswer(index);
  };

  const handleValidate = async () => {
    if (selectedAnswer === null) {
      toast.error('Sélectionne une réponse !');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    // Save answer to database
    const playerId = localStorage.getItem('current_player_id');
    if (playerId) {
      await saveAnswer(playerId, currentQuestion.id, isCorrect);
    }

    if (isCorrect) {
      toast.success('Bonne réponse ! ✅');
    } else {
      toast.error('Mauvaise réponse ❌');
    }

    // Show explanation
    setShowExplanation(true);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Calculate final score
      const score = (answers.filter(a => a).length / shuffledQuestions.length) * 100;
      const success = score >= PASS_THRESHOLD * 100;

      if (attemptId) {
        await endAttempt(attemptId, score, success);
      }

      if (success) {
        // Unlock the box
        await unlockBox(session.code, boxType);
        toast.success('🎉 Boîte débloquée !');
        navigate(`/unlock?box=${boxType}`);
      } else {
        toast.error(`Score insuffisant (${Math.round(score)}%). Minimum requis: ${PASS_THRESHOLD * 100}%`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    }
  };

  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  const score = answers.length > 0 ? (answers.filter(a => a).length / answers.length) * 100 : 0;

  if (timeUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/20 via-background to-destructive/10 p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">⏰ Temps écoulé !</h2>
          <p className="text-muted-foreground mb-4">
            Le temps imparti pour cette boîte est écoulé.
          </p>
          <p className="text-sm">
            Score final: {Math.round(score)}%
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6 bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{box.type === 'A' ? '🏥' : box.type === 'B' ? '🌍' : box.type === 'C' ? '🎨' : '🌱'}</span>
              <div>
                <h2 className="text-xl font-bold">{box.name}</h2>
                <p className="text-sm text-muted-foreground">{box.subtitle}</p>
              </div>
            </div>
            <Timer 
              startTime={quizStartTime} 
              duration={QUIZ_DURATION}
              onTimeUp={handleTimeUp}
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1}/{shuffledQuestions.length}
            </span>
            <span className="text-sm font-bold">
              Score: {Math.round(score)}%
            </span>
          </div>

          {!showExplanation ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleValidate} 
                className="w-full"
                disabled={selectedAnswer === null}
              >
                VALIDER LA RÉPONSE
              </Button>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progression de la boîte</span>
                  <span className="font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const isSelected = index === selectedAnswer;
                  
                  return (
                    <div
                      key={index}
                      className={`w-full p-4 rounded-lg border-2 ${
                        isCorrect
                          ? 'border-success bg-success/10'
                          : isSelected
                          ? 'border-destructive bg-destructive/10'
                          : 'border-border bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isCorrect && <span className="text-success font-bold">✓ Bonne réponse</span>}
                        {isSelected && !isCorrect && <span className="text-destructive font-bold">✗</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentQuestion.explanation && (
                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
                  <p className="font-semibold mb-2">💡 Explication</p>
                  <p className="text-sm">{currentQuestion.explanation}</p>
                </div>
              )}

              <Button 
                onClick={handleNextQuestion} 
                className="w-full"
              >
                {currentQuestionIndex < shuffledQuestions.length - 1 
                  ? 'QUESTION SUIVANTE' 
                  : 'VOIR LE RÉSULTAT'}
              </Button>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progression de la boîte</span>
                  <span className="font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
