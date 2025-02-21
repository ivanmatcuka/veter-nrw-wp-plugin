import { Box, Button, Typography } from '@mui/material';
import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import stringInject from 'stringinject';

import { useTranslation } from 'react-i18next';
import { createDraft } from '../service';
import { News } from './EventNews';
import { GeneratedResponse } from './GeneratedResponse';

type PostPreviewProps = {
  daytime: 'morning' | 'evening';
  textHeader: string;
  textBefore: string;
  textBlockHeader: string;
  textAfter: string;
  selectedModel: string;
  weatherPrompt?: string;
  news: News;
  newsPrompt: string;
  updateNews: (index: number, field: keyof News[0], value: string) => void;
};
export const PostPreview: FC<PropsWithChildren<PostPreviewProps>> = ({
  daytime,
  textAfter,
  textHeader,
  textBefore,
  textBlockHeader,
  selectedModel,
  weatherPrompt,
  news,
  newsPrompt,
  updateNews,
}) => {
  const { t } = useTranslation('common');

  const prefix = daytime === 'morning' ? 'news' : 'event';
  const [isLoading, setIsLoading] = useState(false);
  const [postDraftId, setPostDraftId] = useState<number | null>(null);
  const [generatedWeatherText, setGeneratedWeatherText] = useState('');

  const newsContent = useMemo(
    () => news.map((item) => item.result).join('\n\n'),
    [news],
  );
  const content = useMemo(() => {
    return `
      ${textBefore}
      ${generatedWeatherText}
      ${textBlockHeader}
      ${newsContent}
      ${textAfter}
    `;
  }, [
    textBefore,
    generatedWeatherText,
    textBlockHeader,
    newsContent,
    textAfter,
  ]);

  const postDraft = useCallback(async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    formData.append('title', textHeader);

    setPostDraftId(await createDraft(formData));

    setIsLoading(false);
  }, [textHeader, content]);

  const getNewsRenderedPrompt = useCallback(
    (item: News[number]) =>
      stringInject(newsPrompt, {
        [`${prefix}_X_URL`]: item.url,
        [`${prefix}_X_text`]: item.text,
        [`${prefix}_X_add`]: item.extra,
      }),
    [newsPrompt, prefix],
  );

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">{textHeader}</Typography>
      <Typography variant="body1">{textBefore}</Typography>
      {weatherPrompt && (
        <GeneratedResponse
          model={selectedModel}
          prompt={weatherPrompt}
          onReady={setGeneratedWeatherText}
        />
      )}
      <Typography variant="h6">{textBlockHeader}</Typography>
      {news.map((item, index) => (
        <GeneratedResponse
          key={index}
          model={selectedModel}
          prompt={getNewsRenderedPrompt(item)}
          onReady={(generatedNewsText) =>
            updateNews(index, 'result', generatedNewsText)
          }
        />
      ))}
      <Typography variant="body1">{textAfter}</Typography>
      {postDraftId ? (
        <Button
          href={`/wp-admin/post.php?post=${postDraftId}&action=edit`}
          target="_blank"
          variant="contained"
        >
          {t('openDraft')}
        </Button>
      ) : (
        <Button variant="contained" loading={isLoading} onClick={postDraft}>
          {t('postDraft')}
        </Button>
      )}
    </Box>
  );
};
