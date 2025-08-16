import {
  initializeVerxio,
  createLoyaltyProgram,
  issueLoyaltyPass,
  awardLoyaltyPoints,
  getAssetData,
} from "@verxioprotocol/core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  publicKey,
  keypairIdentity,
  generateSigner,
} from "@metaplex-foundation/umi";

// Devnet configuration
const RPC_URL = "https://api.devnet.solana.com";

// Generate a valid program authority for devnet
const generateDevnetAuthority = () => {
  // For devnet testing, use a placeholder that will be replaced
  return "devnet_program_authority_placeholder";
};

export interface VerxioLoyaltyProgram {
  collectionAddress: string;
  updateAuthority: string;
  name: string;
  tiers: Array<{
    name: string;
    xpRequired: number;
    rewards: string[];
  }>;
  pointsPerAction: Record<string, number>;
}

export interface VerxioLoyaltyPass {
  publicKey: string;
  name: string;
  uri: string;
  owner: string;
  xp: number;
  currentTier: string;
  rewards: string[];
}

class VerxioManager {
  private static instance: VerxioManager;
  private umi: any;
  private context: any;
  private loyaltyProgram: VerxioLoyaltyProgram | null = null;
  private isInitialized = false;
  private programAuthority: any = null;

  private constructor() {
    this.initializeVerxio();
  }

  public static getInstance(): VerxioManager {
    if (!VerxioManager.instance) {
      VerxioManager.instance = new VerxioManager();
    }
    return VerxioManager.instance;
  }

  private async initializeVerxio() {
    try {
      // Check if we're in a browser environment
      if (typeof window !== "undefined") {
        console.log(
          "Running in browser environment - Verxio Protocol will use fallback mode"
        );
        this.isInitialized = true;
        return;
      }

      // Create UMI instance for Solana devnet (Node.js only)
      this.umi = createUmi(RPC_URL);

      // Generate program authority for devnet
      this.programAuthority = generateDevnetAuthority();

      // Initialize Verxio protocol
      this.context = initializeVerxio(this.umi, this.programAuthority);

      // Set signer (will be set when wallet connects)
      console.log("Verxio Protocol initialized on devnet");
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Verxio Protocol:", error);
      // Set as initialized anyway for fallback mode
      this.isInitialized = true;
    }
  }

  // Set wallet signer
  public setSigner(signer: any) {
    if (this.umi && this.isInitialized) {
      this.umi.use(keypairIdentity(signer));
      console.log("Verxio signer set");
    }
  }

