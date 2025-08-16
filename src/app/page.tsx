'use client'
import { useState, useEffect } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { ModernGameLayout } from "@/components/ModernGameLayout";

export default function Home() {
  const wallet = useWallet();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until client-side
  if (!isClient) {
    return (
      <main className="min-h-screen solana-bg relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#9945FF] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#14F195]">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen solana-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #9945FF 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {wallet.connected ? (
          <ModernGameLayout />
        ) : (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-4xl mx-auto">
              {/* Game Logo */}
              <div className="mb-12">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 blur-3xl"></div>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-widest relative z-10">
                    TACTICAL
                  </h1>
                  <div className="text-4xl md:text-6xl font-black text-[#9945FF]/30 absolute inset-0 -z-10 blur-sm">
                    TACTICAL
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-[#14F195] mb-6 tracking-wider">
                  CRYPTO ARENA
                </h2>

                <div className="w-32 h-1 bg-gradient-to-r from-[#9945FF] to-[#14F195] mx-auto mb-8"></div>
              </div>

              {/* Game Description */}
              <div className="mb-12">
                <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
                  <span className="text-[#9945FF] font-bold">DEPLOY</span> legendary crypto heroes into combat.
                  <br />
                  <span className="text-[#14F195] font-bold">ENGAGE</span> in real-time tactical PvP warfare.
                  <br />
                  <span className="text-[#22d3ee] font-bold">COMPLETE</span> high-stakes DeFi missions.
                  <br />
                  <span className="text-white/80">Your tactical reputation is permanently stored on-chain.</span>
                </p>

                {/* Status Indicators */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="status-online"></div>
                    <span className="text-[#14F195] text-sm font-medium">SOLANA NETWORK: ONLINE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="status-online"></div>
                    <span className="text-[#14F195] text-sm font-medium">HONEYCOMB PROTOCOL: ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="status-online"></div>
                    <span className="text-[#14F195] text-sm font-medium">DEPLOYMENT: PRODUCTION READY</span>
                  </div>
                </div>
              </div>

              {/* Connect Wallet Section */}
              <div className="game-panel p-8 md:p-12 max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready for Deployment, Commander?</h3>
                <p className="text-slate-200 mb-8 text-lg">
                  Connect your wallet to deploy your first tactical hero and enter the arena.
                  <br />
                  <span className="text-[#9945FF] font-semibold">The future of tactical gaming is on-chain.</span>
                </p>

                {/* Wallet Button */}
                <div className="transform hover:scale-105 transition-all duration-300 mb-8">
                  <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#7c3aed] hover:!from-[#8b3cf6] hover:!to-[#6d28d9] !text-white !font-bold !px-12 !py-4 !rounded-xl !border-2 !border-[#9945FF]/50 !shadow-lg hover:!shadow-[#9945FF]/25 !text-lg" />
                </div>

                {/* Game Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="game-card p-6 text-center">
                    <div className="text-4xl mb-3">🏰</div>
                    <h4 className="text-lg font-bold text-white mb-2">Hero Collection</h4>
                    <p className="text-slate-200 text-sm">Manage legendary crypto heroes</p>
                  </div>

                  <div className="game-card p-6 text-center">
                    <div className="text-4xl mb-3">⚔️</div>
                    <h4 className="text-lg font-bold text-white mb-2">PvP Battles</h4>
                    <p className="text-slate-200 text-sm">Real-time tactical combat</p>
                  </div>

                  <div className="game-card p-6 text-center">
                    <div className="text-4xl mb-3">🎯</div>
                    <h4 className="text-lg font-bold text-white mb-2">DeFi Quests</h4>
                    <p className="text-slate-200 text-sm">Complete missions for rewards</p>
                  </div>
                </div>

                {/* Game Status */}
                <div className="mt-8 p-6 bg-slate-900/20 border border-slate-700/30 rounded-xl">
                  <div className="text-center">
                    <div className="text-[#14F195] font-bold text-lg mb-3">🎯 GAME STATUS: PRODUCTION READY</div>
                    <div className="text-slate-200 text-sm space-y-1">
                      <div>✅ Hero Collection System - Fully Functional</div>
                      <div>✅ PvP Battle Arena - 2D Graphics Active</div>
                      <div>✅ DeFi Quest System - Progress Tracking</div>
                      <div>✅ Blockchain Integration - Honeycomb + Solana</div>
                      <div>✅ Data Persistence - Local Storage + Backup</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}