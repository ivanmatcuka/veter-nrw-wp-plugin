import { Page } from '@/components/Page';
import { Button, FormControlLabel, Radio, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import stringInject from 'stringinject';

import { Section } from '@/components/Section';
import { AI_MODELS, useSettings } from '../SettingsContext';
import { EventNews, News } from './EventNews';
import { PostPreview } from './PostPreview';

type EventFormProps = {
  daytime: 'morning' | 'evening';
};
export const EventForm: FC<EventFormProps> = ({ daytime }) => {
  const { settings } = useSettings();
  const [showGeneratedResponse, setShowGeneratedResponse] = useState(false);

  const { t } = useTranslation(['morningForm', 'common']);

  const { values, handleChange, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      ...settings,
      weatherText: '',
      selectedModel: AI_MODELS[0],
      news: [{}] as News,
    },
    onSubmit: () => setShowGeneratedResponse(true),
  });

  const handleAddNewsItem = useCallback(() => {
    setFieldValue('news', [...values.news, { text: '', url: '', extra: '' }]);
  }, [setFieldValue, values.news]);

  const handleRemoveNewsItem = useCallback(
    (index: number) => {
      const newNews = values.news.filter((_, i) => i !== index);
      setFieldValue('news', newNews);
    },
    [setFieldValue, values.news],
  );

  const handleUpdateNewsItem = useCallback(
    (index: number, field: keyof News[0], value: string) => {
      const newNews = [...values.news];
      newNews[index] = { ...newNews[index], [field]: value };
      setFieldValue('news', newNews);
    },
    [setFieldValue, values.news],
  );

  useEffect(() => {
    if (!settings) return;

    [
      `${daytime}_text_header`,
      `${daytime}_text_before`,
      `${daytime}_text_block_header`,
      `${daytime}_text_after`,
    ].forEach((key) => {
      if (settings[key]) setFieldValue(key, settings[key]);
    });
  }, [settings, setFieldValue]);

  const daytimeSettings = useMemo(() => {
    return {
      textHeader: values[`${daytime}_text_header`] || '',
      textBefore: values[`${daytime}_text_before`] || '',
      textBlockHeader: values[`${daytime}_text_block_header`] || '',
      textAfter: values[`${daytime}_text_after`] || '',
      weatherPrompt:
        daytime === 'morning'
          ? stringInject(values.weather_morning_prompt || '', {
              weather: values.weatherText || '',
            })
          : null,
      newsPrompt: values[`${daytime}_prompt`] || '',
    };
  }, [values, daytime]);

  return (
    <form onSubmit={handleSubmit}>
      <Page>
        {daytime === 'morning' && (
          <Section title={t('weather')} chip="{weather}">
            <TextField
              fullWidth
              multiline
              name="weatherText"
              value={values.weatherText}
              onChange={handleChange}
              required
            />
          </Section>
        )}

        <Section title={t('news')}>
          <EventNews
            news={values.news}
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
            name={`${daytime}_text_header`}
            value={daytimeSettings.textHeader}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label={t('textBeforePlaceholder')}
            name={`${daytime}_text_before`}
            value={daytimeSettings.textBefore}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label={t('textBlockHeaderPlaceholder')}
            name={`${daytime}_text_block_header`}
            value={daytimeSettings.textBlockHeader}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label={t('textAfterPlaceholder')}
            name={`${daytime}_text_after`}
            value={daytimeSettings.textAfter}
            onChange={handleChange}
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
                    checked={values.selectedModel === model}
                    onChange={() => setFieldValue('selectedModel', model)}
                  />
                }
                label={model}
              />
            ))}
          </div>
        </Section>

        <Section>
          {!showGeneratedResponse ? (
            <Button variant="contained" type="submit">
              {t('generate')}
            </Button>
          ) : (
            <PostPreview
              {...daytimeSettings}
              daytime={daytime}
              news={values.news || []}
              selectedModel={values.selectedModel || ''}
            />
          )}
        </Section>
      </Page>
    </form>
  );
};
