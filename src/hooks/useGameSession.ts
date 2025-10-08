import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GameSession, Player, BoxType } from '@/types/game';
import { boxInfo } from '@/data/questions';

const generateSessionCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `BOAT-${code}`;
};

const generateAvatar = (pseudo: string): string => {
  const colors = ['#0D47A1', '#FF6F00', '#00E5FF', '#00C853', '#9C27B0'];
  const color = colors[pseudo.charCodeAt(0) % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(pseudo)}&background=${color.slice(1)}&color=fff&bold=true`;
};

export const useGameSession = () => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);

  const createSession = async (playerPseudo: string): Promise<GameSession | null> => {
    try {
      const sessionCode = generateSessionCode();

      // Create game session
      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          session_code: sessionCode,
          status: 'active'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Create first player
      const { data: playerData, error: playerError } = await supabase
        .from('session_players')
        .insert({
          session_id: sessionData.id,
          pseudo: playerPseudo,
          avatar_url: generateAvatar(playerPseudo)
        })
        .select()
        .single();

      if (playerError) throw playerError;

      // Fetch all questions to build session
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*');

      const boxes = (['A', 'B', 'C', 'D'] as BoxType[]).map(type => ({
        type,
        name: boxInfo[type].name,
        subtitle: boxInfo[type].subtitle,
        status: 'locked' as const,
        unlockCode: boxInfo[type].unlockCode,
        questions: questionsData?.filter(q => q.box_type === type).map(q => ({
          id: q.id,
          question: q.question_text,
          options: q.options as string[],
          correctAnswer: q.correct_answer
        })) || [],
        answers: []
      }));

      const newSession: GameSession = {
        code: sessionCode,
        players: [{
          id: playerData.id,
          pseudo: playerData.pseudo,
          avatar: playerData.avatar_url
        }],
        boxes,
        startTime: new Date(sessionData.start_time).getTime(),
        codesValidated: []
      };

      // Store in localStorage for quick access
      localStorage.setItem('current_session_code', sessionCode);
      localStorage.setItem('current_player_id', playerData.id);
      
      setSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const joinSession = async (sessionCode: string, playerPseudo: string): Promise<GameSession | null> => {
    try {
      // Find session
      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('session_code', sessionCode)
        .eq('status', 'active')
        .single();

      if (sessionError) throw sessionError;

      // Create player
      const { data: playerData, error: playerError } = await supabase
        .from('session_players')
        .insert({
          session_id: sessionData.id,
          pseudo: playerPseudo,
          avatar_url: generateAvatar(playerPseudo)
        })
        .select()
        .single();

      if (playerError) {
        if (playerError.code === '23505') {
          throw new Error('Ce pseudo est déjà utilisé dans cette session');
        }
        throw playerError;
      }

      // Fetch all players
      const { data: playersData } = await supabase
        .from('session_players')
        .select('*')
        .eq('session_id', sessionData.id);

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*');

      // Fetch unlocked boxes
      const { data: unlocksData } = await supabase
        .from('box_unlocks')
        .select('*')
        .eq('session_id', sessionData.id);

      const boxes = (['A', 'B', 'C', 'D'] as BoxType[]).map(type => {
        const isUnlocked = unlocksData?.some(u => u.box_type === type && u.code_validated);
        return {
          type,
          name: boxInfo[type].name,
          subtitle: boxInfo[type].subtitle,
          status: isUnlocked ? 'unlocked' as const : 'locked' as const,
          unlockCode: boxInfo[type].unlockCode,
          questions: questionsData?.filter(q => q.box_type === type).map(q => ({
            id: q.id,
            question: q.question_text,
            options: q.options as string[],
            correctAnswer: q.correct_answer
          })) || [],
          answers: []
        };
      });

      const joinedSession: GameSession = {
        code: sessionData.session_code,
        players: playersData?.map(p => ({
          id: p.id,
          pseudo: p.pseudo,
          avatar: p.avatar_url
        })) || [],
        boxes,
        startTime: new Date(sessionData.start_time).getTime(),
        endTime: sessionData.end_time ? new Date(sessionData.end_time).getTime() : undefined,
        codesValidated: unlocksData?.filter(u => u.code_validated).map(u => u.box_type as BoxType) || []
      };

      localStorage.setItem('current_session_code', sessionCode);
      localStorage.setItem('current_player_id', playerData.id);
      
      setSession(joinedSession);
      return joinedSession;
    } catch (error) {
      console.error('Error joining session:', error);
      return null;
    }
  };

  const loadCurrentSession = async (): Promise<GameSession | null> => {
    try {
      const sessionCode = localStorage.getItem('current_session_code');
      if (!sessionCode) {
        setLoading(false);
        return null;
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('session_code', sessionCode)
        .single();

      if (sessionError) {
        localStorage.removeItem('current_session_code');
        localStorage.removeItem('current_player_id');
        setLoading(false);
        return null;
      }

      // Fetch all players
      const { data: playersData } = await supabase
        .from('session_players')
        .select('*')
        .eq('session_id', sessionData.id);

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*');

      // Fetch unlocked boxes
      const { data: unlocksData } = await supabase
        .from('box_unlocks')
        .select('*')
        .eq('session_id', sessionData.id);

      const boxes = (['A', 'B', 'C', 'D'] as BoxType[]).map(type => {
        const isUnlocked = unlocksData?.some(u => u.box_type === type && u.code_validated);
        return {
          type,
          name: boxInfo[type].name,
          subtitle: boxInfo[type].subtitle,
          status: isUnlocked ? 'unlocked' as const : 'locked' as const,
          unlockCode: boxInfo[type].unlockCode,
          questions: questionsData?.filter(q => q.box_type === type).map(q => ({
            id: q.id,
            question: q.question_text,
            options: q.options as string[],
            correctAnswer: q.correct_answer
          })) || [],
          answers: []
        };
      });

      const loadedSession: GameSession = {
        code: sessionData.session_code,
        players: playersData?.map(p => ({
          id: p.id,
          pseudo: p.pseudo,
          avatar: p.avatar_url
        })) || [],
        boxes,
        startTime: new Date(sessionData.start_time).getTime(),
        endTime: sessionData.end_time ? new Date(sessionData.end_time).getTime() : undefined,
        codesValidated: unlocksData?.filter(u => u.code_validated).map(u => u.box_type as BoxType) || []
      };

      setSession(loadedSession);
      setLoading(false);
      return loadedSession;
    } catch (error) {
      console.error('Error loading session:', error);
      setLoading(false);
      return null;
    }
  };

  const refreshSession = async () => {
    await loadCurrentSession();
  };

  const clearSession = () => {
    localStorage.removeItem('current_session_code');
    localStorage.removeItem('current_player_id');
    setSession(null);
  };

  useEffect(() => {
    loadCurrentSession();
  }, []);

  return {
    session,
    loading,
    createSession,
    joinSession,
    refreshSession,
    clearSession
  };
};
