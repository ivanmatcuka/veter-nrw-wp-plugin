import { Box, Chip, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

type SectionProps = {
  title?: string;
  chip?: string;
};
export const Section: FC<PropsWithChildren<SectionProps>> = ({
  children,
  chip,
  title,
}) => (
  <Box display="flex" flexDirection="column" gap={1}>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      {title && <Typography variant="h6">{title}</Typography>}
      {chip && <Chip label={chip} size="small" />}
    </Box>
    {children}
  </Box>
);
