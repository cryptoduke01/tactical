'use client'
import { useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  averageTime: number;
  level: number;
}

export function Leaderboard() {
  // Mock data - in real implementation, fetch from Honeycomb
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, player: "SpeedMaster", score: 2450, averageTime: 185, level: 12 },
    { rank: 2, player: "LightningFast", score: 2200, averageTime: 203, level: 10 },
    { rank: 3, player: "QuickDraw", score: 1980, averageTime: 234, level: 9 },
    { rank: 4, player: "ReactKing", score: 1750, averageTime: 267, level: 8 },
    { rank: 5, player: "FlashGamer", score: 1650, averageTime: 289, level: 7 },
  ]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈"; 
    if (rank === 3) return "🥉";
    return rank.toString();
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-white mb-4">Global Leaderboard</h3>
      
      <div className="space-y-2">
        {leaderboard.map(entry => (
          <div 
            key={entry.rank}
            className="flex items-center justify-between glass-card p-3 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-yellow-400 w-8">
                {getRankBadge(entry.rank)}
              </div>
              <div>
                <div className="text-white font-bold">{entry.player}</div>
                <div className="text-gray-400 text-sm">Level {entry.level}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white font-bold">{entry.score.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">{entry.averageTime}ms avg</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          View Full Rankings →
        </button>
      </div>
    </div>
  );
}