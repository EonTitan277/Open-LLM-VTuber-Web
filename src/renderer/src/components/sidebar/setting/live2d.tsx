/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/rules-of-hooks */
import { Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { settingStyles } from './setting-styles';
import { useLive2dSettings } from '@/hooks/sidebar/setting/use-live2d-settings';
import { NumberField, SwitchField } from './common';

interface live2DProps {
  onSave?: (callback: () => void) => () => void
  onCancel?: (callback: () => void) => () => void
}

function live2D({ onSave, onCancel }: live2DProps): JSX.Element {
  const { t } = useTranslation();
  const {
    modelInfo,
    handleInputChange,
    handleSave,
    handleCancel,
  } = useLive2dSettings();

  const parseNumber = (value: string, fallback: number, min: number, max: number): number => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
  };

  useEffect(() => {
    if (!onSave || !onCancel) return;

    const cleanupSave = onSave(handleSave);
    const cleanupCancel = onCancel(handleCancel);

    return (): void => {
      cleanupSave?.();
      cleanupCancel?.();
    };
  }, [onSave, onCancel]);

  return (
    <Stack {...settingStyles.common.container}>
      <SwitchField
        label={t('settings.live2d.pointerInteractive')}
        checked={modelInfo.pointerInteractive ?? false}
        onChange={(checked) => handleInputChange('pointerInteractive', checked)}
      />

      <SwitchField
        label={t('settings.live2d.scrollToResize')}
        checked={modelInfo.scrollToResize ?? true}
        onChange={(checked) => handleInputChange('scrollToResize', checked)}
      />

      <NumberField
        label={t('settings.live2d.renderScale')}
        value={modelInfo.renderScale ?? 1}
        onChange={(value) => handleInputChange(
          'renderScale',
          parseNumber(value, 1, 0.25, 1),
        )}
        min={0.25}
        max={1}
        step={0.05}
        allowMouseWheel
        help={t('settings.live2d.renderScaleHelp')}
      />

      <NumberField
        label={t('settings.live2d.frameRateLimit')}
        value={modelInfo.frameRateLimit ?? 60}
        onChange={(value) => handleInputChange(
          'frameRateLimit',
          parseNumber(value, 60, 15, 60),
        )}
        min={15}
        max={60}
        step={1}
        allowMouseWheel
        help={t('settings.live2d.frameRateLimitHelp')}
      />
    </Stack>
  );
}

export default live2D;
