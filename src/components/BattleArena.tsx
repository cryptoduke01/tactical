'use client'
import { useState, useEffect } from 'react';
import { Hero } from '@/lib/heroManager';
import { ThreeJSBattleScene } from './ThreeJSBattleScene';

interface BattleArenaProps {
  heroes: Hero[];
  playerProfile: any;
  onBattleComplete: (result: any) => void;
}

interface BattleState {
  phase: 'idle' | 'searching' | 'battle' | 'finished';
  playerHero: Hero | null;
  opponentHero: Hero | null;
  battleLog: string[];
  playerHealth: number;
  opponentHealth: number;
  winner: string | null;
  round: number;
}

export function BattleArena({ heroes, playerProfile, onBattleComplete }: BattleArenaProps) {
  const [battleState, setBattleState] = useState<BattleState>({
    phase: 'idle',
    playerHero: null,
    opponentHero: null,
    battleLog: [],
    playerHealth: 100,
    opponentHealth: 100,
    winner: null,
    round: 1
  });

  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [show3DScene, setShow3DScene] = useState(false);
  const [isBattleLoading, setIsBattleLoading] = useState(false);

  // Enhanced opponent heroes with real names and better stats
  const opponentHeroes: Hero[] = [
    {
      id: 'opponent1',
      name: 'Vitalik Buterin',
      level: 2,
      xp: 150,
      rarity: 'epic',
      traits: [
        { name: 'Smart Contracts', value: 95, maxValue: 100, description: 'Ethereum architect' },
        { name: 'Research', value: 90, maxValue: 100, description: 'Academic approach' }
      ],
      image: 'https://example.com/vitalik.png',
      power: 90,
      health: 85,
      mana: 100
    },
    {
      id: 'opponent2',
      name: 'CZ Binance',
      level: 3,
      xp: 250,
      rarity: 'rare',
      traits: [
        { name: 'Trading', value: 95, maxValue: 100, description: 'Exchange mastery' },
        { name: 'Business', value: 100, maxValue: 100, description: 'Entrepreneurial skills' }
      ],
      image: 'https://example.com/cz.png',
      power: 95,
      health: 90,
      mana: 80
    },
    {
      id: 'opponent3',
      name: 'Satoshi Nakamoto',
      level: 5,
      xp: 500,
      rarity: 'legendary',
      traits: [
        { name: 'Cryptography', value: 100, maxValue: 100, description: 'Bitcoin creator' },
        { name: 'Innovation', value: 100, maxValue: 100, description: 'Revolutionary thinking' }
      ],
      image: 'https://example.com/satoshi.png',
      power: 100,
      health: 100,
      mana: 100
    },
    {
      id: 'opponent4',
      name: 'Raj Gokal',
      level: 3,
      xp: 300,
      rarity: 'legendary',
      traits: [
        { name: 'Solana Leadership', value: 95, maxValue: 100, description: 'Solana co-founder' },
        { name: 'Strategic Vision', value: 90, maxValue: 100, description: 'Business expert' }
      ],
      image: 'https://example.com/raj.png',
      power: 92,
      health: 88,
      mana: 85
    },
    {
      id: 'opponent5',
      name: 'Anatoly Yakovenko',
      level: 4,
      xp: 400,
      rarity: 'legendary',
      traits: [
        { name: 'Technical Innovation', value: 100, maxValue: 100, description: 'Solana founder' },
        { name: 'Blockchain Architecture', value: 95, maxValue: 100, description: 'PoH inventor' }
      ],
      image: 'https://example.com/anatoly.png',
      power: 98,
      health: 95,
      mana: 95
    }
  ];

  const startBattle = async () => {
    if (!selectedHero) return;

    setIsSearching(true);
    setBattleState(prev => ({ ...prev, phase: 'searching' }));

    // Simulate matchmaking with loading effect
    await new Promise(resolve => setTimeout(resolve, 3000));

    const randomOpponent = opponentHeroes[Math.floor(Math.random() * opponentHeroes.length)];

    setBattleState({
      phase: 'battle',
      playerHero: selectedHero,
      opponentHero: randomOpponent,
      battleLog: [`🎯 MATCH FOUND! ${selectedHero.name} vs ${randomOpponent.name}`],
      playerHealth: selectedHero.health,
      opponentHealth: randomOpponent.health,
      winner: null,
      round: 1
    });

    setIsSearching(false);
    setShow3DScene(true);

    // Start enhanced battle sequence
    startEnhancedBattleSequence(selectedHero, randomOpponent);
  };

  const startEnhancedBattleSequence = async (playerHero: Hero, opponentHero: Hero) => {
    const log = (message: string) => {
      setBattleState(prev => ({
        ...prev,
        battleLog: [...prev.battleLog, message]
      }));
    };

    setIsBattleLoading(true);

    // Enhanced battle sequence with multiple rounds
    for (let round = 1; round <= 5; round++) {
      setBattleState(prev => ({ ...prev, round }));

      // Round start
      await new Promise(resolve => setTimeout(resolve, 1000));
      log(`⚔️ ROUND ${round} - FIGHT!`);

      // Player attack
      await new Promise(resolve => setTimeout(resolve, 800));
      const playerDamage = Math.floor(Math.random() * 20) + 15; // 15-35 damage
      const newOpponentHealth = Math.max(0, battleState.opponentHealth - playerDamage);

      setBattleState(prev => ({
        ...prev,
        opponentHealth: newOpponentHealth
      }));

      log(`💥 ${playerHero.name} attacks for ${playerDamage} damage!`);

      // Check if opponent is defeated
      if (newOpponentHealth <= 0) {
        log(`🏆 ${playerHero.name} VICTORY! Opponent defeated!`);
        setBattleState(prev => ({
          ...prev,
          winner: playerHero.name,
          phase: 'finished'
        }));
        onBattleComplete({ winner: true, xpGained: 100 });
        break;
      }

      // Opponent attack
      await new Promise(resolve => setTimeout(resolve, 600));
      const opponentDamage = Math.floor(Math.random() * 18) + 12; // 12-30 damage
      const newPlayerHealth = Math.max(0, battleState.playerHealth - opponentDamage);

      setBattleState(prev => ({
        ...prev,
        playerHealth: newPlayerHealth
      }));

      log(`💥 ${opponentHero.name} counter-attacks for ${opponentDamage} damage!`);

      // Check if player is defeated
      if (newPlayerHealth <= 0) {
        log(`💀 ${opponentHero.name} VICTORY! You have been defeated!`);
        setBattleState(prev => ({
          ...prev,
          winner: opponentHero.name,
          phase: 'finished'
        }));
        onBattleComplete({ winner: false, xpGained: 20 });
        break;
      }

      // Round end
      await new Promise(resolve => setTimeout(resolve, 500));
      log(`📊 Round ${round} complete. ${playerHero.name}: ${newPlayerHealth}HP, ${opponentHero.name}: ${newOpponentHealth}HP`);
    }

    // If battle goes to final round, determine winner by remaining health
    if (battleState.phase !== 'finished') {
      const playerWins = battleState.playerHealth > battleState.opponentHealth;
      const winner = playerWins ? playerHero.name : opponentHero.name;
      const xpGained = playerWins ? 80 : 30;

      setBattleState(prev => ({
        ...prev,
        winner,
        phase: 'finished'
      }));

      log(`🏆 BATTLE ENDED! ${winner} wins by decision!`);
      onBattleComplete({ winner: playerWins, xpGained });
    }

    setIsBattleLoading(false);

    // Hide 3D scene after battle
    setTimeout(() => setShow3DScene(false), 5000);
  };

  const resetBattle = () => {
    setBattleState({
      phase: 'idle',
      playerHero: null,
      opponentHero: null,
      battleLog: [],
      playerHealth: 100,
      opponentHealth: 100,
      winner: null,
      round: 1
    });
    setSelectedHero(null);
    setShow3DScene(false);
  };

  if (battleState.phase === 'idle') {
    return (
      <div className="space-y-6">
        <div className="tactical-panel p-6 border-emerald-400/30">
          <h2 className="text-2xl font-bold text-white mb-4 font-mono tracking-wider">
            ⚔️ COMBAT ZONE - TACTICAL DEPLOYMENT
          </h2>
          <p className="text-slate-300 mb-6 font-mono">
            Select your tactical unit and engage in high-stakes PvP combat.
            Every battle affects your on-chain tactical rating.
          </p>

          {/* Hero Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 font-mono">SELECT TACTICAL UNIT:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heroes.map((hero) => (
                <div
                  key={hero.id}
                  className={`tactical-card p-4 cursor-pointer transition-all duration-200 ${selectedHero?.id === hero.id
                    ? 'border-emerald-400 border-2 tactical-glow-green'
                    : 'hover:border-emerald-400/50'
                    }`}
                  onClick={() => setSelectedHero(hero)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚔️</div>
                    <h4 className="font-bold text-white font-mono">{hero.name}</h4>
                    <p className="text-slate-400 text-sm font-mono">Level {hero.level}</p>
                    <p className="text-emerald-400 text-sm font-mono">Power: {hero.power}</p>
                    <div className="mt-2">
                      <div className="bg-gray-700 rounded-full h-2 mb-1">
                        <div
                          className="bg-red-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(hero.health / 100) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-red-400 text-xs font-mono">HP: {hero.health}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Battle Start Button */}
          <div className="text-center">
            <button
              onClick={startBattle}
              disabled={!selectedHero || isSearching}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl border-2 border-red-400/30 shadow-[0_0_20px_rgba(239,68,68,0.3)] transform hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed"
            >
              {!selectedHero ? 'SELECT A HERO FIRST' : '⚔️ DEPLOY TO BATTLE'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (battleState.phase === 'searching') {
    return (
      <div className="space-y-6">
        <div className="tactical-panel p-8 border-blue-400/30 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 border-4 border-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-blue-400 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-mono tracking-wider">🔍 SEARCHING FOR OPPONENT</h2>
          <p className="text-slate-300 text-lg font-mono">Analyzing tactical data...</p>
          <div className="mt-4 text-blue-400 text-sm font-mono">SCANNING SOLANA NETWORK</div>
        </div>
      </div>
    );
  }

  if (battleState.phase === 'battle' && battleState.playerHero && battleState.opponentHero) {
    return (
      <div className="space-y-6">
        {/* Battle Header */}
        <div className="tactical-panel p-6 border-red-400/30">
          <h2 className="text-2xl font-bold text-white mb-4 font-mono tracking-wider text-center">
            ⚔️ LIVE COMBAT - ROUND {battleState.round}
          </h2>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-emerald-400 mb-2">{battleState.playerHero.name}</h3>
              <div className="bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-emerald-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(battleState.playerHealth / battleState.playerHero.health) * 100}%` }}
                ></div>
              </div>
              <p className="text-emerald-400 font-mono">{battleState.playerHealth} HP</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-red-400 mb-2">{battleState.opponentHero.name}</h3>
              <div className="bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-red-400 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(battleState.opponentHealth / battleState.opponentHero.health) * 100}%` }}
                ></div>
              </div>
              <p className="text-red-400 font-mono">{battleState.opponentHealth} HP</p>
            </div>
          </div>
        </div>

        {/* 3D Battle Scene */}
        {show3DScene && (
          <div className="space-y-6">
            <div className="tactical-panel p-6 border-red-400/30">
              <h3 className="text-xl font-bold text-white mb-4 font-mono tracking-wider">
                🎮 LIVE 3D BATTLEFIELD
              </h3>
              <ThreeJSBattleScene
                isActive={show3DScene}
                onSceneReady={() => console.log('3D Battle scene ready')}
              />
            </div>
          </div>
        )}

        {/* Battle Status */}
        <div className="tactical-panel p-6 border-slate-500/30">
          <h3 className="text-lg font-bold text-white mb-4 font-mono tracking-wider">BATTLE LOG</h3>
          <div className="bg-gray-800/50 rounded-lg p-4 h-48 overflow-y-auto military-scrollbar">
            {battleState.battleLog.map((log, index) => (
              <div key={index} className="text-slate-300 font-mono text-sm mb-2">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {isBattleLoading && (
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-8 h-8 border-4 border-red-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 border-4 border-red-400 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-red-400 font-mono mt-2">BATTLE IN PROGRESS...</p>
          </div>
        )}
      </div>
    );
  }

  if (battleState.phase === 'finished') {
    return (
      <div className="space-y-6">
        <div className="tactical-panel p-8 border-emerald-400/30 text-center">
          <div className="text-6xl mb-4">
            {battleState.winner === battleState.playerHero?.name ? '🏆' : '💀'}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-mono tracking-wider">
            {battleState.winner === battleState.playerHero?.name ? 'VICTORY!' : 'DEFEAT!'}
          </h2>
          <p className="text-slate-300 text-lg mb-6 font-mono">
            {battleState.winner === battleState.playerHero?.name
              ? `${battleState.playerHero?.name} has proven superior in tactical combat!`
              : `${battleState.opponentHero?.name} has defeated your tactical unit!`
            }
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-emerald-400 mb-2">YOUR HERO</h3>
              <p className="text-white font-mono">{battleState.playerHero?.name}</p>
              <p className="text-slate-400 font-mono">Final HP: {battleState.playerHealth}</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-red-400 mb-2">OPPONENT</h3>
              <p className="text-white font-mono">{battleState.opponentHero?.name}</p>
              <p className="text-slate-400 font-mono">Final HP: {battleState.opponentHealth}</p>
            </div>
          </div>

          <button
            onClick={resetBattle}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-xl border-2 border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.3)] transform hover:scale-105 transition-all duration-300"
          >
            ⚔️ BATTLE AGAIN
          </button>
        </div>
      </div>
    );
  }

  return null;
} 