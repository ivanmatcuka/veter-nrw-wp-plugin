import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
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
  const [showGeneratedResponse, setShowGeneratedResponse] = useState(false);
  const [prompt, setPrompt] = useState('');

  const { t } = useTranslation('newsForm');

  const { settings } = useSettings();

  const { values, handleChange, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      newsText: '',
      newsUrl: '',
      selectedModel: AI_MODELS[0],
      selectedTone: '',
      paragraphCount: 3,
      additionalInstructions: '',
    },
    onSubmit: () => setShowGeneratedResponse(true),
  });

  const isGeneratorReady =
    values.selectedModel && prompt && settings?.news_header_prompt;

  useEffect(() => {
    if (settings?.news_prompt) setPrompt(settings.news_prompt);
    if (settings?.tones) {
      const tone = parseTones(settings.tones)[0];
      setFieldValue('selectedTone', tone);
    }
    if (settings?.default_model)
      setFieldValue('selectedModel', settings.default_model);
  }, [
    settings?.news_prompt,
    settings?.tones,
    settings?.default_model,
    setFieldValue,
  ]);

  return (
    <form onSubmit={handleSubmit}>
      <Page>
        <Section title={t('articleText')} chip="{news_text}">
          <TextField
            fullWidth
            multiline
            onChange={handleChange}
            name="newsText"
            value={values.newsText}
            required
          />
        </Section>

        <Section title={t('articleUrl')} chip="{url}">
          <TextField
            variant="outlined"
            fullWidth
            value={values.newsUrl}
            name="newsUrl"
            multiline
            rows={1}
            onChange={handleChange}
            required
          />
        </Section>

        <Section title={t('paragraphCount')} chip="{count}">
          <Select
            value={values.paragraphCount}
            name="paragraphCount"
            onChange={handleChange}
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
                selectedTone={values.selectedTone}
                onChange={(selectedTone: string) =>
                  setFieldValue('selectedTone', selectedTone)
                }
              />
            </Box>
          </Section>
        )}

        <Section title={t('additionalInstructions')} chip="{add}">
          <TextField
            fullWidth
            multiline
            name="additionalInstructions"
            value={values.additionalInstructions}
            onChange={handleChange}
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
                onChange={handleChange}
                control={<Radio checked={values.selectedModel === model} />}
                label={model}
              />
            ))}
          </Box>
        </Section>

        <Section>
          {!showGeneratedResponse ? (
            <Button variant="contained" type="submit">
              {t('generate')}
            </Button>
          ) : (
            isGeneratorReady && (
              <NewsFormPreview
                selectedModel={values.selectedModel}
                newsPrompt={prompt}
                paragraphCount={values.paragraphCount}
                selectedTone={values.selectedTone}
                additionalInstructions={values.additionalInstructions}
                newsText={values.newsText}
                newsUrl={values.newsUrl}
                // TODO: check
                newsHeaderPrompt={settings.news_header_prompt ?? ''}
              />
            )
          )}
        </Section>
      </Page>
    </form>
  );
};
