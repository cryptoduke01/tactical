# ⚡ Skill Arena - Honeycomb Protocol Game

A competitive reaction-time game built with **Honeycomb Protocol** featuring on-chain progression, daily missions, and skill traits that evolve based on player performance.

## 🎮 Live Demo

**Play Now:** [Your Deployed URL Here]

## 🏆 Bounty Submission Features

This game demonstrates **innovative use of Honeycomb Protocol** as a core game mechanic:

### ✅ **Honeycomb Protocol Integration**

- **On-Chain Player Profiles** - User creation and management via Honeycomb
- **Skill Traits System** - Speed, Consistency, Focus traits that evolve on-chain
- **Mission System** - Daily challenges with XP rewards tracked via Honeycomb
- **Progression System** - Levels, XP, and achievements stored on-chain
- **Compression** - Cost-effective state storage using Honeycomb's compression

### ✅ **Core Game Mechanics**

- **Reaction Testing** - Click when the button turns green (1-4 second random delays)
- **Scoring System** - Points based on reaction speed (200ms = 20pts, 800ms = 2pts)
- **Combo System** - Chain fast reactions for multipliers
- **Real-time Feedback** - Visual and performance feedback for each attempt

### ✅ **Progression & Rewards**

- **Daily Missions** - Speed challenges, game count targets, score milestones
- **Skill Evolution** - Traits improve based on actual gameplay performance
- **Level System** - XP-based progression with visual feedback
- **Achievement Badges** - Unlockable rewards for milestones

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Connect Wallet & Play

- Open [http://localhost:3000](http://localhost:3000)
- Connect Phantom or Solflare wallet
- Start playing reaction challenges!

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Solana Devnet
- **Game Infrastructure**: Honeycomb Protocol
- **Wallets**: Phantom, Solflare support
- **UI**: Glassmorphism design, mobile-responsive

## 🎯 How Honeycomb Powers This Game

### **User Management**

```typescript
// Player profiles created and managed via Honeycomb
const manager = new HoneycombGameManager(walletAddress);
const playerProfile = await manager.createPlayer();
```

### **Trait Evolution**

```typescript
// Skills evolve based on actual gameplay performance
const speedGain = sessionData.averageReactionTime < 400 ? 5 : 2;
const consistencyGain = sessionData.consistency > 0.8 ? 3 : 1;
```

### **Mission System**

```typescript
// Daily challenges with on-chain progress tracking
const missions = await manager.createDailyMissions();
await manager.updateMissionProgress("speed", 1);
```

### **Progression Storage**

```typescript
// All player data stored on-chain via Honeycomb
await manager.updatePlayerProgress(profile, sessionData);
```

## 🎮 Game Features

### **Reaction Arena**

- Random delay challenges (1-4 seconds)
- Click timing accuracy testing
- Real-time scoring and feedback
- Combo system for skilled players

### **Player Profile**

- Level progression with XP bars
- Skill trait visualization
- Game statistics tracking
- Achievement showcase

### **Daily Missions**

- Speed Demon: React under 300ms 5 times
- Daily Grind: Play 10 games
- High Scorer: Score 100 points in one session

### **Leaderboard**

- Global rankings display
- Performance metrics
- Competitive positioning

## 📱 Mobile Experience

- **Responsive Design** - Works perfectly on all devices
- **Touch Optimized** - Smooth gameplay on mobile
- **Performance Optimized** - 60fps gameplay experience

## 🔧 Development

### **Project Structure**

```
src/
├── app/           # Next.js app router
├── components/    # React components
├── lib/          # Game logic & Honeycomb integration
└── utils/        # Helper functions
```

### **Key Components**

- `GameArena.tsx` - Main game interface
- `PlayerProfile.tsx` - Player stats & traits
- `MissionSystem.tsx` - Daily challenges
- `Leaderboard.tsx` - Global rankings
- `AchievementBadges.tsx` - Unlocked achievements

### **Honeycomb Integration**

- `honeycomb.ts` - Protocol client & game manager
- `gameLogic.ts` - Core game mechanics
- `types.ts` - TypeScript interfaces

## 🎯 Bounty Requirements Met

✅ **Game Concept** - Competitive reaction-time game  
✅ **Honeycomb Integration** - Core game mechanics powered by protocol  
✅ **Missions/Quests** - Daily challenges with rewards  
✅ **Trait Assignment** - Evolving skill system  
✅ **On-Chain Progression** - XP, levels, achievements  
✅ **Public GitHub** - Complete source code  
✅ **Working Prototype** - Fully functional game  
✅ **Video Walkthrough** - 3-minute demonstration

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
npm install -g vercel
vercel --prod
```

### **Netlify**

```bash
npm run build
# Upload dist folder to netlify.com
```

## 🎮 How to Play

1. **Connect Wallet** - Use Phantom or Solflare
2. **Start Challenge** - Click "Start Challenge" button
3. **Wait for Signal** - Button will turn green randomly
4. **React Fast** - Click immediately when green appears
5. **Build Skills** - Improve traits through consistent play
6. **Complete Missions** - Earn XP and unlock achievements
7. **Climb Leaderboard** - Compete with players worldwide

## 🔮 Future Enhancements

- **Multiplayer Mode** - Real-time PvP challenges
- **Tournament System** - Scheduled competitive events
- **NFT Rewards** - Unique achievement badges
- **Social Features** - Friend challenges and sharing
- **Advanced Missions** - Complex skill-based challenges

## 📄 License

MIT License - Open source for the Solana community

## 🤝 Contributing

This project was built for the Solana Game Jam bounty. Feel free to fork and enhance!

---

**Built with ❤️ for the Solana & Honeycomb Protocol communities**
