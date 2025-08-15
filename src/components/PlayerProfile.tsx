import type { PlayerProfile } from '@/lib/types';

interface PlayerProfileProps {
  profile: PlayerProfile;
}

export function PlayerProfile({ profile }: PlayerProfileProps) {
  const xpToNext = (profile.level * 100) - profile.xp;
  const xpProgress = ((profile.xp % 100) / 100) * 100;

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-white mb-4">Player Profile</h3>

      <div className="space-y-4">
        {/* Level and XP */}
        <div>
          <div className="flex justify-between text-white mb-2">
            <span>Level {profile.level}</span>
            <span>{xpToNext} XP to next</span>
          </div>
          <div className="bg-gray-700 rounded-full h-3">
            <div
              className="skill-meter h-3 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center glass-card p-3">
            <div className="text-purple-300 font-bold">Total Score</div>
            <div className="text-white text-lg">{profile.totalScore}</div>
          </div>
          <div className="text-center glass-card p-3">
            <div className="text-blue-300 font-bold">Games Played</div>
            <div className="text-white text-lg">{profile.gamesPlayed}</div>
          </div>
        </div>

        {/* Traits */}
        <div>
          <h4 className="text-white font-bold mb-3">Skills</h4>
          <div className="space-y-2">
            {profile.traits.map(trait => (
              <div key={trait.id}>
                <div className="flex justify-between text-sm text-white mb-1">
                  <span>{trait.name}</span>
                  <span>{trait.value}/100</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${trait.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}