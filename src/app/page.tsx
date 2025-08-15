'use client'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { CryptoLegendsArena } from "@/components/CryptoLegendsArena";

export default function Home() {
  const wallet = useWallet();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Military Grid Background */}
      <div className="absolute inset-0 military-grid opacity-20"></div>

      {/* Tactical Scan Lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/10 to-transparent animate-pulse"></div>

      {/* Military HUD Corner Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-emerald-400/50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-emerald-400/50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-emerald-400/50"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-emerald-400/50"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-12 pt-8">
          {/* Military Title with Tactical Effects */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 blur-3xl"></div>
            <h1 className="text-8xl font-black text-white mb-2 tracking-widest military-text relative z-10">
              TACTICAL
            </h1>
            <div className="text-6xl font-black text-emerald-400/30 absolute inset-0 -z-10 blur-sm">
              TACTICAL
            </div>
          </div>

          <h2 className="text-5xl font-bold text-emerald-400 mb-4 tracking-wider tactical-text">
            CRYPTO ARENA
          </h2>

          <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mb-6"></div>

          <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed font-mono">
            <span className="text-emerald-400 font-bold">DEPLOY</span> legendary crypto heroes into combat.
            <br />
            <span className="text-blue-400 font-bold">ENGAGE</span> in real-time tactical PvP warfare.
            <br />
            <span className="text-amber-400 font-bold">COMPLETE</span> high-stakes DeFi missions.
            <br />
            <span className="text-slate-400 font-mono">Your tactical reputation is permanently stored on-chain.</span>
          </p>

          {/* Military Status Indicators */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="status-online"></div>
              <span className="text-emerald-400 text-sm font-mono">SOLANA NETWORK: ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-online"></div>
              <span className="text-emerald-400 text-sm font-mono">HONEYCOMB PROTOCOL: ACTIVE</span>
            </div>
          </div>

          {/* Tactical Wallet Button */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <WalletMultiButton className="!bg-gradient-to-r !from-slate-700 !to-slate-600 hover:!from-slate-600 hover:!to-slate-500 !text-white !font-bold !px-10 !py-4 !rounded-lg !border-2 !border-emerald-400/50 !shadow-lg hover:!shadow-emerald-400/25 !font-mono !tracking-wider" />
          </div>
        </header>

        {wallet.connected ? (
          <CryptoLegendsArena />
        ) : (
          <div className="text-center max-w-6xl mx-auto">
            {/* Tactical Mission Briefing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="group relative">
                <div className="tactical-panel p-8 transform group-hover:scale-105 transition-all duration-500 hover:border-emerald-400/50 hover:tactical-glow-green">
                  <div className="text-6xl mb-4">⚔️</div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-mono tracking-wider">COMBAT OPERATIONS</h3>
                  <p className="text-slate-300 leading-relaxed font-mono text-sm">
                    Real-time tactical PvP warfare with legendary crypto heroes.
                    Every engagement affects your on-chain tactical rating.
                  </p>
                  <div className="mt-4 text-emerald-400 text-xs font-mono tracking-wider">
                    STATUS: READY FOR DEPLOYMENT
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="tactical-panel p-8 transform group-hover:scale-105 transition-all duration-500 hover:border-blue-400/50 hover:tactical-glow-blue">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-mono tracking-wider">SPECIAL MISSIONS</h3>
                  <p className="text-slate-300 leading-relaxed font-mono text-sm">
                    High-stakes DeFi operations to earn XP, evolve traits, and unlock
                    advanced tactical capabilities.
                  </p>
                  <div className="mt-4 text-blue-400 text-xs font-mono tracking-wider">
                    STATUS: MISSION BRIEFING READY
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="tactical-panel p-8 transform group-hover:scale-105 transition-all duration-500 hover:border-amber-400/50 hover:tactical-glow-orange">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-mono tracking-wider">TACTICAL PROGRESSION</h3>
                  <p className="text-slate-300 leading-relaxed font-mono text-sm">
                    Your achievements, hero evolution, and tactical reputation
                    are permanently stored on Solana via Honeycomb Protocol.
                  </p>
                  <div className="mt-4 text-amber-400 text-xs font-mono tracking-wider">
                    STATUS: PROTOCOL ACTIVE
                  </div>
                </div>
              </div>
            </div>

            {/* Military Call to Action */}
            <div className="tactical-panel p-8 backdrop-blur-xl border-emerald-400/30">
              <h3 className="text-3xl font-bold text-white mb-4 font-mono tracking-wider">READY FOR DEPLOYMENT, SOLDIER?</h3>
              <p className="text-slate-300 mb-6 font-mono">
                Connect your wallet to deploy your first tactical hero and enter the arena.
                <br />
                <span className="text-emerald-400 font-bold font-mono">The future of tactical gaming is on-chain.</span>
              </p>

              {/* Military HUD Elements */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="hud-element">
                  <div className="hud-label">NETWORK STATUS</div>
                  <div className="hud-value">SOLANA DEVNET</div>
                </div>
                <div className="hud-element">
                  <div className="hud-label">PROTOCOL VERSION</div>
                  <div className="hud-value">HONEYCOMB v0.0.7</div>
                </div>
                <div className="hud-element">
                  <div className="hud-label">SECURITY LEVEL</div>
                  <div className="hud-value">MAXIMUM</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}