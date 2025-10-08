# Guide de dépannage

## 🚨 Problèmes courants et solutions

### Erreurs de connexion

#### "Session introuvable ou terminée"

**Symptômes** :
- Impossible de rejoindre une session
- Message d'erreur lors de la jointure

**Causes possibles** :
1. Code de session incorrect
2. Session expirée ou terminée
3. Faute de frappe dans le code

**Solutions** :
```typescript
// Vérifier le statut de la session
const { data } = await supabase
  .from('game_sessions')
  .select('*')
  .eq('session_code', code)
  .single();

console.log('Session status:', data?.status);
// Doit être 'active'
```

---

#### "Code déjà existant"

**Symptômes** :
- Erreur lors de la création de session
- Code BOAT-XXXX déjà utilisé

**Cause** :
- Collision de code (rare mais possible)

**Solution** :
- Le système réessaie automatiquement avec un nouveau code
- Si le problème persiste, vérifier la fonction `generateSessionCode()`

---

### Erreurs de quiz

#### "Cette boîte est déjà en cours par un autre joueur"

**Symptômes** :
- Redirection vers dashboard
- Impossible d'accéder au quiz

**Cause** :
- Un autre joueur a déjà commencé cette boîte

**Solution** :
```typescript
// Vérifier qui travaille sur la boîte
const activeAttempt = await getActiveAttempt(sessionCode, boxType);
console.log('Player on this box:', activeAttempt?.player_id);

// Attendre que le joueur termine ou choisir une autre boîte
```

---

#### Progression perdue après rechargement

**Symptômes** :
- Quiz redémarre à zéro après rafraîchissement
- Réponses précédentes perdues

**Causes possibles** :
1. Sauvegarde automatique désactivée
2. Erreur réseau pendant la sauvegarde
3. `attemptId` null

**Solution** :
```typescript
// Vérifier que la sauvegarde fonctionne
useEffect(() => {
  console.log('Attemp ID:', attemptId);
  console.log('Current answers:', answers);
  
  if (attemptId && answers.length > 0) {
    saveProgress(attemptId, currentQuestionIndex, answers);
  }
}, [attemptId, answers, currentQuestionIndex]);
```

**Vérifier en DB** :
```sql
SELECT * FROM box_attempts 
WHERE id = 'attempt-id' 
AND ended_at IS NULL;
```

---

#### Score incorrect

**Symptômes** :
- Le score affiché ne correspond pas aux réponses
- Calcul erroné

**Cause** :
- Bug dans le calcul du score

**Solution** :
```typescript
// Vérifier le calcul
const correctAnswers = answers.filter(a => a === true).length;
console.log('Correct answers:', correctAnswers);
console.log('Total questions:', totalQuestions);

const percentage = (correctAnswers / totalQuestions) * 100;
console.log('Score:', percentage);
```

---

### Erreurs de déverrouillage

#### "Code incorrect"

**Symptômes** :
- Message d'erreur malgré le bon code
- Impossible de déverrouiller

**Causes possibles** :
1. Espaces avant/après le code
2. Casse (majuscules/minuscules)
3. Mauvais code entré

**Solution** :
```typescript
// Normaliser le code avant comparaison
const normalizedCode = code.trim().toUpperCase();
const expectedCode = box.unlockCode.trim().toUpperCase();

console.log('Entered:', normalizedCode);
console.log('Expected:', expectedCode);

if (normalizedCode === expectedCode) {
  // Déverrouiller
}
```

---

#### Boîte reste "in-progress" après validation

**Symptômes** :
- Code validé mais boîte toujours orange
- Statut non mis à jour

**Cause** :
- Échec de l'insertion dans `box_unlocks`
- Pas de refresh de la session

**Solution** :
```typescript
// Vérifier l'insertion
const { data, error } = await supabase
  .from('box_unlocks')
  .insert({
    session_id: sessionId,
    box_type: boxType,
    code_validated: true
  })
  .select();

console.log('Unlock result:', data, error);

// Rafraîchir la session
await refreshSession();
```

---

### Erreurs de timer

#### Timer affiche temps négatif

**Symptômes** :
- Timer affiche `-1:23` ou autre valeur négative

