import { supabase } from '@/integrations/supabase/client';
import { BoxType } from '@/types/game';

export const useBoxUnlock = () => {
  const unlockBox = async (sessionCode: string, boxType: BoxType): Promise<boolean> => {
    try {
      // Get session ID
      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('session_code', sessionCode)
        .single();

      if (sessionError) throw sessionError;

      // Create unlock record
      const { error: unlockError } = await supabase
        .from('box_unlocks')
        .insert({
          session_id: sessionData.id,
          box_type: boxType,
          code_validated: true
        });

      if (unlockError && unlockError.code !== '23505') {
        throw unlockError;
      }

      return true;
    } catch (error) {
      console.error('Error unlocking box:', error);
      return false;
    }
  };

  return { unlockBox };
};
