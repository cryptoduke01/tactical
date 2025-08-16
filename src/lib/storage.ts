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
      const profileKey = `${STORAGE_KEYS.PLAYER_PROFILE}_${walletAddress}`;
      const heroesKey = `${STORAGE_KEYS.HEROES}_${walletAddress}`;
      const gameStateKey = `${STORAGE_KEYS.GAME_STATE}_${walletAddress}`;

      localStorage.removeItem(profileKey);
      localStorage.removeItem(heroesKey);
      localStorage.removeItem(gameStateKey);
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
    return lastSave ? new Date(lastSave).getTime() : 0;
  }

  // Check if data exists for wallet
  hasDataForWallet(walletAddress: string): boolean {
    const profileKey = `${STORAGE_KEYS.PLAYER_PROFILE}_${walletAddress}`;
    const profile = localStorage.getItem(profileKey);
    return profile !== null;
  }

  // Honeycomb integration methods (stubbed for now)
  private async saveToHoneycomb(profile: PlayerProfile): Promise<void> {
    // This would require actual Honeycomb blockchain transaction
    // For now, we'll simulate the process

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would:
    // 1. Create a transaction to update the user profile
    // 2. Send it to the wallet for signing
    // 3. Submit to Solana network
    // 4. Wait for confirmation
  }

  private async loadFromHoneycomb(
    walletAddress: string
  ): Promise<PlayerProfile | null> {
    // This would query the Honeycomb blockchain

    // Simulate blockchain query delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would:
    // 1. Query Honeycomb for user profile
    // 2. Parse blockchain data
    // 3. Return profile if found

    return null; // No profile found on blockchain
  }

  private async saveHeroesToHoneycomb(
    walletAddress: string,
    heroes: Hero[]
  ): Promise<void> {
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  private async loadHeroesFromHoneycomb(
    walletAddress: string
  ): Promise<Hero[]> {
    // Simulate blockchain query
    await new Promise((resolve) => setTimeout(resolve, 800));

    return []; // No heroes found on blockchain
  }

  // Export data for backup
  exportData(walletAddress: string): string {
    try {
      const profileKey = `${STORAGE_KEYS.PLAYER_PROFILE}_${walletAddress}`;
      const heroesKey = `${STORAGE_KEYS.HEROES}_${walletAddress}`;
      const gameStateKey = `${STORAGE_KEYS.GAME_STATE}_${walletAddress}`;

      const data = {
        playerProfile: localStorage.getItem(profileKey),
        heroes: localStorage.getItem(heroesKey),
        gameState: localStorage.getItem(gameStateKey),
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
  importData(backupData: string, walletAddress: string): boolean {
    try {
      const data = JSON.parse(backupData);
      const profileKey = `${STORAGE_KEYS.PLAYER_PROFILE}_${walletAddress}`;
      const heroesKey = `${STORAGE_KEYS.HEROES}_${walletAddress}`;
      const gameStateKey = `${STORAGE_KEYS.GAME_STATE}_${walletAddress}`;

      if (data.playerProfile) {
        localStorage.setItem(profileKey, data.playerProfile);
      }

      if (data.heroes) {
        localStorage.setItem(heroesKey, data.heroes);
      }

      if (data.gameState) {
        localStorage.setItem(gameStateKey, data.gameState);
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
