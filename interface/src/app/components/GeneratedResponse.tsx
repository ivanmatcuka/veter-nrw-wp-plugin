import { Buffer } from 'buffer';

window.Buffer = Buffer;

import AutoAwesome from '@mui/icons-material/AutoAwesome';
import ReplayIcon from '@mui/icons-material/Replay';
import { Alert, Box, IconButton, TextField, Typography } from '@mui/material';
import { FC, useCallback, useState } from 'react';
import { getChatGPTResponse, getClaudeResponse } from '../service';
import { useSettings } from '../SettingsContext';

type GeneratedResponseProps = {
  model: string;
  prompt: string;
};
export const GeneratedResponse: FC<GeneratedResponseProps> = ({
  model,
  prompt,
}) => {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [error, setError] = useState('');

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
        (res) => setGeneratedText(res.text),
      );
    }

    if (response.error) {
      setError(response.error);
    } else {
      setGeneratedText(response.data as string);
    }

    setIsLoading(false);
  }, [prompt, model, settings.api_chat_gpt, settings.api_claude]);

  return (
    <Box display="flex" gap={2} component="form" alignItems="flex-start">
      <IconButton onClick={handleGenerate} loading={isLoading}>
        <ReplayIcon />
      </IconButton>
      <Box flex={1} display="flex" flexDirection="column" gap={2}>
        <TextField
          multiline
          value={error || generatedText}
          fullWidth
          error={!!error}
          color={error ? 'error' : 'info'}
        />
        <Alert color={error ? 'error' : 'info'} icon={<AutoAwesome />}>
          <Typography variant="body2">{prompt}</Typography>
        </Alert>
      </Box>
    </Box>
  );
};
