'use client'
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { verxioManager, VerxioLoyaltyPass } from '@/lib/verxioManager';
import { PlayerProfile } from '@/lib/heroManager';
import { soundManager } from '@/lib/soundManager';
import { showSuccess, showError } from '@/lib/toastManager';

interface VerxioIntegrationProps {
  playerProfile: PlayerProfile | null;
}

export function VerxioIntegration({ playerProfile }: VerxioIntegrationProps) {
  const wallet = useWallet();
  const [loyaltyProgram, setLoyaltyProgram] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    // Check if loyalty program exists
    const program = verxioManager.getLoyaltyProgram();
    if (program) {
      setLoyaltyProgram(program);
    }
  }, []);

  const initializeProtocol = async () => {
    setIsInitializing(true);
    try {
      const program = await verxioManager.createGameLoyaltyProgram();
      if (program) {
        setLoyaltyProgram(program);
        showSuccess('Protocol Initialized', 'Verxio loyalty program created successfully!');
        soundManager.playSuccess();
      } else {
        showError('Initialization Failed', 'Failed to create loyalty program');
      }
    } catch (error) {
      showError('Initialization Error', 'Failed to initialize Verxio Protocol');
      console.error('Verxio initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const mintLoyaltyPass = async () => {
    if (!wallet.publicKey) {
      showError('Wallet Not Connected', 'Please connect your wallet first');
      return;
    }

    setIsMinting(true);
    try {
      // Simulate contract minting using connected wallet
      const pass = await verxioManager.issuePlayerLoyaltyPass(
        wallet.publicKey.toBase58(),
        `Tactical_${wallet.publicKey.toBase58().slice(0, 8)}`
      );

      if (pass) {
        showSuccess('Loyalty Pass Minted!', `Successfully minted pass for ${wallet.publicKey.toBase58().slice(0, 8)}...`);
        soundManager.playSuccess();

        // Refresh the page to show the new pass
        window.location.reload();
      } else {
        showError('Minting Failed', 'Failed to mint loyalty pass');
      }
    } catch (error) {
      showError('Minting Error', 'Failed to mint loyalty pass');
      console.error('Minting error:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="solana-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">🔗</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Verxio Protocol</h2>
            <p className="text-gray-300">On-chain loyalty infrastructure for Tactical Crypto Arena</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-purple-500/20 rounded-lg">
            <div className="text-2xl mb-2">🌐</div>
            <div className="text-purple-400 font-bold">Public Access</div>
            <div className="text-sm text-gray-300">Anyone can mint passes</div>
          </div>
          <div className="text-center p-4 bg-green-500/20 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-green-400 font-bold">Devnet Ready</div>
            <div className="text-sm text-gray-300">Test on Solana devnet</div>
          </div>
          <div className="text-center p-4 bg-cyan-500/20 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-cyan-400 font-bold">Loyalty Rewards</div>
            <div className="text-sm text-gray-300">Tier-based progression</div>
          </div>
        </div>
      </div>

      {/* Protocol Status */}
      <div className="solana-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Protocol Status</h3>

        {!loyaltyProgram ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚀</div>
            <p className="text-gray-300 mb-4">Verxio Protocol not initialized yet</p>
            <button
              onClick={initializeProtocol}
              disabled={isInitializing}
              className="solana-button"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Protocol'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-green-400 mb-3">Loyalty Program</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Name:</span>
                    <span className="text-white font-bold">{loyaltyProgram.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Collection:</span>
                    <span className="text-white font-mono text-sm">{loyaltyProgram.collectionAddress.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Authority:</span>
                    <span className="text-white font-mono text-sm">{loyaltyProgram.updateAuthority.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-purple-400 mb-3">Tier System</h4>
                <div className="space-y-2">
                  {loyaltyProgram.tiers.map((tier: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className={`text-sm ${tier.name === 'Grind' ? 'text-gray-300' :
                        tier.name === 'Bronze' ? 'text-amber-600' :
                          tier.name === 'Silver' ? 'text-gray-400' :
                            tier.name === 'Gold' ? 'text-yellow-400' :
                              'text-cyan-400'
                        }`}>
                        {tier.name}
                      </span>
                      <span className="text-white text-sm">{tier.xpRequired} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connected Wallet Minting */}
      <div className="solana-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">🎫 Mint Your Loyalty Pass</h3>
        <p className="text-gray-300 mb-6">
          {wallet.connected
            ? `Connected: ${wallet.publicKey?.toBase58().slice(0, 8)}...`
            : 'Connect your wallet to mint a loyalty pass'
          }
        </p>

        {wallet.connected ? (
          <div className="text-center">
            <button
              onClick={mintLoyaltyPass}
              disabled={isMinting || !loyaltyProgram}
              className="solana-button w-full md:w-auto"
            >
              {isMinting ? 'Minting...' : '🚀 Mint Loyalty Pass (Simulated)'}
            </button>

            {!loyaltyProgram && (
              <p className="text-yellow-400 text-sm mt-2">
                ⚠️ Protocol must be initialized before minting
              </p>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>Please connect your wallet to continue</p>
          </div>
        )}
      </div>

      {/* Player's Loyalty Pass */}
      {playerProfile?.loyaltyPass && (
        <div className="solana-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">🎫 Your Loyalty Pass</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Pass Name:</span>
                <span className="text-white font-bold">{playerProfile.loyaltyPass.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Current Tier:</span>
                <span className="text-purple-400 font-bold">{playerProfile.verxioTier || 'Grind'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Pass ID:</span>
                <span className="text-white font-mono text-sm">{playerProfile.loyaltyPass.publicKey.slice(0, 8)}...</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-green-400 mb-3">On-Chain Benefits</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✅ Loyalty Pass NFT</li>
                <li>✅ Tier Progression</li>
                <li>✅ Rewards System</li>
                <li>✅ Cross-Game Potential</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Points System */}
      <div className="solana-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">⚡ Points System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/20 rounded-lg">
            <div className="text-green-400 font-bold mb-2">Battle Actions</div>
            <div className="text-sm text-gray-300">
              <div>Win: +100 points</div>
              <div>Loss: +20 points</div>
            </div>
          </div>

          <div className="p-4 bg-purple-500/20 rounded-lg">
            <div className="text-purple-400 font-bold mb-2">Hero Actions</div>
            <div className="text-sm text-gray-300">
              <div>Summon: +25 points</div>
              <div>Customize: +10 points</div>
            </div>
          </div>

          <div className="p-4 bg-cyan-500/20 rounded-lg">
            <div className="text-cyan-400 font-bold mb-2">Quest Actions</div>
            <div className="text-sm text-gray-300">
              <div>Complete: +50 points</div>
              <div>Daily: +25 points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 