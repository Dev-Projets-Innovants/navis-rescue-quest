import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameSession } from '@/hooks/useGameSession';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, CheckCircle } from 'lucide-react';
import { BoxType } from '@/types/game';
import boxHealthImg from '@/assets/box-health.jpg';
import boxTourismImg from '@/assets/box-tourism.jpg';
import boxArtsImg from '@/assets/box-arts.jpg';
import boxEnvironmentImg from '@/assets/box-environment.jpg';

const boxImages: Record<BoxType, string> = {
  A: boxHealthImg,
  B: boxTourismImg,
  C: boxArtsImg,
  D: boxEnvironmentImg
};

const Dashboard = () => {
  const { session, loading, refreshSession } = useGameSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/connect');
    }
  }, [loading, session, navigate]);

  useEffect(() => {
    // Refresh session every 3 seconds to get updates
    const interval = setInterval(() => {
      refreshSession();
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshSession]);

  if (loading || !session) return null;

  const handleStartBox = (boxType: BoxType) => {
    navigate(`/quiz?box=${boxType}`);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Sticky header avec code équipe */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-4xl mx-auto p-4 text-center">
          <p className="text-xs sm:text-sm opacity-90">Code équipe</p>
          <p className="font-bold text-lg sm:text-xl">{session.code}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6 mt-6">

        <div className="flex gap-2 flex-wrap">
          {session.players.map(player => (
            <div key={player.id} className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
              <img src={player.avatar} alt={player.pseudo} className="w-8 h-8 rounded-full" />
              <span className="text-base">{player.pseudo}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Boîtes à débloquer</h2>
          {session.boxes.map(box => (
            <Card key={box.type} className="p-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img 
                  src={boxImages[box.type]} 
                  alt={box.name}
                  className="w-full sm:w-20 h-32 sm:h-20 rounded-lg object-cover shadow-md"
                />
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-lg">{box.name}</h3>
                  <p className="text-sm text-muted-foreground">{box.subtitle}</p>
                  {box.status === 'unlocked' && (
                    <div className="mt-2 bg-success/10 text-success rounded p-3 text-base font-mono">
                      Code: {box.unlockCode}
                    </div>
                  )}
                </div>
                <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-2">
                  {box.occupiedBy && (
                    <div className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                      En cours par {box.occupiedBy.pseudo}
                    </div>
                  )}
                  {box.status === 'locked' && (
                    <Button 
                      onClick={() => handleStartBox(box.type)} 
                      className="w-full sm:w-auto"
                      disabled={!!box.occupiedBy}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {box.occupiedBy ? 'Occupée' : 'Commencer'}
                    </Button>
                  )}
                  {box.status === 'in-progress' && (
                    <Button onClick={() => handleStartBox(box.type)} className="w-full sm:w-auto gap-2">
                      <Lock className="w-4 h-4" />
                      Continuer
                    </Button>
                  )}
                  {box.status === 'unlocked' && (
                    <CheckCircle className="w-10 h-10 text-success mx-auto sm:mx-0" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 bg-accent/20 border-accent">
          <p className="text-lg font-semibold text-center">
            Pièces collectées: {session.codesValidated.length}/4
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
