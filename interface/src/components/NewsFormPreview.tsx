import stringInject from 'stringinject';

import { Box, Button } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
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
  isReady: boolean;
};

export const NewsFormPreview: FC<NewsFormPreviewProps> = ({
  selectedModel,
  newsPrompt,
  paragraphCount,
  selectedTone,
  additionalInstructions,
  newsText,
  newsUrl,
  isReady,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [postDraftId, setPostDraftId] = useState<number | null>(null);
  const [generatedNewsText, setGeneratedNewsText] = useState('');
  const [newsRenderedPrompt, setNewsRenderedPrompt] = useState<string>('');

  const { t } = useTranslation('common');

  const postDraft = useCallback(async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('content', generatedNewsText);

    setPostDraftId(await createNewsDraft(formData));
    setIsLoading(false);
  }, [generatedNewsText]);

  const postDraftLink = `/wp-admin/post.php?post=${postDraftId}&action=edit`;

  useEffect(() => {
    setNewsRenderedPrompt(
      stringInject(newsPrompt, {
        count: paragraphCount,
        tone: selectedTone,
        add: additionalInstructions || ' ',
        url: newsUrl,
        news_text: newsText,
      }),
    );
  }, [
    newsUrl,
    newsPrompt,
    paragraphCount,
    selectedTone,
    additionalInstructions,
    newsText,
  ]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <GeneratedResponse
        model={selectedModel}
        prompt={newsRenderedPrompt}
        onReady={setGeneratedNewsText}
        onChange={setNewsRenderedPrompt}
        isReady={isReady}
      />
      {generatedNewsText && (
        <Button variant="contained" loading={isLoading} onClick={postDraft}>
          {t('postDraft')}
        </Button>
      )}
      {postDraftId && (
        <Button
          href={postDraftLink}
          target="_blank"
          variant="outlined"
          disabled={!generatedNewsText}
        >
          {t('openDraft')}
        </Button>
      )}
    </Box>
  );
};
