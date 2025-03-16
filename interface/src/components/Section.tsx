import { Box, Chip, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

type SectionProps = {
  chip?: string;
  title?: string;
};
export const Section: FC<PropsWithChildren<SectionProps>> = ({
  children,
  chip,
  title,
}) => (
  <Box display="flex" flexDirection="column" gap={1}>
    <Box alignItems="center" display="flex" justifyContent="space-between">
      {title && <Typography variant="h6">{title}</Typography>}
      {chip && <Chip label={chip} size="small" />}
    </Box>
    {children}
  </Box>
);
