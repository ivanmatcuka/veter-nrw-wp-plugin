import { Buffer } from 'buffer';

window.Buffer = Buffer;

import ArrowBack from '@mui/icons-material/ArrowBackIos';
import ArrowForward from '@mui/icons-material/ArrowForwardIos';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import ReplayIcon from '@mui/icons-material/Replay';
import { Alert, Box, IconButton, TextField } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';

import { useSettings } from '~/hooks/useSettings';
import { getChatGPTResponse, getClaudeResponse } from '~/service';

type GeneratedResponseProps = {
  isReady: boolean;
  model: string;
  prompt: string;
  onChange?: (value: string) => void;
  onReady?: (value: string) => void;
};
export const GeneratedResponse: FC<GeneratedResponseProps> = ({
  isReady,
  model,
  onChange,
  onReady,
  prompt,
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
      response = await getClaudeResponse(
        settings.api_claude,
        prompt,
        settings.claude_model,
      );
    } else {
      response = await getChatGPTResponse(
        settings.api_chat_gpt,
        prompt,
        // @TODO: refactor
        settings.chat_gpt_model || undefined,
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
    settings.claude_model,
    settings.chat_gpt_model,
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
    if (cachedTexts.length || !prompt || !isReady) return;
    handleGenerate();
  }, [prompt, cachedTexts, isReady, handleGenerate]);

  return (
    <Box
      alignItems="flex-start"
      component="div"
      display="flex"
      flexDirection={{ sm: 'row', xs: 'column' }}
      gap={2}
    >
      <IconButton
        disabled={!isReady}
        loading={isLoading}
        onClick={handleGenerate}
      >
        <ReplayIcon fontSize="small" />
      </IconButton>
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        gap={2}
        overflow="hidden"
        width="100%"
      >
        {cachedTexts[currentIndex] && (
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: cachedTexts[currentIndex] }}
          />
        )}
        <Alert color={error ? 'error' : 'info'} icon={<AutoAwesome />}>
          <TextField
            slotProps={{
              input: {
                disableUnderline: true,
                fullWidth: true,
              },
            }}
            disabled={isLoading}
            onChange={(event) => onChange?.(event.target.value)}
            value={prompt}
            variant="standard"
            fullWidth
            multiline
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
