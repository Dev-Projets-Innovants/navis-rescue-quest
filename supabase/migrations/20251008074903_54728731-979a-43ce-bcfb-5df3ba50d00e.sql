-- ============================================
-- Phase 1: Mission Navis - Database Setup
-- ============================================

-- Create box_type enum
CREATE TYPE public.box_type AS ENUM ('A', 'B', 'C', 'D');

-- Create session_status enum
CREATE TYPE public.session_status AS ENUM ('active', 'completed');

-- ============================================
-- Table: questions
-- ============================================
CREATE TABLE public.questions (
  id TEXT PRIMARY KEY,
  box_type public.box_type NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Table: game_sessions
-- ============================================
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT NOT NULL UNIQUE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  status public.session_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Table: session_players
-- ============================================
CREATE TABLE public.session_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  pseudo TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  assigned_box public.box_type,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, pseudo)
);

-- ============================================
-- Table: player_answers
-- ============================================
CREATE TABLE public.player_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.session_players(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(player_id, question_id)
);

-- ============================================
-- Table: box_unlocks
-- ============================================
CREATE TABLE public.box_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  box_type public.box_type NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  code_validated BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(session_id, box_type)
);

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_unlocks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies: questions (public read)
-- ============================================
CREATE POLICY "Questions are viewable by everyone"
  ON public.questions
  FOR SELECT
  USING (true);

-- ============================================
-- RLS Policies: game_sessions (public read/write via session_code)
-- ============================================
CREATE POLICY "Sessions are viewable by everyone"
  ON public.game_sessions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create a session"
  ON public.game_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update a session"
  ON public.game_sessions
  FOR UPDATE
  USING (true);

-- ============================================
-- RLS Policies: session_players (public read/write)
-- ============================================
CREATE POLICY "Players are viewable by everyone"
  ON public.session_players
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join a session"
  ON public.session_players
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update players"
  ON public.session_players
  FOR UPDATE
  USING (true);

-- ============================================
-- RLS Policies: player_answers (public read/write)
-- ============================================
CREATE POLICY "Answers are viewable by everyone"
  ON public.player_answers
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit answers"
  ON public.player_answers
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- RLS Policies: box_unlocks (public read/write)
-- ============================================
CREATE POLICY "Box unlocks are viewable by everyone"
  ON public.box_unlocks
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can unlock boxes"
  ON public.box_unlocks
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update box unlocks"
  ON public.box_unlocks
  FOR UPDATE
  USING (true);

-- ============================================
-- Performance Indexes
-- ============================================
CREATE INDEX idx_game_sessions_session_code ON public.game_sessions(session_code);
CREATE INDEX idx_session_players_session_id ON public.session_players(session_id);
CREATE INDEX idx_player_answers_player_id ON public.player_answers(player_id);
CREATE INDEX idx_player_answers_question_id ON public.player_answers(question_id);
CREATE INDEX idx_box_unlocks_session_id ON public.box_unlocks(session_id);
CREATE INDEX idx_questions_box_type ON public.questions(box_type);

-- ============================================
-- Insert Questions - Box A (Santé)
-- ============================================
INSERT INTO public.questions (id, box_type, question_text, options, correct_answer) VALUES
('A1', 'A', 'En cas d''hypothermie, quelle est la première action à réaliser ?', '["Mettre la personne sous l''eau chaude","Envelopper dans une couverture","Donner de l''alcool à boire","Frictionner vigoureusement"]', 1),
('A2', 'A', 'Quel est le numéro d''urgence universel en Europe ?', '["911","112","15","18"]', 1),
('A3', 'A', 'En cas de déshydratation sévère, que faut-il faire en priorité ?', '["Donner de l''eau froide rapidement","Réhydrater progressivement avec une solution orale","Attendre que la personne ait soif","Donner du café ou du thé"]', 1),
('A4', 'A', 'Comment identifier une fracture ouverte ?', '["L''os est visible à travers la peau","La douleur est très intense","Il y a un gonflement","La zone est rouge"]', 0),
('A5', 'A', 'Quelle maladie tropicale est transmise par les moustiques ?', '["Grippe","Paludisme","Choléra","Tuberculose"]', 1),
('A6', 'A', 'En situation de crise, combien de litres d''eau minimum par personne et par jour ?', '["1 litre","2 litres","3 litres","5 litres"]', 2),
('A7', 'A', 'Que faire en cas de piqûre de méduse ?', '["Rincer à l''eau douce","Rincer à l''eau de mer","Appliquer de la glace directement","Frotter avec du sable"]', 1),
('A8', 'A', 'Quel est le premier geste de la position latérale de sécurité (PLS) ?', '["Basculer la tête en arrière","Plier le bras de la victime","Vérifier la respiration","Placer la main sous la joue"]', 2),
('A9', 'A', 'Combien de temps peut-on survivre sans eau ?', '["1 jour","3 jours","7 jours","14 jours"]', 1),
('A10', 'A', 'Quelle vitamine est essentielle pour éviter le scorbut ?', '["Vitamine A","Vitamine C","Vitamine D","Vitamine K"]', 1);

