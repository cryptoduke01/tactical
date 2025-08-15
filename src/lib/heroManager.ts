import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";

// Use Honeynet for testing (unlimited SOL available)
const API_URL = "https://edge.test.honeycombprotocol.com/";
export const client = createEdgeClient(API_URL, true);

export interface Hero {
  id: string;
  name: string;
  level: number;
  xp: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  traits: HeroTrait[];
  image: string;
  power: number;
  health: number;
  mana: number;
}

export interface HeroTrait {
  name: string;
  value: number;
  maxValue: number;
  description: string;
}

export interface PlayerProfile {
  id: string;
  wallet: string;
  name: string;
  level: number;
  xp: number;
  heroes: Hero[];
  battlesWon: number;
  battlesLost: number;
  questsCompleted: number;
  reputation: number;
  lastActive: number;
}

export class HeroManager {
  private projectAddress: string = "your_project_address_here"; // Will be set when project is created

  constructor() {
    // Initialize with default project or create new one
    this.initializeProject();
  }

  private async initializeProject() {
    try {
      // For now, use a placeholder project address
      // In production, this would be created via Honeycomb dashboard
      console.log("Using placeholder project for development");
      this.projectAddress = "dev_project_placeholder";
    } catch (error) {
      console.error("Failed to initialize project:", error);
      // Fallback to placeholder
      this.projectAddress = "fallback_project";
    }
  }

  async createPlayerProfile(walletAddress: string): Promise<PlayerProfile> {
    try {
      console.log(
        "Creating player profile on Honeycomb for wallet:",
        walletAddress
      );

      // Create user profile using Honeycomb
      const { createNewUserWithProfileTransaction: txResponse } =
        await client.createNewUserWithProfileTransaction({
          project: this.projectAddress,
          wallet: walletAddress,
          payer: walletAddress,
          profileIdentity: "main",
          userInfo: {
            name: `Tactical_${walletAddress.slice(0, 8)}`,
            bio: "Tactical Crypto Arena Operator",
            pfp: "https://example.com/default-avatar.png",
          },
        });

      console.log("Honeycomb profile creation transaction:", txResponse);

      // Store additional game data in Honeycomb
      const gameData = {
        level: 1,
        xp: 0,
        battlesWon: 0,
        battlesLost: 0,
        questsCompleted: 0,
        reputation: 100,
        lastActive: Date.now(),
        heroes: [],
      };

      // Try to store game data in Honeycomb (this would be done via character creation)
      try {
        await this.storeGameData(walletAddress, gameData);
      } catch (error) {
        console.log("Game data storage failed, using local fallback:", error);
      }

      // Return the created profile
      return {
        id: `honeycomb_${walletAddress.slice(0, 8)}`,
        wallet: walletAddress,
        name: `Tactical_${walletAddress.slice(0, 8)}`,
        ...gameData,
      };
    } catch (error) {
      console.error("Error creating player profile on Honeycomb:", error);
      console.log("Falling back to local profile creation");
      // Fallback to local profile
      return this.createLocalProfile(walletAddress);
    }
  }

  private async storeGameData(walletAddress: string, gameData: any) {
    try {
      // For now, just log the data - in production this would be stored on-chain
      console.log("Game data to be stored on Honeycomb:", gameData);
      console.log(
        "This would create a character or use existing storage methods"
      );
    } catch (error) {
      console.error("Failed to store game data:", error);
      throw error;
    }
  }

  private createLocalProfile(walletAddress: string): PlayerProfile {
    return {
      id: `local_${walletAddress.slice(0, 8)}`,
      wallet: walletAddress,
      name: `Tactical_${walletAddress.slice(0, 8)}`,
      level: 1,
      xp: 0,
      heroes: [],
      battlesWon: 0,
      battlesLost: 0,
      questsCompleted: 0,
      reputation: 100,
      lastActive: Date.now(),
    };
  }

  async getPlayerHeroes(walletAddress: string): Promise<Hero[]> {
    try {
      console.log("Fetching heroes for wallet:", walletAddress);

      // For now, return starter heroes since we're in development
      // In production, this would fetch from Honeycomb
      console.log("Returning starter heroes for development");
      return this.getStarterHeroes();
    } catch (error) {
      console.error("Error fetching heroes:", error);
      console.log("Falling back to starter heroes");
      return this.getStarterHeroes();
    }
  }

