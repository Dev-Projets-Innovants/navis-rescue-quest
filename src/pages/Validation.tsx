import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Timer } from '@/components/Timer';
import { getCurrentSession, updateSession } from '@/lib/gameStorage';
import { BoxType } from '@/types/game';
import { CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Validation = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(getCurrentSession());
  const [codes, setCodes] = useState<Record<BoxType, string>>({
    A: '',
    B: '',
    C: '',
    D: ''
  });

  useEffect(() => {
    if (!session) {
      navigate('/dashboard');
    }
  }, []);

  if (!session) return null;

  const handleCodeChange = (boxType: BoxType, value: string) => {
    setCodes({ ...codes, [boxType]: value.toUpperCase() });
  };

  const handleValidate = (boxType: BoxType) => {
    const box = session.boxes.find(b => b.type === boxType);
    if (!box) return;

    if (codes[boxType] === box.unlockCode) {
      if (!session.codesValidated.includes(boxType)) {
        const updatedSession = { ...session };
        updatedSession.codesValidated.push(boxType);
        
        if (updatedSession.codesValidated.length === 4) {
          updatedSession.endTime = Date.now();
        }
        
        updateSession(updatedSession);
        setSession(updatedSession);
        toast.success(`Code ${boxType} validé !`);
        
        if (updatedSession.codesValidated.length === 4) {
          setTimeout(() => navigate('/victory'), 1500);
        }
      }
    } else {
      toast.error('Code incorrect !');
    }
  };

  const validatedCount = session.codesValidated.length;
  const progress = (validatedCount / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6 bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">VALIDATION DES CODES</h1>
            <Timer startTime={session.startTime} />
          </div>

          <div className="space-y-4 mb-6">
            {(['A', 'B', 'C', 'D'] as BoxType[]).map((boxType) => {
              const box = session.boxes.find(b => b.type === boxType);
              const isValidated = session.codesValidated.includes(boxType);
              const isUnlocked = box?.status === 'unlocked';

              return (
                <Card key={boxType} className={`p-4 ${isValidated ? 'bg-success/10 border-success' : ''}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Boîte {boxType}</p>
                        <p className="text-xs text-muted-foreground">{box?.name}</p>
                      </div>
                      {isValidated ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                      ) : !isUnlocked ? (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-warning" />
                      )}
                    </div>

                    {!isValidated && isUnlocked && (
                      <div className="flex gap-2">
                        <Input
                          value={codes[boxType]}
                          onChange={(e) => handleCodeChange(boxType, e.target.value)}
                          placeholder={`Code ${boxType}`}
                          className="font-mono"
                          maxLength={11}
                        />
                        <Button 
                          onClick={() => handleValidate(boxType)}
                          disabled={codes[boxType].length < 8}
                        >
                          Valider
                        </Button>
                      </div>
                    )}

                    {!isValidated && !isUnlocked && (
                      <p className="text-sm text-muted-foreground">
                        Débloque d'abord cette boîte
                      </p>
                    )}

                    {isValidated && (
                      <p className="text-sm text-success font-medium">
                        Code validé : {box?.unlockCode}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Codes validés</span>
              <span className="font-bold">{validatedCount}/4</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assemblage du bateau</span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="w-full"
            >
              ← Retour au Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Validation;
