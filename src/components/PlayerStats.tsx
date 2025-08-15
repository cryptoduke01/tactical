'use client'
import { Hero } from '@/lib/heroManager';

interface PlayerStatsProps {
  profile: any;
  heroes: Hero[];
}

export function PlayerStats({ profile, heroes }: PlayerStatsProps) {
  if (!profile) {
    return (
      <div className="text-center">
        <p className="text-gray-400">No profile data available</p>
      </div>
    );
  }

  const totalHeroPower = heroes.reduce((sum, hero) => sum + hero.power, 0);
  const averageHeroLevel = heroes.length > 0 ? heroes.reduce((sum, hero) => sum + hero.level, 0) / heroes.length : 0;
  const legendaryHeroes = heroes.filter(hero => hero.rarity === 'legendary').length;
  const totalTraits = heroes.reduce((sum, hero) => sum + hero.traits.length, 0);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank.toString();
  };

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, player: "CryptoKing", xp: 15420, heroes: 12, battles: 89 },
    { rank: 2, player: "DeFiMaster", xp: 12850, heroes: 10, battles: 76 },
    { rank: 3, player: "BlockchainLord", xp: 11200, heroes: 8, battles: 65 },
    { rank: 4, player: "Web3Warrior", xp: 9850, heroes: 7, battles: 54 },
    { rank: 5, player: "SolanaSage", xp: 8750, heroes: 6, battles: 48 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2">📊 Player Stats</h2>
        <p className="text-gray-300">Track your progress and achievements in the Crypto Legends Arena</p>
      </div>

      {/* Profile Overview */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Player Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Legend Profile</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Name:</span>
                <span className="text-white font-bold">{profile.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Level:</span>
                <span className="text-green-400 font-bold text-xl">{profile.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total XP:</span>
                <span className="text-blue-400 font-bold">{profile.xp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Reputation:</span>
                <span className="text-purple-400 font-bold">{profile.reputation}</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Level Progress</h4>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">XP to Next Level</span>
                <span className="text-white">{100 - (profile.xp % 100)}</span>
              </div>
              <div className="bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(profile.xp % 100) / 100 * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Next level: {profile.level + 1} ({100 - (profile.xp % 100)} XP needed)
            </p>
          </div>
        </div>
      </div>

      {/* Battle & Quest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-400/30 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">⚔️</div>
          <div className="text-2xl font-bold text-white mb-1">{profile.battlesWon + profile.battlesLost}</div>
          <div className="text-gray-300 mb-2">Total Battles</div>
          <div className="text-green-400 font-bold">{profile.battlesWon} Wins</div>
          <div className="text-red-400 text-sm">{profile.battlesLost} Losses</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-white mb-1">{profile.questsCompleted}</div>
          <div className="text-gray-300 mb-2">Quests Completed</div>
          <div className="text-blue-400 font-bold">Daily Progress</div>
          <div className="text-gray-400 text-sm">5 available today</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-white mb-1">{profile.reputation}</div>
          <div className="text-gray-300 mb-2">Reputation Score</div>
          <div className="text-yellow-400 font-bold">Legendary Status</div>
          <div className="text-gray-400 text-sm">Top 10% player</div>
        </div>
      </div>

      {/* Hero Collection Stats */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">🏰 Hero Collection</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{heroes.length}</div>
            <div className="text-gray-300 text-sm">Total Heroes</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">{totalHeroPower}</div>
            <div className="text-gray-300 text-sm">Total Power</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{Math.round(averageHeroLevel * 10) / 10}</div>
            <div className="text-gray-300 text-sm">Avg Level</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{legendaryHeroes}</div>
            <div className="text-gray-300 text-sm">Legendary</div>
          </div>
        </div>

        {/* Hero Rarity Distribution */}
        <div className="mt-6">
          <h4 className="text-lg font-bold text-white mb-3">Rarity Distribution</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
              const count = heroes.filter(hero => hero.rarity === rarity).length;
              const percentage = heroes.length > 0 ? (count / heroes.length) * 100 : 0;

              return (
                <div key={rarity} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{count}</div>
                  <div className="text-gray-300 text-sm capitalize">{rarity}</div>
                  <div className="text-xs text-gray-400">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Leaderboard */}
      <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-green-400/20 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">🏆 Global Leaderboard</h3>

        <div className="space-y-3">
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between bg-gray-800/50 border border-gray-600/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-yellow-400 w-8">
                  {getRankBadge(entry.rank)}
                </div>
                <div>
                  <div className="text-white font-bold">{entry.player}</div>
                  <div className="text-gray-400 text-sm">{entry.heroes} heroes</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-bold">{entry.xp.toLocaleString()} XP</div>
                <div className="text-gray-400 text-sm">{entry.battles} battles</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-green-400 hover:text-green-300 text-sm font-medium">
            View Full Rankings →
          </button>
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">🏅 Achievements</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">First Victory</span>
              <span className="text-green-400">✅</span>
            </div>
            <p className="text-gray-300 text-sm">Win your first battle</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Quest Master</span>
              <span className="text-gray-400">🔒</span>
            </div>
            <p className="text-gray-300 text-sm">Complete 10 quests</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Hero Collector</span>
              <span className="text-gray-400">🔒</span>
            </div>
            <p className="text-gray-300 text-sm">Own 5 heroes</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Legendary Status</span>
              <span className="text-gray-400">🔒</span>
            </div>
            <p className="text-gray-300 text-sm">Reach level 10</p>
          </div>
        </div>
      </div>
    </div>
  );
} 