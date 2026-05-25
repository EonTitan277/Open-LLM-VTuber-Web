interface Window {
  api?: {
    setIgnoreMouseEvents: (ignore: boolean) => void;
    showContextMenu?: () => void;
    onModeChanged: (callback: (mode: string) => void) => void;
    registerMicShortcut: (shortcut: string) => Promise<boolean>;
    unregisterMicShortcut: () => Promise<void>;
    onProactiveSpeakToggle: (callback: () => void) => void;
    registerProactiveSpeakShortcut: (shortcut: string) => Promise<boolean>;
    unregisterProactiveSpeakShortcut: () => Promise<void>;
  };
}
