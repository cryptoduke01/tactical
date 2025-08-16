import { soundManager } from "./soundManager";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

class ToastManager {
  private static instance: ToastManager;
  private toasts: ToastMessage[] = [];
  private listeners: ((toasts: ToastMessage[]) => void)[] = [];
  private isInitialized = false;
  private originalConsole: any = {};
  private isGameplayMode = false;

  private constructor() {
    this.initializeConsoleCapture();
  }

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  private initializeConsoleCapture() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Store original console methods
    this.originalConsole.log = console.log;
    this.originalConsole.info = console.info;
    this.originalConsole.warn = console.warn;
    this.originalConsole.error = console.error;
    this.originalConsole.debug = console.debug;

    // Capture console.log - filter out unnecessary messages
    console.log = (...args) => {
      this.originalConsole.log.apply(console, args);
      const message = args.join(" ");

      // Filter out unnecessary logs during gameplay
      if (!this.shouldShowToast(message)) return;

      this.showToast("info", "Console Log", message);
    };

    // Capture console.info - filter out unnecessary messages
    console.info = (...args) => {
      this.originalConsole.info.apply(console, args);
      const message = args.join(" ");

      if (!this.shouldShowToast(message)) return;

      this.showToast("info", "Info", message);
    };

    // Capture console.warn - always show warnings
    console.warn = (...args) => {
      this.originalConsole.warn.apply(console, args);
      this.showToast("warning", "Warning", args.join(" "));
    };

    // Capture console.error - always show errors
    console.error = (...args) => {
      this.originalConsole.error.apply(console, args);
      this.showToast("error", "Error", args.join(" "));
    };

    // Capture console.success (custom)
    (console as any).success = (...args: any[]) => {
      this.showToast("success", "Success", args.join(" "));
    };

    // Capture console.debug - filter out unnecessary messages
    console.debug = (...args) => {
      this.originalConsole.debug.apply(console, args);
      const message = args.join(" ");

      if (!this.shouldShowToast(message)) return;

      this.showToast("info", "Debug", message);
    };
  }

  // Filter out unnecessary console messages during gameplay
  private shouldShowToast(message: string): boolean {
    if (!this.isGameplayMode) return true;

    // Filter out common game loop messages
    const filteredMessages = [
      "3D Battle scene ready",
      "Battle scene ready",
      "Animation frame",
      "Rendering",
      "Update loop",
      "Game tick",
      "Frame rate",
      "Performance",
    ];

    return !filteredMessages.some((filter) =>
      message.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Filter out duplicate action messages
  private isDuplicateAction(message: string): boolean {
    const duplicatePatterns = [
      "Progress saved successfully!",
      "Progress saved!",
      "Data exported successfully!",
      "Data imported successfully!",
      "Hero summoned successfully!",
      "Hero created successfully!",
      "XP deducted for hero customization:",
      "XP deducted for hero summon:",
      'Hero ".*" has been customized successfully!',
      'Hero ".*" has been summoned successfully!',
    ];

    return duplicatePatterns.some((pattern) => {
      // Handle regex patterns with wildcards
      if (pattern.includes(".*")) {
        const regex = new RegExp(pattern.replace(".*", ".*"));
        return regex.test(message);
      }
      return message.toLowerCase().includes(pattern.toLowerCase());
    });
  }

  // Enable/disable gameplay mode to reduce toast spam
  public setGameplayMode(enabled: boolean) {
    this.isGameplayMode = enabled;
  }

  public showToast(
    type: ToastMessage["type"],
    title: string,
    message: string,
    duration: number = 5000
  ) {
    try {
      // Check if this is a duplicate action message
      if (this.isDuplicateAction(message)) {
        // Only show the main action toast, not console duplicates
        if (title === "Console Log" || title === "Info") {
          return null;
        }
      }

      const toast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random()}`,
        type,
        title,
        message,
        duration,
        timestamp: Date.now(),
      };

      this.toasts.push(toast);
      this.notifyListeners();

      // Play sound based on type
      switch (type) {
        case "success":
          soundManager.playSuccess();
          break;
        case "error":
          soundManager.playError();
          break;
        case "warning":
          soundManager.playError(); // Use error sound for warnings
          break;
        default:
          soundManager.playButtonClick();
      }

      // Auto-remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(toast.id);
        }, duration);
      }

      return toast.id;
    } catch (error) {
      // Fallback to original console if toast fails
      this.originalConsole.error("Toast error:", error);
      return null;
    }
  }

  public removeToast(id: string) {
    try {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
      this.notifyListeners();
    } catch (error) {
      this.originalConsole.error("Error removing toast:", error);
    }
  }

  public clearAll() {
    try {
      this.toasts = [];
      this.notifyListeners();
    } catch (error) {
      this.originalConsole.error("Error clearing toasts:", error);
    }
  }

  public getToasts(): ToastMessage[] {
    return [...this.toasts];
  }

  public subscribe(listener: (toasts: ToastMessage[]) => void) {
    try {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((l) => l !== listener);
      };
    } catch (error) {
      this.originalConsole.error("Error subscribing to toasts:", error);
      return () => {};
    }
  }

  private notifyListeners() {
    try {
      this.listeners.forEach((listener) => {
        try {
          listener([...this.toasts]);
        } catch (error) {
          this.originalConsole.error("Error in toast listener:", error);
        }
      });
    } catch (error) {
      this.originalConsole.error("Error notifying toast listeners:", error);
    }
  }

  // Convenience methods
  public success(title: string, message: string, duration?: number) {
    return this.showToast("success", title, message, duration);
  }

  public error(title: string, message: string, duration?: number) {
    return this.showToast("error", title, message, duration);
  }

  public warning(title: string, message: string, duration?: number) {
    return this.showToast("warning", title, message, duration);
  }

  public info(title: string, message: string, duration?: number) {
    return this.showToast("info", title, message, duration);
  }

  // Method to restore original console methods
  public restoreConsole() {
    if (this.originalConsole.log) {
      console.log = this.originalConsole.log;
      console.info = this.originalConsole.info;
      console.warn = this.originalConsole.warn;
      console.error = this.originalConsole.error;
      console.debug = this.originalConsole.debug;
    }
  }
}

export const toastManager = ToastManager.getInstance();

// Export convenience functions
export const showToast = toastManager.showToast.bind(toastManager);
export const showSuccess = toastManager.success.bind(toastManager);
export const showError = toastManager.error.bind(toastManager);
export const showWarning = toastManager.warning.bind(toastManager);
export const showInfo = toastManager.info.bind(toastManager);
export const setGameplayMode = toastManager.setGameplayMode.bind(toastManager);
