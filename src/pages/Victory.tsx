import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCurrentSession, clearSession } from '@/lib/gameStorage';
import { Share2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const Victory = () => {
  const navigate = useNavigate();
  const [session] = useState(getCurrentSession());

  useEffect(() => {
    if (!session || session.codesValidated.length !== 4 || !session.endTime) {
      navigate('/dashboard');
    }
  }, []);

  if (!session || !session.endTime) return null;

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
    const text = `🏆 Mission Navis accomplie en ${timeString} !\n🎯 Précision : ${accuracy}%\n👥 Équipe de ${session.players.length} joueurs`;
    
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
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        <Card className="p-8 bg-background/95 backdrop-blur text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl animate-bounce">🏆</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
              MISSION ACCOMPLIE !
            </h1>
          </div>

          <div className="py-6">
            <div className="text-7xl animate-pulse mb-4">🚢</div>
            <p className="text-lg text-muted-foreground">
              Le bateau de secours est assemblé et en route vers l'île !
            </p>
          </div>

          <Card className="p-6 bg-primary/10 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">⏱️ Temps final</p>
                <p className="text-3xl font-bold">{timeString}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">👥 Équipe</p>
                <p className="text-3xl font-bold">{session.players.length}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <h3 className="text-lg font-bold">📊 COMPÉTENCES MOBILISÉES</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>🎯 Précision</span>
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
                <div className="flex items-center justify-between text-sm">
                  <span>🤝 Travail d'équipe</span>
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
                <div className="flex items-center justify-between text-sm">
                  <span>⚡ Réactivité</span>
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

          <Card className="p-4 bg-accent/10 border-accent">
            <p className="text-sm font-medium">
              💬 "Grâce à vous, l'île reçoit les secours vitaux à temps !"
            </p>
          </Card>

          <div className="flex gap-3 pt-4">
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
