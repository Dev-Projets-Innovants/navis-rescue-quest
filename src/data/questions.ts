import { Question, BoxType } from '@/types/game';

import healthHypothermia from '@/assets/questions/health-hypothermia.jpg';
import healthEmergency112 from '@/assets/questions/health-emergency-112.jpg';
import healthRehydration from '@/assets/questions/health-rehydration.jpg';
import healthFracture from '@/assets/questions/health-fracture.jpg';
import healthMalaria from '@/assets/questions/health-malaria.jpg';
import healthWater from '@/assets/questions/health-water.jpg';
import healthJellyfish from '@/assets/questions/health-jellyfish.jpg';
import healthPls from '@/assets/questions/health-pls.jpg';
import healthSurvivalWater from '@/assets/questions/health-survival-water.jpg';
import healthVitaminC from '@/assets/questions/health-vitamin-c.jpg';
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
      question: "En cas d'hypothermie, quelle est la première action à réaliser ?",
      options: [
        "Mettre la personne sous l'eau chaude",
        "Envelopper dans une couverture",
        "Donner de l'alcool à boire",
        "Frictionner vigoureusement"
      ],
      correctAnswer: 1,
      explanation: "En cas d'hypothermie, il faut protéger la personne du froid en l'enveloppant dans une couverture pour limiter les pertes de chaleur. L'eau chaude peut provoquer un choc thermique, l'alcool dilate les vaisseaux et aggrave la perte de chaleur, et les frictions peuvent être dangereuses.",
      image: healthHypothermia
    },
    {
      id: 'A2',
      question: "Quel est le numéro d'urgence universel en Europe ?",
      options: ["911", "112", "15", "18"],
      correctAnswer: 1,
      explanation: "Le 112 est le numéro d'urgence universel utilisable dans tous les pays de l'Union européenne. Il permet de joindre les services de secours depuis n'importe quel téléphone, même sans crédit.",
      image: healthEmergency112
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
      correctAnswer: 1,
      explanation: "En cas de déshydratation sévère, il faut réhydrater progressivement avec une solution de réhydratation orale (SRO) qui contient un équilibre de sels minéraux et de glucose. Boire trop vite peut causer des complications.",
      image: healthRehydration
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
      correctAnswer: 0,
      explanation: "Une fracture ouverte se caractérise par la visibilité de l'os à travers la peau. C'est une urgence médicale car le risque d'infection est très élevé. Il ne faut jamais essayer de remettre l'os en place.",
      image: healthFracture
    },
    {
      id: 'A5',
      question: "Quelle maladie tropicale est transmise par les moustiques ?",
      options: ["Grippe", "Paludisme", "Choléra", "Tuberculose"],
      correctAnswer: 1,
      explanation: "Le paludisme (ou malaria) est une maladie tropicale grave transmise par les moustiques anophèles. La prévention passe par l'utilisation de moustiquaires, de répulsifs et parfois de traitements prophylactiques.",
      image: healthMalaria
    },
    {
      id: 'A6',
      question: "En situation de crise, combien de litres d'eau minimum par personne et par jour ?",
      options: ["1 litre", "2 litres", "3 litres", "5 litres"],
      correctAnswer: 2,
      explanation: "En situation de crise, il faut prévoir au minimum 3 litres d'eau par personne et par jour : 2 litres pour boire et 1 litre pour l'hygiène et la préparation des aliments.",
      image: healthWater
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
      correctAnswer: 1,
      explanation: "En cas de piqûre de méduse, il faut rincer la zone à l'eau de mer (pas d'eau douce qui active le venin). Ensuite, retirer délicatement les filaments avec une pince et consulter un médecin si nécessaire.",
      image: healthJellyfish
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
      correctAnswer: 2,
      explanation: "Avant de mettre une personne en PLS, il faut d'abord vérifier qu'elle respire. La PLS est utilisée pour une personne inconsciente qui respire, afin d'éviter qu'elle s'étouffe avec sa langue ou des vomissements.",
      image: healthPls
    },
    {
      id: 'A9',
      question: "Combien de temps peut-on survivre sans eau ?",
      options: ["1 jour", "3 jours", "7 jours", "14 jours"],
      correctAnswer: 1,
      explanation: "En moyenne, un être humain peut survivre environ 3 jours sans eau dans des conditions normales. Ce délai peut être réduit en cas de forte chaleur ou d'effort physique intense.",
      image: healthSurvivalWater
    },
    {
      id: 'A10',
      question: "Quelle vitamine est essentielle pour éviter le scorbut ?",
      options: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine K"],
      correctAnswer: 1,
      explanation: "La vitamine C est essentielle pour éviter le scorbut, une maladie qui touchait autrefois les marins lors de longues traversées. On la trouve dans les agrumes, les kiwis, les poivrons et bien d'autres fruits et légumes frais.",
      image: healthVitaminC
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
