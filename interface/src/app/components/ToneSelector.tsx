import { parseTones } from '@/utils/helpers';
import { Box, FormControlLabel, Radio } from '@mui/material';
import { FC } from 'react';

type ToneSelectorProps = {
  tones: string;
  selectedTone: string;
  onChange: (selectedTone: string) => void;
};
export const ToneSelector: FC<ToneSelectorProps> = ({
  tones,
  selectedTone,
  onChange,
}) => (
  <Box display="flex" gap={1} flexWrap="wrap">
    {parseTones(tones).map((tone, index) => (
      <FormControlLabel
        key={index}
        control={
          <Radio
            checked={selectedTone === tone}
            onChange={() => onChange(tone)}
          />
        }
        label={tone}
      />
    ))}
  </Box>
);
