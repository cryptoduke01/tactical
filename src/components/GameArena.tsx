'use client'
import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { GameEngine } from '@/lib/gameLogic';
import { HoneycombGameManager } from '@/lib/honeycomb';
import { PlayerProfile } from '@/lib/types';
import { PlayerProfile as PlayerProfileComponent } from './PlayerProfile';
import { MissionSystem } from './MissionSystem';
import { Leaderboard } from './Leaderboard';
import { AchievementBadges } from './AchievementBadges';

export function GameArena() {
  const wallet = useWallet();
  const [gameEngine] = useState(new GameEngine());
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [reactionStart, setReactionStart] = useState(0);
  const [lastReactionTime, setLastReactionTime] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (wallet.publicKey) {
      initializePlayer();
    }
  }, [wallet.publicKey]);
 
  const initializePlayer = async () => {
    if (!wallet.publicKey) return;

    const manager = new HoneycombGameManager(wallet.publicKey.toBase58());
    try {
      const playerProfile = await manager.createPlayer();
      setProfile(playerProfile);
    } catch (error) {
      console.error('Failed to initialize player:', error);
    }
  };

  const startChallenge = () => {
    if (gameState !== 'idle') return;

    setGameState('waiting');
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds

    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      setReactionStart(Date.now());
    }, delay);
  };

  const handleReaction = () => {
    if (gameState === 'waiting') {
      // Too early - penalize
      clearTimeout(timeoutRef.current);
      setGameState('idle');
      setCombo(0);
      alert('Too early! Wait for the signal.');
      return;
    }

    if (gameState === 'ready') {
      const reactionTime = Date.now() - reactionStart;
      const points = gameEngine.addReactionTime(reactionTime);

      setLastReactionTime(reactionTime);
      setSessionScore(gameEngine.getSessionStats().score);
      setGameState('finished');

      // Combo system
      if (reactionTime < 400) {
        setCombo(combo + 1);
      } else {
        setCombo(0);
      }

      // Update player progress and missions
      if (profile) {
        updatePlayerProgress(reactionTime, points);
      }

      setTimeout(() => {
        setGameState('idle');
      }, 1500);
    }
  };

  const updatePlayerProgress = async (reactionTime: number, points: number) => {
    if (!profile || !wallet.publicKey) return;

    const manager = new HoneycombGameManager(wallet.publicKey.toBase58());
    const sessionStats = gameEngine.getSessionStats();

    try {
      const updatedProfile = await manager.updatePlayerProgress(profile, {
        ...sessionStats,
        score: points,
        averageReactionTime: reactionTime
      });

      setProfile(updatedProfile);

      // Update mission progress
      await updateMissionProgress(reactionTime, points);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const updateMissionProgress = async (reactionTime: number, points: number) => {
    if (!profile) return;

    const manager = new HoneycombGameManager(wallet.publicKey!.toBase58());

    // Update speed mission if reaction time is under 300ms
    if (reactionTime < 300) {
      await manager.updateMissionProgress('speed', 1);
    }

    // Update games played mission
    await manager.updateMissionProgress('games', 1);

    // Update score mission if session score is high enough
    if (sessionScore + points >= 100) {
      await manager.updateMissionProgress('score', 1);
    }
  };

  const getReactionFeedback = (time: number) => {
    if (time < 200) return { text: "Lightning! ⚡", color: "text-yellow-300", glow: "neon-glow" };
    if (time < 300) return { text: "Blazing! 🔥", color: "text-orange-300", glow: "pulse-success" };
    if (time < 500) return { text: "Nice! 👍", color: "text-green-300", glow: "" };
    if (time < 800) return { text: "Good 👌", color: "text-blue-300", glow: "" };
    return { text: "Slow 🐌", color: "text-gray-300", glow: "" };
  };

  const feedback = lastReactionTime > 0 ? getReactionFeedback(lastReactionTime) : null;

  return (
    <div className="space-y-6">
      {/* Main Game Area */}
      <div className="glass-card p-8 text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Reaction Arena</h2>
          <div className="flex justify-center gap-8 text-white">
            <div>Score: <span className="font-bold text-2xl text-purple-300">{sessionScore}</span></div>
            {combo > 0 && (
              <div className="text-yellow-300">
                Combo: <span className="font-bold">{combo}x</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 h-32 flex items-center justify-center">
          {gameState === 'idle' && (
            <button
              onClick={startChallenge}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 rounded-2xl text-2xl font-bold transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Challenge
            </button>
          )}

          {gameState === 'waiting' && (
            <button
              onClick={handleReaction}
              className="bg-red-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold cursor-wait"
            >
              Wait for GREEN...
            </button>
          )}

          {gameState === 'ready' && (
            <button
              onClick={handleReaction}
              className="bg-green-500 hover:bg-green-400 text-white px-12 py-6 rounded-2xl text-2xl font-bold animate-pulse neon-glow"
            >
              CLICK NOW! 🎯
            </button>
          )}

          {gameState === 'finished' && feedback && (
            <div className={`text-center ${feedback.glow}`}>
              <div className={`text-4xl font-bold ${feedback.color} mb-2`}>
                {feedback.text}
              </div>
              <div className="text-2xl text-white">
                {lastReactionTime}ms
              </div>
            </div>
          )}
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4 text-white text-sm">
          <div className="glass-card p-3">
            <div className="font-bold text-purple-300">Games</div>
            <div className="text-xl">{gameEngine.getSessionStats().gamesPlayed}</div>
          </div>
          <div className="glass-card p-3">
            <div className="font-bold text-blue-300">Avg Time</div>
            <div className="text-xl">
              {gameEngine.getSessionStats().averageReactionTime || 0}ms
            </div>
          </div>
          <div className="glass-card p-3">
            <div className="font-bold text-green-300">Consistency</div>
            <div className="text-xl">
              {Math.round((gameEngine.getSessionStats().consistency || 0) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Side Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profile && <PlayerProfileComponent profile={profile} />}
        <MissionSystem />
      </div>

      <Leaderboard />

      {/* Achievements */}
      {profile && <AchievementBadges achievements={profile.achievements} />}
    </div>
  );
}