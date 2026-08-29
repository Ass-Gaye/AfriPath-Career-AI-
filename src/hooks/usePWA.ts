import { useState, useEffect } from 'react';
import { pwaService, PlatformType, PWAInstallOutcome } from '../services/pwaService';

export interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  platform: PlatformType;
  version: string;
  promptInstall: () => Promise<PWAInstallOutcome>;
  applyUpdate: () => void;
  clearCacheAndReload: () => Promise<void>;
  getStorageInfo: () => Promise<{ cachedItems: number; quotaEstimate: string }>;
}

export function usePWA(): PWAState {
  const [state, setState] = useState(() => ({
    isInstallable: pwaService.isInstallable(),
    isInstalled: pwaService.isInstalled(),
    isOnline: pwaService.isOnline(),
    updateAvailable: pwaService.hasUpdate(),
    platform: pwaService.getPlatform(),
    version: pwaService.getAppVersion(),
  }));

  useEffect(() => {
    const unsubscribe = pwaService.subscribe(() => {
      setState({
        isInstallable: pwaService.isInstallable(),
        isInstalled: pwaService.isInstalled(),
        isOnline: pwaService.isOnline(),
        updateAvailable: pwaService.hasUpdate(),
        platform: pwaService.getPlatform(),
        version: pwaService.getAppVersion(),
      });
    });

    return unsubscribe;
  }, []);

  return {
    ...state,
    promptInstall: () => pwaService.promptInstall(),
    applyUpdate: () => pwaService.applyUpdate(),
    clearCacheAndReload: () => pwaService.clearCacheAndReload(),
    getStorageInfo: () => pwaService.getStorageInfo(),
  };
}
