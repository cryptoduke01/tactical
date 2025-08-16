import { PlayerProfile, Hero } from "./heroManager";
import { showSuccess, showError } from "./toastManager";

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
      showSuccess("Profile Saved", "Player profile saved successfully!");
    } catch (error) {
      console.error("Failed to save player profile:", error);
      showError("Save Failed", "Failed to save player profile");
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
      showSuccess("Heroes Saved", "Hero collection saved successfully!");
    } catch (error) {
      console.error("Failed to save heroes:", error);
      showError("Save Failed", "Failed to save heroes");
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
      showSuccess("Game Saved", "Game state saved successfully!");
    } catch (error) {
      console.error("Failed to save game state:", error);
      showError("Save Failed", "Failed to save game state");
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

      showSuccess("Data Cleared", "Game data cleared successfully");
    } catch (error) {
      console.error("Failed to clear data:", error);
      showError("Clear Failed", "Failed to clear game data");
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

      showSuccess("Data Imported", "Backup data imported successfully!");
      return true;
    } catch (error) {
      console.error("Failed to import backup data:", error);
      showError("Import Failed", "Failed to import backup data");
      return false;
    }
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();
