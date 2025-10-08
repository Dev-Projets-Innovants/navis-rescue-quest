# Guide d'installation et configuration

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18 ou supérieure
  - Télécharger depuis [nodejs.org](https://nodejs.org/)
  - Vérifier : `node --version`
  
- **npm** ou **bun** (gestionnaire de packages)
  - npm est inclus avec Node.js
  - Bun (optionnel) : [bun.sh](https://bun.sh/)
  
- **Git** pour cloner le projet
  - Télécharger depuis [git-scm.com](https://git-scm.com/)

## 🚀 Installation locale

### 1. Cloner le projet

```bash
# Cloner le dépôt depuis GitHub
git clone <URL_DU_REPO>

# Accéder au dossier du projet
cd mission-navis
```

### 2. Installer les dépendances

```bash
# Avec npm
npm install

# OU avec bun
bun install
```

Cela installera toutes les dépendances listées dans `package.json`.

### 3. Configuration de l'environnement

Le fichier `.env` est **déjà configuré** avec les variables Supabase. Il contient :

```env
VITE_SUPABASE_URL=https://hfunrgmpuwyyohwmdsij.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=hfunrgmpuwyyohwmdsij
```

⚠️ **Ne modifiez pas ce fichier** - il est géré automatiquement par Lovable Cloud.

### 4. Lancer le serveur de développement

```bash
# Avec npm
npm run dev

# OU avec bun
bun run dev
```

Le serveur démarre sur **http://localhost:8080**

### 5. Accéder à l'application

Ouvrir votre navigateur et aller sur :
```
http://localhost:8080
```

Vous devriez voir la page d'accueil de Mission Navis.

## 🛠️ Scripts disponibles

Voici les commandes npm disponibles dans le projet :

### Développement

```bash
# Lancer le serveur de développement
npm run dev

# Ouvre sur http://localhost:8080
```

### Build

```bash
# Créer un build de production
npm run build

# Les fichiers sont générés dans le dossier dist/
```

### Preview

```bash
# Prévisualiser le build de production localement
npm run preview

# Teste la version optimisée avant déploiement
```

### Linting

```bash
# Vérifier le code avec ESLint
npm run lint

# Trouve les erreurs de style et de syntaxe
```

## 🗂️ Structure après installation

```
mission-navis/
├── node_modules/          # Dépendances installées (ignoré par git)
├── dist/                  # Build de production (généré)
├── public/                # Fichiers statiques
├── src/                   # Code source
├── supabase/              # Configuration Supabase
├── .env                   # Variables d'environnement
├── package.json           # Métadonnées et dépendances
├── vite.config.ts         # Configuration Vite
├── tailwind.config.ts     # Configuration Tailwind
└── tsconfig.json          # Configuration TypeScript
```

## 🔌 Connexion à la base de données

### Lovable Cloud (Supabase)

Le projet utilise **Lovable Cloud**, qui fournit automatiquement :

- ✅ Base de données PostgreSQL
- ✅ API REST et Realtime
- ✅ Authentification (si nécessaire)
- ✅ Stockage de fichiers (si nécessaire)

**Aucune configuration supplémentaire n'est requise** - tout est déjà connecté via le fichier `.env`.

### Vérifier la connexion

```typescript
// Test de connexion dans la console du navigateur
import { supabase } from '@/integrations/supabase/client';

// Tester une requête
const { data, error } = await supabase
  .from('game_sessions')
  .select('*')
  .limit(1);

console.log('Connexion OK:', data);
```

## 🌐 Déploiement

### Déploiement sur Lovable

Le projet est déployé automatiquement sur Lovable :

1. Ouvrir le projet dans Lovable
2. Cliquer sur **"Publish"** en haut à droite
3. L'app est automatiquement déployée sur un sous-domaine `.lovable.app`

### Déploiement manuel (optionnel)

Si vous voulez déployer ailleurs (Vercel, Netlify, etc.) :

1. **Build le projet** :
   ```bash
   npm run build
   ```

2. **Le dossier `dist/`** contient les fichiers statiques

3. **Déployer le dossier `dist/`** sur votre hébergeur

⚠️ **Important** : Assurez-vous que les variables d'environnement sont configurées sur votre plateforme de déploiement.

## 🔧 Configuration avancée

### Modifier le port de développement

Éditer `vite.config.ts` :

```typescript
export default defineConfig({
  server: {
    port: 3000, // Changer le port ici
  },
  // ...
});
```

### Ajouter des variables d'environnement

Si vous avez besoin d'ajouter des variables :

1. Ajouter dans `.env` :
   ```env
   VITE_MA_VARIABLE=valeur
   ```

2. Utiliser dans le code :
   ```typescript
   const maVariable = import.meta.env.VITE_MA_VARIABLE;
   ```

⚠️ **Note** : Les variables doivent commencer par `VITE_` pour être accessibles côté client.

### Configuration Tailwind

Modifier `tailwind.config.ts` pour personnaliser les couleurs, espacements, etc.

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Ajouter des couleurs personnalisées
      },
    },
  },
};
```

## 🐛 Résolution des problèmes courants

### Port déjà utilisé

**Erreur** : `Port 8080 is already in use`

**Solution** :
```bash
# Tuer le processus utilisant le port
# Sur Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Sur Mac/Linux
lsof -ti:8080 | xargs kill
```

Ou changer le port dans `vite.config.ts`.

### Erreurs de dépendances

**Erreur** : Modules manquants ou conflits de versions

**Solution** :
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
rm package-lock.json
npm install
```

