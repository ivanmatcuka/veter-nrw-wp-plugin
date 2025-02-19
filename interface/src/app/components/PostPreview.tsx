import { Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import stringInject from 'stringinject';

import { GeneratedResponse } from './GeneratedResponse';

type News = Partial<{
  text: string;
  url: string;
  extra: string;
}>[];

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
}) => {
  const prefix = daytime === 'morning' ? 'news' : 'event';

  return (
    <>
      <Typography variant="h5">{textHeader}</Typography>
      <Typography variant="body1">{textBefore}</Typography>

      {weatherPrompt && (
        <GeneratedResponse model={selectedModel} prompt={weatherPrompt} />
      )}

      <Typography variant="h6">{textBlockHeader}</Typography>
      {news.map((item, index) => (
        <GeneratedResponse
          key={index}
          model={selectedModel}
          prompt={stringInject(newsPrompt, {
            [`${prefix}_X_URL`]: item.url,
            [`${prefix}_X_text`]: item.text,
            [`${prefix}_X_add`]: item.extra,
          })}
        />
      ))}
      <Typography variant="body1">{textAfter}</Typography>
    </>
  );
};
