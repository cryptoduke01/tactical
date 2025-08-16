'use client'
import { useState, useEffect, useRef } from 'react';
import { Hero, PlayerProfile } from '@/lib/heroManager';
import { soundManager } from '@/lib/soundManager';
import { showSuccess, showError, setGameplayMode } from '@/lib/toastManager';

interface BattleArenaProps {
  heroes: Hero[];
  playerProfile: PlayerProfile | null;
  onBattleComplete: (result: { winner: boolean; xpGained: number }) => void;
}

interface BattleCharacter {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  power: number;
  position: { x: number; y: number };
  isAttacking: boolean;
  isDefending: boolean;
  lastAction: string;
}

export function BattleArena({ heroes, playerProfile, onBattleComplete }: BattleArenaProps) {
  const [battleState, setBattleState] = useState<'idle' | 'battle' | 'victory' | 'defeat'>('idle');
  const [playerCharacter, setPlayerCharacter] = useState<BattleCharacter | null>(null);
  const [opponentCharacter, setOpponentCharacter] = useState<BattleCharacter | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [round, setRound] = useState(1);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [battleEffects, setBattleEffects] = useState<Array<{ id: string; type: string; x: number; y: number; timestamp: number }>>([]);

  const battleCanvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Initialize battle characters
  useEffect(() => {
    if (heroes.length > 0 && !playerCharacter) {
      const selectedHero = heroes[0]; // Use first hero for now
      setPlayerCharacter({
        id: selectedHero.id,
        name: selectedHero.name,
        health: selectedHero.health,
        maxHealth: selectedHero.health,
        power: selectedHero.power,
        position: { x: 100, y: 150 },
        isAttacking: false,
        isDefending: false,
        lastAction: ''
      });

      // Create opponent
      setOpponentCharacter({
        id: 'opponent',
        name: 'Dark Warrior',
        health: 120,
        maxHealth: 120,
        power: 85,
        position: { x: 500, y: 150 },
        isAttacking: false,
        isDefending: false,
        lastAction: ''
      });
    }
  }, [heroes, playerCharacter]);

  // Battle animation loop
  useEffect(() => {
    if (isBattleActive && battleState === 'battle') {
      const animate = () => {
        setBattleEffects(prev => prev.filter(effect => Date.now() - effect.timestamp < 1000));

        // Move characters slightly
        setPlayerCharacter(prev => prev ? {
          ...prev,
          position: {
            x: prev.position.x + (Math.random() - 0.5) * 2,
            y: prev.position.y + (Math.random() - 0.5) * 2
          }
        } : null);

        setOpponentCharacter(prev => prev ? {
          ...prev,
          position: {
            x: prev.position.x + (Math.random() - 0.5) * 2,
            y: prev.position.y + (Math.random() - 0.5) * 2
          }
        } : null);

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isBattleActive, battleState]);

  const startBattle = () => {
    if (!playerCharacter || !opponentCharacter) return;

    // Enable gameplay mode to reduce toast spam
    setGameplayMode(true);

    soundManager.playBattle();
    setIsBattleActive(true);
    setBattleState('battle');
    setRound(1);
    setPlayerHealth(playerCharacter.maxHealth);
    setOpponentHealth(opponentCharacter.maxHealth);
    setBattleLog(['Battle started!', `${playerCharacter.name} vs ${opponentCharacter.name}`]);

    // Add initial battle effects
    addBattleEffect('battle-start', 300, 150);
  };

  const performAttack = (attacker: 'player' | 'opponent') => {
    if (!isBattleActive || battleState !== 'battle') return;

    const attackerChar = attacker === 'player' ? playerCharacter : opponentCharacter;
    const defenderChar = attacker === 'player' ? opponentCharacter : playerCharacter;

    if (!attackerChar || !defenderChar) return;

    soundManager.playBattle();

    // Calculate damage
    const damage = Math.floor(attackerChar.power * (0.8 + Math.random() * 0.4));
    const newHealth = Math.max(0, defenderChar.health - damage);

    // Update health
    if (attacker === 'player') {
      setOpponentHealth(newHealth);
      setPlayerCharacter(prev => prev ? { ...prev, isAttacking: true, lastAction: 'attack' } : null);
    } else {
      setPlayerHealth(newHealth);
      setOpponentCharacter(prev => prev ? { ...prev, isAttacking: true, lastAction: 'attack' } : null);
    }

    // Add battle effects
    const effectX = attacker === 'player' ? 400 : 200;
    addBattleEffect('sword', effectX, 150);
    addBattleEffect('fire', effectX, 150);

    // Update battle log
    setBattleLog(prev => [...prev, `${attackerChar.name} attacks for ${damage} damage!`]);

    // Check for battle end
    if (newHealth <= 0) {
      endBattle(attacker === 'player');
      return;
    }

    // Reset attack state after animation
    setTimeout(() => {
      if (attacker === 'player') {
        setPlayerCharacter(prev => prev ? { ...prev, isAttacking: false } : null);
      } else {
        setOpponentCharacter(prev => prev ? { ...prev, isAttacking: false } : null);
      }
    }, 500);

    // AI opponent turn
    if (attacker === 'player') {
      setTimeout(() => {
        if (isBattleActive && battleState === 'battle') {
          performAttack('opponent');
        }
      }, 1000);
    }

    setRound(prev => prev + 1);
  };

  const addBattleEffect = (type: string, x: number, y: number) => {
    const effect = {
      id: `effect-${Date.now()}`,
      type,
      x,
      y,
      timestamp: Date.now()
    };
    setBattleEffects(prev => [...prev, effect]);
  };

  const endBattle = (playerWon: boolean) => {
    // Disable gameplay mode after battle
    setGameplayMode(false);

    setIsBattleActive(false);
    setBattleState(playerWon ? 'victory' : 'defeat');

    const xpGained = playerWon ? 50 : 10;
    const message = playerWon ? 'Victory! You defeated the opponent!' : 'Defeat! Better luck next time!';

    setBattleLog(prev => [...prev, message, `XP gained: ${xpGained}`]);

    // Call battle complete callback
    onBattleComplete({ winner: playerWon, xpGained });

    if (playerWon) {
      soundManager.playSuccess();
      showSuccess('Battle Won!', `Congratulations! You gained ${xpGained} XP!`);
    } else {
      soundManager.playError();
      showError('Battle Lost', 'You were defeated. Try again with a stronger hero!');
    }
  };

  const resetBattle = () => {
    setBattleState('idle');
    setIsBattleActive(false);
    setRound(1);
    setPlayerHealth(playerCharacter?.maxHealth || 100);
    setOpponentHealth(opponentCharacter?.maxHealth || 120);
    setBattleLog([]);
    setBattleEffects([]);
  };

  if (!playerCharacter || !opponentCharacter) {
    return (
      <div className="game-panel p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚔️</div>
          <h3 className="text-2xl font-bold text-white mb-4">No Heroes Available</h3>
          <p className="text-slate-300">You need at least one hero to enter the battle arena.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Battle Header */}
      <div className="game-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white">⚔️ Battle Arena</h2>
          <div className="text-[#14F195] font-semibold">Round {round}</div>
        </div>

        {/* Health Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-white mb-1">
              <span>{playerCharacter.name}</span>
              <span>{playerHealth} HP</span>
            </div>
            <div className="battle-health-bar">
              <div
                className="battle-health-fill player transition-all duration-500"
                style={{ width: `${(playerHealth / playerCharacter.maxHealth) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-white mb-1">
              <span>{opponentCharacter.name}</span>
              <span>{opponentHealth} HP</span>
            </div>
            <div className="battle-health-bar">
              <div
                className="battle-health-fill opponent transition-all duration-500"
                style={{ width: `${(opponentHealth / opponentCharacter.maxHealth) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2D Battle Arena */}
      <div className="game-panel p-6">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-white mb-2">🎮 LIVE 2D BATTLEFIELD</h3>
          <p className="text-slate-300">Watch your heroes engage in tactical combat!</p>
        </div>

        {/* Battle Canvas */}
        <div
          ref={battleCanvasRef}
          className="battle-arena-2d h-96 relative overflow-hidden"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(153, 69, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(153, 69, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Player Character */}
          {playerCharacter && (
            <div
              className={`battle-character player ${playerCharacter.isAttacking ? 'animate-pulse' : ''}`}
              style={{
                left: `${playerCharacter.position.x}px`,
                top: `${playerCharacter.position.y}px`
              }}
            >
              {playerCharacter.lastAction === 'attack' ? '⚔️' : '🛡️'}
            </div>
          )}

          {/* Opponent Character */}
          {opponentCharacter && (
            <div
              className={`battle-character opponent ${opponentCharacter.isAttacking ? 'animate-pulse' : ''}`}
              style={{
                left: `${opponentCharacter.position.x}px`,
                top: `${opponentCharacter.position.y}px`
              }}
            >
              {opponentCharacter.lastAction === 'attack' ? '⚔️' : '👹'}
            </div>
          )}

          {/* Battle Effects */}
          {battleEffects.map(effect => (
            <div
              key={effect.id}
              className="battle-effect"
              style={{ left: `${effect.x}px`, top: `${effect.y}px` }}
            >
              {effect.type === 'sword' && <span className="battle-sword">⚔️</span>}
              {effect.type === 'fire' && <span className="battle-fire">🔥</span>}
              {effect.type === 'battle-start' && <span className="text-[#14F195] text-4xl animate-ping">⚡</span>}
            </div>
          ))}

          {/* Battle Status */}
          <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600/50">
            <div className="text-white text-sm">
              <div className="font-semibold">Battle Status</div>
              <div className="text-[#14F195]">Active</div>
            </div>
          </div>
        </div>

        {/* Battle Controls */}
        <div className="flex justify-center gap-4 mt-6">
          {battleState === 'idle' && (
            <button
              onClick={startBattle}
              className="solana-button px-8 py-3 text-lg"
            >
              🚀 Start Battle
            </button>
          )}

          {battleState === 'battle' && isBattleActive && (
            <button
              onClick={() => performAttack('player')}
              disabled={playerCharacter?.isAttacking}
              className="solana-button success px-8 py-3 text-lg disabled:opacity-50"
            >
              ⚔️ Attack
            </button>
          )}

          {battleState === 'victory' && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-[#14F195] mb-4">Victory!</h3>
              <button
                onClick={resetBattle}
                className="solana-button px-6 py-2"
              >
                Fight Again
              </button>
            </div>
          )}

          {battleState === 'defeat' && (
            <div className="text-center">
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-2xl font-bold text-red-400 mb-4">Defeat</h3>
              <button
                onClick={resetBattle}
                className="solana-button px-6 py-2"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Battle Log */}
      <div className="game-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4">📜 Battle Log</h3>
        <div className="bg-slate-800/50 rounded-lg p-4 h-48 overflow-y-auto custom-scrollbar">
          {battleLog.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Battle log will appear here...</p>
          ) : (
            <div className="space-y-2">
              {battleLog.map((log, index) => (
                <div key={index} className="text-slate-200 text-sm">
                  <span className="text-[#14F195]">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 