**Cause** :
- Temps écoulé > durée du jeu

**Solution** :
```typescript
const timeRemaining = Math.max(0, GAME_DURATION - timeElapsed);

if (timeRemaining === 0) {
  // Fin du jeu
  toast.error("Temps écoulé !");
  navigate('/dashboard');
}
```

---

#### Timer ne se met pas à jour

**Symptômes** :
- Timer figé à une valeur
- Pas de décompte

**Cause** :
- `useEffect` pas configuré correctement
- Cleanup manquant

**Solution** :
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const elapsed = now - session.startTime;
    const remaining = GAME_DURATION - elapsed;
    setTimeRemaining(remaining);
  }, 1000);

  // IMPORTANT : Cleanup
  return () => clearInterval(interval);
}, [session.startTime]);
```

---

### Erreurs Supabase

#### "Failed to fetch"

**Symptômes** :
- Erreur réseau dans la console
- Requêtes échouent

**Causes possibles** :
1. Pas de connexion internet
2. URL Supabase incorrecte
3. Clé API invalide
4. CORS bloqué

**Solutions** :

```typescript
// 1. Vérifier la connexion
console.log('Online:', navigator.onLine);

// 2. Vérifier les variables d'environnement
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('SUPABASE_KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');

// 3. Tester une requête simple
const { data, error } = await supabase
  .from('game_sessions')
  .select('count');

console.log('Test query:', { data, error });
```

---

#### "RLS policy violation"

**Symptômes** :
- Erreur lors d'insert/update/delete
- Politique RLS bloque l'action

**Cause** :
- Politique de sécurité trop restrictive

**Solution** :
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'table_name';

-- Exemple : Autoriser tout le monde à créer
CREATE POLICY "Anyone can create"
ON table_name
FOR INSERT
WITH CHECK (true);
```

---

### Erreurs UI

#### Composant ne se met pas à jour

**Symptômes** :
- Données changent en DB mais pas à l'écran
- UI figée

**Causes possibles** :
1. State pas mis à jour
2. Pas de re-render
3. Dépendances useEffect incorrectes

**Solution** :
```typescript
// Forcer un refresh
const [refresh, setRefresh] = useState(0);

const handleRefresh = () => {
  setRefresh(prev => prev + 1);
};

useEffect(() => {
  loadData();
}, [refresh]); // Re-load quand refresh change
```

---

#### Styles Tailwind ne s'appliquent pas

**Symptômes** :
- Classes CSS ignorées
- Composant sans style

**Causes possibles** :
1. Classe mal écrite
2. Conflit de classes
3. CSS purgé par erreur

**Solution** :
```typescript
// Vérifier les classes
console.log('Classes:', element.className);

// Utiliser cn() pour combiner
import { cn } from '@/lib/utils';

className={cn(
  "base-class",
  isActive && "active-class"
)}
```

---

#### Toast ne s'affiche pas

**Symptômes** :
- Pas de notification à l'écran

**Cause** :
- Composant `<Toaster />` manquant

**Solution** :
```typescript
// Dans App.tsx ou layout
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* Contenu */}
      <Toaster />
    </>
  );
}
```

---

### Erreurs de navigation

#### Redirection infinie

**Symptômes** :
- Page se recharge en boucle
- Navigation bloquée

**Cause** :
- `navigate()` dans un `useEffect` sans dépendances

**Solution** :
```typescript
// ❌ Mauvais
useEffect(() => {
  navigate('/dashboard');
}); // Pas de tableau de dépendances = loop

// ✅ Bon
useEffect(() => {
  if (condition) {
    navigate('/dashboard');
  }
}, []); // Dépendances vides = une seule fois
```

---

#### Page 404 au refresh

**Symptômes** :
- App fonctionne en navigation interne
- 404 après F5 sur une route

**Cause** :
- Serveur ne redirige pas vers index.html

**Solution** :
```typescript
// vite.config.ts - déjà configuré normalement
export default defineConfig({
  // Vite gère ça automatiquement en dev
});

// En production, configurer le serveur web
// Netlify : _redirects
/* /  /index.html  200

// Vercel : vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 🔍 Debugging

### Console logs utiles

```typescript
// Session
console.log('Current session:', session);
console.log('Session code:', session?.code);
console.log('Players:', session?.players);

