import { GameSession, PlayerProfile } from "./types";

export class GameEngine {
  private session: GameSession;
  
  constructor() {
    this.session = {
      score: 0,
      reactionTimes: [],
      accuracy: 0,
      startTime: Date.now(),
      endTime: 0
    };
  }

  calculateScore(reactionTime: number): number {
    if (reactionTime < 200) return 20; // Lightning fast
    if (reactionTime < 300) return 15; // Very fast  
    if (reactionTime < 500) return 10; // Fast
    if (reactionTime < 800) return 5;  // Average
    return 2; // Slow
  }

  addReactionTime(time: number): number {
    const score = this.calculateScore(time);
    this.session.score += score;
    this.session.reactionTimes.push(time);
    return score;
  }

  getSessionStats() {
    const avgTime = this.session.reactionTimes.reduce((a, b) => a + b, 0) / this.session.reactionTimes.length;
    const consistency = this.calculateConsistency();
    
    return {
      ...this.session,
      averageReactionTime: Math.round(avgTime),
      consistency,
      gamesPlayed: this.session.reactionTimes.length
    };
  }

  private calculateConsistency(): number {
    if (this.session.reactionTimes.length < 2) return 1;
    
    const avg = this.session.reactionTimes.reduce((a, b) => a + b, 0) / this.session.reactionTimes.length;
    const variance = this.session.reactionTimes.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / this.session.reactionTimes.length;
    const standardDeviation = Math.sqrt(variance);
    
    return Math.max(0, 1 - (standardDeviation / avg));
  }

  reset() {
    this.session = {
      score: 0,
      reactionTimes: [],
      accuracy: 0,
      startTime: Date.now(),
      endTime: 0
    };
  }
}