-- ============================================
-- Insert Questions - Box B (Tourisme)
-- ============================================
INSERT INTO public.questions (id, box_type, question_text, options, correct_answer) VALUES
('B1', 'B', 'Quelle est la capitale des Maldives ?', '["Malé","Colombo","Port-Louis","Victoria"]', 0),
('B2', 'B', 'Dans quel océan se trouve Madagascar ?', '["Océan Atlantique","Océan Pacifique","Océan Indien","Océan Arctique"]', 2),
('B3', 'B', 'Quelle île est surnommée ''l''île de la Réunion'' ?', '["Maurice","Mayotte","La Réunion","Seychelles"]', 2),
('B4', 'B', 'Quel archipel appartient à la France dans le Pacifique ?', '["Hawaii","Polynésie française","Fidji","Samoa"]', 1),
('B5', 'B', 'Quelle est la langue officielle de la Jamaïque ?', '["Espagnol","Français","Anglais","Créole"]', 2),
('B6', 'B', 'Sur quel continent se trouve l''île de Bali ?', '["Afrique","Asie","Océanie","Amérique du Sud"]', 1),
('B7', 'B', 'Quelle île est connue pour ses statues Moaï ?', '["Tahiti","Île de Pâques","Bora-Bora","Moorea"]', 1),
('B8', 'B', 'Quelle ressource naturelle est abondante dans les îles tropicales ?', '["Pétrole","Eau douce","Charbon","Gaz naturel"]', 1),
('B9', 'B', 'Quelle route maritime relie l''Europe à l''Asie via Suez ?', '["Route du Cap","Route de la Soie maritime","Route du Nord","Route Atlantique"]', 1),
('B10', 'B', 'Quel peuple insulaire est connu pour la navigation en pirogue double ?', '["Vikings","Polynésiens","Grecs","Phéniciens"]', 1);

-- ============================================
-- Insert Questions - Box C (Arts)
-- ============================================
INSERT INTO public.questions (id, box_type, question_text, options, correct_answer) VALUES
('C1', 'C', 'Quelle couleur est universellement associée au danger ?', '["Bleu","Vert","Rouge","Jaune"]', 2),
('C2', 'C', 'Quel signal SOS est utilisé en morse ?', '["... --- ...","--- ... ---","... ... ...","--- --- ---"]', 0),
('C3', 'C', 'Quelle forme géométrique indique un panneau de danger ?', '["Carré","Triangle","Cercle","Hexagone"]', 1),
('C4', 'C', 'Quel artiste est célèbre pour ses peintures de Tahiti ?', '["Van Gogh","Paul Gauguin","Monet","Picasso"]', 1),
('C5', 'C', 'Quelle couleur symbolise l''eau et le calme ?', '["Rouge","Vert","Bleu","Orange"]', 2),
('C6', 'C', 'Quel type d''art utilise des coquillages et coraux ?', '["Sculpture minérale","Art insulaire","Peinture abstraite","Art digital"]', 1),
('C7', 'C', 'Quel musée parisien abrite la Joconde ?', '["Musée d''Orsay","Le Louvre","Centre Pompidou","Musée Rodin"]', 1),
('C8', 'C', 'Quelle technique artistique utilise le feu et la cire ?', '["Aquarelle","Encaustique","Fusain","Pastel"]', 1),
('C9', 'C', 'Combien de drapeaux de signalisation maritime existent (approximativement) ?', '["10","26","40","50"]', 2),
('C10', 'C', 'Quelle exposition d''art contemporain est réputée à Venise ?', '["Documenta","Biennale","Frieze","Art Basel"]', 1);

-- ============================================
-- Insert Questions - Box D (Environnement)
-- ============================================
INSERT INTO public.questions (id, box_type, question_text, options, correct_answer) VALUES
('D1', 'D', 'Quel phénomène naturel cause le plus de dégâts sur les îles ?', '["Séisme","Cyclone tropical","Éruption volcanique","Tsunami"]', 1),
('D2', 'D', 'Quel écosystème protège les côtes de l''érosion ?', '["Mangrove","Désert","Prairie","Toundra"]', 0),
('D3', 'D', 'Quelle est la principale menace pour les récifs coralliens ?', '["Surpêche","Réchauffement climatique","Pollution plastique","Tout cela à la fois"]', 3),
('D4', 'D', 'Quelle énergie renouvelable est abondante sur les îles ?', '["Éolienne","Solaire","Marémotrice","Toutes ces réponses"]', 3),
('D5', 'D', 'Combien d''eau douce contiennent les océans (en pourcentage) ?', '["0%","3%","10%","25%"]', 0),
('D6', 'D', 'Quel animal marin est un indicateur de la santé des océans ?', '["Requin","Méduse","Corail","Plancton"]', 2),
('D7', 'D', 'Quelle catastrophe naturelle peut déclencher un tsunami ?', '["Séisme sous-marin","Éruption volcanique","Glissement de terrain","Toutes ces réponses"]', 3),
('D8', 'D', 'Quelle méthode permet de dessaler l''eau de mer ?', '["Filtration simple","Osmose inverse","Ébullition classique","Congélation"]', 1),
('D9', 'D', 'Quel pourcentage de la biodiversité marine se trouve dans les récifs ?', '["5%","15%","25%","40%"]', 2),
('D10', 'D', 'Quelle pratique agricole est adaptée aux îles ?', '["Monoculture intensive","Permaculture","Agriculture sur brûlis","Culture hors-sol"]', 1);