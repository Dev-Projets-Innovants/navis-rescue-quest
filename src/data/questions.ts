import { Question, BoxType } from '@/types/game';

import healthSleep from '@/assets/questions/health-sleep.jpg';
import healthEnergyDrink from '@/assets/questions/health-energy-drink.jpg';
import healthVape from '@/assets/questions/health-vape.jpg';
import healthAntibiotics from '@/assets/questions/health-antibiotics.jpg';
import healthWarmup from '@/assets/questions/health-warmup.jpg';
import healthSunscreen from '@/assets/questions/health-sunscreen.jpg';
import healthBalancedMeal from '@/assets/questions/health-balanced-meal.jpg';
import healthHydration from '@/assets/questions/health-hydration.jpg';
import healthStress from '@/assets/questions/health-stress.jpg';
import healthBackpack from '@/assets/questions/health-backpack.jpg';
import tourismMale from '@/assets/questions/tourism-male.jpg';
import tourismMadagascar from '@/assets/questions/tourism-madagascar.jpg';
import tourismReunion from '@/assets/questions/tourism-reunion.jpg';
import tourismPolynesia from '@/assets/questions/tourism-polynesia.jpg';
import tourismJamaica from '@/assets/questions/tourism-jamaica.jpg';
import tourismBali from '@/assets/questions/tourism-bali.jpg';
import tourismEasterIsland from '@/assets/questions/tourism-easter-island.jpg';
import tourismFreshwater from '@/assets/questions/tourism-freshwater.jpg';
import tourismSuez from '@/assets/questions/tourism-suez.jpg';
import tourismPolynesianCanoe from '@/assets/questions/tourism-polynesian-canoe.jpg';
import artsDangerRed from '@/assets/questions/arts-danger-red.jpg';
import artsSosMorse from '@/assets/questions/arts-sos-morse.jpg';
import artsTriangleDanger from '@/assets/questions/arts-triangle-danger.jpg';
import artsGauguin from '@/assets/questions/arts-gauguin.jpg';
import artsBlueCalm from '@/assets/questions/arts-blue-calm.jpg';
import artsIslandCrafts from '@/assets/questions/arts-island-crafts.jpg';
import artsLouvre from '@/assets/questions/arts-louvre.jpg';
import artsEncaustic from '@/assets/questions/arts-encaustic.jpg';
import artsSignalFlags from '@/assets/questions/arts-signal-flags.jpg';
import artsBiennale from '@/assets/questions/arts-biennale.jpg';
import environmentCyclone from '@/assets/questions/environment-cyclone.jpg';
import environmentMangrove from '@/assets/questions/environment-mangrove.jpg';
import environmentCoralBleaching from '@/assets/questions/environment-coral-bleaching.jpg';
import environmentRenewableEnergy from '@/assets/questions/environment-renewable-energy.jpg';
import environmentSaltWater from '@/assets/questions/environment-salt-water.jpg';
import environmentHealthyCoral from '@/assets/questions/environment-healthy-coral.jpg';
import environmentTsunami from '@/assets/questions/environment-tsunami.jpg';
import environmentDesalination from '@/assets/questions/environment-desalination.jpg';
import environmentReefBiodiversity from '@/assets/questions/environment-reef-biodiversity.jpg';
import environmentPermaculture from '@/assets/questions/environment-permaculture.jpg';

