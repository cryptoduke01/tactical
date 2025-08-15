import { PlayerProfile, Hero } from "./heroManager";
import toast from "react-hot-toast";

// Storage keys
const STORAGE_KEYS = {
  PLAYER_PROFILE: "tactical_crypto_arena_player_profile",
  HEROES: "tactical_crypto_arena_heroes",
  GAME_STATE: "tactical_crypto_arena_game_state",
  LAST_SAVE: "tactical_crypto_arena_last_save",
};

// Game state interface
export interface GameState {
  lastActive: number;
  totalPlayTime: number;
  achievements: string[];
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    quality: "low" | "medium" | "high";
  };
}

// Storage manager class
export class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Save player profile
  async savePlayerProfile(profile: PlayerProfile): Promise<boolean> {
    try {
      // Save to local storage
      localStorage.setItem(
        STORAGE_KEYS.PLAYER_PROFILE,
        JSON.stringify(profile)
      );

      // Update last save timestamp
      localStorage.setItem(STORAGE_KEYS.LAST_SAVE, Date.now().toString());

      // Try to save to Honeycomb (this would require actual blockchain transaction)
      await this.saveToHoneycomb(profile);

      toast.success("Progress saved successfully!");
      return true;
    } catch (error) {
      console.error("Failed to save player profile:", error);
      toast.error("Failed to save progress. Using local backup.");
      return false;
    }
  }

  // Load player profile
  async loadPlayerProfile(
    walletAddress: string
  ): Promise<PlayerProfile | null> {
    try {
      // Try to load from local storage first
      const localProfile = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);

      if (localProfile) {
        const profile = JSON.parse(localProfile);

        // Check if this profile belongs to the current wallet
        if (profile.wallet === walletAddress) {
          toast.success("Progress loaded from local storage");
          return profile;
        }
      }

      // Try to load from Honeycomb
      const honeycombProfile = await this.loadFromHoneycomb(walletAddress);
      if (honeycombProfile) {
        // Save to local storage for future use
        await this.savePlayerProfile(honeycombProfile);
        toast.success("Progress loaded from blockchain");
        return honeycombProfile;
      }

      // No profile found
      return null;
    } catch (error) {
      console.error("Failed to load player profile:", error);
      toast.error("Failed to load progress");
      return null;
    }
  }

  // Save heroes
  async saveHeroes(walletAddress: string, heroes: Hero[]): Promise<boolean> {
    try {
      const heroesData = {
        walletAddress,
        heroes,
        lastUpdated: Date.now(),
      };

      localStorage.setItem(STORAGE_KEYS.HEROES, JSON.stringify(heroesData));

      // Try to save to Honeycomb
      await this.saveHeroesToHoneycomb(walletAddress, heroes);

      toast.success("Hero collection saved!");
      return true;
    } catch (error) {
      console.error("Failed to save heroes:", error);
      toast.error("Failed to save heroes. Using local backup.");
      return false;
    }
  }

  // Load heroes
  async loadHeroes(walletAddress: string): Promise<Hero[]> {
    try {
      // Try local storage first
      const localHeroes = localStorage.getItem(STORAGE_KEYS.HEROES);

      if (localHeroes) {
        const heroesData = JSON.parse(localHeroes);
        if (heroesData.walletAddress === walletAddress) {
          return heroesData.heroes;
        }
      }

      // Try Honeycomb
      const honeycombHeroes = await this.loadHeroesFromHoneycomb(walletAddress);
      if (honeycombHeroes.length > 0) {
        await this.saveHeroes(walletAddress, honeycombHeroes);
        return honeycombHeroes;
      }

      // Return empty array if no heroes found
      return [];
    } catch (error) {
      console.error("Failed to load heroes:", error);
      toast.error("Failed to load heroes");
      return [];
    }
  }

  // Save game state
  async saveGameState(gameState: GameState): Promise<boolean> {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
      return true;
    } catch (error) {
      console.error("Failed to save game state:", error);
      return false;
    }
  }

  // Load game state
  async loadGameState(): Promise<GameState | null> {
    try {
      const gameState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      return gameState ? JSON.parse(gameState) : null;
    } catch (error) {
      console.error("Failed to load game state:", error);
      return null;
    }
  }

  // Clear all data for a wallet
  async clearData(walletAddress: string): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.PLAYER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.HEROES);
      localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
      localStorage.removeItem(STORAGE_KEYS.LAST_SAVE);

      toast.success("Game data cleared");
    } catch (error) {
      console.error("Failed to clear data:", error);
      toast.error("Failed to clear data");
    }
  }

  // Get last save timestamp
  getLastSaveTime(): number {
    const lastSave = localStorage.getItem(STORAGE_KEYS.LAST_SAVE);
    return lastSave ? parseInt(lastSave) : 0;
  }

  // Check if data exists for wallet
  hasDataForWallet(walletAddress: string): boolean {
    const profile = localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE);
    if (!profile) return false;

    try {
      const parsedProfile = JSON.parse(profile);
      return parsedProfile.wallet === walletAddress;
    } catch {
      return false;
    }
  }

  // Honeycomb integration methods (stubbed for now)
  private async saveToHoneycomb(profile: PlayerProfile): Promise<void> {
    // This would require actual Honeycomb blockchain transaction
    // For now, we'll simulate the process
    console.log("Saving to Honeycomb blockchain:", profile);

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would:
    // 1. Create a transaction to update the user profile
    // 2. Send it to the wallet for signing
    // 3. Submit to Solana network
    // 4. Wait for confirmation

    console.log("Profile saved to Honeycomb (simulated)");
  }

  private async loadFromHoneycomb(
    walletAddress: string
  ): Promise<PlayerProfile | null> {
    // This would query the Honeycomb blockchain
    console.log("Loading from Honeycomb blockchain:", walletAddress);

    // Simulate blockchain query delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would:
    // 1. Query Honeycomb for user profile
    // 2. Parse blockchain data
    // 3. Return profile if found

    console.log("Profile loaded from Honeycomb (simulated)");
    return null; // No profile found on blockchain
  }

  private async saveHeroesToHoneycomb(
    walletAddress: string,
    heroes: Hero[]
  ): Promise<void> {
    console.log("Saving heroes to Honeycomb blockchain:", {
      walletAddress,
      heroesCount: heroes.length,
    });

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Heroes saved to Honeycomb (simulated)");
  }

  private async loadHeroesFromHoneycomb(
    walletAddress: string
  ): Promise<Hero[]> {
    console.log("Loading heroes from Honeycomb blockchain:", walletAddress);

    // Simulate blockchain query
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Heroes loaded from Honeycomb (simulated)");
    return []; // No heroes found on blockchain
  }

  // Export data for backup
  exportData(walletAddress: string): string {
    try {
      const data = {
        playerProfile: localStorage.getItem(STORAGE_KEYS.PLAYER_PROFILE),
        heroes: localStorage.getItem(STORAGE_KEYS.HEROES),
        gameState: localStorage.getItem(STORAGE_KEYS.GAME_STATE),
        exportDate: new Date().toISOString(),
        walletAddress,
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Failed to export data:", error);
      throw error;
    }
  }

  // Import data from backup
  importData(backupData: string): boolean {
    try {
      const data = JSON.parse(backupData);

      if (data.playerProfile) {
        localStorage.setItem(STORAGE_KEYS.PLAYER_PROFILE, data.playerProfile);
      }

      if (data.heroes) {
        localStorage.setItem(STORAGE_KEYS.HEROES, data.heroes);
      }

      if (data.gameState) {
        localStorage.setItem(STORAGE_KEYS.GAME_STATE, data.gameState);
      }

      toast.success("Backup data imported successfully!");
      return true;
    } catch (error) {
      console.error("Failed to import backup data:", error);
      toast.error("Failed to import backup data");
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();
