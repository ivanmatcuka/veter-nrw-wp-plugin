import { Box, Button, FormControlLabel, Radio, TextField } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import stringInject from 'stringinject';

import { Page } from '~/components/Page';
import { Section } from '~/components/Section';
import { AI_MODELS } from '~/contants';
import { useSettings } from '~/hooks/useSettings';

// Non-reusable components
import { EventNews, News } from './EventNews';
import { PostPreview } from './PostPreview';

type DaytimeSettings = {
  textAfter: string;
  textBefore: string;
  textBlockHeader: string;
  textHeader: string;
};
type EventFormProps = {
  daytime: 'morning' | 'evening';
};
export const EventForm: FC<EventFormProps> = ({ daytime }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [weatherText, setWeatherText] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [daytimeSettings, setDaytimeSettings] = useState<DaytimeSettings>({
    textAfter: '',
    textBefore: '',
    textBlockHeader: '',
    textHeader: '',
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
        [`${prefix}_X_add`]: item.extra || ' ',
        [`${prefix}_X_text`]: item.text,
        [`${prefix}_X_URL`]: item.url,
      }),
    [prefix, settings, daytime],
  );

  const [news, setNews] = useState<News>([
    {
      extra: '',
      prompt: getNewsRenderedPrompt({ extra: '', text: '', url: '' }),
      text: '',
      url: '',
    },
  ]);

  const handleAddNewsItem = useCallback(() => {
    setNews([
      ...news,
      {
        extra: '',
        prompt: getNewsRenderedPrompt({ extra: '', text: '', url: '' }),
        text: '',
        url: '',
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
      setNews((prevNews) => {
        const newNews = [...prevNews];
        newNews[index] = { ...newNews[index], [field]: value };

        if (field !== 'prompt' && field !== 'result') {
          newNews[index].prompt = getNewsRenderedPrompt(newNews[index]);
        }

        return newNews;
      });
    },
    [getNewsRenderedPrompt],
  );

  useEffect(() => {
    setDaytimeSettings({
      textAfter: settings[`${daytime}_text_after`] || '',
      textBefore: settings[`${daytime}_text_before`] || '',
      textBlockHeader: settings[`${daytime}_text_block_header`] || '',
      textHeader: settings[`${daytime}_text_header`] || '',
    });
  }, [settings, daytime]);

  useEffect(() => {
    if (settings?.default_model) setSelectedModel(settings.default_model);
  }, [settings?.default_model]);

  console.log({ news });

  return (
    <Page
      onSubmit={(e) => {
        e.preventDefault();
        setIsSubmitted(true);
      }}
      component="form"
    >
      {daytime === 'morning' && (
        <Section chip="{weather}" title={t('weather')}>
          <TextField
            maxRows={20}
            name="weatherText"
            onChange={(event) => setWeatherText(event.target.value)}
            value={weatherText}
            fullWidth
            multiline
            required
          />
        </Section>
      )}

      <Section title={t('news')}>
        <EventNews
          daytime={daytime}
          handleAddNewsItem={handleAddNewsItem}
          handleRemoveNewsItem={handleRemoveNewsItem}
          handleUpdateNewsItem={handleUpdateNewsItem}
          news={news}
        />
      </Section>

      <Section title={t('text')}>
        <TextField
          onChange={(e) =>
            setDaytimeSettings({
              ...daytimeSettings,
              textHeader: e.target.value,
            })
          }
          label={t('textHeaderPlaceholder')}
          value={daytimeSettings.textHeader}
          fullWidth
          multiline
        />
        <TextField
          onChange={(e) =>
            setDaytimeSettings({
              ...daytimeSettings,
              textBefore: e.target.value,
            })
          }
          label={t('textBeforePlaceholder')}
          maxRows={20}
          value={daytimeSettings.textBefore}
          fullWidth
          multiline
        />
        <TextField
          onChange={(e) =>
            setDaytimeSettings({
              ...daytimeSettings,
              textBlockHeader: e.target.value,
            })
          }
          label={t('textBlockHeaderPlaceholder')}
          value={daytimeSettings.textBlockHeader}
          fullWidth
          multiline
        />
        <TextField
          onChange={(e) =>
            setDaytimeSettings({
              ...daytimeSettings,
              textAfter: e.target.value,
            })
          }
          label={t('textAfterPlaceholder')}
          maxRows={20}
          value={daytimeSettings.textAfter}
          fullWidth
          multiline
        />
      </Section>

      <Section title={t('model')}>
        <div>
          {AI_MODELS.map((model) => (
            <FormControlLabel
              control={
                <Radio
                  checked={selectedModel === model}
                  onChange={() => setSelectedModel(model)}
                />
              }
              key={model}
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
            daytime={daytime}
            isReady={isSubmitted}
            news={news ?? []}
            selectedModel={selectedModel || ''}
            updateNews={handleUpdateNewsItem}
            weatherText={weatherText}
          />
        </Box>
      </Section>
    </Page>
  );
};
