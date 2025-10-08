import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameSession } from '@/hooks/useGameSession';
import { Timer } from '@/components/Timer';
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
    navigate(`/quiz/${boxType}`);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-primary text-primary-foreground rounded-lg p-4 flex justify-between items-center">
          <Timer startTime={session.startTime} endTime={session.endTime} />
          <div className="text-right">
            <p className="text-sm opacity-90">Code équipe</p>
            <p className="font-bold">{session.code}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {session.players.map(player => (
            <div key={player.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
              <img src={player.avatar} alt={player.pseudo} className="w-6 h-6 rounded-full" />
              <span className="text-sm">{player.pseudo}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Boîtes à débloquer</h2>
          {session.boxes.map(box => (
            <Card key={box.type} className="p-4">
              <div className="flex items-start gap-4">
                <img 
                  src={boxImages[box.type]} 
                  alt={box.name}
                  className="w-16 h-16 rounded-lg object-cover shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{box.name}</h3>
                  <p className="text-sm text-muted-foreground">{box.subtitle}</p>
                  {box.status === 'unlocked' && (
                    <div className="mt-2 bg-success/10 text-success rounded p-2 text-sm font-mono">
                      Code: {box.unlockCode}
                    </div>
                  )}
                </div>
                <div>
                  {box.status === 'locked' && (
                    <Button onClick={() => handleStartBox(box.type)}>
                      <Lock className="w-4 h-4 mr-2" />
                      Commencer
                    </Button>
                  )}
                  {box.status === 'unlocked' && (
                    <CheckCircle className="w-8 h-8 text-success" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">
            Pièces collectées: {session.codesValidated.length}/4
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