  // Create loyalty program for the game
  public async createGameLoyaltyProgram(): Promise<VerxioLoyaltyProgram | null> {
    if (!this.isInitialized) {
      console.error("Verxio not initialized");
      return null;
    }

    try {
      console.log("Creating game loyalty program...");

      // Check if we're in browser environment - use fallback
      if (typeof window !== "undefined") {
        console.log("Using browser fallback mode for loyalty program");

        this.loyaltyProgram = {
          collectionAddress: "browser_fallback_collection",
          updateAuthority: "browser_fallback_authority",
          name: "Tactical Crypto Arena",
          tiers: [
            { name: "Grind", xpRequired: 0, rewards: ["Basic access"] },
            {
              name: "Bronze",
              xpRequired: 500,
              rewards: ["2% XP bonus", "Basic vouchers"],
            },
            {
              name: "Silver",
              xpRequired: 1000,
              rewards: ["5% XP bonus", "Premium vouchers"],
            },
            {
              name: "Gold",
              xpRequired: 2000,
              rewards: ["10% XP bonus", "Legendary vouchers"],
            },
            {
              name: "Platinum",
              xpRequired: 5000,
              rewards: ["20% XP bonus", "Exclusive rewards"],
            },
          ],
          pointsPerAction: {
            battle_win: 100,
            battle_loss: 20,
            quest_complete: 50,
            hero_summon: 25,
            hero_customize: 10,
          },
        };

        console.log(
          "Loyalty program created (browser fallback):",
          this.loyaltyProgram
        );
        return this.loyaltyProgram;
      }

      // Node.js implementation would go here
      if (!this.context) {
        throw new Error("Verxio context not available");
      }

      const result = await createLoyaltyProgram(this.context, {
        loyaltyProgramName: "Tactical Crypto Arena",
        metadataUri: "https://arweave.net/game-metadata", // Placeholder
        programAuthority: this.context.programAuthority,
        metadata: {
          organizationName: "Tactical Crypto Arena",
          brandColor: "#9945FF",
        },
        tiers: [
          { name: "Grind", xpRequired: 0, rewards: ["Basic access"] },
          {
            name: "Bronze",
            xpRequired: 500,
            rewards: ["2% XP bonus", "Basic vouchers"],
          },
          {
            name: "Silver",
            xpRequired: 1000,
            rewards: ["5% XP bonus", "Premium vouchers"],
          },
          {
            name: "Gold",
            xpRequired: 2000,
            rewards: ["10% XP bonus", "Legendary vouchers"],
          },
          {
            name: "Platinum",
            xpRequired: 5000,
            rewards: ["20% XP bonus", "Exclusive rewards"],
          },
        ],
        pointsPerAction: {
          battle_win: 100,
          battle_loss: 20,
          quest_complete: 50,
          hero_summon: 25,
          hero_customize: 10,
        },
      });

      this.loyaltyProgram = {
        collectionAddress: result.collection.publicKey,
        updateAuthority:
          result.updateAuthority?.publicKey || result.collection.publicKey,
        name: "Tactical Crypto Arena",
        tiers: [
          { name: "Grind", xpRequired: 0, rewards: ["Basic access"] },
          {
            name: "Bronze",
            xpRequired: 500,
            rewards: ["2% XP bonus", "Basic vouchers"],
          },
          {
            name: "Silver",
            xpRequired: 1000,
            rewards: ["5% XP bonus", "Premium vouchers"],
          },
          {
            name: "Gold",
            xpRequired: 2000,
            rewards: ["10% XP bonus", "Legendary vouchers"],
          },
          {
            name: "Platinum",
            xpRequired: 5000,
            rewards: ["20% XP bonus", "Exclusive rewards"],
          },
        ],
        pointsPerAction: {
          battle_win: 100,
          battle_loss: 20,
          quest_complete: 50,
          hero_summon: 25,
          hero_customize: 10,
        },
      };

      console.log("Loyalty program created:", this.loyaltyProgram);
      return this.loyaltyProgram;
    } catch (error) {
      console.error("Failed to create loyalty program:", error);
      return null;
    }
  }

  // Issue loyalty pass to player
  public async issuePlayerLoyaltyPass(
    playerAddress: string,
    playerName: string
  ): Promise<VerxioLoyaltyPass | null> {
    if (!this.isInitialized || !this.loyaltyProgram) {
      console.error("Verxio not initialized or loyalty program not created");
      return null;
    }

    try {
      console.log(`Issuing loyalty pass to ${playerName}...`);

      // Check if we're in browser environment - use fallback
      if (typeof window !== "undefined") {
        console.log("Using browser fallback mode for loyalty pass");

        const loyaltyPass: VerxioLoyaltyPass = {
          publicKey: `browser_pass_${Date.now()}`,
          name: `${playerName}'s Arena Pass`,
          uri: "https://arweave.net/loyalty-pass-metadata", // Placeholder URI
          owner: playerAddress,
          xp: 0,
          currentTier: "Grind",
          rewards: ["Basic access"],
        };

        console.log("Loyalty pass issued (browser fallback):", loyaltyPass);
        return loyaltyPass;
      }

      // Node.js implementation
      if (!this.context) {
        throw new Error("Verxio context not available");
      }

      const result = await issueLoyaltyPass(this.context, {
        collectionAddress: publicKey(this.loyaltyProgram.collectionAddress),
        recipient: publicKey(playerAddress),
        passName: `${playerName}'s Arena Pass`,
        updateAuthority: this.context.programAuthority,
        organizationName: "Tactical Crypto Arena",
      });

      const loyaltyPass: VerxioLoyaltyPass = {
        publicKey: result.asset.publicKey,
        name: `${playerName}'s Arena Pass`,
        uri: "https://arweave.net/loyalty-pass-metadata", // Placeholder URI
        owner: playerAddress,
        xp: 0,
        currentTier: "Grind",
        rewards: ["Basic access"],
      };

      console.log("Loyalty pass issued:", loyaltyPass);
      return loyaltyPass;
    } catch (error) {
      console.error("Failed to issue loyalty pass:", error);
      return null;
    }
  }

