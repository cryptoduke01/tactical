'use client'
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { HeroManager, Hero, PlayerProfile } from '@/lib/heroManager';
import { BattleArena } from './BattleArena';
import { HeroCollection } from './HeroCollection';
import { DeFiQuests } from './DeFiQuests';
import { PlayerStats } from './PlayerStats';

export function CryptoLegendsArena() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<'heroes' | 'battle' | 'quests' | 'stats'>('heroes');
  const [heroManager] = useState(new HeroManager());
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wallet.publicKey) {
      initializePlayer();
    }
  }, [wallet.publicKey]);

  const initializePlayer = async () => {
    if (!wallet.publicKey) return;

    setIsLoading(true);
    try {
      // Initialize player profile using HeroManager (which now uses storage)
      const profile = await heroManager.createPlayerProfile(wallet.publicKey.toBase58());
      setPlayerProfile(profile);

      // Load player's heroes (now persistent)
      const playerHeroes = await heroManager.getPlayerHeroes(wallet.publicKey.toBase58());
      setHeroes(playerHeroes);
    } catch (error) {
      console.error('Failed to initialize player:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTabButtonClass = (tab: string) => {
    return `px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 font-mono tracking-wider ${activeTab === tab
      ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg border border-emerald-400/50'
      : 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50'
      }`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-400 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-emerald-400 text-xl font-semibold mt-4 font-mono tracking-wider">DEPLOYING TACTICAL UNITS...</p>
          <div className="mt-2 text-slate-400 text-sm font-mono">INITIALIZING COMBAT SYSTEMS</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Military Command Center Header */}
      <div className="tactical-panel p-6 border-emerald-400/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider">TACTICAL COMMAND CENTER</h2>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 text-sm font-mono">OPERATOR: {playerProfile?.name || 'UNKNOWN'}</div>
            <div className="text-slate-400 text-xs font-mono">CLEARANCE LEVEL: {playerProfile?.level || 1}</div>
          </div>
        </div>

        {/* Military Grid Lines */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent mb-4"></div>

        {/* Tactical Navigation */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveTab('heroes')}
            className={getTabButtonClass('heroes')}
          >
            🏰 TACTICAL UNITS
          </button>
          <button
            onClick={() => setActiveTab('battle')}
            className={getTabButtonClass('battle')}
          >
            ⚔️ COMBAT ZONE
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={getTabButtonClass('quests')}
          >
            🎯 SPECIAL MISSIONS
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={getTabButtonClass('stats')}
          >
            📊 COMBAT INTELLIGENCE
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[60vh]">
        {activeTab === 'heroes' && (
          <HeroCollection
            heroes={heroes}
            onHeroUpdate={(updatedHeroes: Hero[]) => setHeroes(updatedHeroes)}
            heroManager={heroManager}
            playerProfile={playerProfile}
          />
        )}

        {activeTab === 'battle' && (
          <BattleArena
            heroes={heroes}
            playerProfile={playerProfile}
            onBattleComplete={(battleResult: { winner: boolean; xpGained: number }) => {
              // Update player stats after battle
              if (battleResult.winner && playerProfile) {
                setPlayerProfile(prev => ({
                  ...prev!,
                  xp: (prev?.xp || 0) + battleResult.xpGained,
                  battlesWon: (prev?.battlesWon || 0) + 1
                }));
              }
            }}
          />
        )}

        {activeTab === 'quests' && (
          <DeFiQuests
            playerProfile={playerProfile}
            onQuestComplete={(questResult: { questId: string; xpGained: number; questName: string }) => {
              // Update player stats after quest completion
              if (playerProfile) {
                setPlayerProfile(prev => ({
                  ...prev!,
                  xp: (prev?.xp || 0) + questResult.xpGained,
                  questsCompleted: (prev?.questsCompleted || 0) + 1
                }));
              }
            }}
          />
        )}

        {activeTab === 'stats' && (
          <PlayerStats
            profile={playerProfile}
            heroes={heroes}
          />
        )}
      </div>

      {/* Simple Status Footer */}
      <div className="tactical-panel p-4 border-slate-500/30">
        <div className="text-center">
          <p className="text-slate-400 text-sm font-mono">
            <span className="text-emerald-400 font-semibold">TACTICAL CRYPTO ARENA</span> -
            Powered by Honeycomb Protocol on Solana
          </p>
          <p className="text-emerald-400 text-xs mt-2 font-mono">
            💾 Progress automatically saved to local storage
          </p>
        </div>
      </div>
    </div>
  );
} 