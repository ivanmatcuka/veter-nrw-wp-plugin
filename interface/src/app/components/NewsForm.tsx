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

import { Page } from '@/app/components/Page';
import { Section } from '@/app/components/Section';
import { parseTones } from '@/utils/helpers';

import { NewsFormPreview } from './NewsFormPreview';
import { ToneSelector } from './ToneSelector';

import { AI_MODELS, useSettings } from '../SettingsContext';

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
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        setIsSubmitted(true);
      }}
    >
      <Section title={t('articleText')} chip="{news_text}">
        <TextField
          fullWidth
          multiline
          maxRows={20}
          onChange={(e) => setNewsText(e.target.value)}
          value={newsText}
          required
        />
      </Section>

      <Section title={t('articleUrl')} chip="{url}">
        <TextField
          variant="outlined"
          fullWidth
          value={newsUrl}
          multiline
          onChange={(e) => setNewsUrl(e.target.value)}
          required
        />
      </Section>

      <Section title={t('paragraphCount')} chip="{count}">
        <Select
          value={paragraphCount}
          onChange={(e) => setParagraphCount(+e.target.value)}
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
        <Section title={t('tone')} chip="{tone}">
          <Box display="flex" gap={1} flexWrap="wrap">
            <ToneSelector
              tones={settings.tones}
              selectedTone={selectedTone}
              onChange={setSelectedTone}
            />
          </Box>
        </Section>
      )}

      <Section title={t('additionalInstructions')} chip="{add}">
        <TextField
          fullWidth
          multiline
          maxRows={20}
          name="additionalInstructions"
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
        />
      </Section>

      <Section title={t('model')}>
        <Box display="flex" gap={1}>
          {AI_MODELS.map((model, index) => (
            <FormControlLabel
              key={index}
              value={model}
              name="selectedModel"
              onChange={(e) =>
                setSelectedModel((e.target as HTMLInputElement).value)
              }
              control={<Radio checked={selectedModel === model} />}
              label={model}
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
            selectedModel={selectedModel}
            newsPrompt={prompt}
            paragraphCount={paragraphCount}
            selectedTone={selectedTone}
            additionalInstructions={additionalInstructions}
            newsText={newsText}
            newsUrl={newsUrl}
            isReady={isSubmitted}
          />
        </Box>
      </Section>
    </Page>
  );
};
