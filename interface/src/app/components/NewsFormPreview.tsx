import stringInject from 'stringinject';

import { FC } from 'react';
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
}) => (
  <>
    <GeneratedResponse
      model={selectedModel}
      prompt={stringInject(newsPrompt, {
        count: paragraphCount,
        tone: selectedTone,
        add: additionalInstructions,
        news_text: newsText,
      })}
    />
    <GeneratedResponse
      model={selectedModel}
      prompt={stringInject(newsHeaderPrompt, {
        url: newsUrl,
      })}
    />
  </>
);
