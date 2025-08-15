'use client'
import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import { HoneycombGameManager } from '@/lib/honeycomb';

export function MissionSystem() {
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    loadDailyMissions();
  }, []);

  const loadDailyMissions = async () => {
    try {
      const manager = new HoneycombGameManager('dummy');
      const dailyMissions = await manager.createDailyMissions();
      setMissions(dailyMissions);
    } catch (error) {
      console.error('Failed to load missions:', error);
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-white mb-4">Daily Missions</h3>
      
      <div className="space-y-3">
        {missions.map(mission => (
          <div key={mission.id} className="glass-card p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-white">{mission.name}</h4>
              <span className="text-xs text-purple-300">+{mission.reward.xp} XP</span>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{mission.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Progress</span>
                <span className="text-white">{mission.progress}/{mission.target}</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                ></div>
              </div>
            </div>

            {mission.progress >= mission.target && (
              <button className="mt-3 bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-bold">
                Claim Reward
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}