export interface PlayerProfile {
  id: string;
  wallet: string;
  level: number;
  xp: number;
  totalScore: number;
  gamesPlayed: number;
  averageReactionTime: number;
  traits: PlayerTrait[];
  achievements: Achievement[];
  lastPlayed: number;
}

export interface PlayerTrait {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  description: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  reward: {
    xp: number;
    trait?: string;
  };
  expiresAt: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface GameSession {
  score: number;
  reactionTimes: number[];
  accuracy: number;
  startTime: number;
  endTime: number;
}