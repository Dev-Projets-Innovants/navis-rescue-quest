import { Question, BoxType } from '@/types/game';

export const questionsByBox: Record<BoxType, Question[]> = {
  A: [
    {
      id: 'A1',
      question: "En cas d'hypothermie, quelle est la première action à réaliser ?",
      options: [
        "Mettre la personne sous l'eau chaude",
        "Envelopper dans une couverture",
        "Donner de l'alcool à boire",
        "Frictionner vigoureusement"
      ],
      correctAnswer: 1
    },
    {
      id: 'A2',
      question: "Quel est le numéro d'urgence universel en Europe ?",
      options: ["911", "112", "15", "18"],
      correctAnswer: 1
    },
    {
      id: 'A3',
      question: "En cas de déshydratation sévère, que faut-il faire en priorité ?",
      options: [
        "Donner de l'eau froide rapidement",
        "Réhydrater progressivement avec une solution orale",
        "Attendre que la personne ait soif",
        "Donner du café ou du thé"
      ],
      correctAnswer: 1
    },
    {
      id: 'A4',
      question: "Comment identifier une fracture ouverte ?",
      options: [
        "L'os est visible à travers la peau",
        "La douleur est très intense",
        "Il y a un gonflement",
        "La zone est rouge"
      ],
      correctAnswer: 0
    },
    {
      id: 'A5',
      question: "Quelle maladie tropicale est transmise par les moustiques ?",
      options: ["Grippe", "Paludisme", "Choléra", "Tuberculose"],
      correctAnswer: 1
    },
    {
      id: 'A6',
      question: "En situation de crise, combien de litres d'eau minimum par personne et par jour ?",
      options: ["1 litre", "2 litres", "3 litres", "5 litres"],
      correctAnswer: 2
    },
    {
      id: 'A7',
      question: "Que faire en cas de piqûre de méduse ?",
      options: [
        "Rincer à l'eau douce",
        "Rincer à l'eau de mer",
        "Appliquer de la glace directement",
        "Frotter avec du sable"
      ],
      correctAnswer: 1
    },
    {
      id: 'A8',
      question: "Quel est le premier geste de la position latérale de sécurité (PLS) ?",
      options: [
        "Basculer la tête en arrière",
        "Plier le bras de la victime",
        "Vérifier la respiration",
        "Placer la main sous la joue"
      ],
      correctAnswer: 2
    },
    {
      id: 'A9',
      question: "Combien de temps peut-on survivre sans eau ?",
      options: ["1 jour", "3 jours", "7 jours", "14 jours"],
      correctAnswer: 1
    },
    {
      id: 'A10',
      question: "Quelle vitamine est essentielle pour éviter le scorbut ?",
      options: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine K"],
      correctAnswer: 1
    }
  ],
  B: [
    {
      id: 'B1',
      question: "Quelle est la capitale des Maldives ?",
      options: ["Malé", "Colombo", "Port-Louis", "Victoria"],
      correctAnswer: 0
    },
    {
      id: 'B2',
      question: "Dans quel océan se trouve Madagascar ?",
      options: ["Océan Atlantique", "Océan Pacifique", "Océan Indien", "Océan Arctique"],
      correctAnswer: 2
    },
    {
      id: 'B3',
      question: "Quelle île est surnommée 'l'île de la Réunion' ?",
      options: ["Maurice", "Mayotte", "La Réunion", "Seychelles"],
      correctAnswer: 2
    },
    {
      id: 'B4',
      question: "Quel archipel appartient à la France dans le Pacifique ?",
      options: ["Hawaii", "Polynésie française", "Fidji", "Samoa"],
      correctAnswer: 1
    },
    {
      id: 'B5',
      question: "Quelle est la langue officielle de la Jamaïque ?",
      options: ["Espagnol", "Français", "Anglais", "Créole"],
      correctAnswer: 2
    },
    {
      id: 'B6',
      question: "Sur quel continent se trouve l'île de Bali ?",
      options: ["Afrique", "Asie", "Océanie", "Amérique du Sud"],
      correctAnswer: 1
    },
    {
      id: 'B7',
      question: "Quelle île est connue pour ses statues Moaï ?",
      options: ["Tahiti", "Île de Pâques", "Bora-Bora", "Moorea"],
      correctAnswer: 1
    },
    {
      id: 'B8',
      question: "Quelle ressource naturelle est abondante dans les îles tropicales ?",
      options: ["Pétrole", "Eau douce", "Charbon", "Gaz naturel"],
      correctAnswer: 1
    },
    {
      id: 'B9',
      question: "Quelle route maritime relie l'Europe à l'Asie via Suez ?",
      options: ["Route du Cap", "Route de la Soie maritime", "Route du Nord", "Route Atlantique"],
      correctAnswer: 1
    },
    {
      id: 'B10',
      question: "Quel peuple insulaire est connu pour la navigation en pirogue double ?",
      options: ["Vikings", "Polynésiens", "Grecs", "Phéniciens"],
      correctAnswer: 1
    }
  ],
  C: [
    {
      id: 'C1',
      question: "Quelle couleur est universellement associée au danger ?",
      options: ["Bleu", "Vert", "Rouge", "Jaune"],
      correctAnswer: 2
    },
    {
      id: 'C2',
      question: "Quel signal SOS est utilisé en morse ?",
      options: ["... --- ...", "--- ... ---", "... ... ...", "--- --- ---"],
      correctAnswer: 0
    },
    {
      id: 'C3',
      question: "Quelle forme géométrique indique un panneau de danger ?",
      options: ["Carré", "Triangle", "Cercle", "Hexagone"],
      correctAnswer: 1
    },
    {
      id: 'C4',
      question: "Quel artiste est célèbre pour ses peintures de Tahiti ?",
      options: ["Van Gogh", "Paul Gauguin", "Monet", "Picasso"],
      correctAnswer: 1
    },
    {
      id: 'C5',
      question: "Quelle couleur symbolise l'eau et le calme ?",
      options: ["Rouge", "Vert", "Bleu", "Orange"],
      correctAnswer: 2
    },
    {
      id: 'C6',
      question: "Quel type d'art utilise des coquillages et coraux ?",
      options: ["Sculpture minérale", "Art insulaire", "Peinture abstraite", "Art digital"],
      correctAnswer: 1
    },
    {
      id: 'C7',
      question: "Quel musée parisien abrite la Joconde ?",
      options: ["Musée d'Orsay", "Le Louvre", "Centre Pompidou", "Musée Rodin"],
      correctAnswer: 1
    },
    {
      id: 'C8',
      question: "Quelle technique artistique utilise le feu et la cire ?",
      options: ["Aquarelle", "Encaustique", "Fusain", "Pastel"],
      correctAnswer: 1
    },
    {
      id: 'C9',
      question: "Combien de drapeaux de signalisation maritime existent (approximativement) ?",
      options: ["10", "26", "40", "50"],
      correctAnswer: 2
    },
    {
      id: 'C10',
      question: "Quelle exposition d'art contemporain est réputée à Venise ?",
      options: ["Documenta", "Biennale", "Frieze", "Art Basel"],
      correctAnswer: 1
    }
  ],
  D: [
    {
      id: 'D1',
      question: "Quel phénomène naturel cause le plus de dégâts sur les îles ?",
      options: ["Séisme", "Cyclone tropical", "Éruption volcanique", "Tsunami"],
      correctAnswer: 1
    },
    {
      id: 'D2',
      question: "Quel écosystème protège les côtes de l'érosion ?",
      options: ["Mangrove", "Désert", "Prairie", "Toundra"],
      correctAnswer: 0
    },
    {
      id: 'D3',
      question: "Quelle est la principale menace pour les récifs coralliens ?",
      options: [
        "Surpêche",
        "Réchauffement climatique",
        "Pollution plastique",
        "Tout cela à la fois"
      ],
      correctAnswer: 3
    },
    {
      id: 'D4',
      question: "Quelle énergie renouvelable est abondante sur les îles ?",
      options: ["Éolienne", "Solaire", "Marémotrice", "Toutes ces réponses"],
      correctAnswer: 3
    },
    {
      id: 'D5',
      question: "Combien d'eau douce contiennent les océans (en pourcentage) ?",
      options: ["0%", "3%", "10%", "25%"],
      correctAnswer: 0
    },
    {
      id: 'D6',
      question: "Quel animal marin est un indicateur de la santé des océans ?",
      options: ["Requin", "Méduse", "Corail", "Plancton"],
      correctAnswer: 2
    },
    {
      id: 'D7',
      question: "Quelle catastrophe naturelle peut déclencher un tsunami ?",
      options: ["Séisme sous-marin", "Éruption volcanique", "Glissement de terrain", "Toutes ces réponses"],
      correctAnswer: 3
    },
    {
      id: 'D8',
      question: "Quelle méthode permet de dessaler l'eau de mer ?",
      options: ["Filtration simple", "Osmose inverse", "Ébullition classique", "Congélation"],
      correctAnswer: 1
    },
    {
      id: 'D9',
      question: "Quel pourcentage de la biodiversité marine se trouve dans les récifs ?",
      options: ["5%", "15%", "25%", "40%"],
      correctAnswer: 2
    },
    {
      id: 'D10',
      question: "Quelle pratique agricole est adaptée aux îles ?",
      options: ["Monoculture intensive", "Permaculture", "Agriculture sur brûlis", "Culture hors-sol"],
      correctAnswer: 1
    }
  ]
};

export const boxInfo: Record<BoxType, { name: string; subtitle: string; icon: string; unlockCode: string }> = {
  A: {
    name: 'Santé & Premiers Secours',
    subtitle: 'Connaissances médicales d\'urgence',
    icon: '🏥',
    unlockCode: 'SANTE-2947'
  },
  B: {
    name: 'Tourisme & Culture',
    subtitle: 'Géographie de survie',
    icon: '🌍',
    unlockCode: 'TOUR-8163'
  },
  C: {
    name: 'Arts Créatifs',
    subtitle: 'Communication visuelle d\'urgence',
    icon: '🎨',
    unlockCode: 'ART-5029'
  },
  D: {
    name: 'Environnement',
    subtitle: 'Écosystème et ressources',
    icon: '🌱',
    unlockCode: 'ENV-7241'
  }
};
