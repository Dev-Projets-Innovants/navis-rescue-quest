import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameSession } from '@/hooks/useGameSession';
import { BoxType } from '@/types/game';
import { Copy, CheckCircle, PartyPopper, Ship, MapPin } from 'lucide-react';
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
      <div className="max-w-2xl w-full space-y-4 sm:space-y-6 animate-scale-in px-2">
        <Card className="p-6 sm:p-8 bg-background/95 backdrop-blur text-center space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <img 
              src={missionNavisLogo} 
              alt="Mission Navis" 
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto animate-bounce object-contain"
            />
            <div className="flex items-center justify-center gap-2">
              <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
              <h1 className="text-2xl sm:text-3xl font-bold text-success">BOÎTE DÉBLOQUÉE !</h1>
            </div>
            <p className="text-lg sm:text-xl font-medium">{box.name}</p>
          </div>

          <div className="py-3 sm:py-4">
            <div className="flex items-center justify-center gap-2">
              <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <p className="text-base sm:text-lg font-medium">Pièce du bateau récupérée</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm sm:text-base text-muted-foreground">Code de déblocage :</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-muted rounded-lg text-xl sm:text-2xl font-mono font-bold tracking-wider">
                {box.unlockCode}
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className="h-12 w-12 sm:h-14 sm:w-14"
              >
                {copied ? <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" /> : <Copy className="h-5 w-5 sm:h-6 sm:w-6" />}
              </Button>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 bg-accent/10 border-2 border-accent rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                <p className="text-xs sm:text-sm font-medium">Prochaine étape :</p>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
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
