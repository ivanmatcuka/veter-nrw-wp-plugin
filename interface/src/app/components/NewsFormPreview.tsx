import stringInject from 'stringinject';

import { Box, Button } from '@mui/material';
import { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createNewsDraft } from '../service';
import { GeneratedResponse } from './GeneratedResponse';

type NewsFormPreviewProps = {
  selectedModel: string;
  newsPrompt: string;
  paragraphCount: number;
  selectedTone: string;
  additionalInstructions: string;
  newsText: string;
  newsUrl: string;
  newsHeaderPrompt: string;
};

export const NewsFormPreview: FC<NewsFormPreviewProps> = ({
  selectedModel,
  newsPrompt,
  paragraphCount,
  selectedTone,
  additionalInstructions,
  newsText,
  newsUrl,
  newsHeaderPrompt,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [postDraftId, setPostDraftId] = useState<number | null>(null);
  const [generatedNewsText, setGeneratedNewsText] = useState('');
  const [generatedNewsHeader, setGeneratedNewsHeader] = useState('');

  const { t } = useTranslation('common');

  const postDraft = useCallback(async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('content', generatedNewsText);
    formData.append('title', generatedNewsHeader);

    setPostDraftId(await createNewsDraft(formData));

    setIsLoading(false);
  }, [generatedNewsText, generatedNewsHeader]);

  const newsRenderedPrompt = useMemo(
    () =>
      stringInject(newsPrompt, {
        count: paragraphCount,
        tone: selectedTone,
        add: additionalInstructions,
        news_text: newsText,
      }),
    [
      newsPrompt,
      paragraphCount,
      selectedTone,
      additionalInstructions,
      newsText,
    ],
  );

  const newsHeaderRenderedPrompt = useMemo(
    () =>
      stringInject(newsHeaderPrompt, {
        url: newsUrl,
      }),
    [newsHeaderPrompt, newsUrl],
  );

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <GeneratedResponse
        model={selectedModel}
        prompt={newsRenderedPrompt}
        onReady={setGeneratedNewsText}
      />
      <GeneratedResponse
        model={selectedModel}
        prompt={newsHeaderRenderedPrompt}
        onReady={setGeneratedNewsHeader}
      />
      {postDraftId ? (
        <Button
          href={`/wp-admin/post.php?post=${postDraftId}&action=edit`}
          target="_blank"
          variant="contained"
          disabled={!generatedNewsText || !generatedNewsHeader}
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
