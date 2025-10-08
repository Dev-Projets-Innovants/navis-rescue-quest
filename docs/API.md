# Documentation des Hooks et API

## 🎣 Custom Hooks

### useGameSession

**Fichier** : `src/hooks/useGameSession.ts`

**Objectif** : Gérer l'état global de la session de jeu

#### Interface

```typescript
interface UseGameSessionReturn {
  session: GameSession | null;
  loading: boolean;
  createSession: (playerPseudo: string) => Promise<void>;
  joinSession: (sessionCode: string, playerPseudo: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearSession: () => void;
}
```

#### Utilisation

```typescript
const { 
  session, 
  loading, 
  createSession, 
  joinSession, 
  refreshSession,
  clearSession 
} = useGameSession();
```

#### Fonctions

##### `createSession(playerPseudo: string)`

Crée une nouvelle session de jeu.

```typescript
await createSession("Alice");
// Crée une session avec code BOAT-XXXX
// Ajoute le joueur créateur
// Charge les questions depuis data/questions.ts
// Sauvegarde en localStorage et Supabase
// Redirige vers /dashboard
```

**Étapes** :
1. Générer un code unique : `BOAT-XXXX`
2. Créer l'entrée `game_sessions` dans Supabase
3. Ajouter le joueur dans `session_players`
4. Récupérer les questions depuis `questions.ts`
5. Initialiser les 4 boîtes (A, B, C, D)
6. Sauvegarder dans `localStorage`
7. Mettre à jour le state

**Erreurs possibles** :
- Code déjà existant (réessai automatique)
- Erreur réseau
- Erreur base de données

---

##### `joinSession(sessionCode: string, playerPseudo: string)`

Rejoindre une session existante.

```typescript
await joinSession("BOAT-1234", "Bob");
// Vérifie que la session existe et est active
// Ajoute le joueur à la session
// Charge les données de la session
// Sauvegarde en localStorage
```

**Validations** :
```typescript
// Vérifier que la session existe
const { data: sessionData } = await supabase
  .from('game_sessions')
  .select('*')
  .eq('session_code', sessionCode)
  .eq('status', 'active')
  .single();

if (!sessionData) {
  throw new Error('Session introuvable ou terminée');
}
```

**Étapes** :
1. Rechercher la session par code
2. Vérifier le statut `active`
3. Ajouter le joueur dans `session_players`
4. Charger toutes les données (joueurs, boîtes, etc.)
5. Sauvegarder dans `localStorage`
6. Mettre à jour le state

**Erreurs possibles** :
- Session introuvable
- Session terminée
- Erreur d'ajout du joueur

---

##### `refreshSession()`

Recharger les données de la session actuelle.

```typescript
await refreshSession();
// Recharge depuis Supabase
// Met à jour le state
```

**Usage** :
```typescript
// Refresh automatique toutes les 5 secondes
useEffect(() => {
  const interval = setInterval(refreshSession, 5000);
  return () => clearInterval(interval);
}, []);
```

---

##### `clearSession()`

Effacer la session du localStorage.

```typescript
clearSession();
// Supprime du localStorage
// Reset le state à null
```

**Usage** :
```typescript
// À la fin de la mission
clearSession();
navigate('/');
```

---

### useBoxAttempts

**Fichier** : `src/hooks/useBoxAttempts.ts`

**Objectif** : Gérer les tentatives de quiz sur les boîtes

#### Interface

```typescript
interface UseBoxAttemptsReturn {
  startAttempt: (
    sessionCode: string, 
    boxType: BoxType, 
    playerId: string
  ) => Promise<BoxAttempt | null>;
  
  saveProgress: (
    attemptId: string, 
    currentQuestionIndex: number, 
    answers: boolean[]
  ) => Promise<boolean>;
  
  endAttempt: (
    attemptId: string, 
    score: number, 
    success: boolean
  ) => Promise<boolean>;
  
  getActiveAttempt: (
    sessionCode: string, 
    boxType: BoxType
  ) => Promise<BoxAttempt | null>;
}
```

#### Fonctions

##### `startAttempt(sessionCode, boxType, playerId)`

Démarrer une nouvelle tentative de quiz.

