'use client'
import { useState } from 'react';
import { Hero, HeroManager } from '@/lib/heroManager';

interface HeroCollectionProps {
  heroes: Hero[];
  onHeroUpdate: (heroes: Hero[]) => void;
  heroManager: HeroManager;
}

export function HeroCollection({ heroes, onHeroUpdate, heroManager }: HeroCollectionProps) {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isSummoning, setIsSummoning] = useState(false);

  const getRarityColor = (rarity: Hero['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-400/30';
      case 'epic': return 'text-purple-400 border-purple-400/30';
      case 'rare': return 'text-blue-400 border-blue-400/30';
      case 'common': return 'text-green-400 border-green-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  const getRarityGlow = (rarity: Hero['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'shadow-[0_0_30px_rgba(250,204,21,0.4)]';
      case 'epic': return 'shadow-[0_0_30px_rgba(168,85,247,0.4)]';
      case 'rare': return 'shadow-[0_0_30px_rgba(59,130,246,0.4)]';
      case 'common': return 'shadow-[0_0_30px_rgba(34,197,94,0.4)]';
      default: return 'shadow-[0_0_20px_rgba(156,163,175,0.4)]';
    }
  };

  const summonNewHero = async () => {
    setIsSummoning(true);
    try {
      // Simulate hero summoning
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newHero: Hero = {
        id: `hero_${Date.now()}`,
        name: 'Mystery Hero',
        level: 1,
        xp: 0,
        rarity: 'common',
        traits: [
          { name: 'Potential', value: 50, maxValue: 100, description: 'Untapped abilities' },
          { name: 'Growth', value: 60, maxValue: 100, description: 'Learning capacity' }
        ],
        image: 'https://example.com/mystery-hero.png',
        power: 60,
        health: 90,
        mana: 70
      };

      onHeroUpdate([...heroes, newHero]);
    } catch (error) {
      console.error('Error summoning hero:', error);
    } finally {
      setIsSummoning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-2">🏰 Hero Collection</h2>
        <p className="text-gray-300">Manage your legendary crypto heroes and evolve their traits</p>
      </div>

      {/* Summon New Hero */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-2xl p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Summon New Hero</h3>
        <p className="text-gray-300 mb-6">
          Use your DeFi XP to summon new heroes and expand your collection
        </p>
        <button
          onClick={summonNewHero}
          disabled={isSummoning}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl border-2 border-green-400/30 shadow-[0_0_20px_rgba(34,197,94,0.3)] transform hover:scale-105 transition-all duration-300"
        >
          {isSummoning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto mb-2"></div>
              Summoning...
            </>
          ) : (
            '🔮 Summon Hero (100 XP)'
          )}
        </button>
      </div>

      {/* Heroes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            onClick={() => setSelectedHero(hero)}
            className={`group cursor-pointer transform hover:scale-105 transition-all duration-500 ${getRarityGlow(hero.rarity)}`}
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-all duration-300">
              {/* Hero Image Placeholder */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                {hero.name.charAt(0)}
              </div>

              {/* Hero Info */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{hero.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRarityColor(hero.rarity)}`}>
                  {hero.rarity.toUpperCase()}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div>
                  <div className="text-green-400 font-bold">{hero.power}</div>
                  <div className="text-gray-400 text-xs">Power</div>
                </div>
                <div>
                  <div className="text-red-400 font-bold">{hero.health}</div>
                  <div className="text-gray-400 text-xs">Health</div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold">{hero.mana}</div>
                  <div className="text-gray-400 text-xs">Mana</div>
                </div>
              </div>

              {/* Level & XP */}
              <div className="text-center">
                <div className="text-white font-bold mb-1">Level {hero.level}</div>
                <div className="bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(hero.xp % 100) / 100 * 100}%` }}
                  ></div>
                </div>
                <div className="text-gray-400 text-xs">{hero.xp} XP</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Details Modal */}
      {selectedHero && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-400/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold text-white">{selectedHero.name}</h3>
              <button
                onClick={() => setSelectedHero(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Hero Traits */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xl font-bold text-white">Traits</h4>
              {selectedHero.traits.map((trait, index) => (
                <div key={index} className="bg-gray-700/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{trait.name}</span>
                    <span className="text-green-400 font-bold">{trait.value}/{trait.maxValue}</span>
                  </div>
                  <div className="bg-gray-600 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(trait.value / trait.maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-300 text-sm">{trait.description}</p>
                </div>
              ))}
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{selectedHero.power}</div>
                <div className="text-gray-300">Power</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{selectedHero.health}</div>
                <div className="text-gray-300">Health</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{selectedHero.mana}</div>
                <div className="text-gray-300">Mana</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 rounded-xl transition-all duration-300">
                ⚔️ Send to Battle
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-300">
                🏆 Send on Quest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 