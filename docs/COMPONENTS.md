# Documentation des composants

## 📦 Vue d'ensemble

Cette documentation couvre tous les composants UI et pages de l'application Mission Navis.

## 🎭 Composants personnalisés

### Timer (`src/components/Timer.tsx`)

Composant de compte à rebours affichant le temps restant.

#### Props

```typescript
interface TimerProps {
  endTime: number;      // Timestamp de fin en millisecondes
  onTimeUp?: () => void; // Callback quand le temps est écoulé
}
```

#### Utilisation

```typescript
<Timer 
  endTime={session.startTime + GAME_DURATION}
  onTimeUp={() => {
    toast.error("Temps écoulé !");
    navigate('/dashboard');
  }}
/>
```

#### Comportement

- Affiche le temps restant au format `MM:SS`
- Met à jour toutes les secondes
- Change de couleur quand il reste moins de 5 minutes
- Appelle `onTimeUp` quand le temps atteint 0

#### Styles

```typescript
// Temps normal (> 5 min) : text-primary
// Alerte (< 5 min) : text-destructive
// Format : "25:30" (25 minutes 30 secondes)
```

---

## 📄 Pages (Routes)

### 1. Landing (`src/pages/Landing.tsx`)

**Route** : `/`

**Objectif** : Page d'accueil avec présentation du jeu

**Contenu** :
- Logo Mission Navis
- Titre et description du jeu
- Bouton "Commencer" vers `/connect`
- Image d'illustration

**Props** : Aucune

**État local** : Aucun

**Navigation** :
```typescript
<Button onClick={() => navigate('/connect')}>
  Commencer
</Button>
```

---

### 2. Connect (`src/pages/Connect.tsx`)

**Route** : `/connect`

**Objectif** : Créer ou rejoindre une session de jeu

**État local** :
```typescript
const [pseudo, setPseudo] = useState('');
const [sessionCode, setSessionCode] = useState('');
const [isJoining, setIsJoining] = useState(false);
```

**Formulaire** :
- Input pour le pseudo (requis)
- Radio buttons : "Créer" / "Rejoindre"
- Input pour le code session (si rejoindre)
- Bouton de soumission

**Validation** :
```typescript
if (!pseudo.trim()) {
  toast.error("Veuillez entrer un pseudo");
  return;
}

if (isJoining && !sessionCode.trim()) {
  toast.error("Veuillez entrer le code de session");
  return;
}
```

**Actions** :
```typescript
// Créer une session
const handleCreate = async () => {
  await createSession(pseudo);
  navigate('/dashboard');
};

// Rejoindre une session
const handleJoin = async () => {
  await joinSession(sessionCode, pseudo);
  navigate('/dashboard');
};
```

---

### 3. Dashboard (`src/pages/Dashboard.tsx`)

**Route** : `/dashboard`

**Objectif** : Vue d'ensemble des boîtes et gestion de la mission

**État local** :
```typescript
const { session, refreshSession } = useGameSession();
const [timeRemaining, setTimeRemaining] = useState(0);
```

**Affichage** :
- Timer global en haut
- Code de session (partageable)
- Liste des joueurs connectés
- Grille des 4 boîtes avec leur statut

**Statuts des boîtes** :
```typescript
type BoxStatus = 'locked' | 'in-progress' | 'unlocked';

// locked : Gris, cliquable
// in-progress : Orange, nom du joueur affiché
// unlocked : Vert, check mark
```

**Actions** :
```typescript
const handleBoxClick = (boxType: BoxType) => {
  const box = session.boxes.find(b => b.type === boxType);
  
  if (box.status === 'unlocked') {
    return; // Rien faire
  }
  
  if (box.status === 'in-progress') {
    // Vérifier si c'est le joueur actuel
    const currentPlayerId = localStorage.getItem('current_player_id');
    // Si oui, reprendre, sinon bloquer
  }
  
  if (box.status === 'locked') {
    navigate(`/quiz/${boxType}`);
  }
};
```

