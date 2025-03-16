import { Box, Button } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import stringInject from 'stringinject';

import { createNewsDraft } from '~/service';

import { GeneratedResponse } from './GeneratedResponse';

type NewsFormPreviewProps = {
  additionalInstructions: string;
  isReady: boolean;
  newsPrompt: string;
  newsText: string;
  newsUrl: string;
  paragraphCount: number;
  selectedModel: string;
  selectedTone: string;
};

export const NewsFormPreview: FC<NewsFormPreviewProps> = ({
  additionalInstructions,
  isReady,
  newsPrompt,
  newsText,
  newsUrl,
  paragraphCount,
  selectedModel,
  selectedTone,
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
        add: additionalInstructions || ' ',
        count: paragraphCount,
        news_text: newsText,
        tone: selectedTone,
        url: newsUrl,
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
        isReady={isReady}
        model={selectedModel}
        onChange={setNewsRenderedPrompt}
        onReady={setGeneratedNewsText}
        prompt={newsRenderedPrompt}
      />
      {generatedNewsText && (
        <Button loading={isLoading} onClick={postDraft} variant="contained">
          {t('postDraft')}
        </Button>
      )}
      {postDraftId && (
        <Button
          disabled={!generatedNewsText}
          href={postDraftLink}
          target="_blank"
          variant="outlined"
        >
          {t('openDraft')}
        </Button>
      )}
    </Box>
  );
};
