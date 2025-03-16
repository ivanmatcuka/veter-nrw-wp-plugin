import { Box, Button, Chip, TextField } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type News = {
  extra: string;
  prompt?: string;
  result?: string;
  text: string;
  url: string;
}[];

type EventNewsProps = {
  daytime: 'morning' | 'evening';
  news: News;
  handleAddNewsItem: () => void;
  handleRemoveNewsItem: (index: number) => void;
  handleUpdateNewsItem: (
    index: number,
    field: keyof News[0],
    value: string,
  ) => void;
};

export const EventNews: FC<EventNewsProps> = ({
  daytime,
  handleAddNewsItem,
  handleRemoveNewsItem,
  handleUpdateNewsItem,
  news,
}) => {
  const { t } = useTranslation([
    daytime === 'morning' ? 'morningForm' : 'eveningForm',
    'common',
  ]);
  const chipPrefix = daytime === 'morning' ? 'news' : 'event';

  return (
    <>
      {news.map((item, index) => (
        <Box display="flex" flexDirection="column" gap={1} key={index}>
          <TextField
            onChange={(e) =>
              handleUpdateNewsItem(index, 'text', e.target.value)
            }
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
            label={t('newsTextPlaceholder')}
            maxRows={20}
            value={item.text}
            fullWidth
            multiline
            required
          />
          <TextField
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
            label={t('newsUrlPlaceholder')}
            onChange={(e) => handleUpdateNewsItem(index, 'url', e.target.value)}
            value={item.url}
            fullWidth
            multiline
            required
          />
          <TextField
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
            label={t('additionalInstructionsPlaceholder')}
            maxRows={20}
            value={item.extra}
            fullWidth
            multiline
          />
          <Button
            color="error"
            onClick={() => handleRemoveNewsItem(index)}
            variant="outlined"
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