**Refresh automatique** :
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    refreshSession();
  }, 5000); // Toutes les 5 secondes
  
  return () => clearInterval(interval);
}, []);
```

**Composants utilisés** :
- `Timer` - Compte à rebours
- `Card` - Cartes pour les boîtes
- `Badge` - Badges pour les statuts
- `Avatar` - Avatars des joueurs

---

### 4. Quiz (`src/pages/Quiz.tsx`)

**Route** : `/quiz/:boxType`

**Objectif** : Interface de quiz avec 5 questions

**Paramètres de route** :
```typescript
const { boxType } = useParams<{ boxType: BoxType }>();
```

**État local** :
```typescript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
const [answers, setAnswers] = useState<boolean[]>([]);
const [attemptId, setAttemptId] = useState<string | null>(null);
const [quizStartTime, setQuizStartTime] = useState<number>(0);
```

**Logique de protection** :
```typescript
useEffect(() => {
  const checkExistingAttempt = async () => {
    const activeAttempt = await getActiveAttempt(sessionCode, boxType);
    
    if (activeAttempt) {
      if (activeAttempt.player_id === currentPlayerId) {
        // Restaurer la progression
        setAttemptId(activeAttempt.id);
        setCurrentQuestionIndex(activeAttempt.current_question_index);
        setAnswers(JSON.parse(activeAttempt.answers));
      } else {
        // Bloquer l'accès
        toast.error('Cette boîte est déjà en cours par un autre joueur !');
        navigate('/dashboard');
      }
    } else {
      // Créer une nouvelle tentative
      const newAttempt = await startAttempt(sessionCode, boxType, currentPlayerId);
      setAttemptId(newAttempt.id);
      setQuizStartTime(Date.now());
    }
  };
  
  checkExistingAttempt();
}, []);
```

**Sauvegarde automatique** :
```typescript
useEffect(() => {
  const autosave = setInterval(() => {
    if (attemptId && answers.length > 0) {
      saveProgress(attemptId, currentQuestionIndex, answers);
    }
  }, 2000); // Toutes les 2 secondes
  
  return () => clearInterval(autosave);
}, [attemptId, answers, currentQuestionIndex]);
```

**Affichage d'une question** :
```typescript
const currentQuestion = box.questions[currentQuestionIndex];

<Card>
  <CardHeader>
    <CardTitle>
      Question {currentQuestionIndex + 1} / {box.questions.length}
    </CardTitle>
  </CardHeader>
  
  <CardContent>
    <p className="mb-6">{currentQuestion.question}</p>
    
    <div className="space-y-3">
      {currentQuestion.options.map((option, index) => (
        <Button
          key={index}
          variant={selectedAnswer === index ? "default" : "outline"}
          onClick={() => setSelectedAnswer(index)}
          className="w-full text-left justify-start"
        >
          {option}
        </Button>
      ))}
    </div>
  </CardContent>
  
  <CardFooter>
    <Button
      onClick={handleNext}
      disabled={selectedAnswer === null}
    >
      {currentQuestionIndex < box.questions.length - 1 ? 'Suivant' : 'Terminer'}
    </Button>
  </CardFooter>
</Card>
```

**Gestion de la réponse** :
```typescript
const handleNext = async () => {
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const newAnswers = [...answers, isCorrect];
  setAnswers(newAnswers);
  
  // Sauvegarder la réponse individuelle
  await saveAnswer(currentPlayerId, currentQuestion.id, isCorrect);
  
  if (currentQuestionIndex < box.questions.length - 1) {
    // Question suivante
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
  } else {
    // Quiz terminé
    const score = newAnswers.filter(a => a).length;
    await endAttempt(attemptId, score, score >= 3);
    navigate('/validation', { 
      state: { 
        boxType, 
        score, 
        answers: newAnswers 
      } 
    });
  }
};
```

---

### 5. Validation (`src/pages/Validation.tsx`)

**Route** : `/validation`

**Objectif** : Afficher les résultats du quiz

**Données de navigation** :
```typescript
const location = useLocation();
const { boxType, score, answers } = location.state;
```

**Calcul** :
```typescript
const totalQuestions = 5;
const correctAnswers = answers.filter(a => a).length;
const percentage = (correctAnswers / totalQuestions) * 100;
const success = correctAnswers >= 3;
```

**Affichage** :
```typescript
<Card>
  <CardHeader>
    <CardTitle>
      {success ? '✅ Quiz réussi !' : '❌ Quiz échoué'}
    </CardTitle>
  </CardHeader>
  
  <CardContent>
    <div className="text-center">
      <div className="text-6xl font-bold mb-4">
        {percentage}%
      </div>
      <p className="text-xl mb-6">
        {correctAnswers} / {totalQuestions} bonnes réponses
      </p>
      
      {success && (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="font-bold">Code de déverrouillage :</p>
          <p className="text-2xl font-mono">{box.unlockCode}</p>
        </div>
      )}
    </div>
  </CardContent>
  
  <CardFooter className="flex gap-3">
    {success ? (
      <Button onClick={() => navigate('/unlock')}>
        Déverrouiller la boîte
      </Button>
    ) : (
      <Button onClick={() => navigate(`/quiz/${boxType}`)}>
        Réessayer
      </Button>
    )}
    
    <Button variant="outline" onClick={() => navigate('/dashboard')}>
      Retour au tableau de bord
    </Button>
  </CardFooter>
</Card>
```

---

### 6. Unlock (`src/pages/Unlock.tsx`)

**Route** : `/unlock`

**Objectif** : Valider le code de déverrouillage

**État local** :
```typescript
const [code, setCode] = useState('');
const [isValidating, setIsValidating] = useState(false);
```

**Formulaire** :
```typescript
<Card>
  <CardHeader>
    <CardTitle>Déverrouiller la boîte {boxType}</CardTitle>
  </CardHeader>
  
  <CardContent>
    <Input
      type="text"
      value={code}
      onChange={(e) => setCode(e.target.value.toUpperCase())}
      placeholder="Entrez le code"
      className="text-center text-xl font-mono"
    />
  </CardContent>
  
  <CardFooter>
    <Button
      onClick={handleUnlock}
      disabled={!code || isValidating}
      className="w-full"
    >
      {isValidating ? 'Validation...' : 'Valider'}
    </Button>
  </CardFooter>
