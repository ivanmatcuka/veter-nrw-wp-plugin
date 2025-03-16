import { Box, FormControlLabel, Radio } from '@mui/material';
import { FC } from 'react';

import { parseTones } from '~/utils/helpers';

type ToneSelectorProps = {
  selectedTone: string;
  tones: string;
  onChange: (selectedTone: string) => void;
};
export const ToneSelector: FC<ToneSelectorProps> = ({
  onChange,
  selectedTone,
  tones,
}) => (
  <Box display="flex" flexWrap="wrap" gap={1}>
    {parseTones(tones).map((tone, index) => (
      <FormControlLabel
        control={
          <Radio
            checked={selectedTone === tone}
            onChange={() => onChange(tone)}
          />
        }
        key={index}
        label={tone}
      />
    ))}
  </Box>
);
