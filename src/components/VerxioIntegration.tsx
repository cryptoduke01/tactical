'use client'
import { useState, useEffect } from 'react';
import { verxioManager, VerxioLoyaltyProgram } from '@/lib/verxioManager';
import { PlayerProfile } from '@/lib/heroManager';
import { soundManager } from '@/lib/soundManager';
import { showSuccess, showError } from '@/lib/toastManager';

interface VerxioIntegrationProps {
  playerProfile: PlayerProfile | null;
}

export function VerxioIntegration({ playerProfile }: VerxioIntegrationProps) {
  const [loyaltyProgram, setLoyaltyProgram] = useState<VerxioLoyaltyProgram | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoyaltyDetails, setShowLoyaltyDetails] = useState(false);

  useEffect(() => {
    // Load loyalty program data
    const loadLoyaltyProgram = async () => {
      if (verxioManager.isReady()) {
        const program = verxioManager.getLoyaltyProgram();
        if (program) {
          setLoyaltyProgram(program);
        } else {
          // Try to create the program
          setIsLoading(true);
          try {
            const newProgram = await verxioManager.createGameLoyaltyProgram();
            if (newProgram) {
              setLoyaltyProgram(newProgram);
              showSuccess('Loyalty Program', 'Game loyalty program created successfully!');
            }
          } catch (error) {
            console.error('Failed to create loyalty program:', error);
            showError('Loyalty Program', 'Failed to create loyalty program');
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    loadLoyaltyProgram();
  }, []);

  const handleCreateLoyaltyProgram = async () => {
    setIsLoading(true);
    try {
      const program = await verxioManager.createGameLoyaltyProgram();
      if (program) {
        setLoyaltyProgram(program);
        showSuccess('Loyalty Program', 'Game loyalty program created successfully!');
        soundManager.playSuccess();
      }
    } catch (error) {
      console.error('Failed to create loyalty program:', error);
      showError('Loyalty Program', 'Failed to create loyalty program');
      soundManager.playError();
    } finally {
      setIsLoading(false);
    }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'platinum': return 'text-purple-400 border-purple-400/50';
      case 'gold': return 'text-yellow-400 border-yellow-400/50';
      case 'silver': return 'text-gray-300 border-gray-300/50';
      case 'bronze': return 'text-amber-600 border-amber-600/50';
      case 'grind': return 'text-slate-400 border-slate-400/50';
      default: return 'text-slate-300 border-slate-300/50';
    }
  };

  if (!verxioManager.isReady()) {
    return (
      <div className="game-panel p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-xl font-bold text-white mb-2">Verxio Protocol</h3>
          <p className="text-slate-300 mb-4">On-chain loyalty and XP management</p>
          <button
            onClick={handleCreateLoyaltyProgram}
            disabled={isLoading}
            className="solana-button disabled:opacity-50"
          >
            {isLoading ? 'Initializing...' : 'Initialize Protocol'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Loyalty Program Status */}
      <div className="game-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#14F195] rounded-full animate-pulse"></div>
            <h3 className="text-xl font-bold text-white">🎯 Loyalty Program</h3>
          </div>
          <button
            onClick={() => setShowLoyaltyDetails(!showLoyaltyDetails)}
            className="solana-button secondary text-sm"
          >
            {showLoyaltyDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {loyaltyProgram ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#9945FF]">{loyaltyProgram.name}</div>
                <div className="text-slate-300 text-sm">Program Name</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#14F195]">{loyaltyProgram.tiers.length}</div>
                <div className="text-slate-300 text-sm">Tier Levels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#14F195]">
                  {Object.keys(loyaltyProgram.pointsPerAction).length}
                </div>
                <div className="text-slate-300 text-sm">Actions</div>
              </div>
            </div>

            {/* Player Loyalty Pass */}
            {playerProfile?.loyaltyPass && (
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-4 border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Your Loyalty Pass</h4>
                    <p className="text-slate-300 text-sm">{playerProfile.loyaltyPass.name}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTierColor(playerProfile.verxioTier || 'Grind')}`}>
                    {playerProfile.verxioTier || 'Grind'}
                  </div>
                </div>
              </div>
            )}

            {/* Tiers and Actions */}
            {showLoyaltyDetails && (
              <div className="space-y-4">
                {/* Tiers */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">🎖️ Loyalty Tiers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {loyaltyProgram.tiers.map((tier, index) => (
                      <div
                        key={tier.name}
                        className={`game-card p-3 border-2 ${getTierColor(tier.name)}`}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold text-white mb-1">{tier.name}</div>
                          <div className="text-slate-300 text-sm mb-2">{tier.xpRequired} XP Required</div>
                          <div className="text-xs text-slate-400">
                            {tier.rewards.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">⚡ XP Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(loyaltyProgram.pointsPerAction).map(([action, points]) => (
                      <div key={action} className="game-card p-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#14F195] mb-1">
                            {action.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-slate-300 text-sm">{points} XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-slate-200 mb-4">No loyalty program created yet</p>
            <button
              onClick={handleCreateLoyaltyProgram}
              disabled={isLoading}
              className="solana-button disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Loyalty Program'}
            </button>
          </div>
        )}
      </div>

      {/* On-Chain Benefits */}
      <div className="game-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4">🚀 On-Chain Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-xl border border-slate-600/50">
            <div className="text-3xl mb-2">💎</div>
            <h4 className="text-lg font-bold text-white mb-2">Loyalty Pass NFT</h4>
            <p className="text-slate-300 text-sm">Your progress stored on Solana blockchain</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-xl border border-slate-600/50">
            <div className="text-3xl mb-2">🎖️</div>
            <h4 className="text-lg font-bold text-white mb-2">Tier Progression</h4>
            <p className="text-slate-300 text-sm">Automatic tier upgrades based on XP</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-xl border border-slate-600/50">
            <div className="text-3xl mb-2">🎁</div>
            <h4 className="text-lg font-bold text-white mb-2">Rewards System</h4>
            <p className="text-slate-300 text-sm">Unlock rewards at each tier level</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-xl border border-slate-600/50">
            <div className="text-3xl mb-2">🔗</div>
            <h4 className="text-lg font-bold text-white mb-2">Cross-Game</h4>
            <p className="text-slate-300 text-sm">Use your loyalty pass in other games</p>
          </div>
        </div>
      </div>
    </div>
  );
} 