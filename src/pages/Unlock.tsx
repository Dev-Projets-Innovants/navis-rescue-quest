import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameSession } from '@/hooks/useGameSession';
import { BoxType } from '@/types/game';
import { Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import missionNavisLogo from '@/assets/mission-navis-logo.jpg';

const Unlock = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const boxType = searchParams.get('box') as BoxType;
  const { session, loading } = useGameSession();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!session || !boxType) {
      navigate('/dashboard');
      return;
    }

    const box = session.boxes.find(b => b.type === boxType);
    if (!box || box.status !== 'unlocked') {
      navigate('/dashboard');
    }
  }, [loading, session, boxType, navigate]);

  if (loading || !session || !boxType) return null;

  const box = session.boxes.find(b => b.type === boxType);
  if (!box) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(box.unlockCode);
      setCopied(true);
      toast.success('Code copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erreur lors de la copie');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success via-success/90 to-accent p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6 animate-scale-in">
        <Card className="p-8 bg-background/95 backdrop-blur text-center space-y-6">
          <div className="space-y-4">
            <img 
              src={missionNavisLogo} 
              alt="Mission Navis" 
              className="w-32 h-32 mx-auto animate-bounce object-contain"
            />
            <h1 className="text-3xl font-bold text-success">🎉 BOÎTE DÉBLOQUÉE !</h1>
            <p className="text-xl font-medium">{box.name}</p>
          </div>

          <div className="py-8">
            <div className="inline-block animate-pulse">
              <img 
                src={missionNavisLogo} 
                alt="Mission Navis" 
                className="w-32 h-32 mx-auto object-contain"
              />
              <p className="text-sm text-muted-foreground mt-2">Pièce du bateau récupérée</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground">Code de déblocage :</p>
            <div className="flex items-center justify-center gap-2">
              <div className="px-6 py-4 bg-muted rounded-lg text-2xl font-mono font-bold tracking-wider">
                {box.unlockCode}
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className="h-14 w-14"
              >
                {copied ? <CheckCircle className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="p-4 bg-accent/10 border-2 border-accent rounded-lg">
              <p className="text-sm font-medium">📍 Prochaine étape :</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ouvre la boîte physique pour récupérer la pièce du bateau !
              </p>
            </div>

            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full"
              size="lg"
            >
              RETOUR AU DASHBOARD →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Unlock;
