import { Box, Button, Chip, TextField } from '@mui/material';
import { FC } from 'react';

import { useTranslation } from 'react-i18next';

export type News = Partial<{
  text: string;
  url: string;
  extra: string;
  result?: string;
  prompt?: string;
}>[];

type EventNewsProps = {
  news: News;
  daytime: 'morning' | 'evening';
  handleAddNewsItem: () => void;
  handleRemoveNewsItem: (index: number) => void;
  handleUpdateNewsItem: (
    index: number,
    field: keyof News[0],
    value: string,
  ) => void;
};

export const EventNews: FC<EventNewsProps> = ({
  news,
  daytime,
  handleAddNewsItem,
  handleRemoveNewsItem,
  handleUpdateNewsItem,
}) => {
  const { t } = useTranslation([
    daytime === 'morning' ? 'morningForm' : 'eveningForm',
    'common',
  ]);
  const chipPrefix = daytime === 'morning' ? 'news' : 'event';

  return (
    <>
      {news.map((item, index) => (
        <Box key={index} display="flex" flexDirection="column" gap={1}>
          <TextField
            fullWidth
            multiline
            label={t('newsTextPlaceholder')}
            maxRows={20}
            value={item.text}
            onChange={(e) =>
              handleUpdateNewsItem(index, 'text', e.target.value)
            }
            required
            slotProps={{
              input: {
                endAdornment: (
                  <Chip
                    label={`{${chipPrefix}_${index + 1}_text}`}
                    size="small"
                  />
                ),
              },
            }}
          />
          <TextField
            fullWidth
            multiline
            label={t('newsUrlPlaceholder')}
            value={item.url}
            onChange={(e) => handleUpdateNewsItem(index, 'url', e.target.value)}
            required
            slotProps={{
              input: {
                endAdornment: (
                  <Chip
                    label={`{${chipPrefix}_${index + 1}_URL}`}
                    size="small"
                  />
                ),
              },
            }}
          />
          <TextField
            fullWidth
            multiline
            maxRows={20}
            label={t('additionalInstructionsPlaceholder')}
            value={item.extra}
            onChange={(e) =>
              handleUpdateNewsItem(index, 'extra', e.target.value)
            }
            slotProps={{
              input: {
                endAdornment: (
                  <Chip
                    label={`{${chipPrefix}_${index + 1}_add}`}
                    size="small"
                  />
                ),
              },
            }}
          />
          <Button
            onClick={() => handleRemoveNewsItem(index)}
            variant="outlined"
            color="error"
          >
            {t('removeNewsItem')}
          </Button>
        </Box>
      ))}
      <Button onClick={handleAddNewsItem} variant="outlined">
        {t('addNewsItem')}
      </Button>
    </>
  );
};
