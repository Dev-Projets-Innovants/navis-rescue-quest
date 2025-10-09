import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameSession } from '@/hooks/useGameSession';
import { Share2, RotateCcw, Trophy, Ship, Clock, Users, Target, Handshake, Zap, MessageCircle, BarChart3 } from 'lucide-react';
import { toast } from '@/lib/toastUtils';

const Victory = () => {
  const navigate = useNavigate();
  const { session, loading, clearSession } = useGameSession();

  useEffect(() => {
    if (!loading && (!session || session.codesValidated.length !== 4 || !session.endTime)) {
      navigate('/dashboard');
    }
  }, [loading, session, navigate]);

  if (loading || !session || !session.endTime) return null;

  const duration = session.endTime - session.startTime;
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const totalQuestions = session.boxes.reduce((acc, box) => acc + box.answers.length, 0);
  const correctAnswers = session.boxes.reduce((acc, box) => 
    acc + box.answers.filter(a => a).length, 0
  );
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const handleShare = async () => {
    const text = `Mission Navis accomplie en ${timeString} !\nPrécision : ${accuracy}%\nÉquipe de ${session.players.length} joueurs`;
    
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Score copié !');
      }
    } catch (err) {
      toast.error('Erreur lors du partage');
    }
  };

  const handleReplay = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success via-accent to-primary p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-4 sm:space-y-6 animate-fade-in px-2">
        <Card className="p-6 sm:p-8 bg-background/95 backdrop-blur text-center space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-success mx-auto animate-bounce" />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
              MISSION ACCOMPLIE !
            </h1>
          </div>

          <div className="py-4 sm:py-6">
            <Ship className="w-20 h-20 sm:w-24 sm:h-24 text-primary mx-auto mb-3 sm:mb-4 animate-pulse" />
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Le bateau de secours est assemblé et en route vers l'île !
            </p>
          </div>

          <Card className="p-4 sm:p-6 bg-primary/10 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Temps final</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{timeString}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Équipe</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{session.players.length}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-bold">COMPÉTENCES MOBILISÉES</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    <span>Précision</span>
                  </div>
                  <span className="font-bold">{accuracy}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <Handshake className="w-4 h-4" />
                    <span>Travail d'équipe</span>
                  </div>
                  <span className="font-bold">{Math.min(session.players.length * 25, 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success transition-all duration-1000 delay-300"
                    style={{ width: `${Math.min(session.players.length * 25, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>Réactivité</span>
                  </div>
                  <span className="font-bold">{Math.max(100 - Math.floor(duration / 1000 / 12), 50)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-warning transition-all duration-1000 delay-500"
                    style={{ width: `${Math.max(100 - Math.floor(duration / 1000 / 12), 50)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Card className="p-3 sm:p-4 bg-accent/10 border-accent">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-left">
                "Grâce à vous, l'île reçoit les secours vitaux à temps !"
              </p>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4">
            <Button 
              onClick={handleReplay}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              REJOUER
            </Button>
            <Button 
              onClick={handleShare}
              className="flex-1"
              size="lg"
            >
              <Share2 className="mr-2 h-5 w-5" />
              PARTAGER
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Victory;
