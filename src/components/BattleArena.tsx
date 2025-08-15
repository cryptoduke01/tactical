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
}

export function BattleArena({ heroes, playerProfile, onBattleComplete }: BattleArenaProps) {
  const [battleState, setBattleState] = useState<BattleState>({
    phase: 'idle',
    playerHero: null,
    opponentHero: null,
    battleLog: [],
    playerHealth: 100,
    opponentHealth: 100,
    winner: null
  });

  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [show3DScene, setShow3DScene] = useState(false);

  // Mock opponent heroes for demo
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
    }
  ];

  const startBattle = async () => {
    if (!selectedHero) return;

    setIsSearching(true);
    setBattleState(prev => ({ ...prev, phase: 'searching' }));

    // Simulate matchmaking
    await new Promise(resolve => setTimeout(resolve, 2000));

    const randomOpponent = opponentHeroes[Math.floor(Math.random() * opponentHeroes.length)];

    setBattleState({
      phase: 'battle',
      playerHero: selectedHero,
      opponentHero: randomOpponent,
      battleLog: [`Battle started! ${selectedHero.name} vs ${randomOpponent.name}`],
      playerHealth: selectedHero.health,
      opponentHealth: randomOpponent.health,
      winner: null
    });

    setIsSearching(false);
    setShow3DScene(true);

    // Start battle sequence
    startBattleSequence(selectedHero, randomOpponent);
  };

  const startBattleSequence = async (playerHero: Hero, opponentHero: Hero) => {
    const log = (message: string) => {
      setBattleState(prev => ({
        ...prev,
        battleLog: [...prev.battleLog, message]
      }));
    };

    // Battle sequence with delays
    await new Promise(resolve => setTimeout(resolve, 1000));
    log(`${playerHero.name} charges into battle!`);

    await new Promise(resolve => setTimeout(resolve, 800));
    log(`${opponentHero.name} counters with tactical precision!`);

    await new Promise(resolve => setTimeout(resolve, 600));
    log(`${playerHero.name} uses special ability!`);

    await new Promise(resolve => setTimeout(resolve, 700));
    log(`${opponentHero.name} takes damage!`);

    // Simulate damage
    setBattleState(prev => ({
      ...prev,
      opponentHealth: Math.max(0, prev.opponentHealth - 30)
    }));

    await new Promise(resolve => setTimeout(resolve, 500));
    log(`${opponentHero.name} retaliates with devastating attack!`);

    // Simulate damage
    setBattleState(prev => ({
      ...prev,
      playerHealth: Math.max(0, prev.playerHealth - 25)
    }));

    await new Promise(resolve => setTimeout(resolve, 600));
    log(`${playerHero.name} makes final tactical move!`);

    // Determine winner
    const playerWins = Math.random() > 0.4; // 60% win rate for demo
    const winner = playerWins ? playerHero.name : opponentHero.name;

    setBattleState(prev => ({
      ...prev,
      winner,
      phase: 'finished'
    }));

    // Calculate XP gained
    const xpGained = playerWins ? 50 : 10;
    onBattleComplete({ winner: playerWins, xpGained });

    // Hide 3D scene after battle
    setTimeout(() => setShow3DScene(false), 3000);
  };

  const resetBattle = () => {
    setBattleState({
      phase: 'idle',
      playerHero: null,
      opponentHero: null,
      battleLog: [],
      playerHealth: 100,
      opponentHealth: 100,
      winner: null
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
                      <span className={`inline-block px-2 py-1 rounded text-xs font-mono ${hero.rarity === 'legendary' ? 'bg-yellow-600 text-white' :
                        hero.rarity === 'epic' ? 'bg-purple-600 text-white' :
                          hero.rarity === 'rare' ? 'bg-blue-600 text-white' :
                            'bg-slate-600 text-white'
                        }`}>
                        {hero.rarity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Battle Controls */}
          <div className="text-center">
            <button
              onClick={startBattle}
              disabled={!selectedHero}
              className={`tactical-button ${!selectedHero ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
            >
              {selectedHero ? 'DEPLOY TO BATTLEFIELD' : 'SELECT A HERO FIRST'}
            </button>
          </div>
        </div>

        {/* 3D Battle Scene Preview */}
        <div className="tactical-panel p-6 border-blue-400/30">
          <h3 className="text-xl font-bold text-white mb-4 font-mono tracking-wider">
            🎮 3D TACTICAL ENVIRONMENT PREVIEW
          </h3>
          <p className="text-slate-300 mb-4 font-mono text-sm">
            Experience the battlefield in full 3D with tactical cover, strategic positions, and immersive graphics.
          </p>
          <ThreeJSBattleScene isActive={false} />
        </div>
      </div>
    );
  }

  if (battleState.phase === 'searching') {
    return (
      <div className="tactical-panel p-8 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-slate-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-400 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 font-mono tracking-wider">
          SCANNING FOR OPPONENTS
        </h2>
        <p className="text-slate-300 font-mono">
          Searching tactical networks for worthy adversaries...
        </p>
        <div className="mt-4 text-emerald-400 text-sm font-mono">
          MATCHMAKING IN PROGRESS
        </div>
      </div>
    );
  }

  if (battleState.phase === 'battle') {
    return (
      <div className="space-y-6">
        {/* 3D Battle Scene */}
        <div className="tactical-panel p-6 border-red-400/30">
          <h3 className="text-xl font-bold text-white mb-4 font-mono tracking-wider">
            🎮 LIVE 3D BATTLEFIELD
          </h3>
          <ThreeJSBattleScene
            isActive={show3DScene}
            onSceneReady={() => console.log('3D Battle scene ready')}
          />
        </div>

        {/* Battle Status */}
        <div className="tactical-panel p-6 border-emerald-400/30">
          <h3 className="text-xl font-bold text-white mb-4 font-mono tracking-wider">
            BATTLE IN PROGRESS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Player Hero */}
            <div className="tactical-card p-4">
              <h4 className="font-bold text-white mb-2 font-mono">{battleState.playerHero?.name}</h4>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>HEALTH</span>
                  <span>{battleState.playerHealth}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${battleState.playerHealth}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-emerald-400 text-sm font-mono">Power: {battleState.playerHero?.power}</p>
            </div>

            {/* Opponent Hero */}
            <div className="tactical-card p-4">
              <h4 className="font-bold text-white mb-2 font-mono">{battleState.opponentHero?.name}</h4>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>HEALTH</span>
                  <span>{battleState.opponentHealth}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${battleState.opponentHealth}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-emerald-400 text-sm font-mono">Power: {battleState.opponentHero?.power}</p>
            </div>
          </div>

          {/* Battle Log */}
          <div className="tactical-card p-4 max-h-40 overflow-y-auto">
            <h4 className="font-bold text-white mb-2 font-mono">BATTLE LOG</h4>
            <div className="space-y-1">
              {battleState.battleLog.map((log, index) => (
                <div key={index} className="text-slate-300 text-sm font-mono">
                  <span className="text-emerald-400">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (battleState.phase === 'finished') {
    return (
      <div className="tactical-panel p-8 text-center">
        <div className="text-6xl mb-4">
          {battleState.winner === battleState.playerHero?.name ? '🏆' : '💀'}
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 font-mono tracking-wider">
          {battleState.winner === battleState.playerHero?.name ? 'VICTORY ACHIEVED' : 'DEFEAT SUFFERED'}
        </h2>
        <p className="text-slate-300 mb-6 font-mono">
          {battleState.winner === battleState.playerHero?.name
            ? 'Your tactical superiority has been proven on the battlefield.'
            : 'The enemy has demonstrated superior tactics. Learn from this defeat.'
          }
        </p>

        <div className="mb-6">
          <div className="hud-element inline-block mx-2">
            <div className="hud-label">BATTLE RESULT</div>
            <div className="hud-value">{battleState.winner}</div>
          </div>
          <div className="hud-element inline-block mx-2">
            <div className="hud-label">XP GAINED</div>
            <div className="hud-value">
              {battleState.winner === battleState.playerHero?.name ? '+50' : '+10'}
            </div>
          </div>
        </div>

        <button
          onClick={resetBattle}
          className="tactical-button"
        >
          RETURN TO COMBAT ZONE
        </button>
      </div>
    );
  }

  return null;
} 