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
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Card */}
        <Card className="p-4 bg-card/95 backdrop-blur-sm border-primary/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center text-2xl border border-accent/30">
                {box.type === 'A' ? '🏥' : box.type === 'B' ? '🌍' : box.type === 'C' ? '🎨' : '🌱'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{box.name}</h2>
                <p className="text-xs text-muted-foreground">{box.subtitle}</p>
              </div>
            </div>
            <Timer startTime={session.startTime} />
          </div>
        </Card>

        {/* Question Card */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm border-primary/20 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {currentQuestionIndex + 1}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
            <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              👥 {session.players.length} joueur{session.players.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground leading-relaxed">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 font-medium ${
                    selectedAnswer === index
                      ? 'border-accent bg-accent/20 shadow-lg shadow-accent/20 scale-[1.02]'
                      : 'border-border bg-card hover:border-accent/50 hover:bg-accent/5 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedAnswer === index
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-muted-foreground/30'
                    }`}>
                      {selectedAnswer === index && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button 
              onClick={handleValidate} 
              className="w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={selectedAnswer === null}
            >
              {selectedAnswer === null ? 'SÉLECTIONNE UNE RÉPONSE' : 'VALIDER LA RÉPONSE ✓'}
            </Button>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Progression de la boîte</span>
                <span className="font-bold text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500 ease-out shadow-lg"
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
