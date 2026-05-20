import { useVAD } from '@/context/vad-context';
import { useAiState } from '@/context/ai-state-context';

export function useMicToggle() {
  const {
    startMic,
    stopMic,
    micOn,
    setListeningAllowed,
  } = useVAD();
  const { aiState, setAiState } = useAiState();

  const handleMicToggle = async (): Promise<void> => {
    if (micOn) {
      setListeningAllowed(false);
      stopMic();
      if (aiState === 'listening') {
        setAiState('idle');
      }
    } else {
      setListeningAllowed(true);
      await startMic();
    }
  };

  return {
    handleMicToggle,
    micOn,
  };
}
