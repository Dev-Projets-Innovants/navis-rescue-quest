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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const QUIZ_DURATION = 600; // 10 minutes in seconds
const PASS_THRESHOLD = 0.6; // 60% minimum to pass

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const boxType = searchParams.get('box') as BoxType;
  const { session, loading } = useGameSession();
  const { saveAnswer } = usePlayerAnswers();
  const { unlockBox } = useBoxUnlock();
  const { startAttempt, endAttempt, getActiveAttempt, saveProgress } = useBoxAttempts();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(Date.now());
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [showEducationalPopup, setShowEducationalPopup] = useState(false);
  const [dbQuestionData, setDbQuestionData] = useState<Record<string, { explanation: string; image_url: string }>>({});

  // Get box data before any early returns
  const box = session?.boxes.find(b => b.type === boxType);
  const questionsCount = box && boxType && session ? getQuestionsForBox(boxType, session.players.length) : 0;
  
  // Shuffle questions once using useMemo (must be called before any conditional returns)
  const shuffledQuestions = useMemo(() => {
    if (!box || !box.questions) return [];
    const questions = box.questions.slice(0, questionsCount);
    return shuffleArray(questions);
  }, [box?.questions, questionsCount]);

  // Load question data from database
  useEffect(() => {
    const loadQuestionData = async () => {
      if (!shuffledQuestions.length) return;
      
      const questionIds = shuffledQuestions.map(q => q.id);
      const { data, error } = await supabase
        .from('questions')
        .select('id, explanation, image_url')
        .in('id', questionIds);
      
      if (error) {
        console.error('Error loading question data:', error);
        return;
      }
      
      if (data) {
        const dataMap: Record<string, { explanation: string; image_url: string }> = {};
        data.forEach(item => {
          dataMap[item.id] = {
            explanation: item.explanation || '',
            image_url: item.image_url || ''
          };
        });
        setDbQuestionData(dataMap);
      }
    };
    
    loadQuestionData();
  }, [shuffledQuestions]);

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

    // Check if there's an active attempt or start a new one
    const playerId = localStorage.getItem('current_player_id');
    if (playerId && !attemptId && !progressLoaded) {
      getActiveAttempt(session.code, boxType).then(activeAttempt => {
        if (activeAttempt) {
          // Check if the active attempt belongs to the current player
          if (activeAttempt.player_id === playerId) {
            // Restore existing attempt
            setAttemptId(activeAttempt.id);
            
            // Restore progress
            if (activeAttempt.current_question_index !== null) {
              setCurrentQuestionIndex(activeAttempt.current_question_index);
            }
            
            if (activeAttempt.answers) {
              const savedAnswers = typeof activeAttempt.answers === 'string' 
                ? JSON.parse(activeAttempt.answers)
                : activeAttempt.answers;
              setAnswers(savedAnswers);
            }
            
            // Restore quiz start time
            if (activeAttempt.quiz_start_time) {
              setQuizStartTime(new Date(activeAttempt.quiz_start_time).getTime());
            }
            
            setProgressLoaded(true);
          } else {
            // Someone else is already doing this box
            toast.error('Cette boîte est déjà en cours par un autre joueur !');
            navigate('/dashboard');
            return;
          }
        } else {
          // Start new attempt
          startAttempt(session.code, boxType, playerId).then(data => {
            if (data) {
              setAttemptId(data.id);
              setQuizStartTime(new Date(data.quiz_start_time).getTime());
              setProgressLoaded(true);
            }
          });
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
  }, [loading, session, boxType, navigate, attemptId, startAttempt, getActiveAttempt, progressLoaded]);

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

    // Save progress
    if (attemptId) {
      await saveProgress(attemptId, currentQuestionIndex, newAnswers);
    }

    if (isCorrect) {
      toast.success('Bonne réponse ! ✅');
      setShowExplanation(true);
    } else {
      // Ouvrir la popup éducative uniquement en cas de mauvaise réponse
      setShowEducationalPopup(true);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setShowExplanation(false);
      
      // Save progress
      if (attemptId) {
        await saveProgress(attemptId, nextIndex, answers);
      }
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
        setFinalScore(score);
        setShowFailure(true);
      }
    }
  };

  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  const score = answers.length > 0 ? (answers.filter(a => a).length / answers.length) * 100 : 0;

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (showFailure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/20 via-background to-destructive/10 p-4 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-6">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-bold">Échec</h2>
          <p className="text-muted-foreground">
            Vous n'avez pas atteint le score minimum pour débloquer cette boîte.
          </p>
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              Score obtenu: {Math.round(finalScore)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Minimum requis: {PASS_THRESHOLD * 100}%
            </p>
          </div>
          <Button onClick={handleBackToDashboard} className="w-full">
            Retour au tableau de bord
          </Button>
        </Card>
      </div>
    );
  }

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
          <Button onClick={handleBackToDashboard} className="w-full mt-4">
            Retour au tableau de bord
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestionData = dbQuestionData[currentQuestion?.id] || { explanation: '', image_url: '' };
  const correctOption = currentQuestion?.options[currentQuestion.correctAnswer];

  return (
    <>
      {/* Popup éducative pour mauvaise réponse */}
      <Dialog open={showEducationalPopup} onOpenChange={setShowEducationalPopup}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span className="text-3xl">❌</span>
              Oups ! Ce n'est pas la bonne réponse...
            </DialogTitle>
            <DialogDescription className="text-base">
              Pas de souci ! C'est en se trompant qu'on apprend. Voici la bonne réponse et son explication.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Image représentative */}
            {currentQuestionData.image_url && (
              <div className="w-full rounded-lg overflow-hidden">
                <img 
                  src={currentQuestionData.image_url} 
                  alt="Illustration de la réponse"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            {/* Bonne réponse */}
            <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 rounded">
              <p className="font-semibold text-green-800 dark:text-green-200 mb-1">✅ La bonne réponse était :</p>
              <p className="text-green-900 dark:text-green-100 text-lg">{correctOption}</p>
            </div>
            
            {/* Explication */}
            {currentQuestionData.explanation && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Explication :</p>
                <p className="text-blue-900 dark:text-blue-100 leading-relaxed">{currentQuestionData.explanation}</p>
              </div>
            )}
            
            {/* Bouton de fermeture */}
            <Button 
              onClick={() => {
                setShowEducationalPopup(false);
                setShowExplanation(true);
              }}
              className="w-full mt-4"
              size="lg"
            >
              J'ai compris ✓
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6 bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToDashboard}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Retour
            </Button>
            <Timer 
              startTime={quizStartTime} 
              duration={QUIZ_DURATION}
              onTimeUp={handleTimeUp}
            />
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl">{box.type === 'A' ? '🏥' : box.type === 'B' ? '🌍' : box.type === 'C' ? '🎨' : '🌱'}</span>
            <div>
              <h2 className="text-xl font-bold">{box.name}</h2>
              <p className="text-sm text-muted-foreground">{box.subtitle}</p>
            </div>
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
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 relative ${
                      selectedAnswer === index
                        ? 'border-primary border-[3px] bg-primary/20 shadow-lg shadow-primary/30 scale-[1.02]'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={selectedAnswer === index ? 'font-semibold' : ''}>
                        {option}
                      </span>
                      {selectedAnswer === index && (
                        <span className="text-primary text-2xl">✓</span>
                      )}
                    </div>
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
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        isCorrect
                          ? 'border-green-500 bg-green-50'
                          : isSelected
                          ? 'border-red-500 bg-red-50'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isCorrect && <span className="text-green-600">✓</span>}
                        {isSelected && !isCorrect && <span className="text-red-600">✗</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentQuestion.explanation && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-semibold mb-2">Explication</p>
                  <p className="text-sm">{currentQuestion.explanation}</p>
                  {currentQuestion.image && (
                    <img 
                      src={currentQuestion.image} 
                      alt="Question illustration" 
                      className="w-full rounded-lg mt-3"
                    />
                  )}
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
    </>
  );
};

export default Quiz;