export const questionsByBox: Record<BoxType, Question[]> = {
  A: [
    {
      id: 'A1',
      question: "Combien d'heures de sommeil un ado devrait-il viser en semaine ?",
      options: [
        "5–6 h",
        "6–7 h",
        "8–10 h",
        "11–13 h"
      ],
      correctAnswer: 2,
      explanation: "8–10 h aident la mémoire, l'humeur et les performances scolaires/sportives. Un sommeil suffisant est essentiel pour la croissance, la concentration et le bien-être général des adolescents.",
      image: healthSleep
    },
    {
      id: 'A2',
      question: "Boire une boisson énergisante juste avant le sport, c'est…",
      options: [
        "Parfait pour s'hydrater",
        "Risqué (cœur qui s'emballe, déshydratation)",
        "Indispensable pour l'endurance",
        "Un bon substitut à l'eau"
      ],
      correctAnswer: 1,
      explanation: "Caféine/sucre peuvent accélérer le cœur et ne remplacent pas l'hydratation. Les boissons énergisantes peuvent causer des palpitations, de l'anxiété et augmenter la déshydratation pendant l'effort.",
      image: healthEnergyDrink
    },
    {
      id: 'A3',
      question: "La 'vape' (cigarette électronique), c'est…",
      options: [
        "Sans danger",
        "Pas sans risque (dépendance, irritation)",
        "Un traitement de l'asthme",
        "Interdite partout"
      ],
      correctAnswer: 1,
      explanation: "Elle peut créer une dépendance et irriter les voies respiratoires. La vape contient de la nicotine et d'autres substances chimiques dont les effets à long terme sont encore étudiés.",
      image: healthVape
    },
    {
      id: 'A4',
      question: "Antibiotiques et rhume/grippe (virus), on fait quoi ?",
      options: [
        "On en prend toujours",
        "On n'en prend pas (inefficaces sur les virus)",
        "Oui si fièvre > 38 °C",
        "Un seul comprimé suffit"
      ],
      correctAnswer: 1,
      explanation: "Les antibiotiques agissent sur les bactéries, pas sur les virus. Prendre des antibiotiques inutilement contribue à créer des résistances bactériennes, un problème de santé publique majeur.",
      image: healthAntibiotics
    },
    {
      id: 'A5',
      question: "À quoi sert l'échauffement avant un match ?",
      options: [
        "À rien",
        "À réduire les blessures et préparer muscles/articulations",
        "À te fatiguer",
        "À remplacer l'entraînement"
      ],
      correctAnswer: 1,
      explanation: "Il augmente la température musculaire et la mobilité. L'échauffement améliore la performance sportive, prévient les blessures et prépare le système cardiovasculaire à l'effort.",
      image: healthWarmup
    },
    {
      id: 'A6',
      question: "SPF 50, ça veut dire quoi ?",
      options: [
        "Protection toute la journée",
        "Filtre plus d'UVB qu'un SPF 15",
        "Anti-moustiques",
        "Empêche de bronzer"
      ],
      correctAnswer: 1,
      explanation: "Plus le SPF est élevé, plus il bloque les UVB (mais il faut en remettre). Un SPF 50 bloque environ 98% des UVB. Il est important de réappliquer la crème toutes les 2 heures et après la baignade.",
      image: healthSunscreen
    },
    {
      id: 'A7',
      question: "Au self, un repas 'équilibré' ressemble plutôt à…",
      options: [
        "Frites + soda + dessert",
        "½ assiette légumes + ¼ protéines + ¼ féculents + eau",
        "Sauter le repas",
        "2 barres énergétiques"
      ],
      correctAnswer: 1,
      explanation: "On vise fibres + protéines + féculent pour l'énergie et la satiété. Un repas équilibré apporte tous les nutriments essentiels et aide à maintenir la concentration et l'énergie tout au long de la journée.",
      image: healthBalancedMeal
    },
    {
      id: 'A8',
      question: "S'hydrater quand on fait du sport, c'est…",
      options: [
        "Uniquement quand on meurt de soif",
        "Avant/pendant/après en petites gorgées",
        "Inutile s'il fait froid",
        "Avec des boissons très sucrées"
      ],
      correctAnswer: 1,
      explanation: "Boire régulièrement évite crampes, maux de tête et baisse de perf. L'hydratation est cruciale pour maintenir la température corporelle, la circulation sanguine et les performances physiques.",
      image: healthHydration
    },
    {
      id: 'A9',
      question: "Gros stress/angoisse qui dure : réaction la plus saine ?",
      options: [
        "Garder pour soi",
        "En parler (proche, prof, infirmier·e, pro) et demander de l'aide",
        "Ignorer",
        "Alcool pour 'déstresser'"
      ],
      correctAnswer: 1,
      explanation: "En parler tôt aide à trouver des solutions et à se protéger. Le stress prolongé peut avoir des impacts sérieux sur la santé mentale et physique. Demander de l'aide est un signe de courage, pas de faiblesse.",
      image: healthStress
    },
    {
      id: 'A10',
      question: "Poids raisonnable d'un sac à dos de cours ?",
      options: [
        "30 % du poids du corps",
        "20–25 %",
        "10–15 % et porter avec deux bretelles",
        "Aucun risque, peu importe"
      ],
      correctAnswer: 2,
      explanation: "Au-delà, le risque de douleurs dos/épaules augmente. Un sac trop lourd peut causer des problèmes de posture, des douleurs chroniques et affecter la croissance chez les jeunes.",
      image: healthBackpack
    }
  ],
  B: [
    {
      id: 'B1',
      question: "Quelle est la capitale des Maldives ?",
      options: ["Malé", "Colombo", "Port-Louis", "Victoria"],
      correctAnswer: 0,
      explanation: "Malé est la capitale et la plus grande ville des Maldives. C'est l'une des capitales les plus densément peuplées au monde et se trouve sur l'atoll de Malé Nord dans l'océan Indien.",
      image: tourismMale
    },
    {
      id: 'B2',
      question: "Dans quel océan se trouve Madagascar ?",
      options: ["Océan Atlantique", "Océan Pacifique", "Océan Indien", "Océan Arctique"],
      correctAnswer: 2,
      explanation: "Madagascar est située dans l'océan Indien, au large de la côte est de l'Afrique. C'est la quatrième plus grande île du monde et possède une biodiversité unique avec de nombreuses espèces endémiques.",
      image: tourismMadagascar
    },
    {
      id: 'B3',
      question: "Quelle île est surnommée 'l'île de la Réunion' ?",
      options: ["Maurice", "Mayotte", "La Réunion", "Seychelles"],
      correctAnswer: 2,
      explanation: "La Réunion est un département français d'outre-mer situé dans l'océan Indien. Elle est célèbre pour son volcan actif, le Piton de la Fournaise, et ses paysages spectaculaires.",
      image: tourismReunion
    },
    {
      id: 'B4',
      question: "Quel archipel appartient à la France dans le Pacifique ?",
      options: ["Hawaii", "Polynésie française", "Fidji", "Samoa"],
      correctAnswer: 1,
      explanation: "La Polynésie française est une collectivité d'outre-mer française dans le Pacifique Sud. Elle comprend 118 îles dispersées, dont les célèbres Tahiti, Bora-Bora et Moorea.",
      image: tourismPolynesia
    },
    {
      id: 'B5',
      question: "Quelle est la langue officielle de la Jamaïque ?",
      options: ["Espagnol", "Français", "Anglais", "Créole"],
      correctAnswer: 2,
      explanation: "L'anglais est la langue officielle de la Jamaïque depuis la colonisation britannique. Le patois jamaïcain est également largement parlé comme langue vernaculaire.",
      image: tourismJamaica
    },
    {
      id: 'B6',
      question: "Sur quel continent se trouve l'île de Bali ?",
      options: ["Afrique", "Asie", "Océanie", "Amérique du Sud"],
      correctAnswer: 1,
      explanation: "Bali est une île indonésienne située en Asie du Sud-Est. Elle est réputée pour ses rizières en terrasses, ses temples hindous et ses plages paradisiaques.",
      image: tourismBali
    },
    {
      id: 'B7',
      question: "Quelle île est connue pour ses statues Moaï ?",
      options: ["Tahiti", "Île de Pâques", "Bora-Bora", "Moorea"],
      correctAnswer: 1,
      explanation: "L'île de Pâques (Rapa Nui) est célèbre pour ses gigantesques statues de pierre appelées moaï. Ces sculptures monumentales, créées par le peuple Rapa Nui entre 1250 et 1500, représentent des ancêtres divinisés.",
      image: tourismEasterIsland
    },
    {
      id: 'B8',
      question: "Quelle ressource naturelle est abondante dans les îles tropicales ?",
      options: ["Pétrole", "Eau douce", "Charbon", "Gaz naturel"],
      correctAnswer: 1,
      explanation: "Les îles tropicales bénéficient généralement de précipitations abondantes, ce qui leur procure des ressources en eau douce importantes. Cette eau est essentielle pour la survie et le développement des communautés insulaires.",
      image: tourismFreshwater
    },
    {
      id: 'B9',
      question: "Quelle route maritime relie l'Europe à l'Asie via Suez ?",
      options: ["Route du Cap", "Route de la Soie maritime", "Route du Nord", "Route Atlantique"],
      correctAnswer: 1,
      explanation: "La Route de la Soie maritime moderne passe par le canal de Suez, reliant l'Europe à l'Asie. C'est l'une des routes commerciales les plus importantes au monde, évitant le contournement de l'Afrique par le cap de Bonne-Espérance.",
      image: tourismSuez
    },
    {
      id: 'B10',
      question: "Quel peuple insulaire est connu pour la navigation en pirogue double ?",
      options: ["Vikings", "Polynésiens", "Grecs", "Phéniciens"],
      correctAnswer: 1,
      explanation: "Les Polynésiens sont des navigateurs exceptionnels qui ont colonisé les îles du Pacifique grâce à leurs pirogues doubles (va'a). Ils utilisaient les étoiles, les vagues et les oiseaux pour naviguer sur de longues distances.",
      image: tourismPolynesianCanoe
    }
  ],
  C: [
    {
      id: 'C1',
      question: "Quelle couleur est universellement associée au danger ?",
      options: ["Bleu", "Vert", "Rouge", "Jaune"],
      correctAnswer: 2,
      explanation: "Le rouge est universellement associé au danger et à l'alerte. On le retrouve dans les panneaux de signalisation, les feux de circulation et les signaux d'urgence dans le monde entier.",
      image: artsDangerRed
    },
    {
      id: 'C2',
      question: "Quel signal SOS est utilisé en morse ?",
      options: ["... --- ...", "--- ... ---", "... ... ...", "--- --- ---"],
      correctAnswer: 0,
      explanation: "Le signal SOS en morse est '... --- ...' (trois points, trois traits, trois points). C'est le signal de détresse international, facile à reconnaître et à transmettre même dans des conditions difficiles.",
      image: artsSosMorse
    },
    {
      id: 'C3',
      question: "Quelle forme géométrique indique un panneau de danger ?",
      options: ["Carré", "Triangle", "Cercle", "Hexagone"],
      correctAnswer: 1,
      explanation: "Les panneaux de danger sont triangulaires avec un bord rouge. Cette forme géométrique distinctive permet une identification rapide même à distance ou en cas de mauvaise visibilité.",
      image: artsTriangleDanger
    },
    {
      id: 'C4',
      question: "Quel artiste est célèbre pour ses peintures de Tahiti ?",
      options: ["Van Gogh", "Paul Gauguin", "Monet", "Picasso"],
      correctAnswer: 1,
      explanation: "Paul Gauguin a passé les dernières années de sa vie en Polynésie française, où il a créé certaines de ses œuvres les plus célèbres. Ses peintures de Tahiti capturent la vie insulaire et les couleurs vibrantes des tropiques.",
      image: artsGauguin
    },
    {
      id: 'C5',
      question: "Quelle couleur symbolise l'eau et le calme ?",
      options: ["Rouge", "Vert", "Bleu", "Orange"],
      correctAnswer: 2,
      explanation: "Le bleu est universellement associé à l'eau, au ciel et au calme. Cette couleur a un effet apaisant et est souvent utilisée dans les environnements nécessitant de la sérénité.",
      image: artsBlueCalm
    },
    {
      id: 'C6',
      question: "Quel type d'art utilise des coquillages et coraux ?",
      options: ["Sculpture minérale", "Art insulaire", "Peinture abstraite", "Art digital"],
      correctAnswer: 1,
      explanation: "L'art insulaire des îles tropicales utilise souvent des matériaux locaux comme les coquillages, les coraux, les perles et les bois précieux pour créer des objets décoratifs et rituels.",
      image: artsIslandCrafts
    },
    {
      id: 'C7',
      question: "Quel musée parisien abrite la Joconde ?",
      options: ["Musée d'Orsay", "Le Louvre", "Centre Pompidou", "Musée Rodin"],
      correctAnswer: 1,
      explanation: "Le Louvre à Paris abrite la Joconde (Mona Lisa) de Léonard de Vinci, l'une des peintures les plus célèbres au monde. C'est le musée le plus visité au monde.",
      image: artsLouvre
    },
    {
      id: 'C8',
      question: "Quelle technique artistique utilise le feu et la cire ?",
      options: ["Aquarelle", "Encaustique", "Fusain", "Pastel"],
      correctAnswer: 1,
      explanation: "L'encaustique est une technique de peinture ancienne qui utilise de la cire d'abeille chauffée mélangée à des pigments. La chaleur permet de fusionner les couleurs et crée des effets de texture uniques.",
      image: artsEncaustic
    },
    {
      id: 'C9',
      question: "Combien de drapeaux de signalisation maritime existent (approximativement) ?",
      options: ["10", "26", "40", "50"],
      correctAnswer: 2,
      explanation: "Il existe environ 40 drapeaux de signalisation maritime dans le Code international des signaux. Chaque drapeau a une signification spécifique et peut transmettre des messages importants entre navires.",
      image: artsSignalFlags
    },
    {
      id: 'C10',
      question: "Quelle exposition d'art contemporain est réputée à Venise ?",
      options: ["Documenta", "Biennale", "Frieze", "Art Basel"],
      correctAnswer: 1,
      explanation: "La Biennale de Venise est l'une des plus importantes expositions d'art contemporain au monde. Fondée en 1895, elle se tient tous les deux ans dans la cité des Doges et attire des millions de visiteurs.",
      image: artsBiennale
    }
  ],
  D: [
    {
      id: 'D1',
      question: "Quel phénomène naturel cause le plus de dégâts sur les îles ?",
      options: ["Séisme", "Cyclone tropical", "Éruption volcanique", "Tsunami"],
      correctAnswer: 1,
      explanation: "Les cyclones tropicaux causent les dégâts les plus fréquents et étendus sur les îles, combinant vents violents, pluies torrentielles et ondes de tempête. La prévention et la préparation sont essentielles.",
      image: environmentCyclone
    },
    {
      id: 'D2',
      question: "Quel écosystème protège les côtes de l'érosion ?",
      options: ["Mangrove", "Désert", "Prairie", "Toundra"],
      correctAnswer: 0,
      explanation: "Les mangroves sont des forêts côtières qui protègent naturellement les côtes de l'érosion. Leurs racines complexes absorbent l'énergie des vagues et stabilisent les sédiments.",
      image: environmentMangrove
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
      correctAnswer: 3,
      explanation: "Les récifs coralliens font face à de multiples menaces : réchauffement climatique (blanchissement), surpêche, pollution et acidification des océans. La protection nécessite une action globale.",
      image: environmentCoralBleaching
    },
    {
      id: 'D4',
      question: "Quelle énergie renouvelable est abondante sur les îles ?",
      options: ["Éolienne", "Solaire", "Marémotrice", "Toutes ces réponses"],
      correctAnswer: 3,
      explanation: "Les îles bénéficient d'un fort potentiel en énergies renouvelables : ensoleillement important (solaire), vents constants (éolien) et marées (marémotrice). Ces ressources peuvent les rendre autonomes énergétiquement.",
      image: environmentRenewableEnergy
    },
    {
      id: 'D5',
      question: "Combien d'eau douce contiennent les océans (en pourcentage) ?",
      options: ["0%", "3%", "10%", "25%"],
      correctAnswer: 0,
      explanation: "Les océans contiennent de l'eau salée, pas d'eau douce (0%). Seulement 3% de l'eau sur Terre est douce, et la majeure partie est piégée dans les glaciers et les calottes polaires.",
      image: environmentSaltWater
    },
    {
      id: 'D6',
      question: "Quel animal marin est un indicateur de la santé des océans ?",
      options: ["Requin", "Méduse", "Corail", "Plancton"],
      correctAnswer: 2,
      explanation: "Les coraux sont d'excellents indicateurs de la santé des océans. Leur blanchissement révèle le stress thermique et la pollution. Des coraux sains signalent un écosystème marin équilibré.",
      image: environmentHealthyCoral
    },
    {
      id: 'D7',
      question: "Quelle catastrophe naturelle peut déclencher un tsunami ?",
      options: ["Séisme sous-marin", "Éruption volcanique", "Glissement de terrain", "Toutes ces réponses"],
      correctAnswer: 3,
      explanation: "Les tsunamis peuvent être déclenchés par plusieurs événements : séismes sous-marins (le plus fréquent), éruptions volcaniques, glissements de terrain côtiers ou même chutes de météorites.",
      image: environmentTsunami
    },
    {
      id: 'D8',
      question: "Quelle méthode permet de dessaler l'eau de mer ?",
      options: ["Filtration simple", "Osmose inverse", "Ébullition classique", "Congélation"],
      correctAnswer: 1,
      explanation: "L'osmose inverse est la méthode la plus efficace pour dessaler l'eau de mer. Elle force l'eau à travers une membrane semi-perméable qui retient le sel et les impuretés.",
      image: environmentDesalination
    },
    {
      id: 'D9',
      question: "Quel pourcentage de la biodiversité marine se trouve dans les récifs ?",
      options: ["5%", "15%", "25%", "40%"],
      correctAnswer: 2,
      explanation: "Environ 25% de la biodiversité marine se trouve dans les récifs coralliens, bien qu'ils ne couvrent que 0,1% de la surface océanique. Ce sont de véritables 'forêts tropicales des mers'.",
      image: environmentReefBiodiversity
    },
    {
      id: 'D10',
      question: "Quelle pratique agricole est adaptée aux îles ?",
      options: ["Monoculture intensive", "Permaculture", "Agriculture sur brûlis", "Culture hors-sol"],
      correctAnswer: 1,
      explanation: "La permaculture est idéale pour les îles car elle maximise la production sur de petites surfaces, préserve les ressources en eau et maintient la biodiversité tout en s'adaptant au climat local.",
      image: environmentPermaculture
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
