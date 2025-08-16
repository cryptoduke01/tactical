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
import { VerxioIntegration } from './VerxioIntegration';
import { HeroManager, Hero, PlayerProfile } from '@/lib/heroManager';

interface ModernGameLayoutProps {
  children?: React.ReactNode;
}

export function ModernGameLayout({ children }: ModernGameLayoutProps) {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<'heroes' | 'battle' | 'quests' | 'stats' | 'verxio'>('heroes');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [solBalance, setSolBalance] = useState<string>('0.0000');

  // Fetch SOL balance
  useEffect(() => {
    const fetchSOLBalance = async () => {
      if (wallet.publicKey) {
        try {
          // Simulate fetching SOL balance from devnet
          // In a real app, you'd use connection.getBalance(wallet.publicKey)
          const mockBalance = Math.random() * 10 + 1; // Random balance between 1-11 SOL
          setSolBalance(mockBalance.toFixed(4));
        } catch (error) {
          console.error('Failed to fetch SOL balance:', error);
          setSolBalance('0.0000');
        }
      }
    };

    fetchSOLBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchSOLBalance, 30000);
    return () => clearInterval(interval);
  }, [wallet.publicKey]);

  // Check if user has seen onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Mark onboarding as complete
  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

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

  // Listen for profile updates from hero actions
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      setPlayerProfile(event.detail);
    };

    window.addEventListener('profileUpdate', handleProfileUpdate as EventListener);
    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate as EventListener);
    };
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
      case 'verxio': return '🔗';
      default: return '❓';
    }
  }, []);

  const getTabLabel = useCallback((tab: string) => {
    switch (tab) {
      case 'heroes': return 'Heroes';
      case 'battle': return 'Battle';
      case 'quests': return 'Quests';
      case 'stats': return 'Stats';
      case 'verxio': return 'Verxio';
      default: return 'Unknown';
    }
  }, []);

  // Get dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (hour >= 5 && hour < 12) {
      return { greeting: 'Good morning', emoji: '🌅' };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: 'Good afternoon', emoji: '☀️' };
    } else if (hour >= 17 && hour < 21) {
      return { greeting: 'Good evening', emoji: '🌆' };
    } else {
      return { greeting: 'Good night', emoji: '🌙' };
    }
  };

  const greeting = getGreeting();

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
        {(['heroes', 'battle', 'quests', 'stats', 'verxio'] as const).map((tab) => (
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
        <div className="nav-icon mt-auto" data-tooltip="Settings & Help" onClick={() => setShowOnboarding(true)}>
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
                {greeting.greeting}, {playerProfile?.name || 'Commander'}
              </h1>
              <p className="text-[#14F195] text-sm">Ready for tactical deployment?</p>
            </div>

            {/* Solana Devnet Status and XP Balance */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="flex items-center gap-6 w-full">
                {/* Solana Devnet Status */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#14F195] rounded-full animate-pulse"></div>
                  <span className="text-[#14F195] text-sm font-medium">DEVNET</span>
                </div>

                {/* XP Balance */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 text-sm">XP:</span>
                  <span className="text-[#9945FF] font-bold text-lg">
                    {playerProfile?.xp?.toLocaleString() || '10,000'}
                  </span>
                </div>

                {/* SOL Balance */}
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-300">SOL Balance</div>
                  <div className="text-lg font-bold text-green-400">{solBalance} SOL</div>
                </div>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Sound Control */}
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700/50 to-slate-600/30 border border-slate-600/40 flex items-center justify-center text-white hover:from-slate-600/50 hover:to-slate-500/30 hover:border-slate-500/50 transition-all duration-300 hover:scale-110"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                <span className="text-lg">
                  {isMuted ? '🔇' : '🔊'}
                </span>
              </button>

              {/* Background Music Toggle */}
              <button
                onClick={() => soundManager.toggleBackgroundMusic()}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14F195]/50 to-[#10C07A]/30 border border-[#14F195]/40 flex items-center justify-center text-white hover:from-[#14F195]/50 hover:to-[#10C07A]/30 hover:border-[#14F195]/50 transition-all duration-300 hover:scale-110"
                title="Toggle Background Music"
              >
                <span className="text-lg">🎵</span>
              </button>

              {/* Volume Slider */}
              <div className="hidden md:block">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #9945FF 0%, #9945FF ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                  }}
                />
              </div>

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
              playerProfile={playerProfile}
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

          {activeTab === 'verxio' && (
            <VerxioIntegration
              playerProfile={playerProfile}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav md:hidden">
        <div className="flex justify-around items-center py-3">
          {(['heroes', 'battle', 'quests', 'stats', 'verxio'] as const).map((tab) => (
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

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-slate-600/50 rounded-2xl p-8 max-w-2xl w-full transform transition-all duration-300 scale-100 animate-bounce-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to Tactical Crypto Arena!</h2>
              <p className="text-slate-300">Your guide to becoming a legendary commander</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-[#14F195] text-xl">🏰</div>
                <div>
                  <h3 className="text-white font-semibold">Hero Collection</h3>
                  <p className="text-slate-300 text-sm">Summon and customize crypto heroes. Each action costs XP!</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-[#9945FF] text-xl">⚔️</div>
                <div>
                  <h3 className="text-white font-semibold">Battle Arena</h3>
                  <p className="text-slate-300 text-sm">Select your hero and watch automated 2D battles unfold!</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-[#14F195] text-xl">🎯</div>
                <div>
                  <h3 className="text-white font-semibold">DeFi Quests</h3>
                  <p className="text-slate-300 text-sm">Complete missions to earn XP and level up your heroes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-[#9945FF] text-xl">📊</div>
                <div>
                  <h3 className="text-white font-semibold">Stats & Progress</h3>
                  <p className="text-slate-300 text-sm">Track your performance and hero development.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-[#14F195] text-xl">💾</div>
                <div>
                  <h3 className="text-white font-semibold">Save & Export</h3>
                  <p className="text-slate-300 text-sm">Backup your progress and transfer between devices.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-[#9945FF] text-xl">🔗</div>
                <div>
                  <h3 className="text-white font-semibold">Verxio Protocol</h3>
                  <p className="text-slate-300 text-sm">On-chain loyalty passes, XP management, and tier progression.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={completeOnboarding}
                className="solana-button px-8 py-3 text-lg"
              >
                Let's Battle! 🚀
              </button>
            </div>
          </div>
        </div>
      )}

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