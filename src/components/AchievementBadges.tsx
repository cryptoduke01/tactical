import type { Achievement } from '@/lib/types';

interface AchievementBadgesProps {
  achievements: Achievement[];
}

const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'legendary': return 'text-yellow-400';
    case 'epic': return 'text-purple-400';
    case 'rare': return 'text-blue-400';
    case 'common': return 'text-green-400';
    default: return 'text-gray-400';
  }
};

const getAchievementIcon = (id: string) => {
  if (id.includes('speed')) return '⚡';
  if (id.includes('consistency')) return '🎯';
  if (id.includes('focus')) return '🧠';
  if (id.includes('level')) return '⭐';
  return '🏆';
};

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  if (achievements.length === 0) {
    return (
      <div className="glass-card p-4 text-center">
        <div className="text-gray-400 text-sm">No achievements yet</div>
        <div className="text-xs text-gray-500">Play more to unlock!</div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h4 className="text-white font-bold mb-3">Achievements</h4>
      <div className="grid grid-cols-2 gap-2">
        {achievements.map(achievement => (
          <div key={achievement.id} className="glass-card p-2 text-center">
            <div className={`text-2xl mb-1 ${getRarityColor(achievement.rarity)}`}>
              {getAchievementIcon(achievement.id)}
            </div>
            <div className="text-xs text-white">{achievement.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}