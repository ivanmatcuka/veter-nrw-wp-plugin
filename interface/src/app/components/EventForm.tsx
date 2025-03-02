import { Page } from '@/components/Page';
import { FormControlLabel, Radio, TextField } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Section } from '@/components/Section';
import { AI_MODELS, useSettings } from '../SettingsContext';
import { EventNews, News } from './EventNews';
import { PostPreview } from './PostPreview';

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
  const [news, setNews] = useState<News>([{ text: '', url: '', extra: '' }]);
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

  const handleAddNewsItem = useCallback(() => {
    setNews([...news, { text: '', url: '', extra: '' }]);
  }, [news]);

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
      setNews(newNews);
    },
    [news],
  );

  useEffect(() => {
    setDaytimeSettings({
      textHeader: settings[`${daytime}_text_header`] || '',
      textBefore: settings[`${daytime}_text_before`] || '',
      textBlockHeader: settings[`${daytime}_text_block_header`] || '',
      textAfter: settings[`${daytime}_text_after`] || '',
    });
  }, [settings, daytime]);

  return (
    <Page>
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
        <PostPreview
          {...daytimeSettings}
          newsPrompt={settings[`${daytime}_prompt`] || ''}
          weatherText={weatherText}
          daytime={daytime}
          news={news ?? []}
          updateNews={handleUpdateNewsItem}
          selectedModel={selectedModel || ''}
        />
      </Section>
    </Page>
  );
};
