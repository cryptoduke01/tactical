'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { soundManager } from '@/lib/soundManager';
import { toastManager, ToastMessage } from '@/lib/toastManager';
import { HeroCollection } from './HeroCollection';
import { BattleArena } from './BattleArena';
import { DeFiQuests } from './DeFiQuests';
import { PlayerStats } from './PlayerStats';
import { HeroManager, Hero, PlayerProfile } from '@/lib/heroManager';

interface ModernGameLayoutProps {
  children?: React.ReactNode;
}

export function ModernGameLayout({ children }: ModernGameLayoutProps) {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<'heroes' | 'battle' | 'quests' | 'stats'>('heroes');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize heroManager to prevent recreation on every render
  const heroManager = useMemo(() => new HeroManager(), []);

  // Memoize the initializePlayer function
  const initializePlayer = useCallback(async () => {
    if (!wallet.publicKey) return;

    setIsLoading(true);
    try {
      const profile = await heroManager.createPlayerProfile(wallet.publicKey.toBase58());
      setPlayerProfile(profile);

      const playerHeroes = await heroManager.getPlayerHeroes(wallet.publicKey.toBase58());
      setHeroes(playerHeroes);
    } catch (error) {
      console.error('Failed to initialize player:', error);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.publicKey, heroManager]);

  useEffect(() => {
    if (wallet.publicKey) {
      initializePlayer();
    }
  }, [wallet.publicKey, initializePlayer]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    soundManager.playButtonClick();
    setActiveTab(tab as any);
  }, []);

  const toggleMute = useCallback(() => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playButtonClick();
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
    soundManager.playButtonClick();
  }, []);

  const handleHeroUpdate = useCallback((updatedHeroes: Hero[]) => {
    setHeroes(updatedHeroes);
  }, []);

  const handleBattleComplete = useCallback((battleResult: { winner: boolean; xpGained: number }) => {
    if (battleResult.winner && playerProfile) {
      setPlayerProfile(prev => ({
        ...prev!,
        xp: (prev?.xp || 0) + battleResult.xpGained,
        battlesWon: (prev?.battlesWon || 0) + 1
      }));
    }
  }, [playerProfile]);

  const handleQuestComplete = useCallback((questResult: { questId: string; xpGained: number; questName: string }) => {
    if (playerProfile) {
      setPlayerProfile(prev => ({
        ...prev!,
        xp: (prev?.xp || 0) + questResult.xpGained,
        questsCompleted: (prev?.questsCompleted || 0) + 1
      }));
    }
  }, [playerProfile]);

  const getTabIcon = useCallback((tab: string) => {
    switch (tab) {
      case 'heroes': return '🏰';
      case 'battle': return '⚔️';
      case 'quests': return '🎯';
      case 'stats': return '📊';
      default: return '❓';
    }
  }, []);

  const getTabLabel = useCallback((tab: string) => {
    switch (tab) {
      case 'heroes': return 'Heroes';
      case 'battle': return 'Battle';
      case 'quests': return 'Quests';
      case 'stats': return 'Stats';
      default: return 'Unknown';
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen solana-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 border-4 border-[#9945FF] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-[#14F195] rounded-full animate-spin border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Game...</h2>
          <p className="text-[#14F195]">Initializing your tactical units</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen solana-bg flex">
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar sidebar-nav w-20 flex flex-col items-center py-6 space-y-6">
        {/* Logo */}
        <div className="nav-icon active" data-tooltip="Tactical Arena">
          <span className="text-2xl font-bold">T</span>
        </div>

        {/* Navigation Icons */}
        {(['heroes', 'battle', 'quests', 'stats'] as const).map((tab) => (
          <div
            key={tab}
            className={`nav-icon ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
            data-tooltip={getTabLabel(tab)}
            title={getTabLabel(tab)}
          >
            <span className="text-xl">{getTabIcon(tab)}</span>
          </div>
        ))}

        {/* Settings Icon */}
        <div className="nav-icon mt-auto" data-tooltip="Settings">
          <span className="text-xl">⚙️</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col main-content">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-900/30 to-slate-800/20 backdrop-blur-xl border-b border-slate-700/30 p-4">
          <div className="flex items-center justify-between">
            {/* Greeting */}
            <div className="text-white">
              <h1 className="text-xl font-semibold">
                Good evening, {playerProfile?.name || 'Commander'}
              </h1>
              <p className="text-[#14F195] text-sm">Ready for tactical deployment?</p>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search heroes, quests..."
                  className="w-full bg-slate-800/30 border border-slate-600/40 rounded-xl px-4 py-2 text-white placeholder-slate-300 focus:outline-none focus:border-[#9945FF]/60"
                />
                <span className="absolute right-3 top-2.5 text-slate-300">🔍</span>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <div className="nav-icon" data-tooltip="Shop">
                <span className="text-lg">🛒</span>
              </div>
              <div className="nav-icon" data-tooltip="Notifications">
                <span className="text-lg">🔔</span>
              </div>
              <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#7c3aed] hover:!from-[#8b3cf6] hover:!to-[#6d28d9] !text-white !font-semibold !px-4 !py-2 !rounded-xl !border !border-[#9945FF]/50" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 content-wrapper overflow-auto custom-scrollbar">
          {activeTab === 'heroes' && (
            <HeroCollection
              heroes={heroes}
              onHeroUpdate={handleHeroUpdate}
              heroManager={heroManager}
            />
          )}

          {activeTab === 'battle' && (
            <BattleArena
              heroes={heroes}
              playerProfile={playerProfile}
              onBattleComplete={handleBattleComplete}
            />
          )}

          {activeTab === 'quests' && (
            <DeFiQuests
              playerProfile={playerProfile}
              onQuestComplete={handleQuestComplete}
            />
          )}

          {activeTab === 'stats' && (
            <PlayerStats
              profile={playerProfile}
              heroes={heroes}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav md:hidden">
        <div className="flex justify-around items-center py-3">
          {(['heroes', 'battle', 'quests', 'stats'] as const).map((tab) => (
            <div
              key={tab}
              className={`flex flex-col items-center space-y-1 ${activeTab === tab ? 'text-[#14F195]' : 'text-slate-300'}`}
              onClick={() => handleTabChange(tab)}
            >
              <span className="text-xl">{getTabIcon(tab)}</span>
              <span className="text-xs font-medium">{getTabLabel(tab)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sound Control - Fixed positioning */}
      <div className="sound-control" onClick={toggleMute}>
        <span className="text-white text-lg">
          {isMuted ? '🔇' : '🔊'}
        </span>
      </div>

      {/* Volume Slider (Desktop) */}
      <div className="hidden md:block fixed top-20 left-4 z-40">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #9945FF 0%, #9945FF ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
          }}
        />
      </div>

      {/* Toast Container - Only show important toasts during gameplay */}
      <div className="toast-container">
        {toasts
          .filter(toast => toast.type !== 'info' || !toast.message.includes('3D Battle scene ready'))
          .map((toast) => (
            <div
              key={toast.id}
              className={`toast ${toast.type} slide-up`}
              onClick={() => toastManager.removeToast(toast.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{toast.title}</h4>
                  <p className="text-sm opacity-90">{toast.message}</p>
                </div>
                <button
                  onClick={() => toastManager.removeToast(toast.id)}
                  className="ml-4 text-white/70 hover:text-white text-lg"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #9945FF;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #9945FF;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
      `}</style>
    </div>
  );
} 