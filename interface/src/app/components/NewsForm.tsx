import {
  Box,
  FormControlLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { Page } from '@/components/Page';
import { Section } from '@/components/Section';

import { NewsFormPreview } from './NewsFormPreview';

import { parseTones } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { AI_MODELS, useSettings } from '../SettingsContext';
import { ToneSelector } from './ToneSelector';

const PARAGRAPH_OPTIONS = [1, 2, 3, 4, 5];

export const NewsForm = () => {
  const [prompt, setPrompt] = useState('');
  const [newsText, setNewsText] = useState('');
  const [paragraphCount, setParagraphCount] = useState(1);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [selectedTone, setSelectedTone] = useState('neutral');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const { t } = useTranslation('newsForm');

  const { settings } = useSettings();

  const isReady = Boolean(newsText && paragraphCount && selectedTone);

  useEffect(() => {
    if (settings?.news_prompt) setPrompt(settings.news_prompt);
    if (settings?.tones) {
      const tone = parseTones(settings.tones)[0];
      setSelectedTone(tone);
    }
    if (settings?.default_model) setSelectedModel(settings.default_model);
  }, [settings?.news_prompt, settings?.tones, settings?.default_model]);

  return (
    <Page>
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
              onChange={(selectedTone) => setSelectedTone(selectedTone)}
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
              defaultValue={settings.default_model}
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
        <NewsFormPreview
          selectedModel={selectedModel}
          newsPrompt={prompt}
          paragraphCount={paragraphCount}
          selectedTone={selectedTone}
          additionalInstructions={additionalInstructions}
          newsText={newsText}
          isReady={isReady}
        />
      </Section>
    </Page>
  );
};