// Player
console.log('Current player ID:', localStorage.getItem('current_player_id'));
console.log('Current player pseudo:', localStorage.getItem('current_player_pseudo'));

// Quiz
console.log('Attempt ID:', attemptId);
console.log('Current question:', currentQuestionIndex);
console.log('Answers:', answers);

// Box
console.log('Box type:', boxType);
console.log('Box status:', box?.status);
console.log('Active attempt:', activeAttempt);
```

### Vérifications en DB

```sql
-- Voir toutes les sessions actives
SELECT * FROM game_sessions WHERE status = 'active';

-- Voir les joueurs d'une session
SELECT * FROM session_players WHERE session_id = 'session-uuid';

-- Voir les tentatives actives
SELECT * FROM box_attempts WHERE ended_at IS NULL;

-- Voir les boîtes déverrouillées
SELECT * FROM box_unlocks WHERE code_validated = true;

-- Voir les réponses d'un joueur
SELECT * FROM player_answers WHERE player_id = 'player-uuid';
```

### Network tab

Ouvrir les DevTools → Onglet Network :
- Filtrer par "Fetch/XHR"
- Vérifier les requêtes Supabase
- Inspecter les réponses
- Chercher les erreurs 400/500

### React DevTools

Installer l'extension React DevTools :
- Inspecter les props des composants
- Voir le state en temps réel
- Tracer les re-renders

---

## 🛠️ Outils de diagnostic

### Vérifier l'état complet

```typescript
// Créer une fonction de diagnostic
export const diagnose = async () => {
  console.log('=== DIAGNOSTIC ===');
  
  // LocalStorage
  console.log('Session code:', localStorage.getItem('current_session_code'));
  console.log('Player ID:', localStorage.getItem('current_player_id'));
  
  // Session en mémoire
  const sessionCode = localStorage.getItem('current_session_code');
  if (sessionCode) {
    const { data: session } = await supabase
      .from('game_sessions')
      .select('*, session_players(*)')
      .eq('session_code', sessionCode)
      .single();
    
    console.log('Session data:', session);
  }
  
  // Supabase
  const { data: health } = await supabase.from('game_sessions').select('count');
  console.log('Supabase OK:', !!health);
  
  console.log('=== END DIAGNOSTIC ===');
};

// Appeler dans la console
diagnose();
```

### Reset complet

```typescript
// Effacer tout et recommencer
export const resetAll = () => {
  localStorage.clear();
  window.location.href = '/';
};

// Dans la console du navigateur
resetAll();
```

---

## 📞 Besoin d'aide supplémentaire ?

Si le problème persiste :

1. **Consulter les logs** - Console browser + Network tab
2. **Vérifier la DB** - Requêtes SQL directes
3. **Tester en isolation** - Reproduire dans un composant minimal
4. **Chercher en ligne** - Google, Stack Overflow
5. **Consulter la doc** - Autres fichiers dans `/docs`

### Ressources externes

- **React** : [react.dev/learn](https://react.dev/learn)
- **TypeScript** : [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Supabase** : [supabase.com/docs](https://supabase.com/docs)
- **Tailwind** : [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Vite** : [vitejs.dev/guide](https://vitejs.dev/guide/)

---

## 🐛 Rapporter un bug

Si vous trouvez un bug :

1. **Reproduire** - Trouver les étapes exactes
2. **Documenter** - Screenshots, logs, données
3. **Isoler** - Simplifier le cas de test
4. **Signaler** - Créer une issue avec toutes les infos

### Template de bug report

```markdown
## Description
[Description claire du bug]

## Étapes de reproduction
1. Aller sur la page X
2. Cliquer sur Y
3. Voir l'erreur Z

## Comportement attendu
[Ce qui devrait se passer]

## Comportement actuel
[Ce qui se passe réellement]

## Screenshots
[Si applicable]

## Logs
```
[Copier les logs de la console]
```

## Environnement
- Navigateur: Chrome 120
- OS: Windows 11
- Version: [hash commit ou date]
```
