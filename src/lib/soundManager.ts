// Sound Manager for immersive game audio
class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isBackgroundMusicPlaying: boolean = false;

  private constructor() {
    this.initializeAudio();
    this.initializeBackgroundMusic();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      await this.loadSounds();
    } catch (error) {
      console.log("Audio not supported in this browser");
    }
  }

  private async loadSounds() {
    if (!this.audioContext) return;

    // Generate procedural sounds
    this.generateButtonClick();
    this.generateSuccessSound();
    this.generateErrorSound();
    this.generateBattleSound();
    this.generateHeroSummon();
    this.generateLevelUp();
  }

  private generateButtonClick() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 4410, 44100);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.sin(i * 0.1) * Math.exp(-i * 0.001) * 0.3;
    }

    this.sounds.set("buttonClick", buffer);
  }

  private generateSuccessSound() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 13230, 44100);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / 44100;
      data[i] =
        Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 2) * 0.4 +
        Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 2) * 0.2;
    }

    this.sounds.set("success", buffer);
  }

  private generateErrorSound() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 13230, 44100);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / 44100;
      data[i] =
        Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 1.5) * 0.4 +
        Math.sin(2 * Math.PI * 150 * t) * Math.exp(-t * 1.5) * 0.2;
    }

    this.sounds.set("error", buffer);
  }

  private generateBattleSound() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 22050, 44100);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / 44100;
      data[i] =
        Math.sin(2 * Math.PI * 300 * t) * Math.exp(-t * 3) * 0.3 +
        Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 3) * 0.2;
    }

    this.sounds.set("battle", buffer);
  }

  private generateHeroSummon() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 26460, 44100);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / 44100;
      data[i] =
        Math.sin(2 * Math.PI * 400 * t) * Math.exp(-t * 1.8) * 0.4 +
        Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 1.8) * 0.3 +
        Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 1.8) * 0.2;
    }

    this.sounds.set("heroSummon", buffer);
  }

  private generateLevelUp() {
    if (!this.audioContext) return;

    const buffer = this.audioContext.createBuffer(1, 19845, 44100);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / 44100;
      data[i] =
        Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 2) * 0.4 +
        Math.sin(2 * Math.PI * 900 * t) * Math.exp(-t * 2) * 0.3 +
        Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 2) * 0.2;
    }

    this.sounds.set("levelUp", buffer);
  }

  private initializeBackgroundMusic() {
    try {
      // Create background music element for afro instrumentals
      this.backgroundMusic = new Audio();
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.volume * 0.3; // Background music at 30% of main volume

      // Set real afro instrumental URLs (free music)
      const afroInstrumentals = [
        "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual afro music
        "https://www.soundjay.com/misc/sounds/bell-ringing-04.wav", // Placeholder - replace with actual afro music
      ];

      // Use first available afro instrumental
      this.backgroundMusic.src = afroInstrumentals[0];

      // Handle errors gracefully
      this.backgroundMusic.onerror = () => {
        console.log("Background music not available, using procedural sounds");
        // Try alternative URL
        if (afroInstrumentals[1]) {
          this.backgroundMusic!.src = afroInstrumentals[1];
        }
      };

      // Handle successful load
      this.backgroundMusic.oncanplay = () => {
        console.log("Afro instrumental loaded successfully");
      };
    } catch (error) {
      console.log("Background music not supported");
    }
  }

  // Play background afro instrumental music
  public playBackgroundMusic() {
    if (this.backgroundMusic && !this.isBackgroundMusicPlaying) {
      this.backgroundMusic.play().catch((error) => {
        console.log("Could not play background music:", error);
        // Fallback to procedural sounds
        this.playProceduralBackground();
      });
      this.isBackgroundMusicPlaying = true;
    }
  }

  // Fallback procedural background music
  private playProceduralBackground() {
    if (!this.audioContext) return;

    // Create a continuous procedural afro-like sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3 note
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime + 2); // A4 note
    oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime + 4); // E4 note

    gainNode.gain.setValueAtTime(
      this.volume * 0.1,
      this.audioContext.currentTime
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 8
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 8);
  }

  // Stop background music
  public stopBackgroundMusic() {
    if (this.backgroundMusic && this.isBackgroundMusicPlaying) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.isBackgroundMusicPlaying = false;
    }
  }

  // Set background music source (for custom afro instrumentals)
  public setBackgroundMusic(url: string) {
    if (this.backgroundMusic) {
      this.backgroundMusic.src = url;
      this.backgroundMusic.load();
    }
  }

  // Toggle background music
  public toggleBackgroundMusic() {
    if (this.isBackgroundMusicPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    return this.isBackgroundMusicPlaying;
  }

  public playSound(soundName: string) {
    if (this.isMuted || !this.audioContext || !this.sounds.has(soundName))
      return;

    try {
      const buffer = this.sounds.get(soundName)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0);
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume * 0.3;
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  // Convenience methods for common sounds
  public playButtonClick() {
    this.playSound("buttonClick");
  }

  public playSuccess() {
    this.playSound("success");
  }

  public playError() {
    this.playSound("error");
  }

  public playBattle() {
    this.playSound("battle");
  }

  public playHeroSummon() {
    this.playSound("heroSummon");
  }

  public playLevelUp() {
    this.playSound("levelUp");
  }
}

export const soundManager = SoundManager.getInstance();
