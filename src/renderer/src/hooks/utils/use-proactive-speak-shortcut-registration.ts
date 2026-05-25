import { useEffect } from "react";
import { loadInitialProactiveSpeakShortcut } from "@/hooks/sidebar/setting/shortcut-utils";

export function useProactiveSpeakShortcutRegistration() {
  useEffect(() => {
    if (!window.api?.registerProactiveSpeakShortcut) {
      return;
    }

    const shortcut = loadInitialProactiveSpeakShortcut();
    void window.api
      .registerProactiveSpeakShortcut(shortcut)
      .catch((error: unknown) => {
        console.error(
          "Failed to register initial proactive speak shortcut:",
          error,
        );
      });
  }, []);
}
