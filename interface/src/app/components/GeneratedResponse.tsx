import { Buffer } from 'buffer';

window.Buffer = Buffer;

import ArrowBack from '@mui/icons-material/ArrowBackIos';
import ArrowForward from '@mui/icons-material/ArrowForwardIos';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import ReplayIcon from '@mui/icons-material/Replay';

import { Alert, Box, IconButton, TextField } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';

import { getChatGPTResponse, getClaudeResponse } from '@/app/service';

import { useSettings } from '../SettingsContext';

type GeneratedResponseProps = {
  model: string;
  prompt: string;
  isReady: boolean;
  onReady?: (value: string) => void;
  onChange?: (value: string) => void;
};
export const GeneratedResponse: FC<GeneratedResponseProps> = ({
  model,
  prompt,
  isReady,
  onReady,
  onChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cachedTexts, setCachedTexts] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');

  const { settings } = useSettings();

  const handleGenerate = useCallback(async () => {
    if (!settings?.api_chat_gpt || !settings?.api_claude) {
      setError('API keys are not set');
      return;
    }

    setIsLoading(true);
    setError('');

    let response;

    if (model === 'Claude') {
      response = await getClaudeResponse(settings.api_claude, prompt);
    } else {
      response = await getChatGPTResponse(
        settings.api_chat_gpt,
        prompt,
        (res) => setCachedTexts([...cachedTexts, res.text]),
      );
    }

    if (response.error) {
      setError(response.error);
    } else {
      setCachedTexts([...cachedTexts, response.data as string]);
      setCurrentIndex(cachedTexts.length);
      onReady?.(response.data as string);
    }

    setIsLoading(false);
  }, [
    prompt,
    model,
    settings.api_chat_gpt,
    settings.api_claude,
    cachedTexts,
    onReady,
  ]);

  const handleHistory = useCallback(
    (index: number) => () => {
      setCurrentIndex(index);
      onReady?.(cachedTexts[index]);
    },
    [onReady, cachedTexts],
  );

  useEffect(() => {
    if (cachedTexts.length || !prompt) return;
    handleGenerate();
  }, [cachedTexts, currentIndex, prompt, handleGenerate]);

  return (
    <Box
      display="flex"
      gap={2}
      component="div"
      alignItems="flex-start"
      flexDirection={{ xs: 'column', sm: 'row' }}
    >
      <IconButton
        onClick={handleGenerate}
        loading={isLoading}
        disabled={!isReady}
      >
        <ReplayIcon fontSize="small" />
      </IconButton>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        gap={2}
        overflow="hidden"
        width="100%"
      >
        {cachedTexts[currentIndex] && (
          <Box
            dangerouslySetInnerHTML={{ __html: cachedTexts[currentIndex] }}
            component="div"
          />
        )}
        <Alert
          color={error || !isReady ? 'error' : 'info'}
          icon={<AutoAwesome />}
        >
          <TextField
            fullWidth
            multiline
            value={prompt}
            onChange={(event) => onChange?.(event.target.value)}
            variant="standard"
            disabled={!isReady || isLoading}
            slotProps={{
              input: {
                disableUnderline: true,
                fullWidth: true,
              },
            }}
          />
        </Alert>
      </Box>
      <Box>
        <IconButton
          disabled={currentIndex === 0 || isLoading}
          onClick={handleHistory(currentIndex - 1)}
        >
          <ArrowBack fontSize="small" />
        </IconButton>
        <IconButton
          disabled={
            !cachedTexts.length ||
            currentIndex === cachedTexts.length - 1 ||
            isLoading
          }
          onClick={handleHistory(currentIndex + 1)}
        >
          <ArrowForward fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};
