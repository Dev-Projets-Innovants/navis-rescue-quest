import { GameSession, Player, Box, BoxType } from '@/types/game';
import { questionsByBox, boxInfo } from '@/data/questions';

const STORAGE_KEY = 'mission-navis-session';

export const generateSessionCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `BOAT-${code}`;
};

export const generateAvatar = (pseudo: string): string => {
  const colors = ['#0D47A1', '#FF6F00', '#00E5FF', '#00C853', '#9C27B0'];
  const color = colors[pseudo.charCodeAt(0) % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(pseudo)}&background=${color.slice(1)}&color=fff&bold=true`;
};

export const createSession = (playerPseudo: string): GameSession => {
  const player: Player = {
    id: crypto.randomUUID(),
    pseudo: playerPseudo,
    avatar: generateAvatar(playerPseudo)
  };

  const boxes: Box[] = (['A', 'B', 'C', 'D'] as BoxType[]).map(type => ({
    type,
    name: boxInfo[type].name,
    subtitle: boxInfo[type].subtitle,
    status: 'locked',
    unlockCode: boxInfo[type].unlockCode,
    questions: questionsByBox[type],
    answers: []
  }));

  const session: GameSession = {
    code: generateSessionCode(),
    players: [player],
    boxes,
    startTime: Date.now(),
    codesValidated: []
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(`session-${session.code}`, JSON.stringify(session));
  
  return session;
};

export const joinSession = (sessionCode: string, playerPseudo: string): GameSession | null => {
  const sessionData = localStorage.getItem(`session-${sessionCode}`);
  if (!sessionData) return null;

  const session: GameSession = JSON.parse(sessionData);
  
  const player: Player = {
    id: crypto.randomUUID(),
    pseudo: playerPseudo,
    avatar: generateAvatar(playerPseudo)
  };

  session.players.push(player);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(`session-${sessionCode}`, JSON.stringify(session));
  
  return session;
};

export const getCurrentSession = (): GameSession | null => {
  const sessionData = localStorage.getItem(STORAGE_KEY);
  return sessionData ? JSON.parse(sessionData) : null;
};

export const updateSession = (session: GameSession): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(`session-${session.code}`, JSON.stringify(session));
};

export const clearSession = (): void => {
  const session = getCurrentSession();
  if (session) {
    localStorage.removeItem(`session-${session.code}`);
  }
  localStorage.removeItem(STORAGE_KEY);
};

export const getQuestionsForBox = (boxType: BoxType, playerCount: number): number => {
  if (playerCount <= 2) return 5;
  if (playerCount === 3) return 7;
  return 10;
};