```typescript
const attempt = await startAttempt('BOAT-1234', 'A', playerId);
// Crée une entrée box_attempts
// Retourne l'ID de la tentative
```

**Données insérées** :
```typescript
{
  session_id: sessionId,
  box_type: boxType,
  player_id: playerId,
  quiz_start_time: new Date().toISOString(),
  current_question_index: 0,
  answers: JSON.stringify([])
}
```

---

##### `saveProgress(attemptId, currentQuestionIndex, answers)`

Sauvegarder la progression du quiz.

```typescript
await saveProgress(attemptId, 2, [true, false, true]);
// Met à jour la progression en DB
```

**Update** :
```typescript
{
  current_question_index: currentQuestionIndex,
  answers: JSON.stringify(answers)
}
```

**Usage** :
```typescript
// Sauvegarde automatique toutes les 2 secondes
useEffect(() => {
  const autosave = setInterval(() => {
    if (attemptId) {
      saveProgress(attemptId, currentQuestionIndex, answers);
    }
  }, 2000);
  return () => clearInterval(autosave);
}, [attemptId, currentQuestionIndex, answers]);
```

---

##### `endAttempt(attemptId, score, success)`

Terminer une tentative de quiz.

```typescript
await endAttempt(attemptId, 4, true);
// Marque la tentative comme terminée
```

**Update** :
```typescript
{
  ended_at: new Date().toISOString(),
  score: score,
  success: success
}
```

---

##### `getActiveAttempt(sessionCode, boxType)`

Récupérer la tentative active pour une boîte.

```typescript
const activeAttempt = await getActiveAttempt('BOAT-1234', 'A');
// Retourne la tentative non terminée (ended_at null)
// Ou null si aucune tentative active
```

**Requête** :
```typescript
const { data } = await supabase
  .from('box_attempts')
  .select('*')
  .eq('session_id', sessionId)
  .eq('box_type', boxType)
  .is('ended_at', null)
  .single();
```

**Usage** :
```typescript
// Vérifier si quelqu'un travaille déjà sur cette boîte
const activeAttempt = await getActiveAttempt(sessionCode, boxType);
if (activeAttempt && activeAttempt.player_id !== currentPlayerId) {
  toast.error('Cette boîte est déjà en cours par un autre joueur !');
  navigate('/dashboard');
}
```

---

### useBoxUnlock

**Fichier** : `src/hooks/useBoxUnlock.ts`

**Objectif** : Gérer le déverrouillage des boîtes

#### Interface

```typescript
interface UseBoxUnlockReturn {
  unlockBox: (sessionCode: string, boxType: BoxType) => Promise<boolean>;
}
```

#### Fonction

##### `unlockBox(sessionCode, boxType)`

Marquer une boîte comme déverrouillée.

```typescript
const success = await unlockBox('BOAT-1234', 'A');
// Crée une entrée box_unlocks
// Retourne true si succès
```

**Données insérées** :
```typescript
{
  session_id: sessionId,
  box_type: boxType,
  code_validated: true
}
```

**Contrainte unique** :
- Une seule entrée par `(session_id, box_type)`
- Si l'entrée existe déjà (erreur 23505), pas d'erreur retournée

**Usage** :
```typescript
const handleUnlock = async () => {
  if (code === box.unlockCode) {
    const success = await unlockBox(sessionCode, boxType);
    if (success) {
      toast.success('Boîte déverrouillée !');
      navigate('/dashboard');
    }
  } else {
    toast.error('Code incorrect !');
  }
};
```

---

### usePlayerAnswers

**Fichier** : `src/hooks/usePlayerAnswers.ts`

**Objectif** : Gérer les réponses individuelles des joueurs

#### Interface

```typescript
interface UsePlayerAnswersReturn {
  saveAnswer: (
    playerId: string, 
    questionId: string, 
    isCorrect: boolean
  ) => Promise<boolean>;
  
  getPlayerAnswers: (playerId: string) => Promise<PlayerAnswer[]>;
}
```

#### Fonctions

##### `saveAnswer(playerId, questionId, isCorrect)`

Sauvegarder une réponse.

```typescript
await saveAnswer(playerId, 'A-1', true);
// Crée une entrée player_answers
```

**Données insérées** :
```typescript
{
  player_id: playerId,
  question_id: questionId,
  is_correct: isCorrect
}
```

