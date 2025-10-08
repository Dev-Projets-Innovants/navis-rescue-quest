import { supabase } from '@/integrations/supabase/client';
import { BoxType } from '@/types/game';

export const useBoxAttempts = () => {
  const startAttempt = async (sessionCode: string, boxType: BoxType, playerId: string) => {
    try {
      const { data: sessionData } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('session_code', sessionCode)
        .single();

      if (!sessionData) return null;

      const { data, error } = await supabase
        .from('box_attempts')
        .insert({
          session_id: sessionData.id,
          box_type: boxType,
          player_id: playerId,
          quiz_start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error && error.code !== '23505') throw error;
      return data;
    } catch (error) {
      console.error('Error starting attempt:', error);
      return null;
    }
  };

  const saveProgress = async (
    attemptId: string, 
    currentQuestionIndex: number, 
    answers: boolean[]
  ) => {
    try {
      const { error } = await supabase
        .from('box_attempts')
        .update({
          current_question_index: currentQuestionIndex,
          answers: JSON.stringify(answers)
        })
        .eq('id', attemptId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  };

  const endAttempt = async (attemptId: string, score: number, success: boolean) => {
    try {
      const { error } = await supabase
        .from('box_attempts')
        .update({
          ended_at: new Date().toISOString(),
          score,
          success
        })
        .eq('id', attemptId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error ending attempt:', error);
      return false;
    }
  };

  const getActiveAttempt = async (sessionCode: string, boxType: BoxType) => {
    try {
      const { data: sessionData } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('session_code', sessionCode)
        .single();

      if (!sessionData) return null;

      const { data } = await supabase
        .from('box_attempts')
        .select('*, session_players(pseudo)')
        .eq('session_id', sessionData.id)
        .eq('box_type', boxType)
        .is('ended_at', null)
        .single();

      return data;
    } catch (error) {
      return null;
    }
  };

  return { startAttempt, endAttempt, getActiveAttempt, saveProgress };
};
