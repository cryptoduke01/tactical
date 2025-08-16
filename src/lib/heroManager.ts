import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { storageManager } from "./storage";
import { showSuccess, showError, showWarning } from "./toastManager";
import { verxioManager, VerxioLoyaltyPass } from "./verxioManager";

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
  walletAddress: string;
  name: string;
  level: number;
  xp: number;
  battlesWon: number;
  battlesLost: number;
  questsCompleted: number;
  totalScore: number;
  gamesPlayed: number;
  averageReactionTime: number;
  traits: HeroTrait[];
  createdAt: string;
  lastActive: string;
  loyaltyPass?: VerxioLoyaltyPass; // Verxio loyalty pass
  verxioTier?: string; // Current Verxio tier
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
      this.projectAddress = "dev_project_placeholder";
    } catch (error) {
      console.error("Failed to initialize project:", error);
      // Fallback to placeholder
      this.projectAddress = "fallback_project";
    }
  }

  async createPlayerProfile(walletAddress: string): Promise<PlayerProfile> {
    try {
      // Try to create user in Honeycomb (stubbed for now)

      // Initialize Verxio Protocol if not ready
      if (!verxioManager.isReady()) {
        await verxioManager.createGameLoyaltyProgram();
      }

      // Create Verxio loyalty pass for the player
      let loyaltyPass: VerxioLoyaltyPass | undefined;
      if (verxioManager.isReady()) {
        try {
          const pass = await verxioManager.issuePlayerLoyaltyPass(
            walletAddress,
            `Tactical_${walletAddress.slice(0, 8)}`
          );
          if (pass) {
            loyaltyPass = pass;
            showSuccess(
              "Loyalty Pass Created",
              "Your on-chain loyalty pass has been issued!"
            );
          }
        } catch (error) {
          // Silent fail for Verxio
        }
      }

      // Create local profile with 10,000 XP for new wallets
      const profile: PlayerProfile = {
        id: walletAddress,
        name: `Tactical_${walletAddress.slice(0, 8)}`,
        walletAddress,
        xp: 10000, // Give new wallets 10k XP
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
        loyaltyPass,
        verxioTier: loyaltyPass?.currentTier || "Grind",
      };

      // Save to local storage
      storageManager.savePlayerProfile(profile);

      return profile;
    } catch (error) {
      console.error("Error creating player profile:", error);

      // Fallback to local profile creation
      const fallbackProfile: PlayerProfile = {
        id: walletAddress,
        name: `Tactical_${walletAddress.slice(0, 8)}`,
        walletAddress,
        xp: 10000, // Give new wallets 10k XP
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

      storageManager.savePlayerProfile(fallbackProfile);
      return fallbackProfile;
    }
  }

  // Save player profile
  async savePlayerProfile(profile: PlayerProfile): Promise<void> {
    try {
      storageManager.savePlayerProfile(profile);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  }

  // Update player XP
  async updatePlayerXP(walletAddress: string, xpChange: number): Promise<void> {
    try {
      const profile = await this.getPlayerProfile(walletAddress);
      if (profile) {
        profile.xp = Math.max(0, profile.xp + xpChange); // Prevent negative XP
        profile.lastActive = new Date().toISOString();
        storageManager.savePlayerProfile(profile);

        // Update XP on-chain through Verxio Protocol
        if (profile.loyaltyPass && verxioManager.isReady()) {
          try {
            const action = xpChange > 0 ? "quest_complete" : "hero_action";
            const result = await verxioManager.awardGameXP(
              profile.loyaltyPass.publicKey,
              action,
              Math.abs(xpChange) / 10 // Convert to Verxio points (1 XP = 0.1 Verxio points)
            );

            if (result?.success) {
              profile.verxioTier = result.newTier;
              storageManager.savePlayerProfile(profile);
            }
          } catch (error) {
            // Silent fail for Verxio
          }
        }
      }
    } catch (error) {
      console.error("Error updating player XP:", error);
    }
  }

  // Get player profile
  async getPlayerProfile(walletAddress: string): Promise<PlayerProfile | null> {
    try {
      // Try to load from storage first
      const storedProfile = storageManager.loadPlayerProfile(walletAddress);
      if (storedProfile) {
        return storedProfile;
      }

      // If no stored profile, create a new one
      return await this.createPlayerProfile(walletAddress);
    } catch (error) {
      console.error("Failed to get player profile:", error);
      return null;
    }
  }

  // Get player heroes
  async getPlayerHeroes(walletAddress: string): Promise<Hero[]> {
    try {
      // Try to load from storage first
      const storedHeroes = storageManager.loadHeroes(walletAddress);
      if (storedHeroes.length > 0) {
        return storedHeroes;
      }

      // If no stored heroes, return empty array
      return [];
    } catch (error) {
      console.error("Failed to get player heroes:", error);
      return [];
    }
  }

  // Save player heroes
  async savePlayerHeroes(walletAddress: string, heroes: Hero[]): Promise<void> {
    try {
      storageManager.saveHeroes(walletAddress, heroes);
    } catch (error) {
      console.error("Failed to save heroes:", error);
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
      {
        id: "raj",
        name: "Raj Gokal",
        level: 1,
        xp: 0,
        rarity: "legendary",
        traits: [
          {
            name: "Solana Leadership",
            value: 95,
            maxValue: 100,
            description: "Solana co-founder and COO",
          },
          {
            name: "Strategic Vision",
            value: 90,
            maxValue: 100,
            description: "Business development expert",
          },
          {
            name: "Ecosystem Building",
            value: 95,
            maxValue: 100,
            description: "Community growth specialist",
          },
        ],
        image: "https://example.com/raj.png",
        power: 95,
        health: 90,
        mana: 90,
      },
      {
        id: "anatoly",
        name: "Anatoly Yakovenko",
        level: 1,
        xp: 0,
        rarity: "legendary",
        traits: [
          {
            name: "Technical Innovation",
            value: 100,
            maxValue: 100,
            description: "Solana founder and CEO",
          },
          {
            name: "Blockchain Architecture",
            value: 95,
            maxValue: 100,
            description: "PoH consensus inventor",
          },
          {
            name: "Performance",
            value: 100,
            maxValue: 100,
            description: "65k TPS architect",
          },
        ],
        image: "https://example.com/anatoly.png",
        power: 100,
        health: 95,
        mana: 100,
      },
      {
        id: "greg",
        name: "Greg Fitzgerald",
        level: 1,
        xp: 0,
        rarity: "epic",
        traits: [
          {
            name: "Core Development",
            value: 90,
            maxValue: 100,
            description: "Solana core contributor",
          },
          {
            name: "Rust Programming",
            value: 95,
            maxValue: 100,
            description: "Systems programming expert",
          },
          {
            name: "Performance Optimization",
            value: 85,
            maxValue: 100,
            description: "Low-latency specialist",
          },
        ],
        image: "https://example.com/greg.png",
        power: 85,
        health: 80,
        mana: 90,
      },
    ];
  }

  async createHero(
    walletAddress: string,
    heroData: Partial<Hero>
  ): Promise<Hero> {
    try {
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

      // Get current heroes and add new one
      const currentHeroes = await this.getPlayerHeroes(walletAddress);
      const updatedHeroes = [...currentHeroes, newHero];

      // Save updated hero collection
      await this.savePlayerHeroes(walletAddress, updatedHeroes);

      showSuccess(
        "Hero Created",
        `New hero "${newHero.name}" created successfully!`
      );
      return newHero;
    } catch (error) {
      console.error("Error creating hero:", error);
      showError("Hero Creation Failed", "Failed to create hero");
      throw error;
    }
  }

  async updateHeroTraits(
    walletAddress: string,
    heroId: string,
    traitUpdates: Partial<HeroTrait>[]
  ): Promise<Hero> {
    try {
      // Get current heroes
      const currentHeroes = await this.getPlayerHeroes(walletAddress);
      const heroIndex = currentHeroes.findIndex((h) => h.id === heroId);

      if (heroIndex === -1) {
        throw new Error("Hero not found");
      }

      const hero = currentHeroes[heroIndex];

      // Apply trait updates
      traitUpdates.forEach((update) => {
        const trait = hero.traits.find((t) => t.name === update.name);
        if (trait && update.value !== undefined) {
          trait.value = Math.min(update.value, trait.maxValue);
        }
      });

      // Recalculate power
      hero.power = this.calculateHeroPower(hero);

      // Save updated heroes
      await this.savePlayerHeroes(walletAddress, currentHeroes);

      showSuccess("Hero Updated", "Hero traits updated successfully!");
      return hero;
    } catch (error) {
      console.error("Error updating hero traits:", error);
      showError("Trait Update Failed", "Failed to update hero traits");
      throw error;
    }
  }

  async completeQuest(
    walletAddress: string,
    questId: string,
    xpGained: number
  ): Promise<{ success: boolean; xpGained: number }> {
    try {
      // Load current profile
      const profile = await this.getPlayerProfile(walletAddress);
      if (!profile) {
        throw new Error("Player profile not found");
      }

      // Update profile
      const updatedProfile: PlayerProfile = {
        ...profile,
        xp: profile.xp + xpGained,
        questsCompleted: profile.questsCompleted + 1,
        lastActive: new Date().toISOString(),
      };

      // Check for level up
      const newLevel = Math.floor(updatedProfile.xp / 100) + 1;
      if (newLevel > updatedProfile.level) {
        updatedProfile.level = newLevel;
        showSuccess(
          "Level Up!",
          `Congratulations! You are now level ${newLevel}!`
        );
      }

      // Save updated profile
      await this.savePlayerProfile(updatedProfile);

      showSuccess(
        "Quest Completed",
        `Quest completed successfully! +${xpGained} XP gained`
      );
      return { success: true, xpGained };
    } catch (error) {
      console.error("Error completing quest:", error);
      showError("Quest Completion Failed", "Failed to complete quest");
      return { success: false, xpGained: 0 };
    }
  }

  async updatePlayerStats(
    walletAddress: string,
    updates: Partial<PlayerProfile>
  ): Promise<PlayerProfile> {
    try {
      // Load current profile
      const profile = await this.getPlayerProfile(walletAddress);
      if (!profile) {
        throw new Error("Player profile not found");
      }

      // Update profile
      const updatedProfile: PlayerProfile = {
        ...profile,
        ...updates,
        lastActive: new Date().toISOString(),
      };

      // Save updated profile
      await this.savePlayerProfile(updatedProfile);

      showSuccess("Stats Updated", "Player stats updated successfully!");
      return updatedProfile;
    } catch (error) {
      console.error("Error updating player stats:", error);
      showError("Stats Update Failed", "Failed to update player stats");
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

  // Method to save all game data
  async saveGameData(
    walletAddress: string,
    profile: PlayerProfile,
    heroes: Hero[]
  ): Promise<boolean> {
    try {
      await Promise.all([
        this.savePlayerProfile(profile),
        this.savePlayerHeroes(walletAddress, heroes),
      ]);

      showSuccess("Game Saved", "Game progress saved successfully!");
      return true;
    } catch (error) {
      console.error("Failed to save game data:", error);
      showError("Save Failed", "Failed to save game progress");
      return false;
    }
  }

  // Method to load all game data
  async loadGameData(
    walletAddress: string
  ): Promise<{ profile: PlayerProfile | null; heroes: Hero[] }> {
    try {
      const [profile, heroes] = await Promise.all([
        this.getPlayerProfile(walletAddress),
        this.getPlayerHeroes(walletAddress),
      ]);

      return { profile, heroes };
    } catch (error) {
      console.error("Failed to load game data:", error);
      showError("Load Failed", "Failed to load game progress");
      return { profile: null, heroes: [] };
    }
  }
}
