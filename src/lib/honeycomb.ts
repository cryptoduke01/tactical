import createEdgeClient from "@honeycomb-protocol/edge-client";
import { PlayerProfile, Mission, Achievement } from "./types";

// Use devnet for bounty submission
const API_URL = "https://edge.dev.honeycombprotocol.com/";
export const client = createEdgeClient(API_URL, true);

export class HoneycombGameManager {
  private walletAddress: string;

  constructor(walletAddress: string) {
    this.walletAddress = walletAddress;
  }

  async createPlayer(): Promise<PlayerProfile> {
    try {
      // Note: Honeycomb client doesn't have createUser method yet
      // This would be implemented when the API supports it
      console.log("Creating player profile locally - Honeycomb sync pending");
      return this.createLocalProfile();
    } catch (error) {
      console.error("Error creating player:", error);
      // Fallback: create local profile if API fails
      return this.createLocalProfile();
    }
  }

  private createLocalProfile(): PlayerProfile {
    return {
      id: `local_${this.walletAddress.slice(0, 8)}`,
      wallet: this.walletAddress,
      level: 1,
      xp: 0,
      totalScore: 0,
      gamesPlayed: 0,
      averageReactionTime: 0,
      traits: [
        {
          id: "speed",
          name: "Speed",
          value: 0,
          maxValue: 100,
          description: "Reaction speed mastery",
        },
        {
          id: "consistency",
          name: "Consistency",
          value: 0,
          maxValue: 100,
          description: "Performance stability",
        },
        {
          id: "focus",
          name: "Focus",
          value: 0,
          maxValue: 100,
          description: "Mental concentration",
        },
      ],
      achievements: [],
      lastPlayed: Date.now(),
    };
  }

  async updatePlayerProgress(
    profile: PlayerProfile,
    sessionData: any
  ): Promise<PlayerProfile> {
    try {
      // Update traits based on performance
      const speedGain = sessionData.averageReactionTime < 400 ? 5 : 2;
      const consistencyGain = sessionData.consistency > 0.8 ? 3 : 1;

      profile.traits.forEach((trait) => {
        if (trait.id === "speed")
          trait.value = Math.min(100, trait.value + speedGain);
        if (trait.id === "consistency")
          trait.value = Math.min(100, trait.value + consistencyGain);
        if (trait.id === "focus")
          trait.value = Math.min(
            100,
            trait.value + (sessionData.score > 50 ? 2 : 1)
          );
      });

      // Level up logic
      profile.xp += sessionData.score;
      profile.totalScore += sessionData.score;
      profile.gamesPlayed += sessionData.gamesPlayed;
      profile.averageReactionTime = sessionData.averageReactionTime;
      profile.lastPlayed = Date.now();

      const newLevel = Math.floor(profile.xp / 100) + 1;
      if (newLevel > profile.level) {
        profile.level = newLevel;
      }

      // Try to save to Honeycomb (but don't fail if it doesn't work)
      try {
        // Note: Honeycomb client doesn't have updateUser method yet
        // This would be implemented when the API supports it
        console.log("Profile updated locally - Honeycomb sync pending");
      } catch (saveError) {
        console.log("Local save only - Honeycomb API unavailable");
      }

      return profile;
    } catch (error) {
      console.error("Error updating progress:", error);
      return profile;
    }
  }

  async createDailyMissions(): Promise<Mission[]> {
    const today = new Date().toDateString();

    return [
      {
        id: `speed_${today}`,
        name: "Speed Demon",
        description: "React in under 300ms, 5 times",
        target: 5,
        progress: 0,
        reward: { xp: 50, trait: "speed" },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      },
      {
        id: `games_${today}`,
        name: "Daily Grind",
        description: "Play 10 games",
        target: 10,
        progress: 0,
        reward: { xp: 30 },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      },
      {
        id: `score_${today}`,
        name: "High Scorer",
        description: "Score 100 points in one session",
        target: 100,
        progress: 0,
        reward: { xp: 75, trait: "focus" },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      },
    ];
  }

  async updateMissionProgress(
    missionId: string,
    progress: number
  ): Promise<void> {
    try {
      // In a real implementation, this would update Honeycomb
      console.log(`Mission ${missionId} progress: ${progress}`);
    } catch (error) {
      console.error("Error updating mission:", error);
    }
  }
}
