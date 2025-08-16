// Sound Manager for immersive game audio
class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isMuted: boolean = false;
  private volume: number = 0.7;

  private constructor() {
    this.initializeAudio();
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
