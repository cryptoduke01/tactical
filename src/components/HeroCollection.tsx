'use client'
import { useState } from 'react';
import { Hero, HeroManager } from '@/lib/heroManager';
import { storageManager } from '@/lib/storage';
import { soundManager } from '@/lib/soundManager';
import { showSuccess, showError } from '@/lib/toastManager';

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
      case 'legendary': return 'text-[#9945FF] border-[#9945FF]/50';
      case 'epic': return 'text-[#14F195] border-[#14F195]/50';
      case 'rare': return 'text-blue-400 border-blue-400/50';
      case 'common': return 'text-green-400 border-green-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  const getRarityClass = (rarity: Hero['rarity']) => {
    return `hero-card ${rarity}`;
  };

  const summonNewHero = async () => {
    soundManager.playButtonClick();
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
      soundManager.playHeroSummon();
      showSuccess('Hero Summoned!', `New hero "${newHero.name}" has joined your collection!`);
    } catch (error) {
      console.error('Error summoning hero:', error);
      showError('Summon Failed', 'Failed to summon new hero. Please try again.');
    } finally {
      setIsSummoning(false);
    }
  };

  const saveProgress = async () => {
    soundManager.playButtonClick();
    setIsSaving(true);

    try {
      // Simulate saving with loading effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Save logic would go here
      console.log('Progress saved successfully!');
      showSuccess('Progress Saved', 'Your game progress has been saved successfully!');
    } catch (error) {
      console.error('Error saving progress:', error);
      showError('Save Failed', 'Failed to save progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const exportData = async () => {
    soundManager.playButtonClick();
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

      showSuccess('Data Exported', 'Your game data has been exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showError('Export Failed', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const importData = () => {
    soundManager.playButtonClick();
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
            showSuccess('Data Imported', 'Your game data has been imported successfully!');
          }
        } catch (error) {
          console.error('Failed to import data:', error);
          showError('Import Failed', 'Failed to import data. Please check the file format.');
        } finally {
          setIsImporting(false);
        }
      }
    };
    input.click();
  };

  const startCustomization = (hero: Hero) => {
    soundManager.playButtonClick();
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

    soundManager.playButtonClick();
    const updatedHero = {
      ...customizingHero,
      ...customizationData
    };

    const updatedHeroes = heroes.map(h =>
      h.id === customizingHero.id ? updatedHero : h
    );

    onHeroUpdate(updatedHeroes);
    setCustomizingHero(null);
    showSuccess('Hero Updated', `Hero "${updatedHero.name}" has been customized successfully!`);
  };

  const openHeroDetails = (hero: Hero) => {
    soundManager.playButtonClick();
    setSelectedHero(hero);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar with Save/Import/Export */}
      <div className="game-panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#14F195] rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold text-white tracking-wider">Hero Collection</h2>
          </div>

          {/* Toolbar Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={saveProgress}
              disabled={isSaving}
              className="solana-button success disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="loading-spinner mx-auto mb-1"></div>
                  Saving...
                </>
              ) : (
                '💾 Save Progress'
              )}
            </button>

            <button
              onClick={exportData}
              disabled={isExporting}
              className="solana-button secondary disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="loading-spinner mx-auto mb-1"></div>
                  Exporting...
                </>
              ) : (
                '📤 Export Data'
              )}
            </button>

            <button
              onClick={importData}
              disabled={isImporting}
              className="solana-button warning disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <div className="loading-spinner mx-auto mb-1"></div>
                  Importing...
                </>
              ) : (
                '📥 Import Data'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Available Heroes Display */}
      <div className="game-panel p-6">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          🎯 Available Heroes: {heroes.length}
        </h3>

        {heroes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚔️</div>
            <p className="text-slate-200 text-lg mb-4">No heroes deployed yet, Commander!</p>
            <p className="text-slate-300 text-sm">Summon your first tactical unit to begin your mission.</p>
          </div>
        ) : (
          <div className="responsive-grid">
            {heroes.map((hero) => (
              <div
                key={hero.id}
                className={`group cursor-pointer transform hover:scale-105 transition-all duration-500 ${getRarityClass(hero.rarity)}`}
              >
                {/* Hero Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">⚔️</div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRarityColor(hero.rarity)}`}>
                    {hero.rarity.toUpperCase()}
                  </div>
                </div>

                {/* Hero Info */}
                <h3 className="text-xl font-bold text-white mb-3">{hero.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Level:</span>
                    <span className="text-white">{hero.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Power:</span>
                    <span className="text-[#14F195]">{hero.power}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Health:</span>
                    <span className="text-[#14F195]">{hero.health}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Mana:</span>
                    <span className="text-[#14F195]">{hero.mana}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openHeroDetails(hero);
                    }}
                    className="flex-1 solana-button secondary text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startCustomization(hero);
                    }}
                    className="flex-1 solana-button warning text-sm"
                  >
                    Customize
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summon New Hero Section */}
      <div className="game-panel p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4 tracking-wider">🔮 Summon New Hero</h3>
          <p className="text-slate-200 mb-6">
            Deploy legendary crypto heroes to expand your tactical arsenal
          </p>
          <button
            onClick={summonNewHero}
            disabled={isSummoning}
            className="solana-button disabled:opacity-50 px-8 py-4 text-lg"
          >
            {isSummoning ? (
              <>
                <div className="loading-spinner mx-auto mb-2"></div>
                Summoning Hero...
              </>
            ) : (
              '🔮 Summon Hero (100 XP)'
            )}
          </button>
        </div>
      </div>

      {/* Hero Details Modal */}
      {selectedHero && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-600/50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedHero.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRarityColor(selectedHero.rarity)}`}>
                  {selectedHero.rarity.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setSelectedHero(null)}
                className="text-slate-300 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#14F195]">{selectedHero.power}</div>
                <div className="text-slate-300 text-sm">POWER</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#14F195]">{selectedHero.health}</div>
                <div className="text-slate-300 text-sm">HEALTH</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#14F195]">{selectedHero.mana}</div>
                <div className="text-slate-300 text-sm">MANA</div>
              </div>
            </div>

            {/* Hero Traits */}
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-3">Traits</h4>
              <div className="space-y-3">
                {selectedHero.traits.map((trait, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">{trait.name}</span>
                      <span className="text-[#14F195]">{trait.value}/{trait.maxValue}</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#14F195] to-[#10b981] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(trait.value / trait.maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-slate-200 text-sm mt-2">{trait.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedHero(null)}
              className="w-full solana-button secondary py-3"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Customization Modal */}
      {customizingHero && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-600/50 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Customize {customizingHero.name}</h3>
              <p className="text-slate-200">Modify your tactical unit's attributes</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-200 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={customizationData.name}
                  onChange={(e) => setCustomizationData({ ...customizationData, name: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#9945FF]/70"
                />
              </div>

              <div>
                <label className="block text-slate-200 text-sm mb-2">Power: {customizationData.power}</label>
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
                <label className="block text-slate-200 text-sm mb-2">Health: {customizationData.health}</label>
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
                <label className="block text-slate-200 text-sm mb-2">Mana: {customizationData.mana}</label>
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
                className="flex-1 solana-button success py-3"
              >
                Save Changes
              </button>
              <button
                onClick={() => setCustomizingHero(null)}
                className="flex-1 solana-button secondary py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 