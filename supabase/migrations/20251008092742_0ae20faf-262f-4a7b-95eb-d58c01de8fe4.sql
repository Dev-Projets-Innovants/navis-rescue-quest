-- Add explanation column to questions table
ALTER TABLE public.questions 
ADD COLUMN explanation TEXT;

-- Create box_attempts table to track who is working on which box
CREATE TABLE public.box_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  box_type box_type NOT NULL,
  player_id UUID NOT NULL REFERENCES public.session_players(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  score DECIMAL(5,2),
  success BOOLEAN DEFAULT false,
  UNIQUE(session_id, box_type, player_id)
);

-- Enable RLS
ALTER TABLE public.box_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for box_attempts
CREATE POLICY "Box attempts are viewable by everyone" 
ON public.box_attempts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create box attempts" 
ON public.box_attempts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update box attempts" 
ON public.box_attempts 
FOR UPDATE 
USING (true);

-- Create index for better performance
CREATE INDEX idx_box_attempts_session_box ON public.box_attempts(session_id, box_type);
CREATE INDEX idx_box_attempts_active ON public.box_attempts(session_id, box_type) WHERE ended_at IS NULL;