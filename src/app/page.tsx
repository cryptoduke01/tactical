'use client'
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ModernGameLayout } from '@/components/ModernGameLayout';

export default function Home() {
  const wallet = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen solana-bg flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (wallet.connected) {
    return <ModernGameLayout />;
  }

  return (
    <div className="min-h-screen solana-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-green-500/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-purple-500/20 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-green-500/20 rounded-full animate-pulse delay-3000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-black text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                TACTICAL
              </span>
            </h1>
            <h2 className="text-8xl md:text-9xl font-black text-green-400 mb-6 tracking-tight">
              CRYPTO ARENA
            </h2>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-green-500 mx-auto mb-8 rounded-full"></div>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            <span className="text-purple-400 font-bold">DEPLOY</span> legendary crypto heroes into combat. {' '}
            <span className="text-green-400 font-bold">ENGAGE</span> in real-time tactical PvP warfare. {' '}
            <span className="text-cyan-400 font-bold">COMPLETE</span> high-stakes DeFi missions.
          </p>

          <p className="text-lg text-white/80 mb-12 font-medium">
            Your tactical reputation is permanently stored on-chain.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full max-w-4xl">
          <div className="solana-card p-6 text-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-3 animate-pulse"></div>
            <h3 className="text-green-400 font-bold text-lg mb-2">SOLANA NETWORK</h3>
            <p className="text-white font-semibold">ONLINE</p>
          </div>

          <div className="solana-card p-6 text-center">
            <div className="w-3 h-3 bg-purple-400 rounded-full mx-auto mb-3 animate-pulse"></div>
            <h3 className="text-purple-400 font-bold text-lg mb-2">HONEYCOMB PROTOCOL</h3>
            <p className="text-white font-semibold">ACTIVE</p>
          </div>

          <div className="solana-card p-6 text-center">
            <div className="w-3 h-3 bg-cyan-400 rounded-full mx-auto mb-3 animate-pulse"></div>
            <h3 className="text-cyan-400 font-bold text-lg mb-2">DEPLOYMENT</h3>
            <p className="text-white font-semibold">PRODUCTION READY</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Deployment, Commander?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Connect your wallet to deploy your first tactical hero and enter the arena
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WalletMultiButton className="solana-button !px-8 !py-4 !text-lg !font-bold !rounded-xl transform hover:scale-105 transition-all duration-300" />

            <button className="solana-button-secondary !px-8 !py-4 !text-lg !font-bold !rounded-xl transform hover:scale-105 transition-all duration-300">
              🎮 View Demo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-gray-500 text-sm">
            Powered by Solana • Honeycomb Protocol • Verxio Protocol
          </p>
        </div>
      </div>
    </div>
  );
}