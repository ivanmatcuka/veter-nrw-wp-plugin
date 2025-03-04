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
  isReady: boolean;
};

export const NewsFormPreview: FC<NewsFormPreviewProps> = ({
  selectedModel,
  newsPrompt,
  paragraphCount,
  selectedTone,
  additionalInstructions,
  newsText,
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

  useEffect(() => {
    setNewsRenderedPrompt(
      stringInject(newsPrompt, {
        count: paragraphCount,
        tone: selectedTone,
        add: additionalInstructions || ' ',
        news_text: newsText,
      }),
    );
  }, [
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
      {postDraftId ? (
        <Button
          href={`/wp-admin/post.php?post=${postDraftId}&action=edit`}
          target="_blank"
          variant="contained"
          disabled={!generatedNewsText}
        >
          {t('openDraft')}
        </Button>
      ) : (
        generatedNewsText && (
          <Button variant="contained" loading={isLoading} onClick={postDraft}>
            {t('postDraft')}
          </Button>
        )
      )}
    </Box>
  );
};