  // Award XP for game actions
  public async awardGameXP(
    passAddress: string,
    action: string,
    multiplier: number = 1
  ): Promise<{ success: boolean; newXP: number; newTier: string } | null> {
    if (!this.isInitialized) {
      console.error("Verxio not initialized");
      return null;
    }

    try {
      console.log(`Awarding XP for action: ${action}`);

      // Check if we're in browser environment - use fallback
      if (typeof window !== "undefined") {
        console.log("Using browser fallback mode for XP awarding");

        // Simulate XP calculation
        const baseXP =
          {
            battle_win: 100,
            battle_loss: 20,
            quest_complete: 50,
            hero_summon: 25,
            hero_customize: 10,
          }[action] || 10;

        const totalXP = baseXP * multiplier;

        return {
          success: true,
          newXP: totalXP,
          newTier: "Grind", // Default tier
        };
      }

      // Node.js implementation
      if (!this.context) {
        throw new Error("Verxio context not available");
      }

      const result = await awardLoyaltyPoints(this.context, {
        passAddress: publicKey(passAddress),
        action,
        signer: this.context.programAuthority,
        multiplier,
      });

      // Get updated asset data
      const assetData = await getAssetData(
        this.context,
        publicKey(passAddress)
      );

      return {
        success: true,
        newXP: result.points,
        newTier: "Grind", // Default tier since newTier might not be available
      };
    } catch (error) {
      console.error("Failed to award XP:", error);
      return null;
    }
  }

  // Get loyalty pass data
  public async getLoyaltyPassData(
    passAddress: string
  ): Promise<VerxioLoyaltyPass | null> {
    if (!this.isInitialized) {
      console.error("Verxio not initialized");
      return null;
    }

    try {
      // Check if we're in browser environment - use fallback
      if (typeof window !== "undefined") {
        console.log("Using browser fallback mode for loyalty pass data");

        // Return mock data for browser
        return {
          publicKey: passAddress,
          name: "Browser Loyalty Pass",
          uri: "https://arweave.net/placeholder",
          owner: "browser_user",
          xp: 0,
          currentTier: "Grind",
          rewards: ["Basic access"],
        };
      }

      // Node.js implementation
      if (!this.context) {
        throw new Error("Verxio context not available");
      }

      const assetData = await getAssetData(
        this.context,
        publicKey(passAddress)
      );

      if (!assetData) {
        console.error("Asset data not found");
        return null;
      }

      return {
        publicKey: passAddress,
        name: assetData.name || "Unknown Pass",
        uri: assetData.uri || "https://arweave.net/placeholder",
        owner: assetData.owner || "Unknown",
        xp: assetData.xp || 0,
        currentTier: assetData.currentTier || "Grind",
        rewards: assetData.rewards || ["Basic access"],
      };
    } catch (error) {
      console.error("Failed to get loyalty pass data:", error);
      return null;
    }
  }

  // Get current loyalty program
  public getLoyaltyProgram(): VerxioLoyaltyProgram | null {
    return this.loyaltyProgram;
  }

  // Check if Verxio is ready
  public isReady(): boolean {
    // In browser environment, always return true for fallback mode
    if (typeof window !== "undefined") {
      return true;
    }

    // In Node.js environment, check for proper initialization
    return this.isInitialized && this.context !== null;
  }
}

export const verxioManager = VerxioManager.getInstance();
