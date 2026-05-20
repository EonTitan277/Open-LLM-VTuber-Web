import { useEffect } from 'react';
import { loadInitialMicShortcut } from '@/hooks/sidebar/setting/shortcut-utils';

export function useMicShortcutRegistration() {
  useEffect(() => {
    if (!window.api?.registerMicShortcut) {
      return;
    }

    const shortcut = loadInitialMicShortcut();
    void window.api.registerMicShortcut(shortcut).catch((error: unknown) => {
      console.error('Failed to register initial mic shortcut:', error);
    });
  }, []);
}
