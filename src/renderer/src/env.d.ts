interface Window {
  api?: {
    setIgnoreMouseEvents: (ignore: boolean) => void
    showContextMenu?: () => void
    onModeChanged: (callback: (mode: string) => void) => void
    registerMicShortcut: (shortcut: string) => Promise<boolean>
    unregisterMicShortcut: () => Promise<void>
  }
}
