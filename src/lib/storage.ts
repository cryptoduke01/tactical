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

  // Save player profile with wallet address as key
  savePlayerProfile(profile: PlayerProfile): void {
    try {
      const key = `${STORAGE_KEYS.PLAYER_PROFILE}_${profile.walletAddress}`;
      localStorage.setItem(key, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVE, new Date().toISOString());
      console.log(`Profile saved for wallet: ${profile.walletAddress}`);
    } catch (error) {
      console.error("Failed to save player profile:", error);
    }
  }

  // Load player profile by wallet address
  loadPlayerProfile(walletAddress: string): PlayerProfile | null {
    try {
      const key = `${STORAGE_KEYS.PLAYER_PROFILE}_${walletAddress}`;
      const data = localStorage.getItem(key);
      if (data) {
        const profile = JSON.parse(data);
        console.log(`Profile loaded for wallet: ${walletAddress}`);
        return profile;
      }
      return null;
    } catch (error) {
      console.error("Failed to load player profile:", error);
      return null;
    }
  }

  // Save heroes with wallet address as key
  saveHeroes(walletAddress: string, heroes: Hero[]): void {
    try {
      const key = `${STORAGE_KEYS.HEROES}_${walletAddress}`;
      localStorage.setItem(key, JSON.stringify(heroes));
      console.log(`Heroes saved for wallet: ${walletAddress}`);
    } catch (error) {
      console.error("Failed to save heroes:", error);
    }
  }

  // Load heroes by wallet address
  loadHeroes(walletAddress: string): Hero[] {
    try {
      const key = `${STORAGE_KEYS.HEROES}_${walletAddress}`;
      const data = localStorage.getItem(key);
      if (data) {
        const heroes = JSON.parse(data);
        console.log(`Heroes loaded for wallet: ${walletAddress}`);
        return heroes;
      }
      return [];
    } catch (error) {
      console.error("Failed to load heroes:", error);
      return [];
    }
  }

  // Save game state with wallet address as key
  saveGameState(walletAddress: string, gameState: any): void {
    try {
      const key = `${STORAGE_KEYS.GAME_STATE}_${walletAddress}`;
      localStorage.setItem(key, JSON.stringify(gameState));
      console.log(`Game state saved for wallet: ${walletAddress}`);
    } catch (error) {
      console.error("Failed to save game state:", error);
    }
  }

  // Load game state by wallet address
  loadGameState(walletAddress: string): any {
    try {
      const key = `${STORAGE_KEYS.GAME_STATE}_${walletAddress}`;
      const data = localStorage.getItem(key);
      if (data) {
        const gameState = JSON.parse(data);
        console.log(`Game state loaded for wallet: ${walletAddress}`);
        return gameState;
      }
      return null;
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