**Contrainte unique** :
- Une seule réponse par `(player_id, question_id)`

---

##### `getPlayerAnswers(playerId)`

Récupérer toutes les réponses d'un joueur.

```typescript
const answers = await getPlayerAnswers(playerId);
// Retourne le tableau des réponses
```

---

## 🛠️ Utilitaires

### `src/lib/utils.ts`

#### `cn(...inputs: ClassValue[])`

Fusionner des classes Tailwind.

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  "another-class"
)} />
```

#### `shuffleArray<T>(array: T[])`

Mélanger un tableau (Fisher-Yates).

```typescript
const shuffled = shuffleArray([1, 2, 3, 4, 5]);
// [3, 1, 5, 2, 4]
```

**Usage** :
```typescript
// Mélanger les options de réponse
const shuffledOptions = shuffleArray(question.options);
```

---

### `src/lib/gameStorage.ts`

#### `saveGameState(session: GameSession)`

Sauvegarder la session dans localStorage.

```typescript
saveGameState(session);
```

#### `loadGameState(): GameSession | null`

Charger la session depuis localStorage.

```typescript
const session = loadGameState();
if (session) {
  // Session trouvée
}
```

#### `clearGameState()`

Effacer la session du localStorage.

```typescript
clearGameState();
```

---

## 🔌 Client Supabase

### `src/integrations/supabase/client.ts`

#### Importer le client

```typescript
import { supabase } from '@/integrations/supabase/client';
```

#### Exemples de requêtes

##### SELECT

```typescript
// Récupérer toutes les sessions actives
const { data, error } = await supabase
  .from('game_sessions')
  .select('*')
  .eq('status', 'active');

// Avec jointure
const { data, error } = await supabase
  .from('game_sessions')
  .select('*, session_players(*)')
  .eq('session_code', code)
  .single();
```

##### INSERT

```typescript
// Insérer un joueur
const { data, error } = await supabase
  .from('session_players')
  .insert({
    session_id: sessionId,
    pseudo: 'Alice',
    avatar_url: 'https://...'
  })
  .select()
  .single();
```

##### UPDATE

```typescript
// Mettre à jour une tentative
const { error } = await supabase
  .from('box_attempts')
  .update({
    current_question_index: 3,
    answers: JSON.stringify([true, false, true])
  })
  .eq('id', attemptId);
```

##### DELETE

```typescript
// Supprimer une session (rarement utilisé)
const { error } = await supabase
  .from('game_sessions')
  .delete()
  .eq('id', sessionId);
```

---

## 📊 Types

### `src/types/game.ts`

#### Types principaux

```typescript
export type BoxType = 'A' | 'B' | 'C' | 'D';
export type BoxStatus = 'locked' | 'in-progress' | 'unlocked';

export interface Player {
  id: string;
  pseudo: string;
  avatar: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Box {
  type: BoxType;
  name: string;
  subtitle: string;
  status: BoxStatus;
  unlockCode: string;
  questions: Question[];
  answers: boolean[];
}

export interface GameSession {
  code: string;
  players: Player[];
  boxes: Box[];
  startTime: number;
  endTime?: number;
  codesValidated: BoxType[];
}
```

---

## 🎯 Best Practices

### 1. Gestion des erreurs

```typescript
try {
  const result = await operation();
  toast.success("Succès !");
} catch (error) {
  console.error('Error:', error);
  toast.error("Une erreur est survenue");
}
```

### 2. Loading states

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await operation();
  } finally {
    setLoading(false);
  }
};
```

### 3. Cleanup

```typescript
useEffect(() => {
  const interval = setInterval(/* ... */, 1000);
  
  // Cleanup
  return () => clearInterval(interval);
}, []);
```

### 4. Dépendances des hooks

```typescript
// ✅ Bon : Toutes les dépendances listées
useEffect(() => {
  doSomething(value);
}, [value]);

// ❌ Mauvais : Dépendances manquantes
useEffect(() => {
  doSomething(value);
}, []); // Warning ESLint
```

### 5. Typage strict

```typescript
// ✅ Bon : Types explicites
const handleClick = (id: string): void => {
  // ...
};

// ❌ Mauvais : Types any
const handleClick = (id: any): any => {
  // ...
};
```
