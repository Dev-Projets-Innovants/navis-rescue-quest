import { BoxType } from '@/types/game';

// Utility function to determine number of questions based on player count
export const getQuestionsForBox = (boxType: BoxType, playerCount: number): number => {
  if (playerCount <= 2) return 5;
  if (playerCount === 3) return 7;
  return 10;
};