  private getStarterHeroes(): Hero[] {
    return [
      {
        id: "satoshi",
        name: "Satoshi Nakamoto",
        level: 1,
        xp: 0,
        rarity: "legendary",
        traits: [
          {
            name: "Cryptography",
            value: 95,
            maxValue: 100,
            description: "Master of digital security",
          },
          {
            name: "Innovation",
            value: 100,
            maxValue: 100,
            description: "Revolutionary thinking",
          },
          {
            name: "Mystery",
            value: 100,
            maxValue: 100,
            description: "Unknown identity",
          },
        ],
        image: "https://example.com/satoshi.png",
        power: 100,
        health: 100,
        mana: 100,
      },
      {
        id: "vitalik",
        name: "Vitalik Buterin",
        level: 1,
        xp: 0,
        rarity: "epic",
        traits: [
          {
            name: "Smart Contracts",
            value: 90,
            maxValue: 100,
            description: "Ethereum architect",
          },
          {
            name: "Research",
            value: 85,
            maxValue: 100,
            description: "Academic approach",
          },
          {
            name: "Vision",
            value: 95,
            maxValue: 100,
            description: "Future-focused thinking",
          },
        ],
        image: "https://example.com/vitalik.png",
        power: 85,
        health: 80,
        mana: 95,
      },
      {
        id: "cz",
        name: "CZ Binance",
        level: 1,
        xp: 0,
        rarity: "rare",
        traits: [
          {
            name: "Trading",
            value: 90,
            maxValue: 100,
            description: "Exchange mastery",
          },
          {
            name: "Business",
            value: 95,
            maxValue: 100,
            description: "Entrepreneurial skills",
          },
          {
            name: "Global Reach",
            value: 85,
            maxValue: 100,
            description: "Worldwide influence",
          },
        ],
        image: "https://example.com/cz.png",
        power: 80,
        health: 85,
        mana: 75,
      },
    ];
  }

  async createHero(
    walletAddress: string,
    heroData: Partial<Hero>
  ): Promise<Hero> {
    try {
      console.log("Creating hero for wallet:", walletAddress);

      const newHero: Hero = {
        id: `hero_${Date.now()}`,
        name: heroData.name || "New Hero",
        level: 1,
        xp: 0,
        rarity: heroData.rarity || "common",
        traits: heroData.traits || [],
        image: heroData.image || "https://example.com/default-hero.png",
        power: heroData.power || 50,
        health: heroData.health || 100,
        mana: heroData.mana || 50,
      };

      // For now, just log the hero creation
      // In production, this would be stored on Honeycomb
      console.log("Hero created:", newHero);
      console.log("In production, this would be stored on Honeycomb");

      return newHero;
    } catch (error) {
      console.error("Error creating hero:", error);
      throw error;
    }
  }

  async updateHeroTraits(
    heroId: string,
    traitUpdates: Partial<HeroTrait>[]
  ): Promise<Hero> {
    try {
      console.log(`Updating hero ${heroId} traits:`, traitUpdates);

      // In a real implementation, this would update character data on Honeycomb
      // For now, we'll simulate the update
      const hero =
        this.getStarterHeroes().find((h) => h.id === heroId) ||
        this.getStarterHeroes()[0];

      if (hero) {
        // Apply trait updates
        traitUpdates.forEach((update) => {
          const trait = hero.traits.find((t) => t.name === update.name);
          if (trait && update.value !== undefined) {
            trait.value = Math.min(update.value, trait.maxValue);
          }
        });

        // Recalculate power
        hero.power = this.calculateHeroPower(hero);
      }

      return hero;
    } catch (error) {
      console.error("Error updating hero traits:", error);
      throw error;
    }
  }

  async completeQuest(
    walletAddress: string,
    questId: string,
    xpGained: number
  ): Promise<{ success: boolean; xpGained: number }> {
    try {
      console.log(
        `Quest ${questId} completed by ${walletAddress}, XP gained: ${xpGained}`
      );

      // Update player stats on Honeycomb
      try {
        await this.updatePlayerStats(walletAddress, {
          xp: xpGained,
          questsCompleted: 1,
        });
        console.log("Quest completion recorded");
      } catch (error) {
        console.error("Failed to record quest completion:", error);
      }

      return { success: true, xpGained };
    } catch (error) {
      console.error("Error completing quest:", error);
      return { success: false, xpGained: 0 };
    }
  }

  async updatePlayerStats(
    walletAddress: string,
    updates: Partial<PlayerProfile>
  ): Promise<PlayerProfile> {
    try {
      console.log(`Updating player ${walletAddress} stats:`, updates);

      // For now, just log the updates
      // In production, this would update data on Honeycomb
      console.log("Player stats updated:", updates);
      console.log("In production, this would be stored on Honeycomb");

      // Return updated profile
      return this.createLocalProfile(walletAddress);
    } catch (error) {
      console.error("Error updating player stats:", error);
      throw error;
    }
  }

  // Helper method to calculate hero power based on traits and level
  calculateHeroPower(hero: Hero): number {
    const basePower = hero.power;
    const traitBonus = hero.traits.reduce(
      (sum, trait) => sum + (trait.value / trait.maxValue) * 10,
      0
    );
    const levelBonus = (hero.level - 1) * 5;

    return Math.floor(basePower + traitBonus + levelBonus);
  }
}
