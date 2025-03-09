import { Page } from '@/app/components/Page';
import { Box, Button, FormControlLabel, Radio, TextField } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import stringInject from 'stringinject';

import { Section } from '@/app/components/Section';

import { EventNews, News } from './EventNews';
import { PostPreview } from './PostPreview';

import { AI_MODELS, useSettings } from '../SettingsContext';

type DaytimeSettings = {
  textHeader: string;
  textBefore: string;
  textBlockHeader: string;
  textAfter: string;
};
type EventFormProps = {
  daytime: 'morning' | 'evening';
};
export const EventForm: FC<EventFormProps> = ({ daytime }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [weatherText, setWeatherText] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [daytimeSettings, setDaytimeSettings] = useState<DaytimeSettings>({
    textHeader: '',
    textBefore: '',
    textBlockHeader: '',
    textAfter: '',
  });

  const { settings } = useSettings();

  const { t } = useTranslation([
    daytime === 'morning' ? 'morningForm' : 'eveningForm',
    'common',
  ]);

  const prefix = daytime === 'morning' ? 'news' : 'event';

  const getNewsRenderedPrompt = useCallback(
    (item: News[number]) =>
      stringInject(settings[`${daytime}_prompt`], {
        [`${prefix}_X_URL`]: item.url,
        [`${prefix}_X_text`]: item.text,
        [`${prefix}_X_add`]: item.extra || ' ',
      }),
    [prefix, settings, daytime],
  );

  const [news, setNews] = useState<News>([
    {
      text: '',
      url: '',
      extra: '',
      prompt: getNewsRenderedPrompt({ text: '', url: '', extra: '' }),
    },
  ]);

  const handleAddNewsItem = useCallback(() => {
    setNews([
      ...news,
      {
        text: '',
        url: '',
        extra: '',
        prompt: getNewsRenderedPrompt({ text: '', url: '', extra: '' }),
      },
    ]);
  }, [news, getNewsRenderedPrompt]);

  const handleRemoveNewsItem = useCallback(
    (index: number) => {
      const newNews = news.filter((_, i) => i !== index);
      setNews(newNews);
    },
    [news],
  );

  const handleUpdateNewsItem = useCallback(
    (index: number, field: keyof News[0], value: string) => {
      const newNews = [...news];
      newNews[index] = { ...newNews[index], [field]: value };

      if (field !== 'prompt' && field !== 'result') {
        newNews[index].prompt = getNewsRenderedPrompt(newNews[index]);
      }

      setNews(newNews);
    },
    [news, getNewsRenderedPrompt],
  );

  useEffect(() => {
    setDaytimeSettings({
      textHeader: settings[`${daytime}_text_header`] || '',
      textBefore: settings[`${daytime}_text_before`] || '',
      textBlockHeader: settings[`${daytime}_text_block_header`] || '',
      textAfter: settings[`${daytime}_text_after`] || '',
    });
  }, [settings, daytime]);

  useEffect(() => {
    if (settings?.default_model) setSelectedModel(settings.default_model);
  }, [settings?.default_model]);

  return (
    <Page
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        setIsSubmitted(true);
      }}
    >
      {daytime === 'morning' && (
        <Section title={t('weather')} chip="{weather}">
          <TextField
            fullWidth
            multiline
            maxRows={20}
            name="weatherText"
            value={weatherText}
            onChange={(event) => setWeatherText(event.target.value)}
            required
          />
        </Section>
      )}

      <Section title={t('news')}>
        <EventNews
          news={news}
          daytime={daytime}
          handleAddNewsItem={handleAddNewsItem}
          handleRemoveNewsItem={handleRemoveNewsItem}
          handleUpdateNewsItem={handleUpdateNewsItem}
        />
      </Section>

      <Section title={t('text')}>
        <TextField
          fullWidth
          label={t('textHeaderPlaceholder')}
          value={daytimeSettings.textHeader}
          onChange={(e) =>
            setDaytimeSettings({
              ...daytimeSettings,
              textHeader: e.target.value,
            })
          }
          multiline
          required
        />
        <TextField
          fullWidth
          label={t('textBeforePlaceholder')}
          value={daytimeSettings.textBefore}
          onChange={(e) =>
            setDaytimeSettings({
              ...daytimeSettings,
              textBefore: e.target.value,
            })
          }
          multiline
          maxRows={20}
          required
        />
        <TextField
          fullWidth
          label={t('textBlockHeaderPlaceholder')}
          value={daytimeSettings.textBlockHeader}
          onChange={(e) =>
            setDaytimeSettings({
              ...daytimeSettings,
              textBlockHeader: e.target.value,
            })
          }
          multiline
          required
        />
        <TextField
          fullWidth
          label={t('textAfterPlaceholder')}
          maxRows={20}
          value={daytimeSettings.textAfter}
          onChange={(e) =>
            setDaytimeSettings({
              ...daytimeSettings,
              textAfter: e.target.value,
            })
          }
          multiline
          required
        />
      </Section>

      <Section title={t('model')}>
        <div>
          {AI_MODELS.map((model) => (
            <FormControlLabel
              key={model}
              control={
                <Radio
                  checked={selectedModel === model}
                  onChange={() => setSelectedModel(model)}
                />
              }
              label={model}
            />
          ))}
        </div>
      </Section>

      <Section>
        <Box display="flex" flexDirection="column" gap={4}>
          {!isSubmitted && (
            <Button type="submit" variant="contained">
              {t('generate')}
            </Button>
          )}
          <PostPreview
            {...daytimeSettings}
            isReady={isSubmitted}
            weatherText={weatherText}
            daytime={daytime}
            news={news ?? []}
            updateNews={handleUpdateNewsItem}
            selectedModel={selectedModel || ''}
          />
        </Box>
      </Section>
    </Page>
  );
};
