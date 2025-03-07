import { Box, Button, Typography } from '@mui/material';
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import stringInject from 'stringinject';

import { useTranslation } from 'react-i18next';
import { createDaytimeDraft } from '../service';
import { useSettings } from '../SettingsContext';
import { News } from './EventNews';
import { GeneratedResponse } from './GeneratedResponse';

type PostPreviewProps = {
  daytime: 'morning' | 'evening';
  textHeader: string;
  textBefore: string;
  textBlockHeader: string;
  textAfter: string;
  selectedModel: string;
  weatherText?: string;
  news: News;
  updateNews: (index: number, field: keyof News[0], value: string) => void;
};
export const PostPreview: FC<PropsWithChildren<PostPreviewProps>> = ({
  daytime,
  textAfter,
  textHeader,
  textBefore,
  textBlockHeader,
  selectedModel,
  weatherText,
  news,
  updateNews,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [postDraftId, setPostDraftId] = useState<number | null>(null);
  const [generatedWeatherText, setGeneratedWeatherText] = useState('');
  const [weatherRenderedPrompt, setWeatherRenderedPrompt] =
    useState<string>('');

  const { settings } = useSettings();

  const { t } = useTranslation('common');

  const postDraft = useCallback(async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', textHeader);
    formData.append('weather', generatedWeatherText);
    formData.append('news', JSON.stringify(news));
    formData.append('textBefore', textBefore);
    formData.append('textBlockHeader', textBlockHeader);
    formData.append('textAfter', textAfter);

    setPostDraftId(await createDaytimeDraft(formData));

    setIsLoading(false);
  }, [
    textHeader,
    generatedWeatherText,
    news,
    textBefore,
    textAfter,
    textBlockHeader,
  ]);

  useEffect(() => {
    setWeatherRenderedPrompt(
      daytime === 'morning'
        ? stringInject(settings.weather_prompt || '', {
            weather: weatherText || ' ',
          })
        : null,
    );
  }, [daytime, weatherText, settings.weather_prompt]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">{textHeader}</Typography>
      <Typography variant="body1">{textBefore}</Typography>
      {weatherText && (
        <GeneratedResponse
          model={selectedModel}
          prompt={weatherRenderedPrompt}
          isReady={Boolean(weatherText)}
          onReady={setGeneratedWeatherText}
          onChange={setWeatherRenderedPrompt}
        />
      )}
      <Typography variant="h6">{textBlockHeader}</Typography>
      {news.map((item, index) => (
        <GeneratedResponse
          key={index}
          model={selectedModel}
          prompt={item.prompt || ''}
          isReady={Boolean(item.text && item.url)}
          onReady={(text) => updateNews(index, 'result', text)}
          onChange={(text) => updateNews(index, 'prompt', text)}
        />
      ))}
      <Typography variant="body1">{textAfter}</Typography>
      {news.some((item) => item.result) && (
        <Button variant="contained" loading={isLoading} onClick={postDraft}>
          {t('postDraft')}
        </Button>
      )}
      {postDraftId && (
        <Button
          href={`/wp-admin/post.php?post=${postDraftId}&action=edit`}
          target="_blank"
          variant="outlined"
        >
          {t('openDraft')}
        </Button>
      )}
    </Box>
  );
};
