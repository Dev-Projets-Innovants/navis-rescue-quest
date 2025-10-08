export type BoxType = 'A' | 'B' | 'C' | 'D';

export type BoxStatus = 'locked' | 'in-progress' | 'unlocked';

export interface Player {
  id: string;
  pseudo: string;
  avatar: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface PlayerWithBox extends Player {
  assignedBox?: BoxType | null;
}

export interface Box {
  type: BoxType;
  name: string;
  subtitle: string;
  status: BoxStatus;
  unlockCode: string;
  questions: Question[];
  answers: boolean[];
}

export interface GameSession {
  code: string;
  players: Player[];
  boxes: Box[];
  startTime: number;
  endTime?: number;
  codesValidated: BoxType[];
}
