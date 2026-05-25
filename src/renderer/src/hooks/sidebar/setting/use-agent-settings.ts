import { useCallback, useEffect, useState } from "react";
import { useProactiveSpeak } from "@/context/proactive-speak-context";
import { useTranslation } from "react-i18next";
import {
  loadInitialMicShortcut,
  loadInitialProactiveSpeakShortcut,
  PROACTIVE_SPEAK_TOGGLE_SHORTCUT_KEY,
} from "./shortcut-utils";

interface UseAgentSettingsProps {
  onSave?: (callback: () => void) => () => void;
  onCancel?: (callback: () => void) => () => void;
}

export function useAgentSettings({
  onSave,
  onCancel,
}: UseAgentSettingsProps = {}) {
  const { t } = useTranslation();
  const { settings: persistedSettings, updateSettings } = useProactiveSpeak();
  const [proactiveSpeakShortcut, setProactiveSpeakShortcut] = useState(
    loadInitialProactiveSpeakShortcut(),
  );
  const [proactiveSpeakShortcutError, setProactiveSpeakShortcutError] =
    useState("");

  const [tempSettings, setTempSettings] = useState({
    allowProactiveSpeak: persistedSettings.allowProactiveSpeak,
    idleSecondsToSpeak: persistedSettings.idleSecondsToSpeak,
    allowButtonTrigger: persistedSettings.allowButtonTrigger,
  });

  const [originalSettings, setOriginalSettings] = useState({
    ...persistedSettings,
  });

  useEffect(() => {
    if (persistedSettings) {
      setOriginalSettings(persistedSettings);
      setTempSettings(persistedSettings);
    }
  }, [persistedSettings]);

  const handleAllowProactiveSpeakChange = useCallback((checked: boolean) => {
    setTempSettings((prev) => ({
      ...prev,
      allowProactiveSpeak: checked,
    }));
  }, []);

  const handleIdleSecondsChange = useCallback((value: number) => {
    setTempSettings((prev) => ({
      ...prev,
      idleSecondsToSpeak: value,
    }));
  }, []);

  const handleAllowButtonTriggerChange = useCallback((checked: boolean) => {
    setTempSettings((prev) => ({
      ...prev,
      allowButtonTrigger: checked,
    }));
  }, []);

  const handleProactiveSpeakShortcutChange = useCallback((value: string) => {
    const trimmedValue = value.trim();
    const micShortcut = loadInitialMicShortcut();

    setProactiveSpeakShortcut(trimmedValue);
    setProactiveSpeakShortcutError("");

    if (trimmedValue && trimmedValue === micShortcut) {
      setProactiveSpeakShortcutError(
        t("settings.agent.proactiveSpeakShortcutConflict"),
      );
      return;
    }

    try {
      window.localStorage.setItem(
        PROACTIVE_SPEAK_TOGGLE_SHORTCUT_KEY,
        trimmedValue,
      );
    } catch (error) {
      console.error("Failed to persist proactive speak shortcut:", error);
    }

    const registrationPromise =
      window.api?.registerProactiveSpeakShortcut?.(trimmedValue);
    if (registrationPromise) {
      void registrationPromise
        .then((registered) => {
          if (!registered && trimmedValue) {
            setProactiveSpeakShortcutError(
              t("settings.agent.proactiveSpeakShortcutOsConflict"),
            );
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to register proactive speak shortcut:", error);
          if (trimmedValue) {
            setProactiveSpeakShortcutError(
              t("settings.agent.proactiveSpeakShortcutOsConflict"),
            );
          }
        });
    }
  }, []);

  const handleSave = useCallback(() => {
    updateSettings(tempSettings);
    setOriginalSettings(tempSettings);
  }, [updateSettings, tempSettings]);

  const handleCancel = useCallback(() => {
    setTempSettings(originalSettings);
    updateSettings(originalSettings);
  }, [originalSettings, updateSettings]);

  useEffect(() => {
    if (!onSave || !onCancel) return;

    const cleanupSave = onSave(handleSave);
    const cleanupCancel = onCancel(handleCancel);

    return () => {
      cleanupSave?.();
      cleanupCancel?.();
    };
  }, [onSave, onCancel, handleSave, handleCancel]);

  return {
    settings: tempSettings,
    handleAllowProactiveSpeakChange,
    handleIdleSecondsChange,
    handleAllowButtonTriggerChange,
    proactiveSpeakShortcut,
    handleProactiveSpeakShortcutChange,
    proactiveSpeakShortcutError,
    setProactiveSpeakShortcutError,
  };
}
