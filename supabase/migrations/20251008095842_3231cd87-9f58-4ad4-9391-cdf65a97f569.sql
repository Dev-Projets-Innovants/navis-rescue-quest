-- Add columns to store quiz progress
ALTER TABLE box_attempts
ADD COLUMN IF NOT EXISTS current_question_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS answers jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS quiz_start_time timestamp with time zone;