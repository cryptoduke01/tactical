'use client'
import { useState, useEffect, useRef } from 'react';
import { Hero, PlayerProfile } from '@/lib/heroManager';
import { soundManager } from '@/lib/soundManager';
import { showSuccess, showError } from '@/lib/toastManager';

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
  position: { x: number; y: number };
  isAttacking: boolean;
  isDefending: boolean;
  lastAction: number;
  color: string;
  size: number;
}

interface BattleLog {
  id: string;
  message: string;
  timestamp: number;
  type: 'attack' | 'defend' | 'special' | 'result';
}

export function BattleArena({ heroes, playerProfile, onBattleComplete }: BattleArenaProps) {
  const [battleState, setBattleState] = useState<'idle' | 'hero-selection' | 'battling' | 'finished'>('idle');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [opponent, setOpponent] = useState<BattleCharacter | null>(null);
  const [playerCharacter, setPlayerCharacter] = useState<BattleCharacter | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLog[]>([]);
  const [battleTime, setBattleTime] = useState(30);
  const [isAutomated, setIsAutomated] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const battleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize battle when hero is selected
  useEffect(() => {
    if (selectedHero && battleState === 'hero-selection') {
      startBattle();
    }
  }, [selectedHero, battleState]);

  // Battle timer
  useEffect(() => {
    if (battleState === 'battling' && battleTime > 0) {
      const timer = setTimeout(() => {
        setBattleTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (battleTime === 0) {
      endBattle();
    }
  }, [battleTime, battleState]);

  const startHeroSelection = () => {
    if (heroes.length === 0) {
      showError('No Heroes Available', 'You need at least one hero to enter battle!');
      return;
    }
    setBattleState('hero-selection');
    soundManager.playButtonClick();
  };

  const selectHeroForBattle = (hero: Hero) => {
    setSelectedHero(hero);
    setBattleState('battling');
    soundManager.playButtonClick();
  };

  const startBattle = () => {
    if (!selectedHero) return;

    // Create player character
    const playerChar: BattleCharacter = {
      id: selectedHero.id,
      name: selectedHero.name,
      health: 100,
      maxHealth: 100,
      position: { x: 100, y: 200 },
      isAttacking: false,
      isDefending: false,
      lastAction: 0,
      color: '#14F195', // Solana green
      size: 40
    };

    // Create opponent (random hero from player's collection)
    const availableOpponents = heroes.filter(h => h.id !== selectedHero.id);
    const randomOpponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];

    const opponentChar: BattleCharacter = {
      id: randomOpponent?.id || 'opponent',
      name: randomOpponent?.name || 'Dark Warrior',
      health: 100,
      maxHealth: 100,
      position: { x: 500, y: 200 },
      isAttacking: false,
      isDefending: false,
      lastAction: 0,
      color: '#9945FF', // Solana purple
      size: 40
    };

    setPlayerCharacter(playerChar);
    setOpponent(opponentChar);
    setBattleTime(30);
    setBattleLog([]);
    setIsAutomated(true);

    // Start automated battle
    startAutomatedBattle();

    soundManager.playBattleSound();
  };

  const startAutomatedBattle = () => {
    if (battleIntervalRef.current) {
      clearInterval(battleIntervalRef.current);
    }

    battleIntervalRef.current = setInterval(() => {
      if (playerCharacter && opponent) {
        // Random actions for both characters
        if (Math.random() > 0.5) {
          performAttack('player');
        } else {
          performDefend('player');
        }

        setTimeout(() => {
          if (opponent && playerCharacter) {
            if (Math.random() > 0.5) {
              performAttack('opponent');
            } else {
              performDefend('opponent');
            }
          }
        }, 500);
      }
    }, 2000); // Action every 2 seconds
  };

  const performAttack = (attacker: 'player' | 'opponent') => {
    if (!playerCharacter || !opponent) return;

    const attackerChar = attacker === 'player' ? playerCharacter : opponent;
    const defenderChar = attacker === 'player' ? opponent : playerCharacter;

    // Calculate damage
    const baseDamage = 15;
    const randomDamage = Math.random() * 10;
    const totalDamage = Math.floor(baseDamage + randomDamage);

    // Update health
    const newHealth = Math.max(0, defenderChar.health - totalDamage);

    if (attacker === 'player') {
      setOpponent(prev => prev ? { ...prev, health: newHealth } : null);
    } else {
      setPlayerCharacter(prev => prev ? { ...prev, health: newHealth } : null);
    }

    // Add battle log
    const logEntry: BattleLog = {
      id: Date.now().toString(),
      message: `${attackerChar.name} attacks for ${totalDamage} damage!`,
      timestamp: Date.now(),
      type: 'attack'
    };
    setBattleLog(prev => [...prev, logEntry]);

    // Set attacking animation
    if (attacker === 'player') {
      setPlayerCharacter(prev => prev ? { ...prev, isAttacking: true } : null);
      setTimeout(() => setPlayerCharacter(prev => prev ? { ...prev, isAttacking: false } : null), 500);
    } else {
      setOpponent(prev => prev ? { ...prev, isAttacking: true } : null);
      setTimeout(() => setOpponent(prev => prev ? { ...prev, isAttacking: false } : null), 500);
    }

    soundManager.playBattleSound();
  };

  const performDefend = (defender: 'player' | 'opponent') => {
    if (!playerCharacter || !opponent) return;

    const defenderChar = defender === 'player' ? playerCharacter : opponent;

    // Add battle log
    const logEntry: BattleLog = {
      id: Date.now().toString(),
      message: `${defenderChar.name} takes a defensive stance!`,
      timestamp: Date.now(),
      type: 'defend'
    };
    setBattleLog(prev => [...prev, logEntry]);

    // Set defending animation
    if (defender === 'player') {
      setPlayerCharacter(prev => prev ? { ...prev, isDefending: true } : null);
      setTimeout(() => setPlayerCharacter(prev => prev ? { ...prev, isDefending: false } : null), 1000);
    } else {
      setOpponent(prev => prev ? { ...prev, isDefending: true } : null);
      setTimeout(() => setOpponent(prev => prev ? { ...prev, isDefending: false } : null), 1000);
    }
  };

  const endBattle = () => {
    if (battleIntervalRef.current) {
      clearInterval(battleIntervalRef.current);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsAutomated(false);
    setBattleState('finished');

    // Determine winner
    if (playerCharacter && opponent) {
      const playerWon = playerCharacter.health > opponent.health;
      const xpGained = playerWon ? Math.floor(Math.random() * 50) + 50 : -(Math.floor(Math.random() * 30) + 20);

      const resultLog: BattleLog = {
        id: Date.now().toString(),
        message: playerWon ? 'Victory! You won the battle!' : 'Defeat! Better luck next time!',
        timestamp: Date.now(),
        type: 'result'
      };
      setBattleLog(prev => [...prev, resultLog]);

      onBattleComplete({ winner: playerWon, xpGained });

      if (playerWon) {
        showSuccess('Battle Won!', `You gained ${xpGained} XP!`);
      } else {
        showError('Battle Lost', `You lost ${Math.abs(xpGained)} XP!`);
      }
    }
  };

  const resetBattle = () => {
    setBattleState('idle');
    setSelectedHero(null);
    setOpponent(null);
    setPlayerCharacter(null);
    setBattleLog([]);
    setBattleTime(30);
    setIsAutomated(false);

    if (battleIntervalRef.current) {
      clearInterval(battleIntervalRef.current);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Animation loop
  useEffect(() => {
    if (battleState === 'battling' && playerCharacter && opponent) {
      const animate = () => {
        if (playerCharacter && opponent) {
          // Move characters slightly for animation
          setPlayerCharacter(prev => prev ? {
            ...prev,
            position: {
              x: prev.position.x + (Math.random() - 0.5) * 2,
              y: prev.position.y + (Math.random() - 0.5) * 2
            }
          } : null);

          setOpponent(prev => prev ? {
            ...prev,
            position: {
              x: prev.position.x + (Math.random() - 0.5) * 2,
              y: prev.position.y + (Math.random() - 0.5) * 2
            }
          } : null);
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [battleState, playerCharacter, opponent]);

  // Render battle scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || battleState !== 'battling') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw player character
    if (playerCharacter) {
      ctx.fillStyle = playerCharacter.color;
      ctx.fillRect(
        playerCharacter.position.x - playerCharacter.size / 2,
        playerCharacter.position.y - playerCharacter.size / 2,
        playerCharacter.size,
        playerCharacter.size
      );

      // Draw health bar
      const healthBarWidth = 60;
      const healthBarHeight = 8;
      const healthPercentage = playerCharacter.health / playerCharacter.maxHealth;

      ctx.fillStyle = '#374151';
      ctx.fillRect(
        playerCharacter.position.x - healthBarWidth / 2,
        playerCharacter.position.y - playerCharacter.size / 2 - 20,
        healthBarWidth,
        healthBarHeight
      );

      ctx.fillStyle = '#14F195';
      ctx.fillRect(
        playerCharacter.position.x - healthBarWidth / 2,
        playerCharacter.position.y - playerCharacter.size / 2 - 20,
        healthBarWidth * healthPercentage,
        healthBarHeight
      );

      // Draw name
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(playerCharacter.name, playerCharacter.position.x, playerCharacter.position.y - playerCharacter.size / 2 - 30);
    }

    // Draw opponent
    if (opponent) {
      ctx.fillStyle = opponent.color;
      ctx.fillRect(
        opponent.position.x - opponent.size / 2,
        opponent.position.y - opponent.size / 2,
        opponent.size,
        opponent.size
      );

      // Draw health bar
      const healthBarWidth = 60;
      const healthBarHeight = 8;
      const healthPercentage = opponent.health / opponent.maxHealth;

      ctx.fillStyle = '#374151';
      ctx.fillRect(
        opponent.position.x - healthBarWidth / 2,
        opponent.position.y - opponent.size / 2 - 20,
        healthBarWidth,
        healthBarHeight
      );

      ctx.fillStyle = '#9945FF';
      ctx.fillRect(
        opponent.position.x - healthBarWidth / 2,
        opponent.position.y - opponent.size / 2 - 20,
        healthBarWidth * healthPercentage,
        healthBarHeight
      );

      // Draw name
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(opponent.name, opponent.position.x, opponent.position.y - opponent.size / 2 - 30);
    }

    // Draw battle effects
    if (playerCharacter?.isAttacking) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(playerCharacter.position.x + 30, playerCharacter.position.y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    if (opponent?.isAttacking) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(opponent.position.x - 30, opponent.position.y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [battleState, playerCharacter, opponent]);

  if (battleState === 'hero-selection') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="solana-card p-8 max-w-md w-full mx-4">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Select Your Hero</h3>
          <div className="space-y-3">
            {heroes.map(hero => (
              <button
                key={hero.id}
                onClick={() => selectHeroForBattle(hero)}
                className="w-full solana-button-secondary text-left p-4 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-green-500 rounded-lg flex items-center justify-center text-2xl">
                    {hero.emoji}
                  </div>
                  <div>
                    <div className="font-bold text-white">{hero.name}</div>
                    <div className="text-sm text-gray-300">Level {hero.level}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setBattleState('idle')}
            className="w-full mt-4 solana-button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Battle Header */}
      <div className="solana-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">⚔️ Battle Arena</h2>
            <p className="text-gray-300">Fight for glory and XP rewards!</p>
          </div>

          <div className="flex items-center gap-4">
            {battleState === 'battling' && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{battleTime}s</div>
                <div className="text-sm text-gray-400">Time Remaining</div>
              </div>
            )}

            {battleState === 'idle' && (
              <button
                onClick={startHeroSelection}
                className="solana-button"
              >
                🚀 Enter Battle
              </button>
            )}

            {battleState === 'battling' && (
              <button
                onClick={endBattle}
                className="solana-button-secondary"
              >
                ⏹️ Stop Battle
              </button>
            )}

            {battleState === 'finished' && (
              <button
                onClick={resetBattle}
                className="solana-button"
              >
                🔄 New Battle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Battle Canvas */}
        <div className="lg:col-span-2">
          <div className="solana-card p-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto border border-gray-700 rounded-lg"
            />

            {battleState === 'idle' && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">⚔️</div>
                <p>Select a hero to enter the battle arena</p>
              </div>
            )}
          </div>
        </div>

        {/* Battle Log */}
        <div className="lg:col-span-1">
          <div className="solana-card p-4 h-[400px] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Battle Log</h3>

            {battleLog.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <p>Battle log will appear here...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {battleLog.slice(-10).map(log => (
                  <div
                    key={log.id}
                    className={`p-2 rounded text-sm ${log.type === 'attack' ? 'bg-red-500/20 text-red-300' :
                      log.type === 'defend' ? 'bg-blue-500/20 text-blue-300' :
                        log.type === 'result' ? 'bg-green-500/20 text-green-300' :
                          'bg-gray-500/20 text-gray-300'
                      }`}
                  >
                    {log.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Battle Status */}
      {battleState === 'battling' && playerCharacter && opponent && (
        <div className="solana-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player Status */}
            <div>
              <h4 className="text-lg font-bold text-green-400 mb-3">Your Hero</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Health:</span>
                  <span className="text-white font-bold">{playerCharacter.health}/{playerCharacter.maxHealth}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(playerCharacter.health / playerCharacter.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Opponent Status */}
            <div>
              <h4 className="text-lg font-bold text-purple-400 mb-3">Opponent</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Health:</span>
                  <span className="text-white font-bold">{opponent.health}/{opponent.maxHealth}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(opponent.health / opponent.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 