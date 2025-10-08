import { supabase } from '@/integrations/supabase/client';

export const usePlayerAnswers = () => {
  const saveAnswer = async (
    playerId: string,
    questionId: string,
    isCorrect: boolean
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('player_answers')
        .insert({
          player_id: playerId,
          question_id: questionId,
          is_correct: isCorrect
        });

      if (error && error.code !== '23505') {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error saving answer:', error);
      return false;
    }
  };

  const getPlayerAnswers = async (playerId: string) => {
    try {
      const { data, error } = await supabase
        .from('player_answers')
        .select('*')
        .eq('player_id', playerId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting answers:', error);
      return [];
    }
  };

  return { saveAnswer, getPlayerAnswers };
};
