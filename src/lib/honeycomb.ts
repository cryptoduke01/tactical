import createEdgeClient from "@honeycomb-protocol/edge-client";
import { Mission, Achievement } from "./types";
import { PlayerProfile } from "./heroManager";
import { storageManager } from "./storage";

// Use devnet for bounty submission
const API_URL = "https://edge.dev.honeycombprotocol.com/";
export const client = createEdgeClient(API_URL, true);

export class HoneycombGameManager {
  private walletAddress: string;

  constructor(walletAddress: string) {
    this.walletAddress = walletAddress;
  }

  // Create player profile
  async createPlayerProfile(walletAddress: string): Promise<PlayerProfile> {
    try {
      // Try to create user in Honeycomb first
      const honeycombProfile = await this.createUserInHoneycomb(walletAddress);
      if (honeycombProfile) {
        return honeycombProfile;
      }
    } catch (error) {
      // Fallback to local profile creation
    }

    // Fallback: Create local profile
    const localProfile: PlayerProfile = {
      id: walletAddress,
      name: `Tactical_${walletAddress.slice(0, 8)}`,
      walletAddress,
      xp: 10000,
      level: 1,
      battlesWon: 0,
      battlesLost: 0,
      questsCompleted: 0,
      totalScore: 0,
      gamesPlayed: 0,
      averageReactionTime: 0,
      traits: [
        {
          name: "Tactical Mind",
          value: 75,
          maxValue: 100,
          description: "Strategic thinking ability",
        },
        {
          name: "Combat Experience",
          value: 50,
          maxValue: 100,
          description: "Battle field knowledge",
        },
      ],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    // Save to local storage
    await storageManager.savePlayerProfile(localProfile);

    return localProfile;
  }

  // Update player profile
  async updatePlayerProfile(
    walletAddress: string,
    updates: Partial<PlayerProfile>
  ): Promise<PlayerProfile | null> {
    try {
      // Try to update in Honeycomb first
      const honeycombProfile = await this.updateUserInHoneycomb(
        walletAddress,
        updates
      );
      if (honeycombProfile) {
        return honeycombProfile;
      }
    } catch (error) {
      // Fallback to local update
    }

    // Fallback: Update local profile
    const currentProfile = await storageManager.loadPlayerProfile(
      walletAddress
    );
    if (!currentProfile) {
      return null;
    }

    const updatedProfile: PlayerProfile = {
      ...currentProfile,
      ...updates,
      lastActive: new Date().toISOString(),
    };

    // Save updated profile locally
    await storageManager.savePlayerProfile(updatedProfile);

    return updatedProfile;
  }

  // Update mission progress
  async updateMissionProgress(
    missionId: string,
    progress: number
  ): Promise<boolean> {
    try {
      // Try to update in Honeycomb first
      const success = await this.updateMissionInHoneycomb(missionId, progress);
      if (success) {
        return true;
      }
    } catch (error) {
      // Fallback to local update
    }

    // Fallback: Update locally
    return true;
  }

  // Create user in Honeycomb (stubbed for now)
  private async createUserInHoneycomb(
    walletAddress: string
  ): Promise<PlayerProfile | null> {
    try {
      // This would create a user in Honeycomb Protocol
      // For now, return null to trigger fallback
      return null;
    } catch (error) {
      console.error("Failed to create user in Honeycomb:", error);
      return null;
    }
  }

  // Update user in Honeycomb (stubbed for now)
  private async updateUserInHoneycomb(
    walletAddress: string,
    updates: Partial<PlayerProfile>
  ): Promise<PlayerProfile | null> {
    try {
      // This would update a user in Honeycomb Protocol
      // For now, return null to trigger fallback
      return null;
    } catch (error) {
      console.error("Failed to update user in Honeycomb:", error);
      return null;
    }
  }

  // Update mission in Honeycomb (stubbed for now)
  private async updateMissionInHoneycomb(
    missionId: string,
    progress: number
  ): Promise<boolean> {
    try {
      // This would update mission progress in Honeycomb Protocol
      // For now, return false to trigger fallback
      return false;
    } catch (error) {
      console.error("Failed to update mission in Honeycomb:", error);
      return false;
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
}
