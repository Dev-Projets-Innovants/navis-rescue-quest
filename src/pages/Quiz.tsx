import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timer } from '@/components/Timer';
import { getCurrentSession, updateSession, getQuestionsForBox } from '@/lib/gameStorage';
import { BoxType, Question } from '@/types/game';
import { toast } from 'sonner';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const boxType = searchParams.get('box') as BoxType;
  const [session, setSession] = useState(getCurrentSession());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (!session || !boxType) {
      navigate('/dashboard');
      return;
    }

    const box = session.boxes.find(b => b.type === boxType);
    if (!box || box.status === 'unlocked') {
      navigate('/dashboard');
      return;
    }

    if (box.status === 'locked') {
      const updatedSession = { ...session };
      const boxIndex = updatedSession.boxes.findIndex(b => b.type === boxType);
      updatedSession.boxes[boxIndex].status = 'in-progress';
      updateSession(updatedSession);
      setSession(updatedSession);
    }
  }, []);

  if (!session || !boxType) return null;

  const box = session.boxes.find(b => b.type === boxType);
  if (!box) return null;

  const questionsCount = getQuestionsForBox(boxType, session.players.length);
  const questions = box.questions.slice(0, questionsCount);
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleValidate = () => {
    if (selectedAnswer === null) {
      toast.error('Sélectionne une réponse !');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (isCorrect) {
      toast.success('Bonne réponse ! ✅');
    } else {
      toast.error(`Mauvaise réponse. La bonne réponse était : ${currentQuestion.options[currentQuestion.correctAnswer]}`);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      }, 2000);
    } else {
      setTimeout(() => {
        const updatedSession = { ...session };
        const boxIndex = updatedSession.boxes.findIndex(b => b.type === boxType);
        updatedSession.boxes[boxIndex].status = 'unlocked';
        updatedSession.boxes[boxIndex].answers = newAnswers;
        updateSession(updatedSession);
        navigate(`/unlock?box=${boxType}`);
      }, 2000);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
            <Timer startTime={session.startTime} />
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1}/{questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              👥 {session.players.length} joueur{session.players.length > 1 ? 's' : ''}
            </span>
          </div>

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
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
