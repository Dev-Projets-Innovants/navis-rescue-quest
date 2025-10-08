import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Users } from 'lucide-react';
import { useGameSession } from '@/hooks/useGameSession';
import { useToast } from '@/hooks/use-toast';

const Connect = () => {
  const [pseudo, setPseudo] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [createdCode, setCreatedCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createSession, joinSession } = useGameSession();

  const handleCreateSession = async () => {
    if (!pseudo.trim()) {
      toast({
        title: "Pseudo requis",
        description: "Veuillez saisir un pseudo",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    const session = await createSession(pseudo);
    setIsCreating(false);

    if (!session) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la session",
        variant: "destructive"
      });
      return;
    }

    setCreatedCode(session.code);
    
    toast({
      title: "Session créée !",
      description: `Code : ${session.code}`,
    });
  };

  const handleJoinSession = async () => {
    if (!pseudo.trim() || !sessionCode.trim()) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    const session = await joinSession(sessionCode.toUpperCase(), pseudo);
    setIsJoining(false);

    if (!session) {
      toast({
        title: "Erreur",
        description: "Session introuvable ou pseudo déjà utilisé",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Session rejointe !",
      description: `Bienvenue ${pseudo}`,
    });
    
    navigate('/dashboard');
  };

  const handleStartMission = () => {
    navigate('/dashboard');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(createdCode);
    toast({
      title: "Code copié !",
      description: "Partagez-le avec votre équipe"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 md:p-8 space-y-6 bg-card/95 backdrop-blur">
        <div className="text-center space-y-2">
          <Users className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Mission Navis</h1>
          <p className="text-muted-foreground">Créez ou rejoignez une équipe</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="join">Rejoindre</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 pt-4">
            {!createdCode ? (
              <>
                <div className="space-y-2">
                  <label className="text-base font-medium">Ton pseudo</label>
                  <Input
                    placeholder="Capitaine..."
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    maxLength={20}
                    className="text-lg"
                  />
                </div>
                <Button 
                  onClick={handleCreateSession} 
                  className="w-full"
                  disabled={isCreating}
                >
                  {isCreating ? 'Création...' : 'Créer la session'}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    Code d'équipe
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-background rounded-md p-3 text-center">
                      <span className="text-2xl font-bold text-primary tracking-wider">
                        {createdCode}
                      </span>
                    </div>
                    <Button 
                      onClick={copyCode}
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Partagez ce code avec vos coéquipiers pour qu'ils rejoignent la mission
                </p>
                <Button 
                  onClick={handleStartMission}
                  className="w-full"
                >
                  Lancer la mission →
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="join" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-base font-medium">Code d'équipe</label>
              <Input
                placeholder="BOAT-XXXX"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                maxLength={9}
                className="text-lg font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-medium">Ton pseudo</label>
              <Input
                placeholder="Équipier..."
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                maxLength={20}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleJoinSession}
              className="w-full"
              disabled={isJoining}
            >
              {isJoining ? 'Connexion...' : 'Rejoindre →'}
            </Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Connect;
