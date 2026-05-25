/* eslint-disable import/no-extraneous-dependencies */
import { Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { settingStyles } from "./setting-styles";
import { useAgentSettings } from "@/hooks/sidebar/setting/use-agent-settings";
import { SwitchField, NumberField, ShortcutField } from "./common";

interface AgentProps {
  onSave?: (callback: () => void) => () => void;
  onCancel?: (callback: () => void) => () => void;
}

function Agent({ onSave, onCancel }: AgentProps): JSX.Element {
  const { t } = useTranslation();
  const {
    settings,
    handleAllowProactiveSpeakChange,
    handleIdleSecondsChange,
    handleAllowButtonTriggerChange,
    proactiveSpeakShortcut,
    handleProactiveSpeakShortcutChange,
    proactiveSpeakShortcutError,
  } = useAgentSettings({ onSave, onCancel });

  return (
    <Stack {...settingStyles.common.container}>
      <SwitchField
        label={t("settings.agent.allowProactiveSpeak")}
        checked={settings.allowProactiveSpeak}
        onChange={handleAllowProactiveSpeakChange}
      />

      <ShortcutField
        label={t("settings.agent.proactiveSpeakShortcut")}
        value={proactiveSpeakShortcut}
        onChange={handleProactiveSpeakShortcutChange}
        placeholder={t("settings.agent.proactiveSpeakShortcutPlaceholder")}
        help={t("settings.agent.proactiveSpeakShortcutHelp")}
      />

      {proactiveSpeakShortcutError && (
        <Text color="red.500" fontSize="sm">
          {proactiveSpeakShortcutError}
        </Text>
      )}

      {settings.allowProactiveSpeak && (
        <NumberField
          label={t("settings.agent.idleSecondsToSpeak")}
          value={settings.idleSecondsToSpeak}
          onChange={(value) => handleIdleSecondsChange(Number(value))}
          min={0}
          step={0.1}
          allowMouseWheel
        />
      )}

      <SwitchField
        label={t("settings.agent.allowButtonTrigger")}
        checked={settings.allowButtonTrigger}
        onChange={handleAllowButtonTriggerChange}
      />
    </Stack>
  );
}

export default Agent;