</Card>
```

**Validation** :
```typescript
const handleUnlock = async () => {
  setIsValidating(true);
  
  const box = session.boxes.find(b => b.type === boxType);
  
  if (code === box.unlockCode) {
    const success = await unlockBox(session.code, boxType);
    
    if (success) {
      toast.success('Boîte déverrouillée !');
      await refreshSession();
      navigate('/dashboard');
    } else {
      toast.error('Erreur lors du déverrouillage');
    }
  } else {
    toast.error('Code incorrect !');
  }
  
  setIsValidating(false);
};
```

---

### 7. Victory (`src/pages/Victory.tsx`)

**Route** : `/victory`

**Objectif** : Écran de victoire final

**Condition d'accès** :
```typescript
useEffect(() => {
  if (session.codesValidated.length !== 4) {
    navigate('/dashboard');
  }
}, [session]);
```

**Affichage** :
```typescript
<Card className="text-center">
  <CardHeader>
    <CardTitle className="text-4xl">
      🎉 Mission accomplie !
    </CardTitle>
  </CardHeader>
  
  <CardContent>
    <p className="text-xl mb-6">
      Félicitations ! Vous avez déverrouillé toutes les boîtes.
    </p>
    
    <div className="mb-6">
      <p className="text-lg font-bold">Temps total :</p>
      <p className="text-3xl">{formatTime(session.endTime - session.startTime)}</p>
    </div>
    
    <div className="mb-6">
      <p className="text-lg font-bold mb-3">Équipe :</p>
      <div className="flex justify-center gap-3 flex-wrap">
        {session.players.map(player => (
          <div key={player.id} className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={player.avatar} />
            </Avatar>
            <span>{player.pseudo}</span>
          </div>
        ))}
      </div>
    </div>
  </CardContent>
  
  <CardFooter>
    <Button onClick={() => {
      clearSession();
      navigate('/');
    }}>
      Nouvelle mission
    </Button>
  </CardFooter>
</Card>
```

---

### 8. Not Found (`src/pages/NotFound.tsx`)

**Route** : `*` (catch-all)

**Objectif** : Page 404

**Affichage** :
```typescript
<div className="flex flex-col items-center justify-center min-h-screen">
  <h1 className="text-6xl font-bold mb-4">404</h1>
  <p className="text-xl mb-8">Page non trouvée</p>
  <Button onClick={() => navigate('/')}>
    Retour à l'accueil
  </Button>
</div>
```

---

## 🎨 Composants UI Shadcn

Le projet utilise de nombreux composants de la bibliothèque Shadcn/ui. Voici les principaux :

### Button
```typescript
<Button variant="default" size="lg">
  Cliquez-moi
</Button>

// Variants : default, destructive, outline, secondary, ghost, link
// Sizes : default, sm, lg, icon
```

### Card
```typescript
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu
  </CardContent>
  <CardFooter>
    Actions
  </CardFooter>
</Card>
```

### Input
```typescript
<Input
  type="text"
  placeholder="Votre texte"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Label
```typescript
<Label htmlFor="input-id">
  Libellé
</Label>
<Input id="input-id" />
```

### Badge
```typescript
<Badge variant="default">Badge</Badge>

// Variants : default, secondary, destructive, outline
```

### Avatar
```typescript
<Avatar>
  <AvatarImage src="url" alt="Description" />
  <AvatarFallback>AB</AvatarFallback>
</Avatar>
```

### Progress
```typescript
<Progress value={60} max={100} />
```

### Separator
```typescript
<Separator orientation="horizontal" />
```

### Toast (via Sonner)
```typescript
import { toast } from 'sonner';

toast.success("Opération réussie !");
toast.error("Une erreur est survenue");
toast.info("Information");
toast.warning("Attention");
```

---

## 🎯 Best practices des composants

### 1. Typage strict
```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  isLoading = false 
}) => {
  // ...
};
```

### 2. Extraction de la logique
```typescript
// ❌ Mauvais : Logique dans le composant
const Component = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data').then(/* ... */);
  }, []);
  
  return <div>{/* ... */}</div>;
};

// ✅ Bon : Logique dans un hook
const useData = () => {
  const [data, setData] = useState([]);
  // Logique ici
  return { data };
};

const Component = () => {
  const { data } = useData();
  return <div>{/* ... */}</div>;
};
```

### 3. Composition
```typescript
// Composants petits et réutilisables
<Card>
  <QuizHeader questionNumber={1} />
  <QuizContent question={question} />
  <QuizActions onNext={handleNext} />
</Card>
```

### 4. Memo pour optimisation
```typescript
import { memo } from 'react';

export const ExpensiveComponent = memo(({ data }) => {
  // Composant coûteux
});
```
