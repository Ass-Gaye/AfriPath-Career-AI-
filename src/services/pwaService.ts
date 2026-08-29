/**
 * AfriPath AI — Progressive Web App (PWA) Service
 * Manages service worker lifecycle, installation prompts, offline status, and cache management.
 */

export type PWAInstallOutcome = 'accepted' | 'dismissed' | 'unsupported';
export type PlatformType = 'ios' | 'android' | 'desktop' | 'other';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type PWAStateListener = () => void;

class PWAService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isUpdateAvailable = false;
  private isOnlineStatus = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Set<PWAStateListener> = new Set();
  private isInstalledStandalone = false;
  private version = '1.0.0';

  constructor() {
    if (typeof window !== 'undefined') {
      this.checkStandaloneMode();
      this.initListeners();
      this.registerServiceWorker();
    }
  }

  private initListeners() {
    // 1. Listen for native browser beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyListeners();
      console.log('[PWA] Browser beforeinstallprompt event captured');
    });

    // 2. Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isInstalledStandalone = true;
      this.notifyListeners();
      console.log('[PWA] AfriPath AI successfully installed');
    });

    // 3. Online & Offline network status
    window.addEventListener('online', () => {
      this.isOnlineStatus = true;
      this.notifyListeners();
      console.log('[PWA] Network status: Online');
    });

    window.addEventListener('offline', () => {
      this.isOnlineStatus = false;
      this.notifyListeners();
      console.log('[PWA] Network status: Offline');
    });

    // 4. Listen for display-mode change (e.g. user opens in standalone)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    if (mediaQuery && mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', (e) => {
        this.isInstalledStandalone = e.matches;
        this.notifyListeners();
      });
    }
  }

  private checkStandaloneMode(): boolean {
    if (typeof window === 'undefined') return false;

    const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
    const isAndroidApp = document.referrer.includes('android-app://');
    const isUrlPwaSource = new URLSearchParams(window.location.search).get('source') === 'pwa';

    this.isInstalledStandalone = isStandaloneDisplay || isIOSStandalone || isAndroidApp || isUrlPwaSource;
    return this.isInstalledStandalone;
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        this.swRegistration = registration;
        console.log('[PWA] Service Worker registered successfully with scope:', registration.scope);

        // Check if there is already a waiting worker
        if (registration.waiting) {
          this.isUpdateAvailable = true;
          this.notifyListeners();
        }

        // Listen for new service worker updates installing
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available once old controller is replaced
                this.isUpdateAvailable = true;
                this.notifyListeners();
                console.log('[PWA] New version of AfriPath AI is ready to activate');
              }
            });
          }
        });

        // Periodic check for SW updates (every 30 minutes when online)
        setInterval(() => {
          if (navigator.onLine && registration) {
            registration.update().catch(() => {});
          }
        }, 30 * 60 * 1000);
      } catch (err) {
        console.warn('[PWA] Service Worker registration failed:', err);
      }

      // Handle controllerchange reload
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }

  public subscribe(listener: PWAStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  public getPlatform(): PlatformType {
    if (typeof window === 'undefined') return 'desktop';
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'ios';
    }
    if (/android/.test(userAgent)) {
      return 'android';
    }
    return 'desktop';
  }

  public isInstallable(): boolean {
    return Boolean(this.deferredPrompt) && !this.isInstalledStandalone;
  }

  public isInstalled(): boolean {
    return this.isInstalledStandalone;
  }

  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public hasUpdate(): boolean {
    return this.isUpdateAvailable;
  }

  public getAppVersion(): string {
    return this.version;
  }

  public async promptInstall(): Promise<PWAInstallOutcome> {
    if (!this.deferredPrompt) {
      return 'unsupported';
    }

    try {
      await this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      console.log('[PWA] User response to installation prompt:', choice.outcome);

      if (choice.outcome === 'accepted') {
        this.deferredPrompt = null;
        this.notifyListeners();
        return 'accepted';
      } else {
        return 'dismissed';
      }
    } catch (err) {
      console.error('[PWA] Error displaying installation prompt:', err);
      return 'unsupported';
    }
  }

  public applyUpdate() {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }

  public async clearCacheAndReload() {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if (this.swRegistration) {
        await this.swRegistration.unregister();
      }
      window.location.reload();
    } catch (err) {
      console.error('[PWA] Error clearing cache:', err);
      window.location.reload();
    }
  }

  public async getStorageInfo(): Promise<{ cachedItems: number; quotaEstimate: string }> {
    let cachedItems = 0;
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          const cache = await caches.open(key);
          const reqs = await cache.keys();
          cachedItems += reqs.length;
        }
      }
    } catch (e) {
      console.warn(e);
    }

    let quotaEstimate = 'Cached locally';
    if ('storage' in navigator && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage) {
          const mb = (estimate.usage / (1024 * 1024)).toFixed(1);
          quotaEstimate = `${mb} MB stored`;
        }
      } catch (e) {
        console.warn(e);
      }
    }

    return { cachedItems, quotaEstimate };
  }
}

export const pwaService = new PWAService();
