'use client'
import { useState } from 'react';
import { Hero, HeroManager } from '@/lib/heroManager';
import { storageManager } from '@/lib/storage';

interface HeroCollectionProps {
  heroes: Hero[];
  onHeroUpdate: (heroes: Hero[]) => void;
  heroManager: HeroManager;
}

export function HeroCollection({ heroes, onHeroUpdate, heroManager }: HeroCollectionProps) {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isSummoning, setIsSummoning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [customizingHero, setCustomizingHero] = useState<Hero | null>(null);
  const [customizationData, setCustomizationData] = useState({
    name: '',
    power: 50,
    health: 100,
    mana: 50
  });

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
      // Simulate hero summoning with loading effect
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

  const saveProgress = async () => {
    setIsSaving(true);
    try {
      // Simulate saving with loading effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Save logic would go here
      console.log('Progress saved!');
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = storageManager.exportData('current_wallet');
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tactical-crypto-arena-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsImporting(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const text = await file.text();
          const data = JSON.parse(text);
          if (data.heroes) {
            onHeroUpdate(data.heroes);
          }
        } catch (error) {
          console.error('Failed to import data:', error);
        } finally {
          setIsImporting(false);
        }
      }
    };
    input.click();
  };

  const startCustomization = (hero: Hero) => {
    setCustomizingHero(hero);
    setCustomizationData({
      name: hero.name,
      power: hero.power,
      health: hero.health,
      mana: hero.mana
    });
  };

  const saveCustomization = async () => {
    if (!customizingHero) return;

    const updatedHero = {
      ...customizingHero,
      ...customizationData
    };

    const updatedHeroes = heroes.map(h =>
      h.id === customizingHero.id ? updatedHero : h
    );

    onHeroUpdate(updatedHeroes);
    setCustomizingHero(null);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar with Save/Import/Export */}
      <div className="tactical-panel p-4 border-emerald-400/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider">TACTICAL UNITS COMMAND</h2>
          </div>

          {/* Toolbar Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={saveProgress}
              disabled={isSaving}
              className="military-button text-sm px-4 py-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto mb-1"></div>
                  SAVING...
                </>
              ) : (
                '💾 SAVE PROGRESS'
              )}
            </button>

            <button
              onClick={exportData}
              disabled={isExporting}
              className="tactical-button text-sm px-4 py-2 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto mb-1"></div>
                  EXPORTING...
                </>
              ) : (
                '📤 EXPORT DATA'
              )}
            </button>

            <button
              onClick={importData}
              disabled={isImporting}
              className="success-button text-sm px-4 py-2 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto mb-1"></div>
                  IMPORTING...
                </>
              ) : (
                '📥 IMPORT DATA'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Available Heroes Display */}
      <div className="tactical-panel p-6 border-blue-400/30">
        <h3 className="text-2xl font-bold text-white mb-4 font-mono tracking-wider text-center">
          🎯 AVAILABLE TACTICAL UNITS: {heroes.length}
        </h3>

        {heroes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚔️</div>
            <p className="text-slate-300 text-lg mb-4">No heroes deployed yet, Commander!</p>
            <p className="text-slate-400 text-sm">Summon your first tactical unit to begin your mission.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroes.map((hero) => (
              <div
                key={hero.id}
                className={`group cursor-pointer transform hover:scale-105 transition-all duration-500 ${getRarityGlow(hero.rarity)}`}
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-all duration-300">
                  {/* Hero Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">⚔️</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRarityColor(hero.rarity)}`}>
                      {hero.rarity.toUpperCase()}
                    </div>
                  </div>

                  {/* Hero Info */}
                  <h3 className="text-xl font-bold text-white mb-2">{hero.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Level:</span>
                      <span className="text-white">{hero.level}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Power:</span>
                      <span className="text-emerald-400">{hero.power}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Health:</span>
                      <span className="text-red-400">{hero.health}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Mana:</span>
                      <span className="text-blue-400">{hero.mana}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHero(hero);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-3 rounded-lg transition-all duration-300"
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startCustomization(hero);
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold py-2 px-3 rounded-lg transition-all duration-300"
                    >
                      CUSTOMIZE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summon New Hero Section */}
      <div className="tactical-panel p-6 border-green-400/30">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4 font-mono tracking-wider">🔮 SUMMON NEW TACTICAL UNIT</h3>
          <p className="text-slate-300 mb-6 font-mono">
            Deploy legendary crypto heroes to expand your tactical arsenal
          </p>
          <button
            onClick={summonNewHero}
            disabled={isSummoning}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl border-2 border-green-400/30 shadow-[0_0_20px_rgba(34,197,94,0.3)] transform hover:scale-105 transition-all duration-300"
          >
            {isSummoning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto mb-2"></div>
                SUMMONING TACTICAL UNIT...
              </>
            ) : (
              '🔮 SUMMON HERO (100 XP)'
            )}
          </button>
        </div>
      </div>

      {/* Hero Details Modal */}
      {selectedHero && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-400/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedHero.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRarityColor(selectedHero.rarity)}`}>
                  {selectedHero.rarity.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setSelectedHero(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{selectedHero.power}</div>
                <div className="text-gray-400 text-sm">POWER</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{selectedHero.health}</div>
                <div className="text-gray-400 text-sm">HEALTH</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{selectedHero.mana}</div>
                <div className="text-gray-400 text-sm">MANA</div>
              </div>
            </div>

            {/* Hero Traits */}
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-3">TRAITS</h4>
              <div className="space-y-3">
                {selectedHero.traits.map((trait, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">{trait.name}</span>
                      <span className="text-emerald-400">{trait.value}/{trait.maxValue}</span>
                    </div>
                    <div className="bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(trait.value / trait.maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">{trait.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedHero(null)}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-xl transition-all duration-300"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Hero Customization Modal */}
      {customizingHero && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-400/30 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">CUSTOMIZE {customizingHero.name}</h3>
              <p className="text-gray-300">Modify your tactical unit's attributes</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={customizationData.name}
                  onChange={(e) => setCustomizationData({ ...customizationData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Power: {customizationData.power}</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={customizationData.power}
                  onChange={(e) => setCustomizationData({ ...customizationData, power: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Health: {customizationData.health}</label>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={customizationData.health}
                  onChange={(e) => setCustomizationData({ ...customizationData, health: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Mana: {customizationData.mana}</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={customizationData.mana}
                  onChange={(e) => setCustomizationData({ ...customizationData, mana: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveCustomization}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                SAVE CHANGES
              </button>
              <button
                onClick={() => setCustomizingHero(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 