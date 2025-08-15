import createEdgeClient from "@honeycomb-protocol/edge-client";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { storageManager } from "./storage";
import toast from "react-hot-toast";

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
      console.log("Creating player profile for wallet:", walletAddress);

      // Check if profile already exists in storage
      const existingProfile = await storageManager.loadPlayerProfile(
        walletAddress
      );
      if (existingProfile) {
        toast.success("Existing profile loaded!");
        return existingProfile;
      }

      // Create new profile
      const newProfile: PlayerProfile = {
        id: `honeycomb_${walletAddress.slice(0, 8)}`,
        wallet: walletAddress,
        name: `Tactical_${walletAddress.slice(0, 8)}`,
        level: 1,
        xp: 10000, // Give new wallets a huge XP balance to start with
        heroes: [],
        battlesWon: 0,
        battlesLost: 0,
        questsCompleted: 0,
        reputation: 100,
        lastActive: Date.now(),
      };

      // Try to create on Honeycomb first
      try {
        const { createNewUserWithProfileTransaction: txResponse } =
          await client.createNewUserWithProfileTransaction({
            project: this.projectAddress,
            wallet: walletAddress,
            payer: walletAddress,
            profileIdentity: "main",
            userInfo: {
              name: newProfile.name,
              bio: "Tactical Crypto Arena Operator",
              pfp: "https://example.com/default-avatar.png",
            },
          });

        console.log("Honeycomb profile creation transaction:", txResponse);
        toast.success("Profile created on blockchain!");
      } catch (error) {
        console.error("Failed to create profile on Honeycomb:", error);
        toast("Profile created locally (blockchain unavailable)", {
          icon: "⚠️",
          style: {
            background: "#92400e",
            color: "#fef3c7",
            border: "1px solid #f59e0b",
          },
        });
      }

      // Save to local storage
      await storageManager.savePlayerProfile(newProfile);

      return newProfile;
    } catch (error) {
      console.error("Error creating player profile:", error);
      toast.error("Failed to create player profile");
      throw error;
    }
  }

  async getPlayerHeroes(walletAddress: string): Promise<Hero[]> {
    try {
      console.log("Fetching heroes for wallet:", walletAddress);

      // Try to load from storage first
      const storedHeroes = await storageManager.loadHeroes(walletAddress);
      if (storedHeroes.length > 0) {
        toast.success("Heroes loaded from storage");
        return storedHeroes;
      }

      // If no stored heroes, return starter heroes
      const starterHeroes = this.getStarterHeroes();

      // Save starter heroes to storage
      await storageManager.saveHeroes(walletAddress, starterHeroes);

      toast.success("Starter heroes assigned!");
      return starterHeroes;
    } catch (error) {
      console.error("Error fetching heroes:", error);
      toast.error("Failed to load heroes");
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

      // Get current heroes and add new one
      const currentHeroes = await this.getPlayerHeroes(walletAddress);
      const updatedHeroes = [...currentHeroes, newHero];

      // Save updated hero collection
      await storageManager.saveHeroes(walletAddress, updatedHeroes);

      toast.success(`New hero "${newHero.name}" created!`);
      return newHero;
    } catch (error) {
      console.error("Error creating hero:", error);
      toast.error("Failed to create hero");
      throw error;
    }
  }

  async updateHeroTraits(
    walletAddress: string,
    heroId: string,
    traitUpdates: Partial<HeroTrait>[]
  ): Promise<Hero> {
    try {
      console.log(`Updating hero ${heroId} traits:`, traitUpdates);

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
      await storageManager.saveHeroes(walletAddress, currentHeroes);

      toast.success("Hero traits updated!");
      return hero;
    } catch (error) {
      console.error("Error updating hero traits:", error);
      toast.error("Failed to update hero traits");
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

      // Load current profile
      const profile = await storageManager.loadPlayerProfile(walletAddress);
      if (!profile) {
        throw new Error("Player profile not found");
      }

      // Update profile
      const updatedProfile: PlayerProfile = {
        ...profile,
        xp: profile.xp + xpGained,
        questsCompleted: profile.questsCompleted + 1,
        lastActive: Date.now(),
      };

      // Check for level up
      const newLevel = Math.floor(updatedProfile.xp / 100) + 1;
      if (newLevel > updatedProfile.level) {
        updatedProfile.level = newLevel;
        toast.success(`Level up! You are now level ${newLevel}!`);
      }

      // Save updated profile
      await storageManager.savePlayerProfile(updatedProfile);

      toast.success(`Quest completed! +${xpGained} XP gained`);
      return { success: true, xpGained };
    } catch (error) {
      console.error("Error completing quest:", error);
      toast.error("Failed to complete quest");
      return { success: false, xpGained: 0 };
    }
  }

  async updatePlayerStats(
    walletAddress: string,
    updates: Partial<PlayerProfile>
  ): Promise<PlayerProfile> {
    try {
      console.log(`Updating player ${walletAddress} stats:`, updates);

      // Load current profile
      const profile = await storageManager.loadPlayerProfile(walletAddress);
      if (!profile) {
        throw new Error("Player profile not found");
      }

      // Update profile
      const updatedProfile: PlayerProfile = {
        ...profile,
        ...updates,
        lastActive: Date.now(),
      };

      // Save updated profile
      await storageManager.savePlayerProfile(updatedProfile);

      toast.success("Player stats updated!");
      return updatedProfile;
    } catch (error) {
      console.error("Error updating player stats:", error);
      toast.error("Failed to update player stats");
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
        storageManager.savePlayerProfile(profile),
        storageManager.saveHeroes(walletAddress, heroes),
      ]);

      toast.success("Game progress saved!");
      return true;
    } catch (error) {
      console.error("Failed to save game data:", error);
      toast.error("Failed to save game progress");
      return false;
    }
  }

  // Method to load all game data
  async loadGameData(
    walletAddress: string
  ): Promise<{ profile: PlayerProfile | null; heroes: Hero[] }> {
    try {
      const [profile, heroes] = await Promise.all([
        storageManager.loadPlayerProfile(walletAddress),
        storageManager.loadHeroes(walletAddress),
      ]);

      return { profile, heroes };
    } catch (error) {
      console.error("Failed to load game data:", error);
      toast.error("Failed to load game progress");
      return { profile: null, heroes: [] };
    }
  }
}
