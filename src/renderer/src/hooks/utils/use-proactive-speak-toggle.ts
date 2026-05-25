import { useProactiveSpeak } from "@/context/proactive-speak-context";

export function useProactiveSpeakToggle() {
  const { settings, updateSettings } = useProactiveSpeak();

  const handleProactiveSpeakToggle = async (): Promise<void> => {
    updateSettings({
      ...settings,
      allowProactiveSpeak: !settings.allowProactiveSpeak,
    });
  };

  return {
    handleProactiveSpeakToggle,
    allowProactiveSpeak: settings.allowProactiveSpeak,
  };
}
