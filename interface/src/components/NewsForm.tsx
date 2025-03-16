import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from '~/components/Page';
import { Section } from '~/components/Section';
import { AI_MODELS } from '~/contants';
import { useSettings } from '~/hooks/useSettings';
import { parseTones } from '~/utils/helpers';

import { NewsFormPreview } from './NewsFormPreview';
import { ToneSelector } from './ToneSelector';

const PARAGRAPH_OPTIONS = [1, 2, 3, 4, 5];

export const NewsForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fields
  const [newsText, setNewsText] = useState('');
  const [newsUrl, setNewsUrl] = useState('');
  const [paragraphCount, setParagraphCount] = useState(3);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [selectedTone, setSelectedTone] = useState('neutral');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const [prompt, setPrompt] = useState('');

  const { t } = useTranslation(['newsForm', 'common']);

  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.news_prompt) setPrompt(settings.news_prompt);
    if (settings?.tones) {
      const tone = parseTones(settings.tones)[0];
      setSelectedTone(tone);
    }
    if (settings?.default_model) setSelectedModel(settings.default_model);
  }, [settings?.news_prompt, settings?.tones, settings?.default_model]);

  return (
    <Page
      onSubmit={(e) => {
        e.preventDefault();
        setIsSubmitted(true);
      }}
      component="form"
    >
      <Section chip="{news_text}" title={t('articleText')}>
        <TextField
          maxRows={20}
          onChange={(e) => setNewsText(e.target.value)}
          value={newsText}
          fullWidth
          multiline
          required
        />
      </Section>

      <Section chip="{url}" title={t('articleUrl')}>
        <TextField
          onChange={(e) => setNewsUrl(e.target.value)}
          value={newsUrl}
          variant="outlined"
          fullWidth
          multiline
          required
        />
      </Section>

      <Section chip="{count}" title={t('paragraphCount')}>
        <Select
          onChange={(e) => setParagraphCount(+e.target.value)}
          value={paragraphCount}
          required
        >
          {PARAGRAPH_OPTIONS.map((count) => (
            <MenuItem key={count} value={count}>
              {count}
            </MenuItem>
          ))}
        </Select>
      </Section>

      {settings?.tones && (
        <Section chip="{tone}" title={t('tone')}>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <ToneSelector
              onChange={setSelectedTone}
              selectedTone={selectedTone}
              tones={settings.tones}
            />
          </Box>
        </Section>
      )}

      <Section chip="{add}" title={t('additionalInstructions')}>
        <TextField
          maxRows={20}
          name="additionalInstructions"
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          value={additionalInstructions}
          fullWidth
          multiline
        />
      </Section>

      <Section title={t('model')}>
        <Box display="flex" gap={1}>
          {AI_MODELS.map((model, index) => (
            <FormControlLabel
              onChange={(e) =>
                setSelectedModel((e.target as HTMLInputElement).value)
              }
              control={<Radio checked={selectedModel === model} />}
              key={index}
              label={model}
              name="selectedModel"
              value={model}
            />
          ))}
        </Box>
      </Section>

      <Section>
        <Box display="flex" flexDirection="column" gap={4}>
          {!isSubmitted && (
            <Button type="submit" variant="contained">
              {t('generate')}
            </Button>
          )}
          <NewsFormPreview
            additionalInstructions={additionalInstructions}
            isReady={isSubmitted}
            newsPrompt={prompt}
            newsText={newsText}
            newsUrl={newsUrl}
            paragraphCount={paragraphCount}
            selectedModel={selectedModel}
            selectedTone={selectedTone}
          />
        </Box>
      </Section>
    </Page>
  );
};
