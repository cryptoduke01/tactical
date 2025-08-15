'use client'
import { useState, useEffect } from 'react';

interface DeFiQuestsProps {
  playerProfile: any;
  onQuestComplete: (result: any) => void;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'trading' | 'yield' | 'governance' | 'nft' | 'defi';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  xpReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  expiresAt: number;
  requirements: string[];
}

export function DeFiQuests({ playerProfile, onQuestComplete }: DeFiQuestsProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadDailyQuests();
  }, []);

  const loadDailyQuests = () => {
    const today = new Date().toDateString();
    const dailyQuests: Quest[] = [
      {
        id: `yield_${today}`,
        name: "Yield Farming Master",
        description: "Provide liquidity to earn yield rewards. Complete 3 yield farming transactions.",
        type: 'yield',
        difficulty: 'easy',
        xpReward: 50,
        progress: 0,
        target: 3,
        isCompleted: false,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        requirements: ["Connect wallet", "Provide liquidity", "Earn rewards"]
      },
      {
        id: `trading_${today}`,
        name: "DeFi Trader",
        description: "Execute 5 successful trades on decentralized exchanges. Aim for profit!",
        type: 'trading',
        difficulty: 'medium',
        xpReward: 75,
        progress: 0,
        target: 5,
        isCompleted: false,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        requirements: ["Connect DEX", "Execute trades", "Track P&L"]
      },
      {
        id: `governance_${today}`,
        name: "DAO Participant",
        description: "Participate in governance by voting on 2 proposals. Shape the future of DeFi!",
        type: 'governance',
        difficulty: 'hard',
        xpReward: 100,
        progress: 0,
        target: 2,
        isCompleted: false,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        requirements: ["Hold governance tokens", "Read proposals", "Cast votes"]
      },
      {
        id: `nft_${today}`,
        name: "NFT Collector",
        description: "Mint or trade 1 NFT. Join the digital art revolution!",
        type: 'nft',
        difficulty: 'easy',
        xpReward: 40,
        progress: 0,
        target: 1,
        isCompleted: false,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        requirements: ["Connect wallet", "Browse NFTs", "Complete transaction"]
      },
      {
        id: `defi_${today}`,
        name: "DeFi Pioneer",
        description: "Try 3 different DeFi protocols. Explore the ecosystem!",
        type: 'defi',
        difficulty: 'medium',
        xpReward: 80,
        progress: 0,
        target: 3,
        isCompleted: false,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        requirements: ["Research protocols", "Test features", "Document experience"]
      }
    ];

    setQuests(dailyQuests);
  };

  const getQuestTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'trading': return '📈';
      case 'yield': return '🌾';
      case 'governance': return '🗳️';
      case 'nft': return '🎨';
      case 'defi': return '🚀';
      default: return '❓';
    }
  };

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400/30';
      case 'medium': return 'text-yellow-400 border-yellow-400/30';
      case 'hard': return 'text-orange-400 border-orange-400/30';
      case 'legendary': return 'text-purple-400 border-purple-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  const getDifficultyGlow = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'shadow-[0_0_20px_rgba(34,197,94,0.3)]';
      case 'medium': return 'shadow-[0_0_20px_rgba(250,204,21,0.3)]';
      case 'hard': return 'shadow-[0_0_20px_rgba(249,115,22,0.3)]';
      case 'legendary': return 'shadow-[0_0_20px_rgba(168,85,247,0.3)]';
      default: return 'shadow-[0_0_20px_rgba(156,163,175,0.3)]';
    }
  };

  const startQuest = async (quest: Quest) => {
    setSelectedQuest(quest);
  };

  const completeQuest = async (quest: Quest) => {
    setIsProcessing(true);

    try {
      // Simulate quest completion
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update quest progress
      const updatedQuests = quests.map(q =>
        q.id === quest.id
          ? { ...q, progress: q.target, isCompleted: true }
          : q
      );

      setQuests(updatedQuests);

      // Notify parent component
      onQuestComplete({
        questId: quest.id,
        xpGained: quest.xpReward,
        questName: quest.name
      });

      setSelectedQuest(null);
    } catch (error) {
      console.error('Error completing quest:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getProgressPercentage = (quest: Quest) => {
    return Math.min((quest.progress / quest.target) * 100, 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2">🏆 DeFi Quests</h2>
        <p className="text-gray-300">Complete missions to earn XP and evolve your crypto heroes</p>
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`group cursor-pointer transform hover:scale-105 transition-all duration-500 ${getDifficultyGlow(quest.difficulty)}`}
            onClick={() => startQuest(quest)}
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-all duration-300">
              {/* Quest Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{getQuestTypeIcon(quest.type)}</div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty.toUpperCase()}
                </div>
              </div>

              {/* Quest Info */}
              <h3 className="text-xl font-bold text-white mb-2">{quest.name}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{quest.description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{quest.progress}/{quest.target}</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${quest.isCompleted
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                      }`}
                    style={{ width: `${getProgressPercentage(quest)}%` }}
                  ></div>
                </div>
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between">
                <div className="text-green-400 font-bold">+{quest.xpReward} XP</div>
                {quest.isCompleted ? (
                  <div className="text-green-400 text-sm">✅ Completed</div>
                ) : (
                  <div className="text-gray-400 text-sm">Click to start</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quest Details Modal */}
      {selectedQuest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-400/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedQuest.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(selectedQuest.difficulty)}`}>
                  {selectedQuest.difficulty.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setSelectedQuest(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Quest Description */}
            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed text-lg">{selectedQuest.description}</p>
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-3">Requirements</h4>
              <div className="space-y-2">
                {selectedQuest.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-3">Progress</h4>
              <div className="bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${selectedQuest.isCompleted
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : 'bg-gradient-to-r from-blue-400 to-purple-500'
                    }`}
                  style={{ width: `${getProgressPercentage(selectedQuest)}%` }}
                ></div>
              </div>
              <div className="text-center text-gray-300">
                {selectedQuest.progress} / {selectedQuest.target} completed
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {!selectedQuest.isCompleted ? (
                <button
                  onClick={() => completeQuest(selectedQuest)}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto mb-2"></div>
                      Completing Quest...
                    </>
                  ) : (
                    '🏆 Complete Quest'
                  )}
                </button>
              ) : (
                <div className="flex-1 text-center text-green-400 font-bold py-3">
                  ✅ Quest Completed!
                </div>
              )}

              <button
                onClick={() => setSelectedQuest(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 