### Erreurs TypeScript

**Erreur** : Types manquants ou incorrects

**Solution** :
```bash
# Régénérer les types Supabase
npm run typegen
```

### Erreurs Supabase

**Erreur** : Impossible de se connecter à Supabase

**Solution** :
1. Vérifier que `.env` existe et contient les bonnes clés
2. Vérifier la connexion internet
3. Vérifier que le projet Supabase est actif

### Build échoue

**Erreur** : Erreurs lors du build

**Solution** :
```bash
# Nettoyer le cache et rebuilder
rm -rf dist
npm run build
```

## 📦 Gestion des dépendances

### Ajouter une nouvelle dépendance

```bash
# Dépendance de production
npm install <package-name>

# Dépendance de développement
npm install -D <package-name>
```

### Mettre à jour les dépendances

```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour toutes les dépendances
npm update

# Mettre à jour une dépendance spécifique
npm update <package-name>
```

### Supprimer une dépendance

```bash
npm uninstall <package-name>
```

## 🧪 Tests

Actuellement, le projet n'a pas de tests configurés. Pour ajouter des tests :

```bash
# Installer Vitest
npm install -D vitest @testing-library/react

# Ajouter un script dans package.json
"scripts": {
  "test": "vitest"
}

# Lancer les tests
npm run test
```

## 📊 Performance et optimisation

### Analyse du bundle

```bash
# Installer le plugin d'analyse
npm install -D rollup-plugin-visualizer

# Générer un rapport
npm run build -- --mode analyze
```

### Mode production

```bash
# Build optimisé pour la production
npm run build

# Fichiers minifiés et optimisés dans dist/
```

## 🔒 Sécurité

### Variables sensibles

- ❌ Ne jamais commit `.env` dans git (déjà dans `.gitignore`)
- ✅ Utiliser des variables préfixées par `VITE_` pour le frontend
- ✅ Les clés Supabase sont des clés publiques (safe)

### HTTPS en développement (optionnel)

Pour tester HTTPS localement :

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: true,
  },
});
```

## 🆘 Support

### Ressources utiles

- **Documentation Lovable** : [docs.lovable.dev](https://docs.lovable.dev/)
- **Documentation Vite** : [vitejs.dev](https://vitejs.dev/)
- **Documentation React** : [react.dev](https://react.dev/)
- **Documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)
- **Documentation Tailwind** : [tailwindcss.com/docs](https://tailwindcss.com/docs)

### Besoin d'aide ?

1. Consulter [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Vérifier les logs dans la console du navigateur
3. Vérifier les logs dans le terminal
4. Rechercher l'erreur sur Google ou Stack Overflow
