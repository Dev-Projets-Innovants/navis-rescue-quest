# Mission Navis - Jeu de Quiz Collaboratif

## 📋 Vue d'ensemble

Mission Navis est un jeu de quiz collaboratif en temps réel où les équipes doivent déverrouiller des boîtes mystérieuses en répondant correctement à des questions. Le jeu combine stratégie d'équipe, gestion du temps et connaissances pour créer une expérience engageante.

## 🎯 Concept du jeu

- Les joueurs créent ou rejoignent une session de jeu
- 4 boîtes thématiques doivent être déverrouillées (Arts, Environnement, Santé, Tourisme)
- Chaque boîte contient 5 questions
- Un seul joueur peut travailler sur une boîte à la fois
- Le temps est compté - terminez avant la fin du timer !
- Les codes de déverrouillage doivent être validés pour progresser

## 🚀 Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants UI
- **Lucide React** pour les icônes
- **Sonner** pour les notifications toast

### Backend
- **Lovable Cloud** (Supabase) pour :
  - Base de données PostgreSQL
  - Stockage des sessions et données
  - Politiques RLS pour la sécurité
  - Temps réel (optionnel)

### Outils de développement
- **ESLint** pour le linting
- **TypeScript** pour la sûreté des types
- **Bun/npm** pour la gestion des packages

## 📁 Structure du projet

```
mission-navis/
├── docs/                          # Documentation complète
│   ├── README.md                  # Ce fichier
│   ├── ARCHITECTURE.md            # Architecture technique
│   ├── DATABASE.md                # Schéma de base de données
│   ├── GAME_FLOW.md               # Flux de jeu
│   ├── SETUP.md                   # Guide d'installation
│   ├── COMPONENTS.md              # Composants UI
│   ├── API.md                     # Hooks et API
│   └── TROUBLESHOOTING.md         # Dépannage
├── src/
│   ├── components/                # Composants réutilisables
│   │   ├── ui/                    # Composants Shadcn
│   │   └── Timer.tsx              # Composant timer du jeu
│   ├── pages/                     # Pages de l'application
│   │   ├── Landing.tsx            # Page d'accueil
│   │   ├── Connect.tsx            # Créer/rejoindre session
│   │   ├── Dashboard.tsx          # Tableau de bord des boîtes
│   │   ├── Quiz.tsx               # Interface de quiz
│   │   ├── Unlock.tsx             # Validation de code
│   │   ├── Validation.tsx         # Résultats du quiz
│   │   └── Victory.tsx            # Écran de victoire
│   ├── hooks/                     # Hooks personnalisés
│   │   ├── useGameSession.ts      # Gestion des sessions
│   │   ├── useBoxAttempts.ts      # Gestion des tentatives
│   │   ├── useBoxUnlock.ts        # Déverrouillage des boîtes
│   │   └── usePlayerAnswers.ts    # Réponses des joueurs
│   ├── types/                     # Définitions TypeScript
│   │   └── game.ts                # Types du jeu
│   ├── data/                      # Données statiques
│   │   └── questions.ts           # Questions du quiz
│   ├── lib/                       # Utilitaires
│   │   ├── utils.ts               # Fonctions helper
│   │   └── gameStorage.ts         # Stockage local
│   ├── integrations/              # Intégrations externes
│   │   └── supabase/              # Client Supabase
│   ├── assets/                    # Images et médias
│   └── index.css                  # Styles globaux
├── public/                        # Fichiers statiques
└── supabase/                      # Configuration Supabase
```

## 🎮 Flux de jeu simplifié

1. **Connexion** → Créer ou rejoindre une session
2. **Dashboard** → Voir les 4 boîtes et leur statut
3. **Quiz** → Répondre aux 5 questions d'une boîte
4. **Validation** → Voir le score et obtenir le code
5. **Déverrouillage** → Entrer le code pour débloquer
6. **Victoire** → Toutes les boîtes déverrouillées !

## 📚 Documentation complète

Pour plus de détails, consultez :

- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Architecture technique et patterns
- [**DATABASE.md**](./DATABASE.md) - Schéma et structure de la base de données
- [**GAME_FLOW.md**](./GAME_FLOW.md) - Flux détaillé du jeu et règles
- [**SETUP.md**](./SETUP.md) - Guide d'installation et configuration
- [**COMPONENTS.md**](./COMPONENTS.md) - Documentation des composants UI
- [**API.md**](./API.md) - Documentation des hooks et fonctions
- [**TROUBLESHOOTING.md**](./TROUBLESHOOTING.md) - Guide de dépannage

## 🤝 Contribution

Pour contribuer au projet :
1. Lisez la documentation technique
2. Suivez les patterns établis
3. Testez vos changements localement
4. Assurez-vous que les types TypeScript sont corrects

## 📝 Licence

Ce projet est un jeu éducatif développé avec Lovable.
